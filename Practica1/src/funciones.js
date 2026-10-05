import { guardaVenta } from "./ventas";

//para calcular el precio del producto según el estado
function calcularPrecioPorEstado (producto) {
  let nuevoPrecio;
  if (producto.estado === "nuevo-precintado"){
    nuevoPrecio = producto.precioBase + producto.precioBase *0.25;
  } else if (producto.estado==="usado-como-nuevo"){
      nuevoPrecio = producto.precioBase;
  } else if (producto.estado === "usado-caja-danada"){
      nuevoPrecio = producto.precioBase - producto.precioBase *0.15;
  } else if (producto.estado==="solo-cartucho"){
      nuevoPrecio = producto.precioBase - producto.precioBase *0.3;
  }
  return nuevoPrecio;
}
//para calcular el descuento según la cantidad de compra de un mismo producto
function descuentoPorVolumen (producto, cantidad) {
  let nuevoPrecio;
  if (cantidad===1){
    nuevoPrecio=calcularPrecioPorEstado(producto);
  } else if (cantidad === 2 || cantidad === 3){
    nuevoPrecio=calcularPrecioPorEstado(producto) - calcularPrecioPorEstado(producto)*0.05;
  } else if (cantidad>=4) {
    nuevoPrecio=calcularPrecioPorEstado(producto) - calcularPrecioPorEstado(producto)*0.1;
  }
  //Devuelvo el precio final redondeado a dos decimales
  return Math.round(nuevoPrecio * 100) / 100;
}
//Funcion boolean que comprueba si el stock del producto es menor que 3
function tieneStockBajo(producto) {
  return producto.stock < 3;
}


//1.- VER CATALOGO

//ver todo el catalogo
function mostrarCatalogo(productos) {
  const linea=productos.map(
    (producto) =>{
      const aviso = tieneStockBajo(producto)?"STOCK BAJO":""
      return producto.id +".- " + producto.titulo + " (" + producto.plataforma + ") - Stock: " + producto.stock +" " +aviso;
    } 
  );
  console.log(linea.join("\n"));
}
//filtrar por categoria
function mostrarPorCategoria(productos, categoria) {
  const filtrados = productos.filter((producto) => producto.categoria === categoria);
  mostrarCatalogo(filtrados);
}

//mostrar productos con stock bajo
function mostrarStockBajo(productos) {
  const conStockBajo = productos.filter((producto) => producto.stock < 3);
  mostrarCatalogo(conStockBajo);
}

// 2.- BUSCAR PRODUCTO
//funcion para buscar un producto por id o por nombre
function buscarProducto(productos){
  //Number sirve para convertir a numero lo que introducimos por teclado en modo texto, como el ParseInt de java
  const eleccion = Number(prompt("Elige una opción:\n1.- Id \n2.- Título"));
  let buscado;
  
  if(eleccion===1){
    const id = Number(prompt("Introduce el id: "));
    buscado = productos.find((producto)=> producto.id===id);
  } else if(eleccion===2){
    const nombre = prompt("Introduce el título:");
    buscado = productos.find((producto)=> producto.titulo.toLowerCase().includes(nombre.toLowerCase()));
  } else{
    console.log("Opción no valida")
    return;
  }

  //si no se encuentra el producto mostramos mensaje por pantalla ya que en la practica dice que nada de undefined por pantalla
  if(buscado === undefined){
    console.log("No se ha encontrado ningún producto")
    //sino se muestra el producto buscado
  } else{
    mostrarCatalogo([buscado]);
  }
}

// 3.- REGISTRAR UNA VENTA
function registrarVenta(productos, producto, cantidad) {
  let precioUnitario;

  if (producto.stock < cantidad) {
    console.log("No hay stock suficiente");
    return productos;
  } else {
    precioUnitario = descuentoPorVolumen(producto, cantidad);
  }

  const total = Math.round(precioUnitario * cantidad * 100) / 100;

  console.log("Precio unitario: " + precioUnitario + " €");
  console.log("Total de la venta: " + total + " €");
  console.log("Stock restante: " + (producto.stock - cantidad));

  guardaVenta({titulo: producto.titulo, cantidad: cantidad, total: total });
  return actualizarStock(productos, producto.id, cantidad);
}
//funcion que devuelve un catalogo nuevo para no modificar el original
function actualizarStock(catalogo,id,cantidad){
  const nuevoCatalogo = catalogo.map((juego) => {
  if (juego.id===id){
    //los 3 puntos significa añade todo lo anterior del producto pero cambia esto
    return {...juego,stock:juego.stock - cantidad};
    } else {

      return juego;
    }   
  });
  return nuevoCatalogo;
}
//4.- REPONER STOCK
//funcion que devuelve un catalogo nuevo para no modificar el original
function reponerStock(catalogo,id,cantidad){
  const nuevoCatalogo = catalogo.map((juego) => {
  if (juego.id===id){
    //los 3 puntos significa añade todo lo anterior del producto pero cambia esto
    return {...juego,stock:juego.stock + cantidad};
    } else {

      return juego;
    }   
  });
  return nuevoCatalogo;
}

//5.- INFORME DE CAJA
//para contar cuántas unidades se han vendido de un juego en toda la sesión
function unidadesVendidas(ventas, titulo) {
  //me quedo solo con las ventas de ese juego
  const ventasDelJuego = ventas.filter((venta) => venta.titulo === titulo);
  //sumo las cantidades de esas ventas
  return ventasDelJuego.reduce((acumulado, venta) => acumulado + venta.cantidad, 0);
}

//para mostrar el informe de caja con el total facturado, el más vendido, el valor del stock y el aviso de stock bajo
function informeCaja(productos, ventas) {
  //total facturado: sumo el total de cada venta
  const totalFacturado = ventas.reduce((acumulado, venta) => acumulado + venta.total, 0);

  //producto más vendido: recorro los juegos y me quedo con el que tenga más unidades vendidas
  const masVendido = productos.reduce((mejor, producto) => {
    if (unidadesVendidas(ventas, producto.titulo) > unidadesVendidas(ventas, mejor.titulo)) {
      return producto;
    } else {
      return mejor;
    }
  }, productos[0]);
  const unidadesMasVendido = unidadesVendidas(ventas, masVendido.titulo);

  //valor del stock restante: precio de venta por stock de cada juego, todo sumado
  const valorStock = productos.reduce(
    (acumulado, producto) => acumulado + calcularPrecioPorEstado(producto) * producto.stock,
    0,
  );

  //compruebo si queda algún juego con stock bajo
  const hayStockBajo = productos.some((producto) => tieneStockBajo(producto));

  //muestro el informe
  console.log("===== INFORME DE CAJA =====");
  console.log("Total facturado: " + totalFacturado.toFixed(2) + " €");

  //si no se ha vendido nada, no hay producto más vendido
  if (unidadesMasVendido === 0) {
    console.log("Producto más vendido: ninguno");
  } else {
    console.log("Producto más vendido: " + masVendido.titulo + " (" + unidadesMasVendido + " unidades)");
  }

  console.log("Valor del stock restante: " + valorStock.toFixed(2) + " €");

  if (hayStockBajo) {
    console.log("⚠️ Hay productos con stock bajo");
  }
}
//exportaciones al main para hacer pruebas
export { mostrarCatalogo,buscarProducto, actualizarStock, reponerStock, registrarVenta};