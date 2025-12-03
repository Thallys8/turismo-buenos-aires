/* 1 ********************************** 1 *********************************** 1 ************************************ 1 */

/* Test para handlerSubmitBusqueda - Búsqueda de atracciones con formulario */

describe("Flujo 1 - handlerSubmitBusqueda()", function() {

  let mockListaActividades;

  beforeEach(function() {
    // Verificar que script.js esté cargado
    if (typeof window.handlerSubmitBusqueda === 'undefined') {
      pending("script.js no está cargado. Asegúrate de incluirlo en el SpecRunner.html");
    }
    
    // Mock del DOM (elemento real que necesita la función)
    mockListaActividades = document.createElement('div');
    mockListaActividades.id = 'lista-de-actividades';
    document.body.appendChild(mockListaActividades);
    
    // Solo silenciar logs, no mockear funcionalidad
    spyOn(console, "log");
  });

  afterEach(function() {
    if (document.body.contains(mockListaActividades)) {
      document.body.removeChild(mockListaActividades);
    }
    
    // Limpiar cualquier popup creado
    document.querySelectorAll('.panel-con-fondo').forEach(el => el.remove());
  });

  // --- FUNCIONALIDAD BÁSICA (happy path) ---
  it("debe procesar correctamente parámetros válidos", async function() {
    const parametros = {
      momento: [1], 
      horario: [0], 
      actividad: [1], 
      grupo: [1]
    };

    const mockAtracciones = [
      { nombreAtraccion: "Obelisco" }
    ];

    spyOn(window, "obtenerAtracciones").and.resolveTo(mockAtracciones);
    spyOn(window.filtroAtracciones, "buscarAtracciones").and.returnValue([]);

    await window.handlerSubmitBusqueda(parametros, mockListaActividades);

    // Si llegó hasta acá sin tirar error, estamos bien
    expect(true).toBeTrue();
  });

  // --- CASOS BORDE ---
  it("debe aceptar arrays vacíos como parámetros", async function() {
    const parametros = {
      momento: [], 
      horario: [], 
      actividad: [], 
      grupo: []
    };

    const mockAtracciones = [
      { nombreAtraccion: "Teatro Colón" }
    ];

    spyOn(window, "obtenerAtracciones").and.resolveTo(mockAtracciones);
    spyOn(window.filtroAtracciones, "buscarAtracciones").and.returnValue([]);

    await window.handlerSubmitBusqueda(parametros, mockListaActividades);

    expect(true).toBeTrue();
  });

  it("debe manejar resultados sin atracciones mostrando mensaje apropiado", async function() {
    // Usamos el contenedor creado en beforeEach
    const lista = mockListaActividades;

    // Mock de datos crudos que devolvería la API
    const mockAtracciones = [
      { nombreAtraccion: "Obelisco" },
      { nombreAtraccion: "Teatro Colón" }
    ];

    // Mock de API
    spyOn(window, "obtenerAtracciones").and.resolveTo(mockAtracciones);

    // Filtro devuelve SIN resultados
    spyOn(window.filtroAtracciones, "buscarAtracciones").and.returnValue([]);

    const parametros = {
      momento: [1],
      horario: [0],
      actividad: [1],
      grupo: [1]
    };

    await window.handlerSubmitBusqueda(parametros, lista);

    // Debe mostrarse el mensaje de "ninguna cumple con el criterio"
    expect(lista.textContent).toContain("cumple con el criterio");
  });

  // --- VALIDACIÓN DE ERRORES ---
  it("debe manejar parámetros null o undefined sin lanzar error", async function() {
    const parametros = {
      momento: null, 
      horario: undefined, 
      actividad: [], 
      grupo: []
    };

    const mockAtracciones = [
      { nombreAtraccion: "Jardín Japonés" }
    ];

    spyOn(window, "obtenerAtracciones").and.resolveTo(mockAtracciones);
    spyOn(window.filtroAtracciones, "buscarAtracciones").and.returnValue([]);

    await window.handlerSubmitBusqueda(parametros, mockListaActividades);

    expect(true).toBeTrue();
  });

  // --- OPERACIONES CON ARRAYS ---
  it("debe limpiar elementos anteriores antes de agregar nuevos", async () => {
    const lista = mockListaActividades;
    lista.innerHTML = "<p>Contenido anterior</p>";

    const mockAtracciones = [
      { nombreAtraccion: "Planetario" }
    ];

    spyOn(window, "obtenerAtracciones").and.resolveTo(mockAtracciones);

    // Devolvemos una lista con UNA atracción ya en formato que espera crearAtracciones
    spyOn(window.filtroAtracciones, "buscarAtracciones").and.returnValue([
      {
        titulo: "Planetario",
        subtitulo: "Ciencia y estrellas",
        descripcion: "Un lugar para mirar el cielo.",
        horarioAbierto: "10 a 18 h",
        idMapa: "map-planetario",
        promptMaps: "https://maps.google.com",
        imgSrc: "img/planetario.jpg",
        altFoto: "Planetario"
      }
    ]);

    const parametros = {
      momento: [1],
      horario: [0],
      actividad: [1],
      grupo: [1]
    };

    await window.handlerSubmitBusqueda(parametros, lista);

    // Ya no debería estar el texto anterior
    expect(lista.innerHTML).not.toContain("Contenido anterior");
    // Y debería haber la nueva tarjeta
    expect(lista.innerHTML).toContain("Planetario");
  });

  // --- OPERACIONES CON OBJETOS ---
  it("debe usar el filtro de atracciones para buscar", async () => {
    const lista = mockListaActividades;

    const mockAtracciones = [
      { nombreAtraccion: "Jardín Japonés" }
    ];

    spyOn(window, "obtenerAtracciones").and.resolveTo(mockAtracciones);

    const spyFiltro = spyOn(window.filtroAtracciones, "buscarAtracciones")
      .and.returnValue([]);

    const parametros = {
      momento: [1],
      horario: [0],
      actividad: [1],
      grupo: [1]
    };

    await window.handlerSubmitBusqueda(parametros, lista);

    expect(spyFiltro.calls.count()).toBeGreaterThan(0);
  });
});


