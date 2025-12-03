// js/models/FiltroAtracciones.js

export default class FiltroAtracciones {
    constructor() {}

    /**
     * @param {Array<number|string>} momento  [1] = semana, [2] = finde
     * @param {Array<string>} horario  ["1"] = noche, ["2"] = dia
     * @param {Array<string>} actividad  ["1","2","3","4"] o ["[1,2,3,4]"]
     * @param {Array<string>} grupo   ["1","2","3","4"] o ["[1,2,3,4]"]
     * @param {Array<object>} atracciones    lista de atracciones (obtenerAtracciones)
     */
    buscarAtracciones(momento, horario, actividad, grupo, atracciones = []) {
        const momentosFiltro = this._mapMomento(momento);      // ["semana","finde"]
        const horariosFiltro = this._mapHorario(horario);      // ["dia","noche"]
        const estilosFiltro  = this._mapActividad(actividad);  // ["cultura",...]
        const gruposFiltro   = this._mapGrupo(grupo);          // ["familia",...]

        return atracciones.filter(atr => {
            const diasAtr = (atr.diasAbiertoAtraccion || []).map(d => d.toLowerCase());
            const turnos  = (atr.turnoAtraccion || []).map(t => t.toLowerCase());
            const estilos = (atr.estiloAtraccion || []).map(e => e.toLowerCase());
            const grupos  = (atr.gruposRecomendadosAtraccion || []).map(g => g.toLowerCase());

            // ---- MOMENTO: semana / finde ----
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

            // ---- HORARIO: dia / noche ----
            let okHorario = true;
            if (horariosFiltro.length > 0) {
                okHorario = turnos.some(t => horariosFiltro.includes(t));
            }

            // ---- ACTIVIDAD: deporte, fiesta, cultura, relajacion ----
            let okEstilo = true;
            if (estilosFiltro.length > 0) {
                okEstilo = estilos.some(e => estilosFiltro.includes(e));
            }

            // ---- GRUPO: familia, amigos, pareja, desconocidos ----
            let okGrupo = true;
            if (gruposFiltro.length > 0) {
                okGrupo = grupos.some(g => gruposFiltro.includes(g));
            }

            return okMomento && okHorario && okEstilo && okGrupo;
        });
    }

    _mapMomento(momentoArray = []) {
        const values = momentoArray.map(String);
        const result = [];
        if (values.includes("1")) result.push("semana");
        if (values.includes("2")) result.push("finde");
        return result;
    }

    _mapHorario(horarioArray = []) {
        const values = horarioArray.map(String);
        const result = [];

        // En tu HTML: 1 = noche, 2 = dia
        if (values.includes("1")) result.push("noche");
        if (values.includes("2")) result.push("dia");

        return result;
    }

    _mapActividad(actividadArray = []) {
        const values = actividadArray.map(String);

        // Cualquiera → todos los estilos
        if (values.includes("[1,2,3,4]")) {
            return ["deporte", "fiesta", "cultura", "relajacion"];
        }

        const mapa = {
            "1": "deporte",
            "2": "fiesta",
            "3": "cultura",
            "4": "relajacion"
        };

        return values
            .map(v => mapa[v])
            .filter(Boolean)
            .map(v => v.toLowerCase());
    }

    _mapGrupo(grupoArray = []) {
        const values = grupoArray.map(String);

        // Cualquiera → todos los grupos
        if (values.includes("[1,2,3,4]")) {
            return ["familia", "amigos", "pareja", "desconocidos"];
        }

        const mapa = {
            "1": "familia",
            "2": "amigos",
            "3": "pareja",
            "4": "desconocidos"
        };

        return values
            .map(v => mapa[v])
            .filter(Boolean)
            .map(v => v.toLowerCase());
    }
}
