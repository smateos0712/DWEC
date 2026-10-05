let ventas = [];

function guardaVenta(venta){
    //añade la nueva venta al final de la lista.
    ventas = [... ventas, venta];
}

function obtenerVentas(){
    return ventas;
}

export {ventas,guardaVenta,obtenerVentas};