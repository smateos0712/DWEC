// persistencia.js — Bloque C · ✍️ C5 y C6. Guardar el tablero tras cada cambio y recuperarlo al abrir la página.
// Usa guardar, cargar y borrar (almacen.js, resuelto), tu obtenerJSON (red.js) y Tablero.desdeJSON.
import { Tablero } from "../modelo/Tablero.js";
import { borrar, cargar, guardar } from "./almacen.js";
import { obtenerJSON } from "./red.js";

export const CLAVE = "dwec-p2-tablero";

// ✍️ C5 · guardarTablero(tablero, storage = localStorage): guarda el tablero en CLAVE
export function guardarTablero(tablero, storage = localStorage) {
  guardar(CLAVE, tablero, storage);
}

// ✍️ C6 · async arrancar({ storage = localStorage, fetchFn = fetch, url = "/tareas-iniciales.json",
//                  limiteEnCurso = 3 } = {}) → { tablero, origen, error? }
//   Los tres casos («guardado», «inicial» y «vacio») están en el enunciado (bloque C).
export async function arrancar({
  storage = localStorage,
  fetchFn = fetch,
  url = "/tareas-iniciales.json",
  limiteEnCurso = 3,
} = {}) {
  const guardado = cargar(CLAVE, null, storage);
  if (guardado !== null) {
    try {
      const tableroDevuelto = { tablero: Tablero.desdeJSON(guardado), origen: "guardado" };
      return tableroDevuelto;
    } catch {
      borrar(CLAVE, storage);
    }
  }
  try {
    const datos = await obtenerJSON(url, fetchFn);
    const tableroDevuelto = { tablero: Tablero.desde(datos, limiteEnCurso), origen: "inicial" };
    return tableroDevuelto;
  } catch (e) {
    return { tablero: new Tablero(limiteEnCurso), origen: "vacio", error: e.message };
  }
}
