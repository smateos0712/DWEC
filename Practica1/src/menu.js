import { catalogo } from "./catalogo.js";
import {
  ventas,
  mostrarCatalogo,
  mostrarPorCategoria,
  mostrarStockBajo,
  buscarProducto,
  registrarVenta,
  actualizarStock,
  reponerStock,
  mostrarRegistro,
  cambiarEstadoColeccionista,
} from "./funciones.js";

//funcion que arranca el menu de la tienda
function iniciarMenu() {
  //el inventario empieza siendo el catalogo y lo voy cambiando por el nuevo despues de cada venta o reposicion
  let inventario = catalogo;
  let opcion;

  do {
    opcion = prompt(
      "RETROSTOCK\n1.- Ver catálogo\n2.- Buscar producto\n3.- Registrar una venta\n4.- Reponer stock\n5.- Informe de caja\n6.- Salir\n7.- Añadir producto\n8.-Cambiar Estado",
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
          const categoria = prompt("Escribe la categoría:");
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
            const total = registrarVenta(producto, cantidad);
            //solo actualizo el stock si la venta se ha hecho (si no hay stock devuelve undefined)
            if (total !== undefined) {
              inventario = actualizarStock(inventario, producto.id, cantidad);
              console.log("Stock restante: " + (producto.stock - cantidad));
            }
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
            inventario = reponerStock(inventario, producto, cantidad);
            console.log("Stock de " + producto.titulo + " repuesto. Stock actual: " + (producto.stock + cantidad));
          } else {
            console.log("Cantidad no válida");
          }
        }
        break;
      }

      //5.- INFORME DE CAJA
      case "5":
        mostrarRegistro(ventas, inventario);
        break;

      //6.- SALIR
      case "6":
        console.log("Saliendo de RetroStock. Resumen de la sesión:");
        mostrarRegistro(ventas, inventario);
        break;

      //7.- AÑADIR PRODUCTO (para poder hacer los casos de prueba de la practica)
      case "7": {
        const nuevoProducto = {
          id: inventario.length + 1,
          titulo: prompt("Título:"),
          plataforma: prompt("Plataforma:"),
          categoria: prompt("Categoría:"),
          precioBase: Number(prompt("Precio base:")),
          estado: prompt("Estado (nuevo-precintado, usado-como-nuevo, usado-caja-danada, solo-cartucho):"),
          stock: Number(prompt("Stock inicial:")),
        };
        //añado el producto creando un inventario nuevo, sin modificar el anterior
        inventario = [...inventario, nuevoProducto];
        console.log("Producto añadido con id " + nuevoProducto.id);
        break;
      }

      case "8":{
        const productoSeleccionado = Number(prompt("Introduce el id del juego para ponerlo en estado coleccionista: "))
        cambiarEstadoColeccionista(inventario,productoSeleccionado);
        console.log("Se ha cambiado su estado a coleccionista");
        break;
      }


      //si pulsa cancelar se sale del menu
      case null:
        console.log("Saliendo de RetroStock");
        break;

      default:
        console.log("Opción no válida");
    }
    //el menu se repite hasta que elija 6 o pulse cancelar
  } while (opcion !== "6" && opcion !== null);
}

export { iniciarMenu };