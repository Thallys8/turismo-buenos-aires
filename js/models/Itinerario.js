
/**
 * Representa un itinerario de viaje generado por el usuario
 */
export default class Itinerario{
    listaDias; 
    itinerario;
    
    constructor(){
        this.listaDias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];;
        this.itinerario = [];
    }

    /**
     * Permite cargar un dia en el itinerario
     * @param {Array<(string, any)>} keyValueArray Contiene las selecciones del usuario
     */
    cargarDiaItinerario( keyValueArray ){
        const datosItinerario = keyValueArray.reduce((objeto, [id, valor]) => {
            objeto[id] = valor;
            return objeto;
        }, {});

        this.itinerario.push(datosItinerario);
    }

    /**
     * Evalua si es que el itinerario se encuentra completo o faltan dias
     * @returns {Boolean} Si el itinerario esta completo o no
     */
    estaCompleto(){
        return this.itinerario.length === this.listaDias.length
    }

    /**
     * Devuelve el dia que se esta cargando actualmente
     * @returns {String} El dia que se esta cargando actualmente
     */
    diaEnProceso(){
        return this.listaDias[this.itinerario.length]
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