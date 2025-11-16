// Tests para los modelos de /models

import conexionAlmacen from "../models/ConexionAlmacen.js";
import constructorHTML from "../models/ConstructorHTML.js";
import filtroAtracciones from "../models/FiltroAtracciones.js";
import Itinerario from "../models/Itinerario.js";
import TarjetaAtraccion from "../models/TarjetaAtraccion.js";
import validador from "../models/Validador.js";

//
// 1) Validador
//
describe("Validador", () => {

  it("algunValorExiste devuelve true si hay al menos un valor en común", () => {
    const arrayChequeado = [1, 2, 3];
    const valoresBuscados = [5, 3, 9];

    const resultado = validador.algunValorExiste(arrayChequeado, valoresBuscados);

    expect(resultado).toBeTrue();
  });

  it("algunValorExiste devuelve false si no hay valores en común", () => {
    const arrayChequeado = [1, 2, 3];
    const valoresBuscados = [5, 6, 9];

    const resultado = validador.algunValorExiste(arrayChequeado, valoresBuscados);

    expect(resultado).toBeFalse();
  });

  it("esEmail reconoce un email válido", () => {
    expect(validador.esEmail("usuario@test.com")).toBeTrue();
  });

  it("esEmail rechaza un email inválido", () => {
    expect(validador.esEmail("usuario@@test..com")).toBeFalse();
  });
});


//
// 2) Itinerario
//
describe("Itinerario", () => {
  let itinerario;

  beforeEach(() => {
    itinerario = new Itinerario();
  });

  function crearFormularioItinerario(dia = "lunes") {
    const form = document.createElement("form");

    const inputDia = document.createElement("input");
    inputDia.name = "dia";
    inputDia.value = dia;
    form.appendChild(inputDia);

    const campos = ["mañana", "media-mañana", "media-tarde", "tarde", "noche"];
    campos.forEach(nombre => {
      const input = document.createElement("input");
      input.name = nombre;
      input.value = nombre + "-valor";
      form.appendChild(input);
    });

    return form;
  }

  it("cargarDiaItinerario agrega un objeto al arreglo interno", () => {
    const form = crearFormularioItinerario("lunes");

    itinerario.cargarDiaItinerario(form);

    expect(itinerario.itinerario.length).toBe(1);
    expect(itinerario.itinerario[0].dia).toBe("lunes");
    expect(itinerario.itinerario[0]["mañana"]).toBe("mañana-valor");
  });

  it("estaCompleto es true cuando se cargan los 7 días", () => {
    const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

    dias.forEach(dia => {
      const form = crearFormularioItinerario(dia);
      itinerario.cargarDiaItinerario(form);
    });

    expect(itinerario.estaCompleto()).toBeTrue();
  });

  it("diaEnProceso devuelve el siguiente día a cargar", () => {
    // Nada cargado -> primer día
    expect(itinerario.diaEnProceso()).toBe("lunes");

    const form = crearFormularioItinerario("lunes");
    itinerario.cargarDiaItinerario(form);

    expect(itinerario.diaEnProceso()).toBe("martes");
  });

  it("toJSON devuelve un string JSON con propiedad 'datos'", () => {
    const form = crearFormularioItinerario("lunes");
    itinerario.cargarDiaItinerario(form);

    const jsonStr = itinerario.toJSON();
    const obj = JSON.parse(jsonStr);

    expect(Array.isArray(obj.datos)).toBeTrue();
    expect(obj.datos[0].dia).toBe("lunes");
  });
});


//
// 3) TarjetaAtraccion
//
describe("TarjetaAtraccion", () => {
  let datosAtraccion;

  beforeEach(() => {
    datosAtraccion = {
      titulo: "Cataratas del Iguazú",
      subtitulo: "Maravilla natural",
      descripcion: "Un lugar increíble para visitar.",
      horarios: "Todos los días 8-18",
      idMapa: "mapa-iguazu",
      promptMaps: "https://maps.example.com",
      imgSrc: "imagen.jpg",
      altFoto: "Foto cataratas"
    };
  });

  it("fromJSON devuelve un elemento ARTICLE con clase 'tarjeta'", () => {
    const tarjeta = new TarjetaAtraccion();
    const elemento = tarjeta.fromJSON(datosAtraccion, () => {});

    expect(elemento).toBeDefined();
    expect(elemento.tagName).toBe("ARTICLE");
    expect(elemento.classList.contains("tarjeta")).toBeTrue();
  });

  it("el botón 'Reservar' dispara el callback al hacer click", () => {
    const callback = jasmine.createSpy("callbackReserva");
    const tarjeta = new TarjetaAtraccion();
    const elemento = tarjeta.fromJSON(datosAtraccion, callback);

    document.body.appendChild(elemento); // para que el click se procese bien
    const boton = elemento.querySelector(".reservar-btn");

    boton.click();

    expect(callback).toHaveBeenCalled();
  });
});


