import { catalogo } from "./catalogo.js";
import { obtenerVentas } from "./ventas.js";
import {
  mostrarCatalogo,
  mostrarPorCategoria,
  mostrarStockBajo,
  buscarProducto,
  registrarVenta,
  reponerStock,
  informeCaja,
} from "./funciones.js";
//función que arranca el menú principal de la tienda
function iniciarMenu() {
  //el inventario empieza siendo el catálogo y se sustituye por el nuevo después de cada venta o reposición
  let inventario = catalogo;
  let opcion;
 
  do {
    opcion = prompt(
      "RETROSTOCK\n1.- Ver catálogo\n2.- Buscar producto\n3.- Registrar una venta\n4.- Reponer stock\n5.- Informe de caja\n6.- Salir\n7.- Añadir producto",
    );
 
    switch (opcion) {
      //1.- VER CATALOGO
      case "1": {
        const vista = prompt(
          "VER CATÁLOGO\n1.- Todo el catálogo\n2.- Filtrar por categoría\n3.- Solo productos con stock bajo",
        );
        if (vista === "1") {
          mostrarCatalogo(inventario);
        } else if (vista === "2") {
          const categoria = prompt(
            "Escribe la categoría (RPG, Plataformas, Lucha, Puzzle, Deportes, Carreras):",
          );
          mostrarPorCategoria(inventario, categoria);
        } else if (vista === "3") {
          mostrarStockBajo(inventario);
        } else {
          console.log("Opción no válida");
        }
        break;
      }
 
      //2.- BUSCAR PRODUCTO
      case "2":
        buscarProducto(inventario);
        break;
 
      //3.- REGISTRAR UNA VENTA
      case "3": {
        const id = Number(prompt("Introduce el id del producto:"));
        const producto = inventario.find((juego) => juego.id === id);
 
        if (producto === undefined) {
          console.log("No existe ningún producto con ese id");
        } else {
          const cantidad = Number(prompt("¿Cuántas unidades quieres vender?"));
          if (cantidad > 0) {
            //guardo el inventario nuevo que devuelve la venta
            inventario = registrarVenta(inventario, producto, cantidad);
          } else {
            console.log("Cantidad no válida");
          }
        }
        break;
      }
 
      //4.- REPONER STOCK
      case "4": {
        const id = Number(prompt("Introduce el id del producto:"));
        const producto = inventario.find((juego) => juego.id === id);
 
        if (producto === undefined) {
          console.log("No existe ningún producto con ese id");
        } else {
          const cantidad = Number(prompt("¿Cuántas unidades quieres reponer?"));
          if (cantidad > 0) {
            //guardo el inventario nuevo que devuelve la reposición
            inventario = reponerStock(inventario, id, cantidad);
            console.log(
              "Stock de " + producto.titulo + " repuesto. Stock actual: " + (producto.stock + cantidad),
            );
          } else {
            console.log("Cantidad no válida");
          }
        }
        break;
      }
 
      //5.- INFORME DE CAJA
      case "5":
        informeCaja(inventario, obtenerVentas());
        break;
 
      //6.- SALIR
      case "6":
        console.log("Saliendo de RetroStock. Resumen de la sesión:");
        informeCaja(inventario, obtenerVentas());
        break;
 
      //7.- AÑADIR PRODUCTO (para poder hacer los casos de prueba del enunciado)
      case "7": {
        const nuevoProducto = {
          id: inventario.length + 1,
          titulo: prompt("Título:"),
          plataforma: prompt("Plataforma:"),
          categoria: prompt("Categoría:"),
          precioBase: Number(prompt("Precio base:")),
          estado: prompt(
            "Estado (nuevo-precintado, usado-como-nuevo, usado-caja-danada, solo-cartucho):",
          ),
          stock: Number(prompt("Stock inicial:")),
        };
        //añado el producto creando un inventario nuevo, sin modificar el anterior
        inventario = [...inventario, nuevoProducto];
        console.log("Producto añadido con id " + nuevoProducto.id);
        break;
      }
 
      default:
        console.log("Opción no válida");
    }
    //el menú se repite hasta que elija 6 o pulse Cancelar
  } while (opcion !== "6" && opcion !== null);
}
 
export { iniciarMenu };