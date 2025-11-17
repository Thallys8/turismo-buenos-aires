import managerAlmacenamiento from "../utils/storage.js";
import Itinerario from "./Itinerario.js";

/**
 * Maneja las conexiones con el almacenamiento interno en storage.js
 */
class ConexionAlamacen { 
    keyAtracciones = "atracciones";
    keyItinerarios = "itinerarios";
    keyNewsletter = "newsletter";
    keyReservas = "reservas";

    /**
     * Devuelve la informacion de las atracciones disponibles en el sistema
     * @returns {JSON} objeto JSON con los datos de todas las atracciones
     */
    solicitarInformacionAtracciones(){
        return managerAlmacenamiento.obtener(this.keyAtracciones, "local");
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
     * Agrega un elemento a alguna clave en storage.js si existe.
     * Sino la crea como nueva
     * @param {*} clave 
     * @param {*} valor 
     * @param {*} propiedad 
     */
    agregarLocalArrayActualizable(clave, valor, propiedad){
        let datos = managerAlmacenamiento.obtener(clave, "local");

        if(datos !== null){
            let arrayDatos = datos.datos;

            if( arrayDatos !== null){
                arrayDatos.append(valor);
                datos.subscripciones = arrayDatos;
                
                managerAlmacenamiento.actualizar(datos);
            }
        }
        else{ 
            managerAlmacenamiento.guardar(clave, valor, "local");
        }
    }

    /**
     * Recibe un DataForm y lo convierte en un objeto JSON
     * @param {DataForm} form Datos en formato DataForm 
     * @returns {JSON} objeto JSON con los datos del formulario
     */
    DataFormToJSON(form){
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
        const subscripcion = this.DataFormToJSON(subscripcionForm);
        this.agregarLocalArrayActualizable(this.keyNewsletter, subscripcion, "subscripciones");
    }

    /**
     * Recibe el objeto itinerario y los guarda en el storage
     * @param {Itinerario} itinerarioObj el objeto itinerario
     */
    ingresarInformacionItinerario( itinerarioObj ){
        const itinerario = itinerarioObj.toJSON();
        this.agregarLocalArrayActualizable(this.keyItinerarios, itinerario, "generados");
    }

    /**
     * Recibe los datos de la reserva y los guarda en el storage
     * @param {DataForm} reservaForm
     */
    ingresarInformacionReservas( reservaForm ){
        const reserva = this.DataFormToJSON(reservaForm);
        this.agregarLocalArrayActualizable(this.keyReservas, reserva, "generados");
    }
}

const conexionAlamacen = new ConexionAlamacen();
export default conexionAlamacen;