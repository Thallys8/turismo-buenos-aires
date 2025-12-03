// js/models/FiltroAtracciones.js

export default class FiltroAtracciones {
    constructor() {}

    /**
     * Busca atracciones que cumplan con los criterios indicados.
     * @param {Array<number|string>} momento  [1] = semana, [2] = finde
     * @param {Array<number|string>} horario  ['0'] = día, ['1'] = noche
     * @param {Array<number|string>} actividad  códigos de tipo de actividad
     * @param {Array<number|string>} grupo   códigos de tipo de grupo
     * @param {Array<object>} atracciones    lista de atracciones (obtenerAtracciones)
     * @returns {Array<object>} atracciones filtradas
     */
    buscarAtracciones(momento, horario, actividad, grupo, atracciones = []) {
        const momentosFiltro = this._mapMomento(momento);
        const horariosFiltro = this._mapHorario(horario);
        const estilosFiltro  = this._mapActividad(actividad);
        const gruposFiltro   = this._mapGrupo(grupo);

        // Si no viene nada, no filtramos por ese criterio
        return atracciones.filter(atr => {
            const diasAtr = (atr.diasAbiertoAtraccion || []).map(d => d.toLowerCase());
            const turnos  = (atr.turnoAtraccion || []).map(t => t.toLowerCase());
            const estilos = (atr.estiloAtraccion || []).map(e => e.toLowerCase());
            const grupos  = (atr.gruposRecomendadosAtraccion || []).map(g => g.toLowerCase());

            // ---- filtro MOMENTO: semana / finde ----
            let okMomento = true;
            if (momentosFiltro.length > 0) {
                const diasSemana = ["lunes", "martes", "miercoles", "miércoles", "jueves"];
                const diasFinde  = ["viernes", "sabado", "sábado", "domingo"];

                const abreSemana = diasAtr.some(d => diasSemana.includes(d));
                const abreFinde  = diasAtr.some(d => diasFinde.includes(d));

                okMomento =
                    (momentosFiltro.includes("semana") && abreSemana) ||
                    (momentosFiltro.includes("finde")  && abreFinde);
            }

            // ---- filtro HORARIO: dia / noche ----
            let okHorario = true;
            if (horariosFiltro.length > 0) {
                okHorario = turnos.some(t => horariosFiltro.includes(t));
            }

            // ---- filtro ACTIVIDAD: cultura, fiesta, relajacion, deporte, etc. ----
            let okEstilo = true;
            if (estilosFiltro.length > 0) {
                okEstilo = estilos.some(e => estilosFiltro.includes(e));
            }

            // ---- filtro GRUPO: familia, amigos, pareja, desconocidos ----
            let okGrupo = true;
            if (gruposFiltro.length > 0) {
                okGrupo = grupos.some(g => gruposFiltro.includes(g));
            }

            return okMomento && okHorario && okEstilo && okGrupo;
        });
    }

    /**
     * Mapear valores del formulario de "momento" a etiquetas lógicas.
     * momento: 1 = semana, 2 = finde
     */
    _mapMomento(momentoArray = []) {
        const values = momentoArray.map(v => String(v));
        const result = [];

        if (values.includes("1")) result.push("semana");
        if (values.includes("2")) result.push("finde");

        return result;
    }

    /**
     * Mapear valores del formulario de "horario" a [ "dia", "noche" ].
     * horario: "0" = dia, "1" = noche
     */
    _mapHorario(horarioArray = []) {
        const values = horarioArray.map(v => String(v));
        const result = [];

        if (values.includes("0") || values.includes("dia")) {
            result.push("dia");
        }
        if (values.includes("1") || values.includes("noche")) {
            result.push("noche");
        }

        return result;
    }

    /**
     * Mapear valores del formulario "tipo-actividad" a los estilos del JSON.
     * Ajustá estos índices a los value reales de tus <option>.
     *
     * Ejemplo posible:
     *  0 = cualquiera (sin filtro)
     *  1 = cultura
     *  2 = fiesta
     *  3 = relajacion
     *  4 = deporte
     */
    _mapActividad(actividadArray = []) {
        const values = actividadArray.map(v => String(v));

        const mapa = {
            "1": "cultura",
            "2": "fiesta",
            "3": "relajacion",
            "4": "deporte"
            // podés agregar más si tenés más estilos en el JSON
        };

        const resultado = values
            .map(v => mapa[v])
            .filter(Boolean)       // quita undefined
            .map(v => v.toLowerCase());

        return resultado;
    }

    /**
     * Mapear valores del formulario "tipo-grupo" a los grupos del JSON.
     *
     * Ejemplo posible:
     *  0 = familia
     *  1 = amigos
     *  2 = pareja
     *  3 = desconocidos
     */
    _mapGrupo(grupoArray = []) {
        const values = grupoArray.map(v => String(v));

        const mapa = {
            "0": "familia",
            "1": "amigos",
            "2": "pareja",
            "3": "desconocidos"
        };

        const resultado = values
            .map(v => mapa[v])
            .filter(Boolean)
            .map(v => v.toLowerCase());

        return resultado;
    }
}
