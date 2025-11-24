import ConexionAlmacen from "./ConexionAlmacen.js";
import Validador from "./Validador.js"

/**
 * Se encarga de almacenar y ejecutar filtros para la informacion almacenada
 */
export default class FiltroAtracciones {
    validador;
    conexionAlmacen;

    constructor(){
        this.validador = new Validador();
        this.conexionAlmacen = new ConexionAlmacen();
    }

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
        const arrayAtracciones = this.conexionAlmacen.solicitarInformacionAtracciones();
        let atraccionesFiltradas = [];

        if(arrayAtracciones != null && arrayAtracciones){
            atraccionesFiltradas = arrayAtracciones.filter( atraccion => {
                let momentoOk = this.validador.algunValorExiste(momento, atraccion.momento);
                let horarioOk = this.validador.algunValorExiste(horario, atraccion.horario);
                let actividadOk = this.validador.algunValorExiste(actividad, atraccion.actividad);
                let grupoOk = this.validador.algunValorExiste(grupo, atraccion.grupo);

                return momentoOk && horarioOk && actividadOk && grupoOk;
            });
        }
        return atraccionesFiltradas;
    }

    /**
     * Busca la atraccion segun el nombre recibido como parametro
     * @param {String} nombre 
     * @returns {object} Los datos de la atraccion o null
     */
    buscarAtraccionPorNombre( nombre ){
        const arrayAtracciones = this.conexionAlmacen.solicitarInformacionAtracciones();

        let busqueda = arrayAtracciones.filter( atraccion => {
            return atraccion.titulo.normalize() === nombre.normalize();
        });

        if(busqueda.length > 0){
            return busqueda[0];
        }
        return null; 
    }
}