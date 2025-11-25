import Semana from "./Semana.js";

/**
 * Representa un itinerario de viaje generado por el usuario
 */
export default class Itinerario{
    semana;
    itinerario;
    
    constructor(){
        this.semana = new Semana();
        this.itinerario = [];
    }

    /**
     * Permite cargar un dia en el itinerario
     * @param {Array<(string, any)>} keyValueArray Contiene las selecciones del usuario
     */
    cargarDiaItinerario( dia ){
        console.log(dia);
        this.itinerario.push(dia);
    }

    /**
     * Permite asociar un email al itinerario
     * @param {String} email 
     */
    cargarEmail( email ){
        this.itinerario.email = email;
    }

    /**
     * Evalua si es que el itinerario se encuentra completo o faltan dias
     * @returns {Boolean} Si el itinerario esta completo o no
     */
    estaCompleto(){
        let dias = this.semana.getSemana();
        return this.itinerario.length === dias.length
    }

    /**
     * Devuelve el dia que se esta cargando actualmente
     * @returns {String} El dia que se esta cargando actualmente
     */
    diaEnProceso(){
        return this.semana.getDias(this.itinerario.length);
    }

    /**
     * Retorna los datos del itinerario
     * @returns {Array<Object>}
     */
    getItinerario(){
        return this.itinerario;
    }

    /**
     * Retorna los datos del itinerario en formato JSON
     * @returns {JSON} un string json
     */
    toJSON(){
        console.log(this.itinerario);
        return JSON.stringify({ datos: this.itinerario });
    }
}