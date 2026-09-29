const edad = 8;
const tieneEntrada = true;

function validarAccesoTernario (edad, tieneEntrada) {
    edad <12 ? console.log("Acceso gratuito") : edad >=12 && edad <=17 && tieneEntrada ? console.log("Acceso con descuento") : edad >=18 && tieneEntrada ? console.log("Acceso completo") : console.log("Acceso denegado");
}

validarAccesoTernario(edad, tieneEntrada);

let mensaje= edad >=18? "Mayor de edad" : "Menor de edad";
console.log(mensaje);

let categoria = edad <2? "Bebé":edad <12? "Niño":edad <18? "Adolescente":"Adulto";
console.log(categoria);