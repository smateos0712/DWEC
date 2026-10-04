const catalogo = [
  {
    id: 1,
    titulo: "Super Mario 64",
    plataforma: "N64",
    categoria: "Plataformas",
    precioBase: 25,
    estado: "usado-caja-danada",
    stock: 3,
  },
  {
    id: 2,
    titulo: "Final Fantasy VII",
    plataforma: "PS1",
    categoria: "RPG",
    precioBase: 40,
    estado: "usado-como-nuevo",
    stock: 5,
  },
  {
    id: 3,
    titulo: "Sonic the Hedgehog 2",
    plataforma: "MEGA DRIVE",
    categoria: "Plataformas",
    precioBase: 20,
    estado: "solo-cartucho",
    stock: 7,
  },
  {
    id: 4,
    titulo: "Street Fighter II Turbo",
    plataforma: "SNES",
    categoria: "Lucha",
    precioBase: 35,
    estado: "usado-caja-danada",
    stock: 2,
  },
  {
    id: 5,
    titulo: "Tetris",
    plataforma: "GAME BOY",
    categoria: "Puzzle",
    precioBase: 15,
    estado: "solo-cartucho",
    stock: 10,
  },
  {
    id: 6,
    titulo: "Pokémon Rojo",
    plataforma: "GAME BOY",
    categoria: "RPG",
    precioBase: 55,
    estado: "nuevo-precintado",
    stock: 1,
  },
  {
    id: 7,
    titulo: "International Superstar Soccer Deluxe",
    plataforma: "SNES",
    categoria: "Deportes",
    precioBase: 30,
    estado: "usado-como-nuevo",
    stock: 4,
  },
  {
    id: 8,
    titulo: "Tekken 3",
    plataforma: "PS1",
    categoria: "Lucha",
    precioBase: 25,
    estado: "usado-como-nuevo",
    stock: 6,
  },
  {
    id: 9,
    titulo: "Mario Kart 64",
    plataforma: "N64",
    categoria: "Carreras",
    precioBase: 35,
    estado: "nuevo-precintado",
    stock: 3,
  },
  {
    id: 10,
    titulo: "Columns",
    plataforma: "MEGA DRIVE",
    categoria: "Puzzle",
    precioBase: 12,
    estado: "usado-caja-danada",
    stock: 5,
  },
  {
    id: 11,
    titulo: "Super Mario World",
    plataforma: "SNES",
    categoria: "Plataformas",
    precioBase: 30,
    estado: "nuevo-precintado",
    stock: 8,
  },
  {
    id: 12,
    titulo: "NBA Jam",
    plataforma: "MEGA DRIVE",
    categoria: "Deportes",
    precioBase: 18,
    estado: "solo-cartucho",
    stock: 4,
  },
];

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

//ver todo el catalogo
function mostrarCatalogo(productos) {
  const linea=productos.map(
    (producto) => producto.id +".- " + producto.titulo + " (" + producto.plataforma + ") - Stock: " + producto.stock
  );
  console.log(linea.join("\n"));
}
//1.- VER CATALOGO
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

//exportaciones al main para hacer pruebas
export { catalogo, calcularPrecioPorEstado, descuentoPorVolumen, tieneStockBajo, mostrarCatalogo, buscarProducto};