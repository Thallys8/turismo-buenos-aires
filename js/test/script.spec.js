/* 1 ********************************** 1 *********************************** 1 ************************************ 1 */
     
/* Test para Buscar atracciones segun informacion ingresada en el formulario. Lineas 106 a 163 */

describe("Flujo 1 - BuscarAtracciones()", function() {

  // Evitamos que los logs de consola molesten en el test
  beforeEach(function() {
    spyOn(console, "log");
  });

  // --- FUNCIONALIDAD BÁSICA (happy path) ---
  it("debe generar correctamente el objeto de solicitud con parámetros válidos", function() {
    const momento = ["mañana"];
    const horario = ["tarde"];
    const actividad = ["paseo"];
    const grupo = ["familia"];

    BuscarAtracciones(momento, horario, actividad, grupo);

    // Verificamos que loguea la solicitud correctamente
    expect(console.log).toHaveBeenCalledWith("Enviando la siguiente solicitud al backend...");
    expect(console.log).toHaveBeenCalledWith({
      momento: momento,
      horario: horario,
      actividad: actividad,
      grupo: grupo
    });
  });

  // --- CASOS BORDE ---
  it("debe aceptar arrays vacíos como parámetros", function() {
    BuscarAtracciones([], [], [], []);
    expect(console.log).toHaveBeenCalledWith(jasmine.objectContaining({
      momento: [],
      horario: [],
      actividad: [],
      grupo: []
    }));
  });

  it("debe manejar parámetros con muchos elementos sin fallar", function() {
    const largo = 1000;
    const momento = Array(largo).fill("mañana");
    const horario = Array(largo).fill("tarde");
    const actividad = Array(largo).fill("paseo");
    const grupo = Array(largo).fill("familia");

    BuscarAtracciones(momento, horario, actividad, grupo);
    expect(console.log).toHaveBeenCalledWith(jasmine.objectContaining({
      momento,
      horario,
      actividad,
      grupo
    }));
  });

  // --- VALIDACIÓN DE ERRORES ---
  it("debe manejar valores null o undefined sin lanzar error", function() {
    expect(function() {
      BuscarAtracciones(null, undefined, null, undefined);
    }).not.toThrow();
  });

  it("debe manejar tipos incorrectos (números o strings en vez de arrays)", function() {
    expect(function() {
      BuscarAtracciones("mañana", 5, {}, false);
    }).not.toThrow();
  });

  // --- OPERACIONES CON ARRAYS ---
  it("debe poder recibir arrays con elementos repetidos", function() {
    const momento = ["mañana", "mañana"];
    const horario = ["tarde", "tarde"];
    BuscarAtracciones(momento, horario, [], []);
    expect(console.log).toHaveBeenCalledWith(jasmine.objectContaining({
      momento,
      horario
    }));
  });

  it("debe poder recibir arrays mixtos (strings, números, vacíos)", function() {
    const actividad = ["paseo", 123, "", null];
    BuscarAtracciones([], [], actividad, []);
    expect(console.log).toHaveBeenCalledWith(jasmine.objectContaining({
      actividad
    }));
  });

  // --- OPERACIONES CON OBJETOS ---
  it("debe crear un objeto 'Solicitud' con las propiedades correctas", function() {
    const momento = ["mañana"];
    const horario = ["tarde"];
    const actividad = ["paseo"];
    const grupo = ["familia"];

    BuscarAtracciones(momento, horario, actividad, grupo);

    const esperado = {
      momento,
      horario,
      actividad,
      grupo
    };

    expect(console.log).toHaveBeenCalledWith(esperado);
  });

  // --- CÁLCULOS Y ALGORITMOS ---
  // (La función no hace cálculos, pero podemos verificar el comportamiento lógico)
  it("debe registrar dos mensajes en consola: uno de texto y uno de objeto", function() {
    BuscarAtracciones(["mañana"], ["tarde"], ["paseo"], ["familia"]);
    expect(console.log.calls.count()).toBe(2);
  });
});


/* 2 ********************************** 2 *********************************** 2 ************************************ 2 */
    
