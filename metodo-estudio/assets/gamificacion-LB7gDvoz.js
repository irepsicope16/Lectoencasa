import{v as o}from"./index-BZ24N4EK.js";/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]],r=o("clock",i);/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=[["path",{d:"M6 9H4.5a2.5 2.5 0 0 1 0-5H6",key:"17hqa7"}],["path",{d:"M18 9h1.5a2.5 2.5 0 0 0 0-5H18",key:"lmptdp"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22",key:"1nw9bq"}],["path",{d:"M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22",key:"1np0yb"}],["path",{d:"M18 2H6v7a6 6 0 0 0 12 0V2Z",key:"u46fv3"}]],t=o("trophy",c);function n(a){const e=a.actividadesCompletadas*10+a.sesionesCronometro*5+a.fichasCreadas*5+a.repasosFichas*2+a.mapasCreados*5+a.entradasDiario*5+a.racha*2,s=[{id:"primer-paso",titulo:"Primer paso",descripcion:"Completar tu primera actividad",conseguida:a.actividadesCompletadas>=1},{id:"coleccionista",titulo:"Coleccionista de técnicas",descripcion:"5 actividades completadas",conseguida:a.actividadesCompletadas>=5},{id:"explorador",titulo:"Explorador",descripcion:"Probar actividades de 3 rutas distintas",conseguida:a.rutasDistintasProbadas>=3},{id:"constante",titulo:"Constante",descripcion:"Racha de 3 días seguidos",conseguida:a.racha>=3},{id:"en-llamas",titulo:"En llamas",descripcion:"Racha de 7 días seguidos",conseguida:a.racha>=7},{id:"maratonista",titulo:"Maratonista",descripcion:"5 sesiones de cronómetro",conseguida:a.sesionesCronometro>=5},{id:"memoria-de-hierro",titulo:"Memoria de hierro",descripcion:"Repasar fichas 10 veces",conseguida:a.repasosFichas>=10},{id:"mapeador",titulo:"Mapeador",descripcion:"Crear tu primer mapa conceptual",conseguida:a.mapasCreados>=1},{id:"reflexivo",titulo:"Reflexivo",descripcion:"3 entradas en el diario",conseguida:a.entradasDiario>=3}];return{puntos:e,insignias:s}}export{r as C,t as T,n as c};