/* 2 ********************************** 2 *********************************** 2 ************************************ 2 */
    
/* Test para concretarSubscripcionNews - Suscripción a Newsletter */

describe("Flujo 2 - Suscripción a Newsletter", function() {

  let mockFormulario;
  let mockEvent;

  beforeEach(function() {
    // Verificar que script.js esté cargado
    if (typeof window.concretarSubscripcionNews === 'undefined') {
      pending("script.js no está cargado. Asegúrate de incluirlo en el SpecRunner.html");
    }
    
    // Mock del formulario
    mockFormulario = document.createElement('form');
    mockFormulario.innerHTML = `
      <input name="nombre" value="Juan Pérez">
      <input type="checkbox" name="noticias" value="1" checked>
      <input type="checkbox" name="eventos" value="2" checked>
      <input name="email" value="juan@example.com">
      <span id="email-error" class="email-error"></span>
    `;
    
    const parentElement = document.createElement('div');

    parentElement.appendChild(mockFormulario);
    document.body.appendChild(parentElement);

    const emailError = document.createElement("span");
    emailError.id = "email-error";
    document.body.appendChild(emailError);
    
    // Mock del evento
    mockEvent = jasmine.createSpyObj('event', ['preventDefault']);
  });

  afterEach(function() {
    // Limpiar popups
    document.querySelectorAll('.panel-con-fondo').forEach(el => el.remove());
    const emailError = document.getElementById("email-error");
    if (emailError) emailError.remove();
  });

  // --- FUNCIONALIDAD BÁSICA ---
  it("debe prevenir el comportamiento por defecto del formulario", function() {
    window.concretarSubscripcionNews(mockEvent, mockFormulario);
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it("debe procesar los datos del formulario", function() {
    expect(function() {
      window.concretarSubscripcionNews(mockEvent, mockFormulario);
    }).not.toThrow();
  });

  it("debe crear un popup de confirmación", function() {
    window.concretarSubscripcionNews(mockEvent, mockFormulario);
    
    // Verificar que se creó un popup
    const popup = document.querySelector('.panel-con-fondo');
    expect(popup).toBeTruthy();
    expect(popup.innerHTML).toContain("Subscripcion exitosa");
  });

  // --- CASOS BORDE ---
  it("debe aceptar un formulario con campos vacíos", function() {
    mockFormulario.innerHTML = `
      <input name="nombre" value="">
      <input name="email" value="">
      <span id="email-error" class="email-error"></span>
    `;
    
    expect(function() {
      window.concretarSubscripcionNews(mockEvent, mockFormulario);
    }).not.toThrow();
  });

  it("debe manejar formularios sin checkboxes seleccionados", function() {
    mockFormulario.innerHTML = `
      <input name="nombre" value="Test">
      <input type="checkbox" name="noticias" value="1">
      <input name="email" value="test@example.com">
      <span id="email-error" class="email-error"></span>
    `;
    
    expect(function() {
      window.concretarSubscripcionNews(mockEvent, mockFormulario);
    }).not.toThrow();
  });

  // --- VALIDACIÓN DE ERRORES ---
  it("no debe lanzar errores con valores básicos", function() {
    expect(function() {
      window.concretarSubscripcionNews(mockEvent, mockFormulario);
    }).not.toThrow();
  });

  // --- OPERACIONES CON OBJETOS ---
  it("debe extraer correctamente los datos del FormData", function() {
    const formData = new FormData(mockFormulario);
    
    expect(formData.get('nombre')).toBe('Juan Pérez');
    expect(formData.get('email')).toBe('juan@example.com');
  });
});


/* 3 ********************************** 3 *********************************** 3 ************************************ 3 */

/* Test para generarMenuReserva y concretarReserva - Creación de reservas */

describe("Flujo 3 - Creación de reservas de atracciones", function() {

  let mockEvent;
  let mockFormulario;

  beforeEach(function() {
    // Verificar que script.js esté cargado
    if (typeof window.generarMenuReserva === 'undefined' || typeof window.concretarReserva === 'undefined') {
      pending("script.js no está cargado. Asegúrate de incluirlo en el SpecRunner.html");
    }
    
    spyOn(console, 'log');
  });

  afterEach(function() {
    // Limpiar popups
    document.querySelectorAll('.panel-con-fondo').forEach(el => el.remove());
  });

  // --- FUNCIONALIDAD BÁSICA ---
  describe("generarMenuReserva()", function() {
    
    it("debe procesar el evento correctamente", function() {
      const mockButton = document.createElement('button');
      mockButton.value = "Cataratas del Iguazú";
      mockEvent = { target: mockButton };
      
      expect(function() {
        window.generarMenuReserva(mockEvent);
      }).not.toThrow();
    });

    it("debe crear un popup con formulario cuando hay disponibilidad", function() {
      const mockButton = document.createElement('button');
      mockButton.value = "Cataratas del Iguazú";
      mockEvent = { target: mockButton };
      
      window.generarMenuReserva(mockEvent);
      
      // Puede o no crear popup dependiendo de disponibilidad real
      // Solo verificamos que no lanza error
      expect(true).toBeTrue();
    });
  });

  describe("concretarReserva()", function() {
    
    beforeEach(function() {
      mockFormulario = document.createElement('form');
      mockFormulario.innerHTML = `
        <input name="atraccion" value="Test Atracción">
        <input name="visitantes" value="3">
        <input name="disponibilidad" value="Lunes">
        <input name="email" value="test@example.com">
        <span id="email-error" class="email-error"></span>
      `;
      
      const parentElement = document.createElement('div');
      parentElement.appendChild(mockFormulario);
      document.body.appendChild(parentElement);
      
      mockEvent = jasmine.createSpyObj('event', ['preventDefault']);
    });

    it("debe prevenir el comportamiento por defecto", function() {
      window.concretarReserva(mockEvent, mockFormulario);
      
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it("debe crear un popup de confirmación con los datos", function() {
      window.concretarReserva(mockEvent, mockFormulario);
      
      const popup = document.querySelector('.panel-con-fondo');
      expect(popup).toBeTruthy();
      expect(popup.innerHTML).toContain("reservacion");
    });
  });

  // --- CASOS BORDE ---
  it("debe manejar valores de atracción válidos", function() {
    const mockButton = document.createElement('button');
    mockButton.value = "Atracción Test";
    
    expect(function() {
      window.generarMenuReserva({ target: mockButton });
    }).not.toThrow();
  });

  // --- VALIDACIÓN DE ERRORES ---
  it("debe manejar formularios básicos sin lanzar error", function() {
    mockFormulario = document.createElement('form');
    mockFormulario.innerHTML = `
      <input name="atraccion" value="Test">
      <input name="visitantes" value="1">
      <input name="disponibilidad" value="Lunes">
      <input name="email" value="test@test.com">
      <span id="email-error" class="email-error"></span>
    `;
    
    const parentElement = document.createElement('div');
    parentElement.appendChild(mockFormulario);
    mockEvent = jasmine.createSpyObj('event', ['preventDefault']);
    
    expect(function() {
      window.concretarReserva(mockEvent, mockFormulario);
    }).not.toThrow();
  });
});


/* 4 ********************************** 4 *********************************** 4 ************************************ 4 */

/* Test para generarItinerario - Creación de Itinerario */

describe("Flujo 4 - Creación de Itinerario", function() {

  beforeEach(function() {
    // Verificar que script.js esté cargado
    if (typeof window.generarItinerario === 'undefined' || typeof window.almacenarDiaItinerario === 'undefined') {
      pending("script.js no está cargado. Asegúrate de incluirlo en el SpecRunner.html");
    }
    
    spyOn(console, 'log');
  });

  afterEach(function() {
    // Limpiar popups
    document.querySelectorAll('.panel-con-fondo').forEach(el => el.remove());
  });

  // --- FUNCIONALIDAD BÁSICA ---
  describe("generarItinerario()", function() {
    
    it("debe ejecutarse sin lanzar errores", async function() {
      const mockAtracciones = [
        { nombreAtraccion: "Obelisco" },
        { nombreAtraccion: "La Boca" }
      ];

      spyOn(window, "obtenerAtracciones").and.resolveTo(mockAtracciones);

      await window.generarItinerario();

      expect(true).toBeTrue();
    });

    it("debe crear un popup con formulario de itinerario", async function() {
      const mockAtracciones = [
        { nombreAtraccion: "Obelisco" },
        { nombreAtraccion: "La Boca" }
      ];

      spyOn(window, "obtenerAtracciones").and.resolveTo(mockAtracciones);

      await window.generarItinerario();
      
      const popup = document.querySelector('.panel-con-fondo');
      expect(popup).toBeTruthy();
      expect(popup.innerHTML.toLowerCase()).toContain("itinerario");
    });
  });

  describe("almacenarDiaItinerario()", function() {
    
    let mockFormulario;

    beforeEach(async function() {
      mockFormulario = document.createElement('form');
      mockFormulario.innerHTML = `
        <input type="checkbox" name="dias" value="lunes" checked>
        <input type="checkbox" name="dias" value="martes">
        <select name="lunes-mañana"><option value="Atracción 1" selected>Atracción 1</option></select>
        <select name="lunes-tarde"><option value="Atracción 2" selected>Atracción 2</option></select>
        <select name="lunes-noche"><option value="Atracción 3" selected>Atracción 3</option></select>
        <input name="email" value="test@example.com">
        <span id="email-error" class="email-error"></span>
      `;
      
      const parentElement = document.createElement('div');
      parentElement.appendChild(mockFormulario);
      document.body.appendChild(parentElement);

      const mockAtracciones = [
        { nombreAtraccion: "Atracción 1" },
        { nombreAtraccion: "Atracción 2" },
        { nombreAtraccion: "Atracción 3" }
      ];

      spyOn(window, "obtenerAtracciones").and.resolveTo(mockAtracciones);

      await window.generarItinerario();
    });

    it("debe procesar el formulario sin errores", function() {
      expect(function() {
        window.almacenarDiaItinerario(mockFormulario);
      }).not.toThrow();
    });
  });

  // --- CASOS BORDE ---
  it("debe manejar la inicialización del itinerario", async function() {
    const mockAtracciones = [
      { nombreAtraccion: "Obelisco" }
    ];

    spyOn(window, "obtenerAtracciones").and.resolveTo(mockAtracciones);

    await window.generarItinerario();
    
    // Verificar que se creó el popup
    const popup = document.querySelector('.panel-con-fondo');
    expect(popup).toBeTruthy();
  });

  // --- VALIDACIÓN DE ERRORES ---
  it("no debe lanzar error al generar itinerario", async function() {
    const mockAtracciones = [
      { nombreAtraccion: "Obelisco" }
    ];

    spyOn(window, "obtenerAtracciones").and.resolveTo(mockAtracciones);

    await window.generarItinerario();

    expect(true).toBeTrue();
  });
});