/* Test para la Validar formato de Email. Lineas 170 a 207 */
describe("Flujo 2 - Subscripción a Newsletter", function() {

  // Antes de cada test, espiamos funciones externas
  beforeEach(function() {
    spyOn(console, "log");
    spyOn(window, "prompt");
    spyOn(window, "alert");
  });


  // --- FUNCIONALIDAD BÁSICA (Happy path) --- 
  describe("Funcionalidad básica", function() {

    it("debe crear y mostrar correctamente el objeto de solicitud en FinalizarSubscripcion", function() {
      const nombre = "Juan Pérez";
      const intereses = ["1", "3"];
      const email = "juan@example.com";

      FinalizarSubscripcion(nombre, intereses, email);

      expect(console.log).toHaveBeenCalledWith("Enviando la siguiente solicitud al backend...");
      expect(console.log).toHaveBeenCalledWith({
        nombreCompleto: nombre,
        intereses: intereses,
        email: email
      });
    });

    it("debe ejecutar SubscribirNewsletter correctamente con datos válidos", function() {
      // Simulamos las respuestas de prompt
      window.prompt.and.returnValues("Juan Pérez", "1,2", "juan@example.com");

      spyOn(window, "PromptSeleccionMultiple").and.returnValue(["1", "2"]);
      spyOn(window, "PromptCorreoElectronico").and.returnValue("juan@example.com");
      spyOn(window, "FinalizarSubscripcion");

      SubscribirNewsletter();

      expect(window.alert).toHaveBeenCalledWith("Subscripcion exitosa! Recibira la confirmacion en su correo");
      expect(window.FinalizarSubscripcion).toHaveBeenCalledWith("Juan Pérez", ["1", "2"], "juan@example.com");
    });
  });


  // --- CASOS BORDE --- 
  describe("Casos borde", function() {

    it("debe aceptar un nombre vacío", function() {
      FinalizarSubscripcion("", ["1"], "test@example.com");
      expect(console.log).toHaveBeenCalledWith(jasmine.objectContaining({ nombreCompleto: "" }));
    });

    it("debe aceptar un array vacío de intereses", function() {
      FinalizarSubscripcion("Ana", [], "ana@example.com");
      expect(console.log).toHaveBeenCalledWith(jasmine.objectContaining({ intereses: [] }));
    });

    it("debe aceptar un email muy largo", function() {
      const largoEmail = "a".repeat(200) + "@example.com";
      FinalizarSubscripcion("Ana", ["2"], largoEmail);
      expect(console.log).toHaveBeenCalledWith(jasmine.objectContaining({ email: largoEmail }));
    });
  });


  // --- VALIDACIÓN DE ERRORES ---
  describe("Validación de errores", function() {

    it("no debe lanzar errores con null o undefined", function() {
      expect(function() {
        FinalizarSubscripcion(null, undefined, null);
      }).not.toThrow();
    });

    it("debe manejar tipos inválidos (números, objetos, etc.)", function() {
      expect(function() {
        FinalizarSubscripcion(123, { interes: "noticias" }, false);
      }).not.toThrow();
    });
  });


  // --- OPERACIONES CON ARRAYS ---
  describe("Operaciones con arrays", function() {

    it("debe aceptar intereses con valores duplicados", function() {
      const intereses = ["1", "1", "2"];
      FinalizarSubscripcion("Carlos", intereses, "carlos@example.com");
      expect(console.log).toHaveBeenCalledWith(jasmine.objectContaining({ intereses }));
    });

    it("debe aceptar intereses con distintos tipos de valores", function() {
      const intereses = ["1", 2, null, ""];
      FinalizarSubscripcion("Sofía", intereses, "sofia@example.com");
      expect(console.log).toHaveBeenCalledWith(jasmine.objectContaining({ intereses }));
    });
  });


  // --- OPERACIONES CON OBJETOS ---
  describe("Operaciones con objetos", function() {

    it("debe crear correctamente el objeto Solicitud con todas sus propiedades", function() {
      const data = {
        nombreCompleto: "Laura",
        intereses: ["1"],
        email: "laura@example.com"
      };

      FinalizarSubscripcion(data.nombreCompleto, data.intereses, data.email);

      expect(console.log).toHaveBeenCalledWith(jasmine.objectContaining(data));
    });

    it("el objeto debe poder modificarse después de crearse (mutable)", function() {
      const nombre = "Pedro";
      const intereses = ["3"];
      const email = "pedro@example.com";

      FinalizarSubscripcion(nombre, intereses, email);

      // Verificamos que sea un objeto literal, no inmutable
      const ultimaLlamada = console.log.calls.mostRecent().args[0];
      ultimaLlamada.email = "modificado@example.com";
      expect(ultimaLlamada.email).toBe("modificado@example.com");
    });
  });


  // --- CÁLCULOS Y ALGORITMOS ---
  describe("Cálculos y algoritmos", function() {

    it("debe registrar exactamente dos mensajes en consola", function() {
      FinalizarSubscripcion("Juan", ["1"], "juan@example.com");
      expect(console.log.calls.count()).toBe(2);
    });

    it("debe calcular correctamente la cantidad de intereses", function() {
      const intereses = ["1", "2", "3"];
      FinalizarSubscripcion("Ana", intereses, "ana@example.com");

      const solicitud = console.log.calls.mostRecent().args[0];
      expect(solicitud.intereses.length).toBe(3);
    });
  });

});


