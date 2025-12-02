// js/test/api.spec.js
// Pruebas orientadas a js/api/atracciones.json

describe("API de atracciones - js/api/atracciones.json", function () {

  const ATRACCIONES_URL = "../api/atracciones.json";

  /* 1) Test de función fetch con respuesta exitosa */
  it("debe obtener las atracciones correctamente con fetch (respuesta exitosa)", async function () {
    const response = await fetch(ATRACCIONES_URL);

    // La respuesta debe ser correcta (HTTP 200–299)
    expect(response.ok).toBeTrue();

    const data = await response.json();

    // Debe tener la propiedad 'atracciones' como array
    expect(data).toBeDefined();
    expect(Array.isArray(data.atracciones)).toBeTrue();
    expect(data.atracciones.length).toBeGreaterThan(0);

    // Cada atracción debe tener al menos un nombre
    const primera = data.atracciones[0];
    expect(primera.nombreAtraccion).toBeDefined();
  });

  /* 2) Test de función fetch con error HTTP */
  it("debe manejar un error HTTP (por ejemplo 404) al pedir un recurso inexistente", async function () {
    // Simulamos un recurso que no existe
    const response = await fetch("../api/recurso-inexistente.json");

    // No debería ser ok
    expect(response.ok).toBeFalse();
    // Normalmente será 404, pero al menos verificamos que sea >= 400
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  /* 3) Test de función fetch con error de red */
  it("debe manejar correctamente un error de red (fallo en fetch)", async function () {
    const originalFetch = window.fetch;

    // Espiamos fetch para simular un error de red (reject)
    spyOn(window, "fetch").and.returnValue(
      Promise.reject(new Error("Network error simulado"))
    );

    let errorCapturado;

    try {
      await fetch(ATRACCIONES_URL);
    } catch (error) {
      errorCapturado = error;
    }

    // Verificamos que el error se haya capturado
    expect(errorCapturado).toBeDefined();
    expect(errorCapturado.message).toContain("Network error");

    // Restauramos fetch original para no afectar otros tests
    window.fetch = originalFetch;
  });

  /* 4) Test de procesamiento de datos con map/filter/reduce */
  it("debe procesar los datos de atracciones usando map, filter y reduce correctamente", async function () {
    const response = await fetch(ATRACCIONES_URL);
    const data = await response.json();

    const atracciones = data.atracciones;

    // map: obtener solo los nombres de las atracciones
    const nombres = atracciones.map(a => a.nombreAtraccion);

    // filter: atracciones que se pueden visitar de día
    const atraccionesDia = atracciones.filter(a =>
      Array.isArray(a.turnoAtraccion) &&
      a.turnoAtraccion.includes("dia")
    );

    // reduce: total de días abiertos sumando todos
    const totalDiasAbiertos = atracciones.reduce((acum, a) => {
      const dias = Array.isArray(a.diasAbiertoAtraccion)
        ? a.diasAbiertoAtraccion.length
        : 0;
      return acum + dias;
    }, 0);

    expect(nombres.length).toBe(atracciones.length);
    expect(atraccionesDia.length).toBeGreaterThan(0);
    expect(totalDiasAbiertos).toBeGreaterThan(0);
  });

  /* 5) Test de integración con DOM (si aplica) */
  it("debe integrar los datos de atracciones en el DOM creando una lista de nombres", async function () {
    // Creamos un contenedor en el DOM para las pruebas
    const lista = document.createElement("ul");
    lista.id = "lista-atracciones-test";
    document.body.appendChild(lista);

    const response = await fetch(ATRACCIONES_URL);
    const data = await response.json();

    data.atracciones.forEach(a => {
      const li = document.createElement("li");
      li.textContent = a.nombreAtraccion;
      lista.appendChild(li);
    });

    const items = lista.querySelectorAll("li");

    // Debe haber un li por cada atracción
    expect(items.length).toBe(data.atracciones.length);

    // El primer elemento debe coincidir con la primera atracción del JSON
    expect(items[0].textContent).toBe(data.atracciones[0].nombreAtraccion);

    // Limpiamos el DOM de prueba
    document.body.removeChild(lista);
  });

});
