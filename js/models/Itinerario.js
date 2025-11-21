import conexionAlmacen from "./ConexionAlmacen.js";

/**
 * Representa un itinerario de viaje generado por el usuario
 */
class Itinerario{
    listaDias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    itinerario = [];

    /**
     * Permite cargar un dia en el itinerario
     * @param {HTMLElement} formulario Contiene las selecciones del usuario
     */
    cargarDiaItinerario( formulario ){
        const datosFormulario = new FormData(formulario);
        const datosItinerario = Array.from(datosFormulario).reduce( (objeto, [id, valor]) => {
            objeto[id] = valor;
            return objeto;
        });

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
     * Retorna los datos del itinerario en formato JSON
     * @returns {JSON} un string json
     */
    toJSON(){
        console.log(this.itinerario);
        return JSON.stringify({ datos: this.itinerario });
    }
}

export default Itinerario;