/* 3 ********************************** 3 *********************************** 3 ************************************ 3 */

/* Test para la Selecionar Atraciones. Lineas 212 a 341 */
describe("Flujo 3 - Creación de reservas de atracciones", function() {

  beforeEach(function() {
    spyOn(window, "prompt");
    spyOn(window, "alert");
    spyOn(console, "log");
  });


  // --- FUNCIONALIDAD BÁSICA (Happy Path) ---
  describe("Funcionalidad básica", function() {

    it("SolicitarAtracciones debe devolver el arreglo de atracciones y loguearlo", function() {
      const resultado = SolicitarAtracciones();

      expect(Array.isArray(resultado)).toBeTrue();
      expect(resultado.length).toBeGreaterThan(0);
      expect(console.log).toHaveBeenCalledWith("Solicitando atracciones al backend...");
      expect(console.log).toHaveBeenCalledWith("Respuesta recibida:");
      expect(console.log).toHaveBeenCalledWith(AtraccionTuristica);
    });

    it("SolicitarDisponibilidad debe devolver un array de días disponibles", function() {
      spyOn(Math, "random").and.returnValue(0.3); // fuerza disponibilidad
      const disponibilidad = SolicitarDisponibilidad("atraccion 1");
      expect(Array.isArray(disponibilidad)).toBeTrue();
      expect(disponibilidad.length).toBe(7); // todos los días disponibles
      expect(console.log).toHaveBeenCalledWith("Solicitando disponibilidad de la atraccion al backend...");
    });

    it("ConcretarReserva debe crear y mostrar el objeto de reserva correctamente", function() {
      const atraccion = "1";
      const grupo = 3;
      const dias = ["1", "3"];
      const email = "test@example.com";

      ConcretarReserva(atraccion, grupo, dias, email);

      expect(console.log).toHaveBeenCalledWith("Enviando los datos de la reserva al backend...");
      expect(console.log).toHaveBeenCalledWith(jasmine.objectContaining({
        atraccion,
        grupo,
        dias,
        email
      }));
    });
  });


  // --- CASOS BORDE ---
  describe("Casos borde", function() {

    it("SolicitarDisponibilidad debe poder devolver un array vacío (sin días disponibles)", function() {
      spyOn(Math, "random").and.returnValue(0.8); // sin disponibilidad
      const resultado = SolicitarDisponibilidad("atraccion 1");
      expect(resultado.length).toBe(0);
    });

    it("ConcretarReserva debe aceptar un grupo de 0 personas", function() {
      ConcretarReserva("1", 0, ["1"], "correo@example.com");
      expect(console.log).toHaveBeenCalledWith(jasmine.objectContaining({
        grupo: 0
      }));
    });

    it("Debe manejar strings vacíos como email sin lanzar error", function() {
      expect(function() {
        ConcretarReserva("1", 2, ["1"], "");
      }).not.toThrow();
    });
  });


  // --- VALIDACIÓN DE ERRORES ---
  describe("Validación de errores", function() {

    it("no debe lanzar error si se envían null o undefined", function() {
      expect(function() {
        ConcretarReserva(null, undefined, null, undefined);
      }).not.toThrow();
    });

    it("debe aceptar tipos incorrectos sin romper el flujo", function() {
      expect(function() {
        ConcretarReserva(123, "abc", {}, []);
      }).not.toThrow();
    });
  });


  // --- OPERACIONES CON ARRAYS ---
  describe("Operaciones con arrays", function() {

    it("SolicitarDisponibilidad debe generar un array de strings de días", function() {
      const resultado = SolicitarDisponibilidad("atraccion 1");
      resultado.forEach(dia => expect(typeof dia).toBe("string"));
    });

    it("ConcretarReserva debe aceptar múltiples días", function() {
      const dias = ["1", "2", "3"];
      ConcretarReserva("0", 5, dias, "test@example.com");
      expect(console.log).toHaveBeenCalledWith(jasmine.objectContaining({ dias }));
    });

    it("Debe poder agregar o eliminar días del array sin afectar la función", function() {
      const dias = ["1", "2"];
      dias.push("3");
      dias.pop();
      expect(function() {
        ConcretarReserva("0", 2, dias, "mail@test.com");
      }).not.toThrow();
    });
  });


  // --- OPERACIONES CON OBJETOS ---
  describe("Operaciones con objetos", function() {

    it("Debe crear un objeto 'datosReserva' con las claves correctas", function() {
      ConcretarReserva("2", 4, ["1", "2"], "objeto@test.com");

      const ultimaLlamada = console.log.calls.mostRecent().args[0];
      expect(ultimaLlamada.hasOwnProperty("atraccion")).toBeTrue();
      expect(ultimaLlamada.hasOwnProperty("grupo")).toBeTrue();
      expect(ultimaLlamada.hasOwnProperty("dias")).toBeTrue();
      expect(ultimaLlamada.hasOwnProperty("email")).toBeTrue();
    });

    it("El objeto de reserva debe poder modificarse (mutable)", function() {
      ConcretarReserva("1", 2, ["1"], "modificar@test.com");
      const reserva = console.log.calls.mostRecent().args[0];
      reserva.grupo = 99;
      expect(reserva.grupo).toBe(99);
    });
  });


  // --- CÁLCULOS Y ALGORITMOS ---
  describe("Cálculos y algoritmos", function() {

    it("Debe calcular correctamente el precio total (mockeando dependencias)", function() {
      spyOn(window, "SolicitarAtracciones").and.returnValue(AtraccionTuristica);
      spyOn(window, "SolicitarDisponibilidad").and.returnValue(["lunes", "martes"]);
      spyOn(window, "PromptSeleccionUnica").and.returnValue("0");
      spyOn(window, "PromptSeleccionMultiple").and.returnValue(["1", "2"]);
      spyOn(window, "PromptCorreoElectronico").and.returnValue("user@test.com");
      spyOn(window, "ConcretarReserva");

      // Simulamos prompts: atracción, grupo, email
      window.prompt.and.returnValues("1", "2");

      CrearUnaReserva();

      // Precio = precioAtraccion * cantidad de días * cantidad de personas
      const precioEsperado = AtraccionTuristica[0].precio * 2 * 2; // 10000 * 2 * 2 = 40000

      const mensaje = window.alert.calls.mostRecent().args[0];
      expect(mensaje).toContain(`$${precioEsperado}`);
    });

    it("Debe registrar en consola las solicitudes correctas en el flujo completo", function() {
      spyOn(window, "SolicitarAtracciones").and.returnValue(AtraccionTuristica);
      spyOn(window, "SolicitarDisponibilidad").and.returnValue(["lunes"]);
      spyOn(window, "PromptSeleccionUnica").and.returnValue("0");
      spyOn(window, "PromptSeleccionMultiple").and.returnValue(["1"]);
      spyOn(window, "PromptCorreoElectronico").and.returnValue("user@test.com");
      spyOn(window, "ConcretarReserva");

      window.prompt.and.returnValue("2");

      CrearUnaReserva();

      expect(window.ConcretarReserva).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalled();
    });
  });
});


