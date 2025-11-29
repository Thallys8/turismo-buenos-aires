import managerAlmacenamiento from "../utils/storage.js";
import Itinerario from "./Itinerario.js"; // solo para jsdoc si querés
import Semana from "./Semana.js";

/**
 * Maneja las conexiones con el almacenamiento interno en storage.js
 */
export default class ConexionAlmacen {
    semana;
    keys;
    atracciones;

    constructor() {
        this.keys = {
            atracciones: "atracciones",
            itinerarios: "itinerarios",
            newsletter: "newsletter",
            reservas: "reservas"
        };

        this.semana = new Semana();
        this.atracciones = [];

        // Genera las claves iniciales en localStorage
        this.generarClaves();

        // Promesa para saber cuándo terminó de cargar el JSON
        this.ready = this._cargarAtracciones();
    }

    /**
     * Carga js/api/atracciones.json y lo guarda en memoria y en localStorage
     */
    async _cargarAtracciones() { 
        try {
            const resp = await fetch("/js/api/atracciones.json");
            const data = await resp.json();

            this.atracciones = data.atracciones || [];
            console.log("Atracciones cargadas desde JSON:", this.atracciones);

            // Opcional: guardarlas también en storage bajo la clave "atracciones"
            // para respetar el esquema { datos: [...] }
            managerAlmacenamiento.actualizar(
                this.keys.atracciones,
                { datos: this.atracciones },
                "local"
            );
        } catch (error) {
            console.error("Error cargando atracciones.json", error);
            this.atracciones = [];
        }
    }

    /**
     * Genera las claves dentro del almacenamiento si no existen
     */
    generarClaves() {
        for (let llave of Object.keys(this.keys)) {
            const claveReal = this.keys[llave];
            if (!this.existeClave(claveReal)) {
                managerAlmacenamiento.guardar(claveReal, { datos: [] }, "local");
            }
        }
    }

    /**
     * Chequea si la clave especificada existe en el almacenamiento
     * @param {String} clave 
     * @returns {Boolean} Valor de verdad
     */
    existeClave(clave) {
        let respuesta = managerAlmacenamiento.obtener(clave, "local");
        return (respuesta !== undefined && respuesta !== null);
    }

    /**
     * Devuelve la informacion de las atracciones disponibles en el sistema
     * @returns {Array<object>} los datos de todas las atracciones
     */
    solicitarInformacionAtracciones() {
        // Intentamos leer desde storage (forma "oficial" del proyecto)
        const respuesta = managerAlmacenamiento.obtener(this.keys.atracciones, "local");
        if (respuesta && Array.isArray(respuesta.datos)) {
            return respuesta.datos;
        }

        // Si por algún motivo no hay nada en storage, devolvemos lo cargado en memoria
        return this.atracciones || [];
    }

    /**
     * Busca la disponibilidad por dia para visitas, de una atraccion especifica
     * @param {String} idAtraccion identificador de la atraccion (nombre)
     * @returns {String[]} Lista de dias con disponibilidad
     */
    solicitarDisponibilidad(idAtraccion) {
        // OPCIÓN A: lógica original aleatoria (manteniendo el código anterior para caso el nuevo falle en las pruebas)
        // let listaDias = this.semana.getSemana();
        // let disponibilidad = [];
        // listaDias.forEach(dia => { 
        //     if (Math.random() < 0.5) { disponibilidad.push(dia); } 
        // });
        // return disponibilidad;

        // OPCIÓN B: Los datos reales de atracciones.json
        const atr = this.atracciones.find(a => a.nombreAtraccion === idAtraccion);
        if (!atr || !Array.isArray(atr.diasAbiertoAtraccion)) {
            return [];
        }
        return atr.diasAbiertoAtraccion;
    }

    /**
     * Agrega un elemento a alguna clave en storage.js si existe
     * @param {String} clave 
     * @param {any} valor 
     */
    agregarLocalArrayActualizable(clave, valor) {
        const respuesta = managerAlmacenamiento.obtener(clave, "local");

        if (respuesta !== undefined && respuesta !== null) {
            const arrayDatos = respuesta.datos;

            if (arrayDatos !== null && arrayDatos !== undefined) {
                arrayDatos.push(valor);
                respuesta.datos = arrayDatos;

                managerAlmacenamiento.actualizar(clave, respuesta, "local");
            }
        }
    }

    /**
     * Recibe un FormData y lo convierte en un objeto JSON plano
     * @param {FormData} form Datos en formato FormData 
     * @returns {Object} objeto JSON con los datos del formulario
     */
    dataFormToJSON(form) {
        const json = Array.from(form).reduce((objeto, [key, value]) => {
            objeto[key] = value;
            return objeto;
        }, {});

        return json;
    }

    /**
     * Recibe los datos de la subscripción a la newsletter y los guarda en el storage
     * @param {FormData} subscripcionForm FormData con los datos de la subscripcion
     */
    ingresarInformacionNewsletter(subscripcionForm) {
        const subscripcion = this.dataFormToJSON(subscripcionForm);
        this.agregarLocalArrayActualizable(this.keys.newsletter, subscripcion);
    }

    /**
     * Recibe el objeto itinerario y lo guarda en el storage
     * @param {Itinerario} itinerarioObj el objeto itinerario
     */
    ingresarInformacionItinerario(itinerarioObj) {
        const itinerario = itinerarioObj.toJSON();
        this.agregarLocalArrayActualizable(this.keys.itinerarios, itinerario);
    }

    /**
     * Recibe los datos de la reserva y los guarda en el storage
     * @param {FormData} reservaForm
     */
    ingresarInformacionReservas(reservaForm) {
        const reserva = this.dataFormToJSON(reservaForm);
        this.agregarLocalArrayActualizable(this.keys.reservas, reserva);
    }
}