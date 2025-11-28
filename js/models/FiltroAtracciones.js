// js/models/FiltroAtracciones.js
import Validador from "./Validador.js";

export default class FiltroAtracciones {
    constructor() {
        this.validador = new Validador();
    }

    /**
     * Convierte los valores numéricos del formulario a strings
     * que coinciden con las propiedades del JSON de atracciones.
     * Ajustá estos mapas según los value de tus <option>.
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

    _mapearActividad(actividadArray) {
        if (!actividadArray || actividadArray.length === 0) return null;

        // Ajustá esto según tus opciones reales en el formulario
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
     * @param {Number[]|String[]} momento  (por ahora lo dejamos sin usar o futuro "semana/finde")
     * @param {Number[]|String[]} horario  (0=dia,1=noche → turnoAtraccion)
     * @param {Number[]|String[]} actividad (coincide con estiloAtraccion)
     * @param {Number[]|String[]} grupo     (coincide con gruposRecomendadosAtraccion)
     * @returns {Object[]} lista de atracciones que cumplen los filtros
     */
    buscarAtracciones(momento, horario, actividad, grupo) {
        // Obtenemos las atracciones desde la instancia global que expone script.js
        const conexion = window.conexionAlamacen;
        if (!conexion) {
            console.warn("No se encontró window.conexionAlamacen. ¿Se está cargando script.js antes?");
            return [];
        }

        const todas = conexion.solicitarInformacionAtracciones();

        // Normalizamos criterios
        const turnosFiltrar = this._mapearTurno(horario);
        const estilosFiltrar = this._mapearActividad(actividad);
        const gruposFiltrar = this._mapearGrupo(grupo);

        // Si no hay ningún criterio, devolvemos todas
        if (!turnosFiltrar && !estilosFiltrar && !gruposFiltrar) {
            return todas;
        }

        return todas.filter(atr => {
            let okTurno = true;
            let okEstilo = true;
            let okGrupo = true;

            // turnoAtraccion: ["dia","noche"]
            if (turnosFiltrar) {
                okTurno = this.validador.algunValorExiste(
                    atr.turnoAtraccion || [],
                    turnosFiltrar
                );
            }

            // estiloAtraccion: ["cultura","relajacion",...]
            if (estilosFiltrar) {
                okEstilo = this.validador.algunValorExiste(
                    atr.estiloAtraccion || [],
                    estilosFiltrar
                );
            }

            // gruposRecomendadosAtraccion: ["familia","amigos",...]
            if (gruposFiltrar) {
                okGrupo = this.validador.algunValorExiste(
                    atr.gruposRecomendadosAtraccion || [],
                    gruposFiltrar
                );
            }

            return okTurno && okEstilo && okGrupo;
        });
    }
}
