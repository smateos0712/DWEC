// app.js — Bloque B · ✍️ B4, B5 y B6. Conecta el modelo (el tablero) con la página: pinta, escucha y avisa.
// Usa tus piezas: crearTarjeta/pintarLista, leerFormulario/mostrarErrores y delegar.
// La estructura de la página (ids, data-*) está en index.html y NO se cambia: la usan los tests.
import { ErrorTablero } from "../modelo/errores.js";
import { delegar } from "./delegacion.js";
import { leerFormulario, mostrarErrores } from "./formulario.js";
import { pintarLista } from "./tarjeta.js";

/** Botones de cada tarjeta según su columna: [texto, data-accion] */
const ACCIONES = {
  "Por hacer": [["Empezar →", "empezar"]],
  "En curso": [
    ["← Volver", "volver"],
    ["✓ Completar", "completar"],
  ],
  Hecho: [],
};

// ✍️ B6 · validar(datos) → { campo: "mensaje" } con los errores (objeto vacío si todo está bien)
//   - titulo: obligatorio y como mucho 80 caracteres
//   - cadaDias (si viene): entero mayor que 0. Si es correcto pero no hay limite, el error va
//     en «limite»: una tarea que se repite necesita fecha límite
export function validar(datos) {
  const errores = {}
  if (datos.titulo.length===0||datos.titulo.length>80){
    errores.titulo= "Escribe un título de 1 a 80 caracteres."
  }
  if("cadaDias" in datos && (!Number.isInteger(datos.cadaDias) || datos.cadaDias<=0)){
    errores.cadaDias = "Escribe una franja de días entera mayor a 0."
  }
  if(datos.limite===null && (datos.cadaDias && !("cadaDias" in errores))){
    errores.limite= "una tarea que se repite necesita fecha límite."
  }
  return errores
}

/**
 * Arranca la interfaz dentro de raiz (el <main id="app">). Los listeners se ponen UNA vez aquí;
 * pintar() solo cambia nodos, así que repintar no los duplica.
 * opciones.hoy: fecha fija para los tests · opciones.alCambiar(tablero): tras cada cambio (UD6)
 */
export function iniciarApp(raiz, tablero, { hoy = null, alCambiar = () => {} } = {}) {
  const form = raiz.querySelector("#form-alta");
  const aviso = raiz.querySelector("#aviso");
  const columnas = raiz.querySelector("#columnas");
  const resumen = raiz.querySelector("#resumen");

  // ✍️ B4 · pintar(): deja la página igual que el modelo cada vez que se llama, y NO pone listeners
  //   - cada columna ([data-columna="…"]): sus tareas en el orden de ordenadas(), con pintarLista en su
  //     .lista, y en cada .tarjeta sus botones según ACCIONES: <button type="button" data-accion="…">
  //   - el .contador de cada columna: (n), o (n/límite) en la que tiene límite WIP
  //   - [data-dato="progreso"]: hechas ÷ total en %, redondeado (con el tablero vacío, 0 %)
  //   - [data-dato="vencidas"]: las vencidas de tablero.resumen(ahora)
  //   La fecha de hoy: const ahora = hoy ?? new Date();  (los tests pasan una fija)
  function pintar() {
    const ahora = hoy ?? new Date();
    const listaColumnas = columnas.querySelectorAll("[data-columna]")
    const resumenTablero = tablero.resumen(ahora)

    const progreso = raiz.querySelector('[data-dato="progreso"]')
    if (progreso){
      const total = resumenTablero.porHacer + resumenTablero.enCurso + resumenTablero.hecho;
      const hechas = resumenTablero.hecho;
      const porcentaje = total === 0 ? 0 : Math.round((hechas / total) * 100);
      progreso.textContent = `${porcentaje} %`

    }

    const vencidas = raiz.querySelector('[data-dato="vencidas"]')
    if (vencidas){
      const nvencidas = resumenTablero.vencidas
      vencidas.textContent = `${nvencidas}`
    }

    //Recorremos las columnas de la lista de columnas del html                                                  
    for (const col of listaColumnas){
      const nombreCol = col.dataset.columna;
      const colLista = col.querySelector(".lista")
      const colObjeto = tablero.columna(nombreCol)
      const tareasOrdenadas = colObjeto.ordenadas()
      pintarLista(colLista,tareasOrdenadas,ahora)

      //contadores en columna si tiene limite y si no
      const colContador= col.querySelector(".contador")
      if (colObjeto.limiteWip !== null){
        colContador.textContent=`(${tareasOrdenadas.length}/${colObjeto.limiteWip})`
      } else{
        colContador.textContent=`(${tareasOrdenadas.length})`
      }
      
      const listaTarjetas = colLista.querySelectorAll(".tarjeta")
      const accionesPermitidas = ACCIONES[nombreCol] || [];
      for (const tarjeta of listaTarjetas){
        for (const [texto, accion] of accionesPermitidas){
          const boton = document.createElement("button")
          boton.textContent = texto
          boton.dataset.accion = accion
          boton.type="button";
          tarjeta.append(boton)
        }
      }
    }
  }

  // 👀 Resuelto: avisar("texto") enseña el aviso; avisar("") lo esconde
  function avisar(mensaje) {
    aviso.textContent = mensaje;
    aviso.hidden = mensaje === "";
  }

  // ✍️ B5 · UN listener, puesto UNA vez aquí (nunca dentro de pintar): clic en los botones de las
  //   tarjetas, con delegar sobre `columnas`. empezar → «En curso», volver → «Por hacer», completar.
  //   Tras cada cambio que sale bien: avisar(""), pintar() y alCambiar(tablero).
  //   Si el tablero lanza un ErrorTablero → avisar(error.message) y no se repinta.
  //   Cualquier otro error → se relanza (es un fallo del programa).
  //   Pista: una función cambiar(accion) con el try/catch te sirve también para el B6.


  
  delegar(columnas,"click","[data-accion]", (boton)=> {
    try{
      const id= Number(boton.closest("[data-id]").dataset.id);
      
      console.log(id,boton.dataset.accion);

      if(boton.dataset.accion==="empezar"){
        tablero.mover(id,"En curso");
      }

      
      if(boton.dataset.accion==="volver"){
        tablero.mover(id,"Por hacer");
      }

      if(boton.dataset.accion==="completar"){
        tablero.completar(id);
      }
      alCambiar(tablero);
      avisar("");
      pintar();
    }

    catch (error){
      if (error instanceof ErrorTablero){
        avisar(error.message);
      }
      else{
        throw error;
      }
    }

  })


  // ✍️ B6 · submit de `form`: preventDefault, leerFormulario, validar y mostrarErrores. Si hay errores,
  //   no se crea nada. Si no, tablero.crearTarea(datos) (como un cambio más) y form.reset().

  form.addEventListener("submit",(evento)=>{
    
    try{
      evento.preventDefault();
      const datos = leerFormulario(form);
      const errores = validar(datos);
      mostrarErrores(form,errores);

      if (Object.keys(errores).length===0){
        tablero.crearTarea(datos);
        alCambiar(tablero);
        avisar("");
        pintar();
        form.reset()
      }
    }

    catch (error){
      if (error instanceof ErrorTablero){
        avisar(error.message)
      }
      else{
        throw error;
      }      
    }
  })
  pintar();
  return { pintar };
}

(void ACCIONES, ErrorTablero, delegar, leerFormulario, mostrarErrores, pintarLista); // (borra esta línea cuando los uses)
