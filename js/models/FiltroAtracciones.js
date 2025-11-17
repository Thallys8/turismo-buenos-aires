import conexionAlmacen from "./ConexionAlmacen.js";
import validador from "./Validador.js"

/**
 * Se encarga de almacenar y ejecutar filtros para la informacion almacenada
 */
class FiltroAtracciones {

    /**
     * Solicita al backend que devuelva las atracciones que cumplen con los requisitos
     * 
     * @param {String[]} momento - Los momentos de la semana seleccionados
     * @param {String[]} horario - Los horarios del dia seleccionados
     * @param {String[]} actividad - Los tipos de actividades seleccionados
     * @param {String[]} grupo - Los tipos de grupos seleccionados
     * @returns {Object[]} Las atracciones que cumplan con los parametros
     */
    buscarAtracciones(momento, horario, actividad, grupo){
        const arrayAtracciones = conexionAlmacen.solicitarInformacionAtracciones().datos;

        let atraccionesFiltradas = arrayAtracciones.filter( atraccion => {
            let momentoOk = validador.algunValorExiste(momento, atraccion.momento);
            let horarioOk = validador.algunValorExiste(horario, atraccion.horario);
            let actividadOk = validador.algunValorExiste(actividad, atraccion.actividad);
            let grupoOk = validador.algunValorExiste(grupo, atraccion.grupo);

            console.log(momentoOk + " " + horarioOk + " " + actividadOk + " " + grupoOk);
            return momentoOk && horarioOk && actividadOk && grupoOk;
        });

        return atraccionesFiltradas;
    }
}

const filtroAtracciones = new FiltroAtracciones();
export default filtroAtracciones;