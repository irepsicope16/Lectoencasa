import { getSupabase } from '@/services/cloud/client'

interface BaseRow {
  id: string
  createdAt: string
  updatedAt: string
}

/**
 * Repositorio remoto sobre Supabase con la MISMA API pública que el
 * repositorio local (ver repository.ts). Cada colección es una tabla
 * documento: (id text pk, data jsonb, "consultantId" generada para RLS).
 * La UI y los hooks no distinguen entre uno y otro.
 */
export class SupabaseRepository<T extends BaseRow> {
  constructor(readonly collection: string) {}

  private async table() {
    const sb = await getSupabase()
    return sb.from(this.collection)
  }

  async list(): Promise<T[]> {
    const t = await this.table()
    const { data, error } = await t.select('data')
    if (error) throw new Error(`[${this.collection}] ${error.message}`)
    return (data ?? []).map((r) => r.data as T)
  }

  async get(id: string): Promise<T | undefined> {
    const t = await this.table()
    const { data, error } = await t.select('data').eq('id', id).maybeSingle()
    if (error) throw new Error(`[${this.collection}] ${error.message}`)
    return (data?.data as T) ?? undefined
  }

  async query(predicate: (row: T) => boolean): Promise<T[]> {
    return (await this.list()).filter(predicate)
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & Partial<BaseRow>): Promise<T> {
    const now = new Date().toISOString()
    const row = {
      ...data,
      id: data.id ?? crypto.randomUUID(),
      createdAt: data.createdAt ?? now,
      updatedAt: now,
    } as T
    const t = await this.table()
    const { error } = await t.insert({ id: row.id, data: row })
    if (error) throw new Error(`[${this.collection}] ${error.message}`)
    return row
  }

  async update(id: string, patch: Partial<T>): Promise<T> {
    const existing = await this.get(id)
    if (!existing) throw new Error(`[${this.collection}] no existe el registro ${id}`)
    const updated = { ...existing, ...patch, id, updatedAt: new Date().toISOString() }
    const t = await this.table()
    const { error } = await t.update({ data: updated }).eq('id', id)
    if (error) throw new Error(`[${this.collection}] ${error.message}`)
    return updated
  }

  async remove(id: string): Promise<void> {
    const t = await this.table()
    const { error } = await t.delete().eq('id', id)
    if (error) throw new Error(`[${this.collection}] ${error.message}`)
  }

  async bulkCreate(items: T[]): Promise<void> {
    if (!items.length) return
    const t = await this.table()
    const { error } = await t.upsert(items.map((row) => ({ id: row.id, data: row })))
    if (error) throw new Error(`[${this.collection}] ${error.message}`)
  }
}
