// Tests para los modelos de /models

import ConexionAlmacen from "../models/ConexionAlmacen.js";
import FiltroAtracciones from "../models/FiltroAtracciones.js";
import Itinerario from "../models/Itinerario.js";
import Reserva from "../models/Reserva.js";
import Semana from "../models/Semana.js";
import Validador from "../models/Validador.js";

//
// 1) Validador
//
describe("Validador", () => {
  let validador;
  
  beforeEach(() => {
    validador = new Validador();
  });

  // Tests de métodos de negocio
  it("algunValorExiste: detecta valores en común", () => {
    expect(validador.algunValorExiste([1, 2, 3], [5, 3, 9])).toBeTrue();
    expect(validador.algunValorExiste([1, 2, 3], [5, 6, 9])).toBeFalse();
  });

  // Tests de validaciones
  it("esEmail: valida formato de email correctamente", () => {
    expect(validador.esEmail("usuario@test.com")).toBeTrue();
    expect(validador.esEmail("usuario@@test.com")).toBeFalse();
    expect(validador.esEmail("usuariotest.com")).toBeFalse();
    expect(validador.esEmail("")).toBeFalse();
  });
});


//
// 2) Semana
//
describe("Semana", () => {
  let semana;

  beforeEach(() => {
    semana = new Semana();
  });

  // Tests de métodos de negocio
  it("getDias: devuelve el día correcto según el índice", () => {
    expect(semana.getDias(0)).toBe("lunes");
    expect(semana.getDias(6)).toBe("domingo");
  });

  it("getDias: devuelve todos los días en orden", () => {
    const diasEsperados = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    
    for (let i = 0; i < diasEsperados.length; i++) {
      expect(semana.getDias(i)).toBe(diasEsperados[i]);
    }
  });
});


//
// 3) Reserva
//
describe("Reserva", () => {
  let reserva;

  beforeEach(() => {
    reserva = new Reserva();
  });

  function crearFormDataReserva(datos = {}) {
    const form = document.createElement("form");
    form.innerHTML = `
      <input name="atraccion" value="${datos.atraccion || 'Test Atracción'}">
      <input name="visitantes" value="${datos.visitantes || '3'}">
      <input name="disponibilidad" value="${datos.disponibilidad || 'Lunes'}">
      <input name="email" value="${datos.email || 'test@example.com'}">
    `;
    return new FormData(form);
  }

  // Tests de métodos de negocio
  it("guardarReserva: almacena correctamente los datos", () => {
    const formData = crearFormDataReserva();
    
    reserva.guardarReserva(Array.from(formData));
    const datos = reserva.obtenerReserva();

    expect(datos.atraccion).toBe("Test Atracción");
    expect(datos.visitantes).toBe("3");
  });

  it("obtenerReserva: devuelve objeto con propiedades correctas", () => {
    const formData = crearFormDataReserva();
    reserva.guardarReserva(Array.from(formData));
    
    const datos = reserva.obtenerReserva();

    expect(datos).toEqual(jasmine.objectContaining({
      atraccion: jasmine.any(String),
      visitantes: jasmine.any(String),
      email: jasmine.any(String)
    }));
  });
});


//
// 4) Itinerario
//
describe("Itinerario", () => {
  let itinerario;

  beforeEach(() => {
    itinerario = new Itinerario();
  });

  function crearFormDataItinerario(dia = "lunes") {
    const form = document.createElement("form");
    form.innerHTML = `
      <input name="dia" value="${dia}">
      <select name="mañana"><option value="Atracción 1" selected></option></select>
      <select name="media-mañana"><option value="ninguna" selected></option></select>
      <select name="media-tarde"><option value="Atracción 2" selected></option></select>
      <select name="tarde"><option value="ninguna" selected></option></select>
      <select name="noche"><option value="Atracción 3" selected></option></select>
    `;
    return new FormData(form);
  }

  // Tests de métodos de negocio
  it("cargarDiaItinerario: agrega día al itinerario", () => {
    const formData = crearFormDataItinerario("lunes");
    
    itinerario.cargarDiaItinerario(Array.from(formData));

    expect(itinerario.itinerario.length).toBe(1);
  });

  it("estaCompleto: valida correctamente cuando tiene 7 días", () => {
    expect(itinerario.estaCompleto()).toBeFalse();
    
    const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    dias.forEach(dia => {
      const formData = crearFormDataItinerario(dia);
      itinerario.cargarDiaItinerario(Array.from(formData));
    });

    expect(itinerario.estaCompleto()).toBeTrue();
  });

  it("diaEnProceso: devuelve el siguiente día a cargar", () => {
    expect(itinerario.diaEnProceso()).toBe("lunes");

    const formData = crearFormDataItinerario("lunes");
    itinerario.cargarDiaItinerario(Array.from(formData));

    expect(itinerario.diaEnProceso()).toBe("martes");
  });

  it("getItinerario: devuelve array de días cargados", () => {
    const formData = crearFormDataItinerario("lunes");
    itinerario.cargarDiaItinerario(Array.from(formData));

    const resultado = itinerario.getItinerario();

    expect(Array.isArray(resultado)).toBeTrue();
    expect(resultado.length).toBe(1);
  });

  // Tests de serialización
  it("toJSON: devuelve JSON válido con propiedad 'datos'", () => {
    const formData = crearFormDataItinerario("lunes");
    itinerario.cargarDiaItinerario(Array.from(formData));

    const jsonStr = itinerario.toJSON();
    const obj = JSON.parse(jsonStr);


    expect(Object.keys(obj)).toContain("datos");

    expect(Array.isArray(obj.datos)).toBeTrue();
  });
});


