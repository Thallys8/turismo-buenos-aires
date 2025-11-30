// js/api/apiService.js

const API_URL = "./js/api/atracciones.json";

/** Sanitiza un string: asegura que sea string y recorta espacios. */
function sanitizeString(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value).trim();
}

/** Sanitiza un array de strings: fuerza a array, limpia cada valor y quita vacíos. */
function sanitizeStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map(v => sanitizeString(v))
    .filter(v => v.length > 0);
}

/**
 * Valida una atracción cruda del JSON y devuelve:
 * - objeto atracción sanitizado si es válida
 * - null si está demasiado rota y conviene ignorarla
 */
function validarYAtraccion(raw, index) {
  if (!raw || typeof raw !== "object") {
    console.warn(`[apiService] Atracción en índice ${index} no es un objeto válido.`);
    return null;
  }

  const nombreAtraccion = sanitizeString(raw.nombreAtraccion);
  const turnoAtraccion = sanitizeStringArray(raw.turnoAtraccion);
  const diasAbiertoAtraccion = sanitizeStringArray(raw.diasAbiertoAtraccion);
  const estiloAtraccion = sanitizeStringArray(raw.estiloAtraccion);
  const gruposRecomendadosAtraccion = sanitizeStringArray(raw.gruposRecomendadosAtraccion);
  const direccionAtraccion = sanitizeString(raw.direccionAtraccion, "Ciudad de Buenos Aires");

  // Reglas mínimas de validez
  const errores = [];

  if (!nombreAtraccion) {
    errores.push("Falta el nombre de la atracción.");
  }

  if (turnoAtraccion.length === 0) {
    errores.push("No tiene horarios asignados (día/noche).");
  }

  if (diasAbiertoAtraccion.length === 0) {
    errores.push("No tiene días de apertura configurados.");
  }

  if (errores.length > 0) {
    console.warn(
      `[apiService] Atracción inválida en índice ${index} (${nombreAtraccion || "sin nombre"}):`,
      errores.join(" | ")
    );
    return null;
  }

  return {
    nombreAtraccion,
    turnoAtraccion,
    diasAbiertoAtraccion,
    estiloAtraccion,
    gruposRecomendadosAtraccion,
    direccionAtraccion
  };
}

/** Obtiene las atracciones desde el JSON remoto, las sanitiza y valida. */
export async function obtenerAtracciones() {
  try {
    const resp = await fetch(API_URL);

    if (!resp.ok) {
      console.error(`[apiService] Error HTTP ${resp.status} al cargar ${API_URL}`);
      throw new Error(
        "No pudimos cargar las atracciones en este momento. Probá nuevamente en unos instantes."
      );
    }

    const data = await resp.json();

    if (!data || !Array.isArray(data.atracciones)) {
      console.error("[apiService] Formato de datos inválido: falta 'atracciones' como arreglo.");
      throw new Error(
        "Encontramos un problema con los datos de atracciones. Estamos trabajando para solucionarlo."
      );
    }

    // Sanitizar + validar (map) y descartar las inválidas (filter)
    const atrSanitizadas = data.atracciones
      .map(validarYAtraccion)
      .filter(a => a !== null);

    // Si no quedó ninguna válida, avisamos
    if (atrSanitizadas.length === 0) {
      console.warn("[apiService] No se encontraron atracciones válidas después de la validación.");
      throw new Error("Por el momento no hay atracciones disponibles.");
    }

    return atrSanitizadas;
  } catch (error) {
    // Log técnico para desarrollador
    console.error("[apiService] Error general al obtener atracciones:", error);

    // Error amigable para el usuario
    if (error instanceof SyntaxError) {
      // Error parseando JSON
      throw new Error(
        "Tuvimos un problema al leer los datos de las atracciones. Por favor recargá la página."
      );
    }

    if (error.message && error.message.startsWith("No pudimos cargar")) {
      throw error; 
    }

    if (error.message && error.message.startsWith("Encontramos un problema")) {
      throw error; 
    }

    throw new Error(
      "Ocurrió un error inesperado al cargar las atracciones. Probá nuevamente en unos segundos."
    );
  }
}

/** Map sobre los datos ya validados. Devuelve solo los nombres de las atracciones. */
export async function obtenerNombresAtracciones() {
  const atracciones = await obtenerAtracciones();
  return atracciones.map(a => a.nombreAtraccion);
}

/** Filtra atracciones por un criterio flexible.
 * `criterios` puede incluir:
 * - turno: ["dia","noche"]
 * - estilos: ["cultura","fiesta",...]
 * - grupos: ["familia","amigos",...]
 *
 * Usa filter + some (orden superior). */

export async function filtrarAtraccionesPorCriterios(criterios = {}) {
  const { turno, estilos, grupos } = criterios;
  const atracciones = await obtenerAtracciones();

  return atracciones.filter(a => {
    let okTurno = true;
    let okEstilo = true;
    let okGrupo = true;

    if (turno && Array.isArray(turno) && turno.length > 0) {
      okTurno = a.turnoAtraccion.some(t => turno.includes(t));
    }

    if (estilos && Array.isArray(estilos) && estilos.length > 0) {
      okEstilo = a.estiloAtraccion.some(e => estilos.includes(e));
    }

    if (grupos && Array.isArray(grupos) && grupos.length > 0) {
      okGrupo = a.gruposRecomendadosAtraccion.some(g => grupos.includes(g));
    }

    return okTurno && okEstilo && okGrupo;
  });
}

/** Devuelve estadísticas usando reduce:
 * - total de atracciones
 * - conteo por turno (cuántas tienen día, cuántas noche)
 * - conteo por tipo de estilo (cultura, fiesta, etc.) */

export async function obtenerEstadisticasAtracciones() {
  const atracciones = await obtenerAtracciones();

  const estadisticas = atracciones.reduce(
    (acc, atr) => {
      acc.total++;

      // turnos
      atr.turnoAtraccion.forEach(t => {
        acc.porTurno[t] = (acc.porTurno[t] || 0) + 1;
      });

      // estilos
      atr.estiloAtraccion.forEach(e => {
        acc.porEstilo[e] = (acc.porEstilo[e] || 0) + 1;
      });

      // grupos
      atr.gruposRecomendadosAtraccion.forEach(g => {
        acc.porGrupo[g] = (acc.porGrupo[g] || 0) + 1;
      });

      return acc;
    },
    {
      total: 0,
      porTurno: {},
      porEstilo: {},
      porGrupo: {}
    }
  );

  return estadisticas;
}

/** Función de ayuda para integrar con el DOM:
 * Recibe un callback que sabe "pintar" las atracciones.
 * Si hay error, llama a onError con un mensaje. */

export async function cargarAtraccionesEnUI({ onSuccess, onError }) {
  try {
    const atracciones = await obtenerAtracciones();
    if (typeof onSuccess === "function") {
      onSuccess(atracciones);
    }
  } catch (error) {
    console.error("[apiService] Error al cargar atracciones en UI:", error);
    if (typeof onError === "function") {
      onError(error.message || "Error al cargar las atracciones.");
    }
  }
}
