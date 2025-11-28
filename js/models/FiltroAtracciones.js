// js/models/FiltroAtracciones.js
import Validador from "./Validador.js";

export default class FiltroAtracciones {
    constructor() {
        this.validador = new Validador();
    }

    /**
     * Normaliza un nombre de día para poder compararlo sin problemas de mayúsculas/acentos.
     * ej: "Miércoles" → "miercoles"
     */
    _normalizarDia(dia) {
        return dia
            .toLowerCase()
            .normalize("NFD")               // separa acentos
            .replace(/[\u0300-\u036f]/g, ""); // elimina acentos
    }

    /**
     * A partir de la lista de días de una atracción, determina si esa atracción
     * abre en días de semana y/o en fin de semana.
     */
    _clasificarMomentoDesdeDias(diasAbiertoAtraccion = []) {
        const diasNorm = diasAbiertoAtraccion.map(d => this._normalizarDia(d));

        const diasSemana = ["lunes", "martes", "miercoles", "jueves"];
        const diasFinde  = ["viernes", "sabado", "domingo"];

        const tieneSemana = diasSemana.some(d => diasNorm.includes(d));
        const tieneFinde  = diasFinde.some(d => diasNorm.includes(d));

        return { tieneSemana, tieneFinde };
    }

    /**
     * Interpreta el array `momento` que viene del formulario.
     * momento: [1]  -> solo semana
     * momento: [2]  -> solo finde
     * momento: [1,2] o vacío -> no filtra por momento
     */
    _interpretarMomento(momentoArray) {
        if (!momentoArray || momentoArray.length === 0) {
            return null; // sin filtro
        }

        // Convertimos a número por las dudas
        const valores = Array.from(new Set(momentoArray.map(m => Number(m))));
        const incluyeSemana = valores.includes(1);
        const incluyeFinde  = valores.includes(2);

        // Si tiene ambos (1 y 2), es como no filtrar por momento
        if (incluyeSemana && incluyeFinde) {
            return null;
        }

        return {
            filtrarSemana: incluyeSemana,
            filtrarFinde: incluyeFinde
        };
    }

    /**
     * Mapea el horario (0/1) a "dia"/"noche" para comparar con turnoAtraccion.
     */
    _mapearTurno(horarioArray) {
        if (!horarioArray || horarioArray.length === 0) return null;

        const mapaTurno = {
            0: "dia",
            1: "noche",
            "0": "dia",
            "1": "noche"
        };

        return horarioArray.map(v => mapaTurno[v] || v);
    }

    /**
     * Mapea la actividad (número) a strings que coincidan con estiloAtraccion.
     * Ajustá este mapa según los value reales de tu <select name="tipo-actividad">.
     */
    _mapearActividad(actividadArray) {
        if (!actividadArray || actividadArray.length === 0) return null;

        const mapaActividad = {
            0: "cualquiera",
            1: "cultura",
            2: "relajacion",
            3: "fiesta",
            4: "deporte",
            5: "aventura",
            "0": "cualquiera",
            "1": "cultura",
            "2": "relajacion",
            "3": "fiesta",
            "4": "deporte",
            "5": "aventura"
        };

        return actividadArray.map(v => mapaActividad[v] || v);
    }

    /**
     * Mapea el grupo (número) a strings que coincidan con gruposRecomendadosAtraccion.
     * Ajustá según los value reales de <select name="tipo-grupo">.
     */
    _mapearGrupo(grupoArray) {
        if (!grupoArray || grupoArray.length === 0) return null;

        const mapaGrupo = {
            0: "cualquiera",
            1: "familia",
            2: "amigos",
            3: "pareja",
            4: "desconocidos",
            "0": "cualquiera",
            "1": "familia",
            "2": "amigos",
            "3": "pareja",
            "4": "desconocidos"
        };

        return grupoArray.map(v => mapaGrupo[v] || v);
    }

    /**
     * Buscar atracciones que cumplan con los criterios.
     * @param {Number[]|String[]} momento   1 = semana, 2 = finde
     * @param {Number[]|String[]} horario   0=dia,1=noche → turnoAtraccion
     * @param {Number[]|String[]} actividad → estiloAtraccion
     * @param {Number[]|String[]} grupo     → gruposRecomendadosAtraccion
     * @returns {Object[]} lista de atracciones que cumplen los filtros
     */
    buscarAtracciones(momento, horario, actividad, grupo) {
        const conexion = window.conexionAlamacen;
        if (!conexion) {
            console.warn("No se encontró window.conexionAlamacen. Verificá el orden de los scripts.");
            return [];
        }

        const todas = conexion.solicitarInformacionAtracciones();

        // Interpretamos filtros
        const filtroMomento = this._interpretarMomento(momento);
        const turnosFiltrar  = this._mapearTurno(horario);
        const estilosFiltrar = this._mapearActividad(actividad);
        const gruposFiltrar  = this._mapearGrupo(grupo);

        // Si literalmente no hay ningún filtro activo en nada:
        if (!filtroMomento && !turnosFiltrar && !estilosFiltrar && !gruposFiltrar) {
            return todas;
        }

        return todas.filter(atr => {
            let okMomento = true;
            let okTurno   = true;
            let okEstilo  = true;
            let okGrupo   = true;

            // MOMENTO (semana / finde) según diasAbiertoAtraccion
            if (filtroMomento) {
                const { tieneSemana, tieneFinde } = this._clasificarMomentoDesdeDias(
                    atr.diasAbiertoAtraccion || []
                );

                // Si se pide semana, debe haber algún día de semana
                if (filtroMomento.filtrarSemana && !tieneSemana) {
                    okMomento = false;
                }

                // Si se pide finde, debe haber algún día de finde
                if (filtroMomento.filtrarFinde && !tieneFinde) {
                    okMomento = false;
                }
            }

            // HORARIO: turnoAtraccion ["dia","noche"]
            if (turnosFiltrar) {
                okTurno = this.validador.algunValorExiste(
                    atr.turnoAtraccion || [],
                    turnosFiltrar
                );
            }

            // ACTIVIDAD: estiloAtraccion ["cultura","relajacion",...]
            if (estilosFiltrar) {
                okEstilo = this.validador.algunValorExiste(
                    atr.estiloAtraccion || [],
                    estilosFiltrar
                );
            }

            // GRUPO: gruposRecomendadosAtraccion ["familia","amigos",...]
            if (gruposFiltrar) {
                okGrupo = this.validador.algunValorExiste(
                    atr.gruposRecomendadosAtraccion || [],
                    gruposFiltrar
                );
            }

            return okMomento && okTurno && okEstilo && okGrupo;
        });
    }
}
