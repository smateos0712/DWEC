import { AgendaNoValidaError } from "./errores";
import { Tarea } from "./Tarea";
import { TareaRecurrente } from "./TareaRecurrente";

export class TareaConAgenda extends Tarea{
    #duracion=0
    #puntos=[]
    
    constructor(titulo, prioridad = "media", limite = null, id = null,duracion){
        
        super(titulo,prioridad,limite,id);
        if(!Number.isInteger(duracion) || duracion <=0){
            throw new RangeError(`La duración introducida ${duracion} no es un número entero o es menor o igual que 0.`)
        }
        else{
            this.duracion=duracion;
        }
    }
    get duracion(){
    return this.#duracion;
    }

    get puntos(){
        return this.#puntos;
    }

    planificar(nombre,minutos){
        if (!Number.isInteger(minutos)||minutos<=0){
            throw new RangeError(`Los minutos ${minutos} no son válidos.`);
        }
        if (this.#puntos.some((punto) => punto.nombre === nombre)){
            throw new RangeError(`Ya hay un punto con el nombre ${nombre}`);
        }
        this.#puntos.push({nombre: nombre, minutos: minutos})        
    }
    comprobarPaso(desde, hasta) {
        if (desde !== "Por hacer") return;        // la regla es para EMPEZAR
        const minutos = this.#puntos.reduce((suma, p) => suma + p.minutos, 0);
        if (minutos === 0 || minutos > this.#duracion) throw new AgendaNoValidaError(minutos, this.#duracion);

    }
}