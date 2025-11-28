// js/test/library.spec.js

describe("Librería AOS - integración con el sistema", function () {

  beforeEach(function () {
    // Verificar que script.js esté cargado
    if (typeof window.crearAtracciones === "undefined") {
      pending("script.js no está cargado o no expuso crearAtracciones en window.");
    }

    // Mock de filtroAtracciones para tener datos controlados
    window.filtroAtracciones = {
      buscarAtracciones: function () {
        return [
          {
            titulo: "Atracción 1",
            subtitulo: "Sub 1",
            descripcion: "Desc 1",
            idMapa: "map1",
            promptMaps: "https://maps.example/1",
            imgSrc: "img1.jpg",
            altFoto: "Foto 1"
          },
          {
            titulo: "Atracción 2",
            subtitulo: "Sub 2",
            descripcion: "Desc 2",
            idMapa: "map2",
            promptMaps: "https://maps.example/2",
            imgSrc: "img2.jpg",
            altFoto: "Foto 2"
          },
          {
            titulo: "Atracción 3",
            subtitulo: "Sub 3",
            descripcion: "Desc 3",
            idMapa: "map3",
            promptMaps: "https://maps.example/3",
            imgSrc: "img3.jpg",
            altFoto: "Foto 3"
          }
        ];
      }
    };
  });

  /* 1) Test de inicialización de la librería AOS */
  it("debe tener AOS definido e inicializado al cargar la aplicación", function () {
    // AOS debe existir
    expect(window.AOS).toBeDefined();
    expect(typeof window.AOS.init).toBe("function");

    // Flag que marca que se llamó a AOS.init() (lo setea el mock en test-runner.html)
    if (typeof window.__AOS_INIT_CALLED__ !== "undefined") {
      expect(window.__AOS_INIT_CALLED__).toBeTrue();
    }
  });

  /* 2) Test de configuración correcta */
  it("debe tener la configuración base de AOS correctamente definida", function () {
    expect(window.AOS).toBeDefined();
    expect(typeof window.AOS.init).toBe("function");

    // AOS no debería ser un objeto vacío o nulo
    expect(window.AOS).not.toEqual({});
    expect(window.AOS).not.toBeNull();

    // Si la implementación real expone defaults, verificamos que sea un objeto
    if (window.AOS && window.AOS.defaults) {
      expect(typeof window.AOS.defaults).toBe("object");
    }
  });

  /* 3) Test: AOS aplicado a las tarjetas (data-aos presente) */
  it("debe asignar el atributo data-aos a cada tarjeta generada", function () {
    const criterios = {
      momento: [1],
      horario: [0],
      actividad: [1],
      grupo: [1]
    };

    const tarjetas = window.crearAtracciones(criterios, () => {});

    expect(tarjetas.length).toBeGreaterThan(0);

    tarjetas.forEach(card => {
      const aosAttr = card.getAttribute("data-aos");
      expect(aosAttr).toBeDefined();
      expect(aosAttr).not.toBeNull();
      expect(aosAttr).not.toBe("");
    });
  });

  /* 4) Test: animaciones intercaladas izquierda/derecha */
  it("debe intercalar las animaciones AOS: fade-right y fade-left en las tarjetas", function () {
    const criterios = {
      momento: [1],
      horario: [0],
      actividad: [1],
      grupo: [1]
    };

    const tarjetas = window.crearAtracciones(criterios, () => {});

    // Según nuestro mock hay 3 atracciones
    expect(tarjetas.length).toBe(3);

    expect(tarjetas[0].getAttribute("data-aos")).toBe("fade-right");
    expect(tarjetas[1].getAttribute("data-aos")).toBe("fade-left");
    expect(tarjetas[2].getAttribute("data-aos")).toBe("fade-right");
  });

  /* 5) Test de funcionalidad principal integrada AOS */
  it("debe aplicar correctamente la funcionalidad principal de AOS animando las tarjetas con un patrón intercalado", function () {
    const criterios = {
      momento: [1],
      horario: [0],
      actividad: [1],
      grupo: [1]
    };

    const tarjetas = window.crearAtracciones(criterios, () => {});

    // Deben existir tarjetas
    expect(tarjetas.length).toBeGreaterThan(0);

    // Cada tarjeta tiene data-aos
    tarjetas.forEach(el => {
      const aosAttr = el.getAttribute("data-aos");
      expect(aosAttr).toBeDefined();
      expect(aosAttr).not.toBe("");
    });

    // Verificamos el patrón intercalado esperado
    const expectedPattern = ["fade-right", "fade-left", "fade-right"];

    for (let i = 0; i < tarjetas.length && i < expectedPattern.length; i++) {
      expect(tarjetas[i].getAttribute("data-aos")).toBe(expectedPattern[i]);
    }
  });

  /* 6) Test de manejo de errores de la librería / ausencia de AOS */
  it("debe manejar correctamente errores o ausencia de la librería AOS sin romper la funcionalidad", function () {
    const backupAOS = window.AOS;

    // Simulamos un problema: AOS no está disponible
    window.AOS = undefined;

    const criterios = {
      momento: [1],
      horario: [0],
      actividad: [1],
      grupo: [1]
    };

    let tarjetas;

    // La generación de tarjetas NO debe lanzar errores aunque AOS no exista
    expect(function () {
      tarjetas = window.crearAtracciones(criterios, () => {});
    }).not.toThrow();

    expect(tarjetas.length).toBeGreaterThan(0);

    tarjetas.forEach(card => {
      const aosAttr = card.getAttribute("data-aos");
      expect(aosAttr).toBeDefined();
      expect(aosAttr).not.toBe("");
    });

    // Restauramos AOS para no afectar otros tests
    window.AOS = backupAOS;
  });

  /* 7) Test de interacción con otras partes del sistema */
  it("debe interactuar correctamente con otras partes del sistema sin interferir con callbacks ni eventos", function () {
    const criterios = {
      momento: [1],
      horario: [0],
      actividad: [1],
      grupo: [1]
    };

    // Callback falso para simular integración con otra lógica
    const fakeCallback = jasmine.createSpy("fakeCallback");

    const tarjetas = window.crearAtracciones(criterios, fakeCallback);

    expect(tarjetas.length).toBeGreaterThan(0);

    // AOS está aplicado, pero no debe interferir
    tarjetas.forEach(card => {
      const aosAttr = card.getAttribute("data-aos");
      expect(aosAttr).toBeDefined();
      expect(aosAttr).not.toBe("");
    });

    // Simulamos interacción de usuario: clic en el botón de la primera tarjeta
    const boton = tarjetas[0].querySelector(".reservar-btn");
    expect(boton).toBeDefined();

    boton.click();

    // El callback debe haberse ejecutado, señal de que AOS no interfiere
    expect(fakeCallback).toHaveBeenCalled();
  });

});