/* 4 ********************************** 4 *********************************** 4 ************************************ 4 */

/* Test para la Menu de Usuario. Lineas 346 a 444 */
describe("Flujo 4 - Creación de Itinerario", function() {
    
    beforeEach(function() {
        // Espiamos funciones que interactúan con el usuario o consola
        spyOn(window, "prompt");
        spyOn(window, "alert");
        spyOn(console, "log");

        // Mock de las atracciones del "backend"
        spyOn(window, "SolicitarAtracciones").and.returnValue([
            { nombre: "Cataratas del Iguazú", precio: 10000 },
            { nombre: "Glaciar Perito Moreno", precio: 7000 },
            { nombre: "Tren a las Nubes", precio: 8000 }
        ]);

        // Mock de PromptCorreoElectronico
        spyOn(window, "PromptCorreoElectronico").and.returnValue("usuario@test.com");

        // Mock de PromptSeleccionMultiple con respuesta controlada
        spyOn(window, "PromptSeleccionMultiple").and.callFake(function(promptTxt, opciones) {
            // Caso feliz: siempre selecciona la primera atracción
            return ["1"];
        });
    });

    // --- FUNCIONALIDAD BÁSICA (HAPPY PATH) ---
    it("debería crear correctamente un itinerario con atracciones válidas", function() {
        spyOn(window, "FinalizarItinerario");

        // Mock de prompt para comentarios
        window.prompt.and.callFake(function(msg) {
            if (msg.includes("comentario")) return "Visitar temprano";
            return null;
        });

        CrearUnItinerario();

        expect(window.FinalizarItinerario).toHaveBeenCalled();
        const args = window.FinalizarItinerario.calls.argsFor(0);
        expect(args[0]).toBe("usuario@test.com"); // email
        expect(Array.isArray(args[1])).toBeTrue(); // itinerario
        expect(args[1][0]).toEqual(jasmine.objectContaining({
            dia: jasmine.any(String),
            atracciones: jasmine.any(Array)
        }));
    });

    // --- CASOS BORDE ---
    it("debería permitir días sin actividades (cuando se selecciona 'x')", function() {
        window.PromptSeleccionMultiple.and.returnValue(["x"]);

        spyOn(window, "FinalizarItinerario");

        CrearUnItinerario();

        const itinerario = window.FinalizarItinerario.calls.argsFor(0)[1];
        expect(itinerario.length).toBeLessThan(7); // algunos días sin actividad
    });

    it("debería aceptar comentarios vacíos", function() {
        window.prompt.and.returnValue(""); // comentario vacío
        spyOn(window, "FinalizarItinerario");

        CrearUnItinerario();

        const itinerario = window.FinalizarItinerario.calls.argsFor(0)[1];
        expect(itinerario[0].comentario).toBe(""); // sin comentario
    });

    // --- VALIDACIÓN DE ERRORES ---
    it("debería alertar si se elige 'x' junto con otras opciones", function() {
        window.PromptSeleccionMultiple.and.returnValue(["x", "1"]);
        
        CrearUnItinerario();
        
        expect(window.alert).toHaveBeenCalledWith("La opcion X debe ingresarse sola");
    });

    it("debería manejar null o undefined sin romper", function() {
        window.PromptSeleccionMultiple.and.returnValue(undefined);
        expect(() => CrearUnItinerario()).not.toThrow();
    });

    // --- OPERACIONES CON ARRAYS ---
    it("debería generar un itinerario con array de objetos por día", function() {
        spyOn(window, "FinalizarItinerario");
        CrearUnItinerario();

        const itinerario = window.FinalizarItinerario.calls.argsFor(0)[1];
        expect(Array.isArray(itinerario)).toBeTrue();
        expect(itinerario[0]).toEqual(jasmine.objectContaining({
            dia: jasmine.any(String),
            atracciones: jasmine.any(Array)
        }));
    });

    // --- OPERACIONES CON OBJETOS ---
    it("debería construir correctamente el objeto enviado al backend", function() {
        spyOn(window, "FinalizarItinerario");

        CrearUnItinerario();

        const data = window.FinalizarItinerario.calls.argsFor(0)[1];
        expect(data[0].hasOwnProperty("dia")).toBeTrue();
        expect(data[0].hasOwnProperty("atracciones")).toBeTrue();
        expect(data[0].hasOwnProperty("comentario")).toBeTrue();
    });

    // --- CÁLCULOS Y ALGORITMOS ---
    it("debería llamar a FinalizarItinerario con email válido y contenido esperado", function() {
        spyOn(window, "FinalizarItinerario");

        CrearUnItinerario();

        expect(window.FinalizarItinerario).toHaveBeenCalledWith(
            jasmine.stringMatching(/@/), // email válido
            jasmine.any(Array)
        );
    });
});
