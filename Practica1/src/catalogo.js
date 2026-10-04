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

//para buscar el producto dentro del catalogo a través del id
function buscarId(idBuscado) {
  return catalogo.find((producto) => producto.id === idBuscado);
}
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

export { catalogo, buscarId, calcularPrecioPorEstado, descuentoPorVolumen, tieneStockBajo };
