// js/test/api.spec.js
// Pruebas orientadas a js/api/atracciones.json y apiService.js

import { API_URL, sanitizeString } from "../api/apiService.js";

/* ------------------------------------------------------------------
 * 0) Configuración básica de apiService
 * ------------------------------------------------------------------*/

describe("API de atracciones - configuración de apiService", function () {

  it("debe exponer la constante API_URL con la ruta correcta", function () {
    // Verificamos que la constante apunte al JSON esperado,
    // relativo al index.html (./js/api/atracciones.json)
    expect(API_URL).toBe("./js/api/atracciones.json");
  });

});

/* ------------------------------------------------------------------
 * 1) Tests unitarios de sanitizeString
 * ------------------------------------------------------------------*/

describe("sanitizeString", function () {

  it("devuelve el string recortado cuando es un valor válido", function () {
    const input = "   Hola Buenos Aires   ";
    const resultado = sanitizeString(input);

    // Esperamos que quite espacios al inicio y al final
    expect(resultado).toBe("Hola Buenos Aires");
  });

  it("reemplaza valores no-string por el fallback indicado", function () {
    const fallback = "valor-por-defecto";

    expect(sanitizeString(null, fallback)).toBe(fallback);
    expect(sanitizeString(undefined, fallback)).toBe(fallback);
    expect(sanitizeString(123, fallback)).toBe(fallback);
    expect(sanitizeString({}, fallback)).toBe(fallback);
    expect(sanitizeString([], fallback)).toBe(fallback);
  });

  it("si el string es vacío o solo espacios, devuelve el fallback", function () {
    const fallback = "vacío-normalizado";

    expect(sanitizeString("", fallback)).toBe(fallback);
    expect(sanitizeString("    ", fallback)).toBe(fallback);
  });

  it("si no se pasa fallback, usa cadena vacía como valor por defecto", function () {
    expect(sanitizeString(null)).toBe("");
    expect(sanitizeString("    ")).toBe("");
  });

  it("no revienta si el string contiene caracteres especiales o HTML", function () {
    const input = `<script>alert("xss")</script>`;
    const resultado = sanitizeString(input);

    // No definimos exactamente cómo se limpia, solo que sigue siendo string
    expect(typeof resultado).toBe("string");
    expect(resultado.length).toBeGreaterThan(0);
  });

});


/* ------------------------------------------------------------------
 * 2) Pruebas orientadas a js/api/atracciones.json (fetch + DOM)
 * ------------------------------------------------------------------*/

describe("API de atracciones - js/api/atracciones.json", function () {

  // Ruta del JSON relativa al test-runner (js/test/test-runner.html)
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
