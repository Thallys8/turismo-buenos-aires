// js/api/apiService.js

// URL base del JSON de atracciones (desde index.html)
export const API_URL = "./js/api/atracciones.json";

/** Sanitiza un string: asegura que sea string, recorta espacios y aplica fallback si queda vacío. */
export function sanitizeString(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  const str = String(value).trim();
  return str || fallback;
}

/** Sanitiza un array de strings: fuerza a array, limpia cada valor y quita vacíos. */
export function sanitizeStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map(v => sanitizeString(v, ""))
    .filter(v => v.length > 0);
}

/**
 * Normaliza una atracción cruda del JSON.
 * Solo se descarta si NO tiene nombre.
 */
function normalizarAtraccion(raw, index) {
  if (!raw || typeof raw !== "object") {
    console.warn(`[apiService] Atracción en índice ${index} no es un objeto válido.`, raw);
    return null;
  }

  const nombreAtraccion = sanitizeString(raw.nombreAtraccion);
  if (!nombreAtraccion) {
    console.warn(`[apiService] Atracción en índice ${index} descartada por no tener nombre.`, raw);
    return null;
  }

  // Filtros
  const turnoAtraccion = sanitizeStringArray(raw.turnoAtraccion);
  const diasAbiertoAtraccion = sanitizeStringArray(raw.diasAbiertoAtraccion);
  const estiloAtraccion = sanitizeStringArray(raw.estiloAtraccion);
  const gruposRecomendadosAtraccion = sanitizeStringArray(raw.gruposRecomendadosAtraccion);

  // Dirección (aceptamos las dos variantes por si quedó el typo)
  const direccionAtraccion = sanitizeString(
    raw.direccionAtraccion ?? raw.dirreccionAtraccion,
    ""
  );

  // Campos para la tarjeta (lo que usa script.js)
  const titulo = sanitizeString(raw.titulo, nombreAtraccion);
  const subtitulo = sanitizeString(raw.subtitulo, "");
  const descripcion = sanitizeString(raw.descripcion, "");
  const horarioAbierto = sanitizeString(raw.horarioAbierto, "");
  const idMapa = sanitizeString(raw.idMapa, `map-${index}`);
  const promptMaps = sanitizeString(raw.promptMaps, "");
  const imgSrc = sanitizeString(raw.imgSrc, "");
  const altFoto = sanitizeString(raw.altFoto, titulo);

  return {
    nombreAtraccion,
    turnoAtraccion,
    diasAbiertoAtraccion,
    estiloAtraccion,
    gruposRecomendadosAtraccion,
    direccionAtraccion,
    titulo,
    subtitulo,
    descripcion,
    horarioAbierto,
    idMapa,
    promptMaps,
    imgSrc,
    altFoto
  };
}

/** Obtiene las atracciones desde el JSON, las normaliza y devuelve un array (puede ser vacío). */
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
    const listaCruda = Array.isArray(data.atracciones) ? data.atracciones : [];

    if (listaCruda.length === 0) {
      console.warn("[apiService] El JSON no contiene atracciones.");
      return [];
    }

    // Normalizar (map) y descartar solo las que estén realmente rotas (sin nombre)
    const normalizadas = listaCruda
      .map(normalizarAtraccion)
      .filter(a => a !== null);

    return normalizadas;
  } catch (error) {
    console.error("[apiService] Error general al obtener atracciones:", error);

    if (error instanceof SyntaxError) {
      throw new Error(
        "Tuvimos un problema al leer los datos de las atracciones. Por favor recargá la página."
      );
    }

    if (error.message && error.message.startsWith("No pudimos cargar")) {
      throw error;
    }

    throw new Error(
      "Ocurrió un error inesperado al cargar las atracciones. Probá nuevamente en unos segundos."
    );
  }
}

/** Devuelve solo los nombres de las atracciones (por si lo necesitas en otro lado). */
export async function obtenerNombresAtracciones() {
  const atracciones = await obtenerAtracciones();
  return atracciones.map(a => a.nombreAtraccion);
}
