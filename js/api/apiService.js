// js/api/apiService.js

// URL base del JSON de atracciones (desde index.html)
export const API_URL = "./js/api/atracciones.json";

/** Sanitiza un string: lo fuerza a string, recorta espacios y aplica fallback si queda vacío. */
export function sanitizeString(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  const trimmed = String(value).trim();
  return trimmed || fallback;
}

/** Convierte el valor a array de strings “limpios”.
 * Acepta:
 *   - ["a","b"]
 *   - "a"
 *   - null / undefined → []
 */
function sanitizeToStringArray(value) {
  if (Array.isArray(value)) {
    return value
      .map(v => sanitizeString(v, ""))
      .filter(v => v.length > 0);
  }

  const single = sanitizeString(value, "");
  return single ? [single] : [];
}

/** Sanitiza una URL simple (para imgSrc / promptMaps). */
function sanitizeUrl(value) {
  const s = sanitizeString(value, "");
  if (!s) return "";
  // Permitimos http/https o rutas relativas
  if (s.startsWith("http") || s.startsWith("./") || s.startsWith("/")) {
    return s;
  }
  return "";
}

/**
 * Valida una atracción cruda del JSON y devuelve:
 * - objeto atracción sanitizado si es válida
 * - null si está demasiado rota y conviene ignorarla
 *
 * Conserva también los campos de UI:
 * titulo, subtitulo, descripcion, horarioAbierto, promptMaps, imgSrc, altFoto
 */
function validarYAtraccion(raw, index) {
  if (!raw || typeof raw !== "object") {
    console.warn(`[apiService] Atracción en índice ${index} no es un objeto válido.`);
    return null;
  }

  // --- Datos "de negocio" usados para filtros ---
  const nombreAtraccion = sanitizeString(raw.nombreAtraccion, "");

  let turnoAtraccion = sanitizeToStringArray(raw.turnoAtraccion);
  let diasAbiertoAtraccion = sanitizeToStringArray(raw.diasAbiertoAtraccion);
  let estiloAtraccion = sanitizeToStringArray(raw.estiloAtraccion);
  let gruposRecomendadosAtraccion = sanitizeToStringArray(raw.gruposRecomendadosAtraccion);

  // contemplamos posible typo dirreccionAtraccion
  const direccionAtraccion =
    sanitizeString(raw.direccionAtraccion, "") ||
    sanitizeString(raw.dirreccionAtraccion, "Ciudad de Buenos Aires");

  // --- Datos de presentación para la UI (tarjetas) ---
  const titulo = sanitizeString(raw.titulo || raw.nombreAtraccion || "", "Atracción");
  const subtitulo = sanitizeString(raw.subtitulo || "", "");
  const descripcion = sanitizeString(raw.descripcion || "", "");
  const horarioAbierto = sanitizeString(raw.horarioAbierto || "", "No informado");

  const promptMaps = sanitizeUrl(raw.promptMaps || "");
  const imgSrc = sanitizeUrl(raw.imgSrc || "");
  const altFoto = sanitizeString(raw.altFoto || titulo, titulo);

  // -------- Reglas mínimas de validez --------
  // Ahora solo exigimos que tenga nombre.
  const errores = [];

  if (!nombreAtraccion) {
    errores.push("Falta el nombre de la atracción.");
  }

  // Si los arrays vienen vacíos, les damos defaults en lugar de descartar todo.
  if (turnoAtraccion.length === 0) {
    console.warn(
      `[apiService] Atracción "${nombreAtraccion}" sin turnoAtraccion; se asigna ["dia","noche"].`
    );
    turnoAtraccion = ["dia", "noche"];
  }

  if (diasAbiertoAtraccion.length === 0) {
    console.warn(
      `[apiService] Atracción "${nombreAtraccion}" sin diasAbiertoAtraccion; se asigna semana completa.`
    );
    diasAbiertoAtraccion = [
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo"
    ];
  }

  if (errores.length > 0) {
    console.warn(
      `[apiService] Atracción inválida en índice ${index} (${nombreAtraccion || "sin nombre"}):`,
      errores.join(" | ")
    );
    return null;
  }

  // Devolvemos TODO lo que necesita la app (filtros + UI)
  return {
    // negocio / filtros
    nombreAtraccion,
    turnoAtraccion,
    diasAbiertoAtraccion,
    estiloAtraccion,
    gruposRecomendadosAtraccion,
    direccionAtraccion,

    // presentación
    titulo,
    subtitulo,
    descripcion,
    horarioAbierto,
    promptMaps,
    imgSrc,
    altFoto
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

    if (atrSanitizadas.length === 0) {
      console.warn("[apiService] No se encontraron atracciones válidas después de la validación.");
      // No tiramos error duro: devolvemos array vacío.
      return [];
    }

    return atrSanitizadas;
  } catch (error) {
    console.error("[apiService] Error general al obtener atracciones:", error);

    if (error instanceof SyntaxError) {
      throw new Error(
        "Tuvimos un problema al leer los datos de las atracciones. Por favor recargá la página."
      );
    }

    if (
      error.message &&
      (error.message.startsWith("No pudimos cargar") ||
        error.message.startsWith("Encontramos un problema"))
    ) {
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

/** Filtra atracciones por un criterio flexible. */
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

/** Devuelve estadísticas usando reduce. */
export async function obtenerEstadisticasAtracciones() {
  const atracciones = await obtenerAtracciones();

  const estadisticas = atracciones.reduce(
    (acc, atr) => {
      acc.total++;

      atr.turnoAtraccion.forEach(t => {
        acc.porTurno[t] = (acc.porTurno[t] || 0) + 1;
      });

      atr.estiloAtraccion.forEach(e => {
        acc.porEstilo[e] = (acc.porEstilo[e] || 0) + 1;
      });

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

/** Ayuda para integrar con el DOM. */
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
