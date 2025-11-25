// Libreria AOS - En la animación de Scroll

describe("Inicialización de la librería AOS", function () {

    // ---- Test de inicialización de la librería AOS ----
    it("debe tener AOS definido con el método init", function () {
        expect(window.AOS).toBeDefined();
        expect(typeof window.AOS.init).toBe("function");
    });

    it("debe llamar a AOS.init() al cargar la aplicación", function () {
        // Este flag lo setea el mock de AOS en test-runner.html
        expect(window.__AOS_INIT_CALLED__).toBeTrue();
    });


    // ---------------------------------------------------------
    // ---- Test de configuración correcta AOS ----

    it("debe tener la configuración base de AOS correctamente definida", function () {
    // AOS debe existir
    expect(window.AOS).toBeDefined();

    // El método init debe existir y ser una función
    expect(typeof window.AOS.init).toBe("function");

    // Verificamos que AOS no haya sido sobrescrito o modificado de forma inesperada
    expect(window.AOS).not.toEqual({});
    expect(window.AOS).not.toBeNull();

    // Opcional: si querés marcar que soporta la configuración estándar
    // (esto funciona si estás usando la versión real de AOS)
    if (window.AOS && window.AOS.defaults) {
        expect(typeof window.AOS.defaults).toBe("object");
    }
    });


    // ---------------------------------------------------------
    // ---- Test de funcionalidad principal integrada AOS ----

    it("debe aplicar correctamente la funcionalidad principal de AOS animando las tarjetas con un patrón intercalado", function () {
    // Criterios para que crearAtracciones ejecute normalmente
    const criterios = {
        momento: [1],
        horario: [0],
        actividad: [1],
        grupo: [1]
    };

    // ---------------------------------------------------------
    // Generar tarjetas usando la lógica real de la app
    const tarjetas = window.crearAtracciones(criterios, () => {});

    // Validación: deben existir tarjetas generadas
    expect(tarjetas.length).toBeGreaterThan(0);

    // Validación: cada tarjeta debe tener data-aos (AOS aplicado)
    tarjetas.forEach(el => {
        const aosAttr = el.getAttribute("data-aos");
        expect(aosAttr).toBeDefined();
        expect(aosAttr).not.toBeNull();
        expect(aosAttr).not.toBe("");
    });

    // Validación: verificar el comportamiento principal → animaciones intercaladas
    // fade-right → fade-left → fade-right → fade-left ...
    const expectedPattern = ["fade-right", "fade-left", "fade-right"];

    for (let i = 0; i < tarjetas.length && i < expectedPattern.length; i++) {
        expect(tarjetas[i].getAttribute("data-aos")).toBe(expectedPattern[i]);
    }
    });

    
    // ---------------------------------------------------------
    // ---- Test de manejo de errores de la librería AOS ----
     it("debe manejar correctamente errores o ausencia de la librería AOS sin romper la funcionalidad", function () {
    // Guardamos el AOS original para restaurarlo al final
    const backupAOS = window.AOS;

    // Simulamos un problema: AOS no está disponible (no cargó / se rompió)
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

    // Debe seguir generando tarjetas
    expect(tarjetas.length).toBeGreaterThan(0);

    // Las tarjetas siguen teniendo algún valor en data-aos (función sigue estable)
    tarjetas.forEach(card => {
        const aosAttr = card.getAttribute("data-aos");
        expect(aosAttr).toBeDefined();
        expect(aosAttr).not.toBe("");
    });

    // Restauramos la referencia original de AOS para no afectar otros tests
    window.AOS = backupAOS;
    });
    
    
    // ---------------------------------------------------------
    // ---- Test de interacción con otras partes del sistema AOS ----
    it("debe interactuar correctamente con las funciones del sistema sin interferir con la creación de tarjetas ni callbacks", function () {
    // Criterios válidos para forzar la creación de tarjetas
    const criterios = {
        momento: [1],
        horario: [0],
        actividad: [1],
        grupo: [1]
    };

    // Creamos un callback falso para simular interacción con otros módulos
    const fakeCallback = jasmine.createSpy("fakeCallback");

    // Generamos tarjetas usando la función principal del sistema
    const tarjetas = window.crearAtracciones(criterios, fakeCallback);

    // Verificamos que existan tarjetas
    expect(tarjetas.length).toBeGreaterThan(0);

    // Las tarjetas deben seguir teniendo AOS sin interferir con el resto del comportamiento
    tarjetas.forEach(card => {
        const aos = card.getAttribute("data-aos");
        expect(aos).toBeDefined();
        expect(aos).not.toBe("");
    });

    // Simulamos interacción: clic en el botón de la primera tarjeta
    const boton = tarjetas[0].querySelector(".reservar-btn");
    expect(boton).toBeDefined();

    // Disparamos evento de click para comprobar interacción
    boton.click();

    // El callback asignado debe haberse ejecutado (señal de interacción correcta)
    expect(fakeCallback).toHaveBeenCalled();
    });

});
