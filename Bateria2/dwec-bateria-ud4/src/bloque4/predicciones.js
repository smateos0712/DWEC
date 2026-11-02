// 🔮 PREDICCIONES · Cambia cada undefined por lo que crees que da. Luego: docker compose run --rm web npm run comprobar 4
// Las tres primeras usan las mismas clases A y B (B hereda de A).
export const predicciones = {
  p1: "BA", // class A { hola() { return "A"; } } class B extends A { hola() { return "B" + super.hola(); } }; new B().hola()
  p2: true, // class A { hola() { return "A"; } } class B extends A { hola() { return "B" + super.hola(); } }; new B() instanceof A
  p3: true, // class A { hola() { return "A"; } } class B extends A { hola() { return "B" + super.hola(); } }; Object.getPrototypeOf(B) === A
  p4: 2, // class X { constructor() { this.n = 1; } } class Y extends X { constructor() { super(); this.n++; } }; new Y().n
};