//
// 4) ConstructorHTML
//
describe("ConstructorHTML", () => {

  it("crearAtracciones genera una tarjeta por cada atracción filtrada", () => {
    // Mockear filtroAtracciones.buscarAtracciones
    const fakeAtracciones = [
      { titulo: "A1", subtitulo: "", descripcion: "", horarios: "", idMapa: "m1", promptMaps: "", imgSrc: "", altFoto: "" },
      { titulo: "A2", subtitulo: "", descripcion: "", horarios: "", idMapa: "m2", promptMaps: "", imgSrc: "", altFoto: "" }
    ];

    spyOn(filtroAtracciones, "buscarAtracciones").and.returnValue(fakeAtracciones);

    const callbackReserva = jasmine.createSpy("callbackReserva");
    const criterios = { momento: [1], horario: [0], actividad: [1], grupo: [1] };

    const tarjetas = constructorHTML.crearAtracciones(criterios, callbackReserva);

    expect(filtroAtracciones.buscarAtracciones).toHaveBeenCalled();
    expect(Array.isArray(tarjetas)).toBeTrue();
    expect(tarjetas.length).toBe(2);
    expect(tarjetas[0].tagName).toBe("ARTICLE");
  });

  it("crearPopUpFormulario genera un contenedor con form interno y dispara el callback al hacer submit", () => {
    const callbackSubmit = jasmine.createSpy("onSubmit");

    const popup = constructorHTML.crearPopUpFormulario(`
      <label>Nombre</label>
      <input name="nombre" value="Prueba">
    `, (event) => {
      event.preventDefault();
      callbackSubmit(event);
    });

    document.body.appendChild(popup);

    const form = popup.querySelector("form");
    expect(form).toBeTruthy();

    // Simulamos el submit
    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    expect(callbackSubmit).toHaveBeenCalled();
  });

  it("crearPopUpSimple crea un panel que se cierra al hacer click en el botón", () => {
    const popup = constructorHTML.crearPopUpSimple("<p>Mensaje</p>");
    document.body.appendChild(popup);

    const boton = popup.querySelector("button");
    expect(boton).toBeTruthy();

    boton.click();

    // El contenedor completo debería desaparecer del DOM
    expect(document.body.contains(popup)).toBeFalse();
  });
});


//
// 5) FiltroAtracciones
//
describe("FiltroAtracciones", () => {

  it("buscarAtracciones devuelve solo las atracciones que cumplen todos los filtros", () => {
    // Mock de conexionAlmacen.solicitarInformacionAtracciones()
    spyOn(conexionAlmacen, "solicitarInformacionAtracciones").and.returnValue({
      datos: [
        { momento: [1], horario: [0], actividad: [10], grupo: [3], titulo: "Apta" },
        { momento: [2], horario: [1], actividad: [11], grupo: [4], titulo: "No apta" }
      ]
    });

    // Usamos el validador real: funciona con números y arrays
    const momento = [1];
    const horario = [0];
    const actividad = [10];
    const grupo = [3];

    const resultado = filtroAtracciones.buscarAtracciones(momento, horario, actividad, grupo);

    expect(Array.isArray(resultado)).toBeTrue();
    expect(resultado.length).toBe(1);
    expect(resultado[0].titulo).toBe("Apta");
  });
});


//
// 6) ConexionAlmacen
//
// NOTA: Como no conocemos la implementación interna,
// sólo verificamos que sus métodos existan y devuelvan
// tipos de datos coherentes con el resto del código.
describe("ConexionAlmacen", () => {

  it("expone el método solicitarInformacionAtracciones que devuelve un objeto con 'datos' como array", () => {
    expect(typeof conexionAlmacen.solicitarInformacionAtracciones).toBe("function");

    const resultado = conexionAlmacen.solicitarInformacionAtracciones();
    // Permitimos que el proyecto decida el contenido, pero
    // asumimos que debe tener la forma { datos: [...] }
    expect(resultado).toBeDefined();
    expect(Array.isArray(resultado.datos)).toBeTrue();
  });

  it("solicitarDisponibilidad devuelve un array (posiblemente vacío)", () => {
    expect(typeof conexionAlmacen.solicitarDisponibilidad).toBe("function");

    const dias = conexionAlmacen.solicitarDisponibilidad("alguna-atraccion");
    expect(Array.isArray(dias)).toBeTrue();
  });

  it("ingresarInformacionReservas acepta un FormData sin lanzar error", () => {
    if (typeof conexionAlmacen.ingresarInformacionReservas !== "function") {
      pending("ingresarInformacionReservas no está implementado aún");
    }

    const form = document.createElement("form");
    const input = document.createElement("input");
    input.name = "email";
    input.value = "test@example.com";
    form.appendChild(input);

    const datos = new FormData(form);

    expect(() => conexionAlmacen.ingresarInformacionReservas(datos)).not.toThrow();
  });

  it("ingresarInformacionItinerario acepta un objeto Itinerario sin lanzar error", () => {
    if (typeof conexionAlmacen.ingresarInformacionItinerario !== "function") {
      pending("ingresarInformacionItinerario no está implementado aún");
    }

    const iti = new Itinerario();
    expect(() => conexionAlmacen.ingresarInformacionItinerario(iti)).not.toThrow();
  });

  it("ingresarInformacionNewsletter acepta FormData sin lanzar error", () => {
    if (typeof conexionAlmacen.ingresarInformacionNewsletter !== "function") {
      pending("ingresarInformacionNewsletter no está implementado aún");
    }

    const form = document.createElement("form");
    const input = document.createElement("input");
    input.name = "email";
    input.value = "newsletter@test.com";
    form.appendChild(input);

    const datos = new FormData(form);

    expect(() => conexionAlmacen.ingresarInformacionNewsletter(datos)).not.toThrow();
  });
});
