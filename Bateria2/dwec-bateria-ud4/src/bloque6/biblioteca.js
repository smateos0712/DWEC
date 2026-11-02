// Bloque 6 · Integrador: la biblioteca del instituto
// Une lo de los bloques 4 (publicaciones) y 5 (socios y PrestamoError). Explicación: web → 4.1 Batería → Bloque 6.
// Comprueba con:  docker compose run --rm web npm run comprobar 6
import { PrestamoError, Socio } from "../bloque5/composicion.js";

// ✍️ La clase Biblioteca, con todo en campos PRIVADOS (pista: tres Map):
//   - el catálogo: isbn → publicación (un Libro o una Revista del bloque 4)
//   - qué está prestado: isbn → nombre del socio
//   - los socios: nombre → Socio
//
//   alta(isbn, publicacion)    → PrestamoError si el isbn ya existe
//   registrar(nombre, maximo)  → crea el Socio, lo guarda y lo devuelve
//   prestar(isbn, nombre, hoy) → PrestamoError si no existe el isbn, si ya está prestado o si no existe el socio.
//                                Los días de préstamo los decide la PUBLICACIÓN (diasPrestamo): ¡polimorfismo!
//   devolver(isbn)             → PrestamoError si no está prestado
//   disponibles()              → las descripciones de lo que NO está prestado
//   informeVencidos(hoy)       → [{ socio: "Ana", isbn: "222" }, …]
export class Biblioteca {
  #catalogo=new Map();
  #prestados=new Map();
  #socios=new Map();
  alta(isbn, publicacion) {
    if(this.#catalogo.has(isbn)) throw new PrestamoError(`Ya existe ${isbn}`);
    this.#catalogo.set(isbn, publicacion);
  }

  disponibles(){
    const disponibles = [...this.#catalogo].filter(([isbn])=> !this.#prestados.has(isbn)).map(([,p])=>p.descripcion());
    return disponibles; 
  }

  registrar(nombre,maximo){
    const socio = new Socio(nombre,maximo);
    this.#socios.set(nombre,socio);
    return socio;
  }

  prestar(isbn, nombre, hoy){
    const publicacion = this.#catalogo.get(isbn);
    if(!publicacion) throw new PrestamoError(`No existe ${publicacion}`);
    if(this.#prestados.has(isbn)) throw new PrestamoError(`${isbn} ya está prestado.`);

    const socio=this.#socios.get(nombre);
    if(!socio)throw new PrestamoError(`No existe el socio ${socio}`);
    socio.prestar(isbn, hoy, publicacion.diasPrestamo());
    this.#prestados.set(isbn, socio);
  }

  devolver(isbn){
    const nombre = this.#prestados.get(isbn);
    if(!nombre) throw new PrestamoError (`${isbn} no está prestado.`);
    this.#socios.get(nombre).devolver(isbn);
    this.#prestados.delete(isbn);
  }

  informeVencidos(hoy) {
    const informe = [];
    for (const socio of this.#socios.values()) {
      for (const isbn of socio.vencidos(hoy)) {
        informe.push({ socio: socio.nombre, isbn });
      }
    }
    return informe;
  }
}

// (Para que ESLint no avise mientras no las uses)
void PrestamoError;
void Socio;
