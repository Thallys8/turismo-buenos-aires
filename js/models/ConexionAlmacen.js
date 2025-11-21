import managerAlmacenamiento from "../utils/storage.js";
import Itinerario from "./Itinerario.js"; // para un jsdoc

/**
 * Maneja las conexiones con el almacenamiento interno en storage.js
 */
export default class ConexionAlamacen {
    keys = {
        atracciones: "atracciones",
        itinerarios: "itinerarios",
        newsletter: "newsletter",
        reservas: "reservas"
    }

    constructor(){
        for( let llave of Object.keys(this.keys)){
            if (!this.existeClave(llave))
                managerAlmacenamiento.guardar(llave, { datos: []}, "local");
        }
    }

    /**
     * Chequea si la clave especificada existe en el almacenamiento
     * @param {String} clave 
     * @returns {Boolean} Valor de verdad
     */
    existeClave( clave ){
        let respuesta = managerAlmacenamiento.obtener(clave);
        return ( respuesta !== undefined && respuesta );
    }


    /**
     * Devuelve la informacion de las atracciones disponibles en el sistema
     * @returns {JSON} objeto JSON con los datos de todas las atracciones
     */
    solicitarInformacionAtracciones(){
        let respuesta = managerAlmacenamiento.obtener(this.keys.atracciones, "local");
        return respuesta.datos;
    }

    /**
     * Busca la disponibilidad por dia para visitas, de una atraccion especifica
     * @param {String} idAtraccion identificador de la atraccion (nombre)
     * @returns {String} Lista de dias con disponibilidad
     */
    solicitarDisponibilidad(idAtraccion){
        
        // solicitar disponibilidad al almacenamiento

        let listaDias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
        
        // 50/50 de si el dia tiene cupos disponibles o no
        let disponibilidad = [];
        listaDias.forEach(dia => { 
            if(Math.random() < 0.5) { disponibilidad.push(dia); } 
        });

        return disponibilidad;
    }

    /**
     * Agrega un elemento a alguna clave en storage.js si existe
     * @param {String} clave 
     * @param {any} valor 
     */
    agregarLocalArrayActualizable(clave, valor){
        const respuesta = managerAlmacenamiento.obtener(clave, "local");

        if(respuesta !== undefined && respuesta){
            const arrayDatos = respuesta.datos;

            if( arrayDatos !== null && arrayDatos){
                console.log(respuesta);
                arrayDatos.push(valor);
                respuesta.datos = arrayDatos;
                
                managerAlmacenamiento.actualizar(clave, respuesta, "local");
            }
        }
    }

    /**
     * Recibe un DataForm y lo convierte en un objeto JSON
     * @param {DataForm} form Datos en formato DataForm 
     * @returns {JSON} objeto JSON con los datos del formulario
     */
    dataFormToJSON(form){
        var json = {};
        form.forEach(function(value, key){
            json[key] = value;
        });

        return json;
    }

    /**
     * Recibe los datos de la subscripcion a la newsletter y los guarda en el storage
     * @param {DataForm} subscripcionForm FormData con los datos de la subscripcion
     */
    ingresarInformacionNewsletter( subscripcionForm ){
        const subscripcion = this.dataFormToJSON(subscripcionForm);
        this.agregarLocalArrayActualizable(this.keys.newsletter, subscripcion);
    }

    /**
     * Recibe el objeto itinerario y los guarda en el storage
     * @param {Itinerario} itinerarioObj el objeto itinerario
     */
    ingresarInformacionItinerario( itinerarioObj ){
        const itinerario = itinerarioObj.toJSON();
        this.agregarLocalArrayActualizable(this.keys.itinerarios, itinerario);
    }

    /**
     * Recibe los datos de la reserva y los guarda en el storage
     * @param {DataForm} reservaForm
     */
    ingresarInformacionReservas( reservaForm ){
        const reserva = this.dataFormToJSON(reservaForm);
        this.agregarLocalArrayActualizable(this.keys.reservas, reserva);
    }
}