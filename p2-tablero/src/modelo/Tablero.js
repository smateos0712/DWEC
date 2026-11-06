// Tablero.js — Bloque A · ✍️ A3 (el tablero) y A5 (reglas).
// En el bloque C volverás aquí para ✍️ C4 (toJSON y desdeJSON).
// El tablero TIENE tres columnas: es composición, no hereda de nadie.
import { Columna } from "./Columna.js";
import { ColumnaLlenaError, MovimientoNoPermitidoError } from "./errores.js";
import { Tarea } from "./Tarea.js";
import { TareaRecurrente } from "./TareaRecurrente.js";
import { aDatos, desdeDatos } from "./serializar.js";

export class Tablero {
  static COLUMNAS = Object.freeze(["Por hacer", "En curso", "Hecho"]);
  static VERSION_DATOS = 1; // (bloque C) si algún día cambia el formato guardado, se sube
  // Privado: #columnas, un Map nombre → Columna
  #columnas= new Map;
  // ✍️ A3 ──────────────────────────────────────────────────────────────────────
  constructor(limiteEnCurso = 3) {
    // Crea las tres columnas; solo «En curso» lleva límite WIP (limiteEnCurso)
    this.#columnas.set("Por hacer", new Columna("Por hacer"));
    this.#columnas.set("En curso", new Columna("En curso",limiteEnCurso));
    this.#columnas.set("Hecho",new Columna("Hecho"));
  }

  // static desde(datos, limiteEnCurso): un Tablero con una tarea por cada objeto de datos
  //   (usa crearTarea)

  static desde(datos,limiteEnCurso){
    const tablero=new Tablero(limiteEnCurso);
    for (const dato of datos){
      tablero.crearTarea(dato);
    }
    return tablero;
  }

  // columna(nombre): la Columna, o un Error si no existe (que el mensaje lleve el nombre)
  columna(nombre){
    if(!this.#columnas.has(nombre)){
      throw new Error(`La columna ${nombre} no existe.`);
    } 
    return this.#columnas.get(nombre);
  }
  // get columnas: array con las tres columnas, en orden
  get columnas(){
    return [...this.#columnas.values()];
  }

  // crearTarea(datos): TareaRecurrente si datos trae cadaDias, Tarea si no → a «Por hacer»
  //   y la devuelve. datos es un objeto { titulo, prioridad, limite, cadaDias }: saca cada campo
  //   y pásaselo al constructor, en su orden (new Tarea(datos) NO vale: espera el título)
  crearTarea(datos){
    if (!datos.cadaDias){
      return this.#columnas.get("Por hacer").añadir(new Tarea(datos.titulo,datos.prioridad,datos.limite));
    }
    else{
      return this.#columnas.get("Por hacer").añadir(new TareaRecurrente(datos.titulo,datos.prioridad,datos.limite,datos.cadaDias)); 
    }
  }

  // buscar(id): la tarea, esté en la columna que esté, o null
  buscar(id){
    const columnaBuscada = this.dondeEsta(id);
    if(columnaBuscada===null) return null;
    return columnaBuscada.tareas.find((tarea)=> tarea.id===id);
  }



  // dondeEsta(id): la Columna donde está, o null
  dondeEsta(id){
    const listaColumnas = this.columnas;
    for (const columna of listaColumnas){
      if(columna.tiene(id)){
        return columna;
      }
    }
    return null;
  }

  // mover(id, destino): Error si no existe la tarea · Error si la columna destino está llena
  //   (¡comprueba ANTES de quitarla de su columna, o se perdería!) · la mueve y la devuelve
  mover(id,destino){
    return this.#trasladar(id,destino);
  }

  // completar(id): la mueve a «Hecho» y añade a «Por hacer» lo que devuelva tarea.alCompletar()
  //   ⚠️ Sin preguntar si es recurrente: eso es el polimorfismo
  completar(id){
    const tarea = this.#trasladar(id,"Hecho");
    for(const t of tarea.alCompletar()){
      this.columna("Por hacer").añadir(t);
    }  
  }

  // resumen(hoy = new Date()): { porHacer, enCurso, hecho, vencidas }
  //   vencidas = las que estaVencida(hoy) y NO están en «Hecho»
  resumen(hoy = new Date()){
    const listaTareas = [...this.columna("Por hacer").tareas, ...this.columna("En curso").tareas];
    const tareasVencidas = listaTareas.filter((tarea)=>tarea.estaVencida(hoy)).length; 
    return {
    "porHacer": this.columna("Por hacer").tareas.length,
    "enCurso": this.columna("En curso").tareas.length,
    "hecho": this.columna("Hecho").tareas.length,
    "vencidas": tareasVencidas
    }
  }

  // ✍️ A5 · Reglas (vuelves a mover y completar) ─────────────────────────────────
  //   - Columna llena → ColumnaLlenaError (en vez de un Error cualquiera)
  //   - Sacar una tarea de «Hecho», o «moverla» a la columna en la que ya está →
  //     MovimientoNoPermitidoError. Todo se comprueba ANTES de tocar nada.
  //   Pista: mover y completar hacen casi lo mismo. Un método privado #trasladar(id, destino)
  //   con las comprobaciones evita escribirlas dos veces.
  #trasladar(id,destino){
    const columnaOrigen= this.dondeEsta(id);
    if(columnaOrigen===null) throw new Error (`No existe el id: ${id}`);
    if(columnaOrigen.nombre==="Hecho") throw new MovimientoNoPermitidoError(id,columnaOrigen.nombre,destino);
    if(columnaOrigen.nombre===destino) throw new MovimientoNoPermitidoError(id,columnaOrigen.nombre,destino);
    if(this.columna(destino).llena) throw new ColumnaLlenaError(this.columna(destino));
    return this.columna(destino).añadir(columnaOrigen.quitar(id));
  }



  // ✍️ C4 (bloque C) ────────────────────────────────────────────────────────────
  // toJSON(): { version, limiteEnCurso, columnas: { "Por hacer": [datos…], … } }
  //   JSON.stringify(tablero) lo llama solo. Sin él sale "{}": los # no se ven. Usa aDatos.

  /** Lo contrario de toJSON: el MISMO tablero (columnas, ids y límite WIP). Lanza si no encaja. */
  static desdeJSON(datos) {
    throw new Error("Sin hacer");
  }
}

// Comprueba con:  docker compose run --rm web npm test bloque-a
(void Columna,
  ColumnaLlenaError,
  MovimientoNoPermitidoError,
  Tarea,
  TareaRecurrente,
  aDatos,
  desdeDatos); // (borra esta línea cuando los uses)