//
// 5) FiltroAtracciones
//
describe("FiltroAtracciones", () => {
  let filtroAtracciones;

  beforeEach(() => {
    filtroAtracciones = new FiltroAtracciones();
  });

  // Tests de constructor
  it("se inicializa correctamente con validador y conexión", () => {
    expect(filtroAtracciones.validador).toBeDefined();
    expect(filtroAtracciones.conexionAlmacen).toBeDefined();
  });

  // Tests de métodos de negocio
  it("buscarAtracciones: filtra atracciones según criterios", () => {
    const atraccionesMock = [
      { momento: [1], horario: [0], actividad: [10], grupo: [3], titulo: "Apta 1" },
      { momento: [1], horario: [0], actividad: [10], grupo: [3], titulo: "Apta 2" },
      { momento: [2], horario: [1], actividad: [11], grupo: [4], titulo: "No apta" }
    ];

    spyOn(filtroAtracciones.conexionAlmacen, 'solicitarInformacionAtracciones')
      .and.returnValue(atraccionesMock);

    const resultado = filtroAtracciones.buscarAtracciones([1], [0], [10], [3]);

    expect(resultado.length).toBe(2);
    expect(resultado[0].titulo).toBe("Apta 1");
  });

  it("buscarAtracciones: devuelve array vacío sin coincidencias", () => {
    const atraccionesMock = [
      { momento: [1], horario: [0], actividad: [10], grupo: [3], titulo: "Test" }
    ];

    spyOn(filtroAtracciones.conexionAlmacen, 'solicitarInformacionAtracciones')
      .and.returnValue(atraccionesMock);

    const resultado = filtroAtracciones.buscarAtracciones([5], [5], [5], [5]);

    expect(resultado.length).toBe(0);
  });
});


//
// 6) ConexionAlmacen
//
describe("ConexionAlmacen", () => {
  let conexionAlmacen;

  beforeEach(() => {
    conexionAlmacen = new ConexionAlmacen();
  });

  // Tests de métodos de negocio
  it("solicitarInformacionAtracciones: devuelve objeto con datos array", () => {
    const resultado = conexionAlmacen.solicitarInformacionAtracciones();

    expect(resultado).toBeDefined();
    expect(Array.isArray(resultado)).toBeTrue();
  });

  it("solicitarDisponibilidad: devuelve array de días", () => {
    const dias = conexionAlmacen.solicitarDisponibilidad("test-atraccion");
    
    expect(Array.isArray(dias)).toBeTrue();
  });

  // Tests de validaciones (métodos opcionales)
  it("ingresarInformacionReservas: acepta FormData sin error", () => {
    if (typeof conexionAlmacen.ingresarInformacionReservas !== "function") {
      pending("Método no implementado aún");
    }

    const form = document.createElement("form");
    form.innerHTML = `<input name="email" value="test@example.com">`;
    const datos = new FormData(form);

    expect(() => conexionAlmacen.ingresarInformacionReservas(datos)).not.toThrow();
  });

  it("ingresarInformacionItinerario: acepta Itinerario sin error", () => {
    if (typeof conexionAlmacen.ingresarInformacionItinerario !== "function") {
      pending("Método no implementado aún");
    }

    const iti = new Itinerario();
    
    expect(() => conexionAlmacen.ingresarInformacionItinerario(iti)).not.toThrow();
  });

  it("ingresarInformacionNewsletter: acepta FormData sin error", () => {
    if (typeof conexionAlmacen.ingresarInformacionNewsletter !== "function") {
      pending("Método no implementado aún");
    }

    const form = document.createElement("form");
    form.innerHTML = `<input name="email" value="test@test.com">`;
    const datos = new FormData(form);

    expect(() => conexionAlmacen.ingresarInformacionNewsletter(datos)).not.toThrow();
  });
});


//
// 7) Tests de integración clave
//
describe("Integración entre modelos", () => {

  it("FiltroAtracciones usa Validador para buscar", () => {
    const filtro = new FiltroAtracciones();
    
    expect(filtro.validador instanceof Validador).toBeTrue();
  });

  it("Itinerario usa Semana para controlar días", () => {
    const itinerario = new Itinerario();
    
    expect(itinerario.semana instanceof Semana).toBeTrue();
  });

  it("Flujo completo: Buscar y crear reserva", () => {
    const filtro = new FiltroAtracciones();
    const reserva = new Reserva();
    
    const atraccionesMock = [{ momento: [1], horario: [0], actividad: [1], grupo: [1], titulo: "Test" }];
    
    spyOn(filtro.conexionAlmacen, 'solicitarInformacionAtracciones')
      .and.returnValue(atraccionesMock);

    const atracciones = filtro.buscarAtracciones([1], [0], [1], [1]);
    
    if (atracciones.length > 0) {
      const form = document.createElement("form");
      form.innerHTML = `
        <input name="atraccion" value="${atracciones[0].titulo}">
        <input name="visitantes" value="2">
        <input name="disponibilidad" value="Lunes">
        <input name="email" value="test@test.com">
      `;
      
      reserva.guardarReserva(Array.from(new FormData(form)));
      const datos = reserva.obtenerReserva();
      
      expect(datos.atraccion).toBe("Test");
    }
  });
});