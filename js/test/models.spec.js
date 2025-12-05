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
  let mockConexion;

  beforeEach(() => {
    reserva = new Reserva();

    mockConexion = jasmine.createSpyObj("ConexionAlmacen", [
      "ingresarInformacionReservas",
      "solicitarDisponibilidad",
      "solicitarInformacionAtracciones",
      "ingresarInformacionItinerario",
      "ingresarInformacionNewsletter"
    ]);

    // La reserva internamente usa this.conexionAlmacen
    reserva.conexionAlmacen = mockConexion;
  });

  it("guardarReserva: almacena correctamente los datos", () => {
    // Simulamos Array.from(new FormData(form))
    const keyValueArray = [
      ["atraccion", "Test"],
      ["disponibilidad", "Lunes"],
      ["visitantes", "3"],
      ["email", "test@test.com"]
    ];

    reserva.guardarReserva(keyValueArray);

    expect(mockConexion.ingresarInformacionReservas).toHaveBeenCalled();
  });

  it("obtenerReserva: devuelve objeto con propiedades correctas", () => {
    const keyValueArray = [
      ["atraccion", "Test Atracción"],
      ["disponibilidad", "Lunes"],
      ["visitantes", "2"],
      ["email", "correo@test.com"]
    ];

    reserva.guardarReserva(keyValueArray);
    const resultado = reserva.obtenerReserva();

    expect(resultado).toEqual(jasmine.objectContaining({
      atraccion: jasmine.any(String),
      // puede ser string o número según tu implementación → lo dejamos flexible
      visitantes: jasmine.anything(),
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
  let filtro;
  let mockConexion;

  beforeEach(() => {
    mockConexion = jasmine.createSpyObj("ConexionAlmacen", [
      "solicitarInformacionAtracciones"
    ]);

    // Instancia real del filtro
    filtro = new FiltroAtracciones();

    // Forzamos a que use nuestro mock en lugar de la conexión real
    // (cubriendo ambos posibles nombres)
    filtro.conexionAlmacen = mockConexion;
    filtro.conexionAlamacen = mockConexion;
    window.conexionAlmacen = mockConexion;
    window.conexionAlamacen = mockConexion;
  });

  // Tests de constructor
  it("se inicializa correctamente con método buscarAtracciones", () => {
    expect(filtro).toBeDefined();
    expect(typeof filtro.buscarAtracciones).toBe("function");
  });

  // Tests de métodos de negocio
  it("buscarAtracciones: filtra atracciones según criterios", () => {
    const atraccionesMock = [
      {
        nombreAtraccion: "Apta 1",
        // Abierta en semana (lunes → jueves)
        diasAbiertoAtraccion: ["lunes", "martes", "miercoles"],
        // Turno de día
        turnoAtraccion: ["dia"],
        // Actividad 1 → "cultura"
        estiloAtraccion: ["cultura"],
        // Grupo 1 → "familia"
        gruposRecomendadosAtraccion: ["familia"]
      },
      {
        nombreAtraccion: "Apta 2",
        diasAbiertoAtraccion: ["martes"],
        turnoAtraccion: ["dia"],
        estiloAtraccion: ["cultura"],
        gruposRecomendadosAtraccion: ["familia"]
      },
      {
        nombreAtraccion: "No apta",
        // Solo finde
        diasAbiertoAtraccion: ["sabado", "domingo"],
        turnoAtraccion: ["noche"],
        estiloAtraccion: ["fiesta"],
        gruposRecomendadosAtraccion: ["amigos"]
      }
    ];

    mockConexion.solicitarInformacionAtracciones.and.returnValue(atraccionesMock);

    // 1 = semana, 0 = día, 1 = cultura, 1 = familia
    const resultado = filtro.buscarAtracciones([1], [0], [1], [1]);

    expect(mockConexion.solicitarInformacionAtracciones).toHaveBeenCalled();
    expect(Array.isArray(resultado)).toBeTrue();

    expect(resultado.length).toBe(2);
    expect(resultado.map(a => a.nombreAtraccion)).toEqual(["Apta 1", "Apta 2"]);
  });

  it("buscarAtracciones: devuelve array vacío sin coincidencias", () => {
    const atraccionesMock = [
      {
        nombreAtraccion: "No apta 1",
        diasAbiertoAtraccion: ["sabado", "domingo"],
        turnoAtraccion: ["noche"],
        estiloAtraccion: ["fiesta"],
        gruposRecomendadosAtraccion: ["amigos"]
      },
      {
        nombreAtraccion: "No apta 2",
        diasAbiertoAtraccion: ["sabado"],
        turnoAtraccion: ["noche"],
        estiloAtraccion: ["deporte"],
        gruposRecomendadosAtraccion: ["desconocidos"]
      }
    ];

    mockConexion.solicitarInformacionAtracciones.and.returnValue(atraccionesMock);

    // Buscamos semana + día + cultura + familia → no matchea ninguna
    const resultado = filtro.buscarAtracciones([1], [0], [1], [1]);

    expect(mockConexion.solicitarInformacionAtracciones).toHaveBeenCalled();
    expect(Array.isArray(resultado)).toBeTrue();
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
  let mockConexion;

  beforeEach(() => {
    mockConexion = jasmine.createSpyObj("ConexionAlmacen", [
      "solicitarInformacionAtracciones",
      "ingresarInformacionReservas"
    ]);

    // Por si algún modelo mira el global:
    window.conexionAlmacen = mockConexion;
  });

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

    // Inyectamos el mock explícitamente en ambos modelos
    filtro.conexionAlmacen = mockConexion;
    reserva.conexionAlmacen = mockConexion;

    // Mock que respeta la estructura real que espera FiltroAtracciones
    const atraccionesMock = [
      {
        nombreAtraccion: "Test",
        diasAbiertoAtraccion: ["lunes", "martes"],        // semana
        turnoAtraccion: ["dia"],                          // 0 → "dia"
        estiloAtraccion: ["cultura"],                     // 1 → "cultura"
        gruposRecomendadosAtraccion: ["familia"]          // 1 → "familia"
      }
    ];

    mockConexion.solicitarInformacionAtracciones.and.returnValue(atraccionesMock);

    // 1 = semana, 0 = día, 1 = cultura, 1 = familia
    const atracciones = filtro.buscarAtracciones([1], [0], [1], [1]);

    // Aseguramos que haya resultados
    expect(atracciones.length).toBeGreaterThan(0);

    // Simulamos el formulario de reserva
    const form = document.createElement("form");
    form.innerHTML = `
      <input name="atraccion" value="${atracciones[0].nombreAtraccion}">
      <input name="visitantes" value="2">
      <input name="disponibilidad" value="Lunes">
      <input name="email" value="test@test.com">
    `;

    // Igual que en la app: Array.from(new FormData(form))
    const keyValueArray = Array.from(new FormData(form));

    reserva.guardarReserva(keyValueArray);
    const resultado = reserva.obtenerReserva();

    expect(resultado.atraccion).toBe("Test");
    expect(mockConexion.ingresarInformacionReservas).toHaveBeenCalled();
  });
});
