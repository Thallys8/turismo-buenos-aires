
/**
 * Maneja las conexiones con el almacenamiento interno en storage.js
 * (newsletter, reservas, itinerarios, etc.)
 * NO usa fetch: la carga de atracciones la hace apiService.js
 */
export default class ConexionAlmacen {
    managerAlmacenamiento;
    semana;
    keys;

    async inicializar(){
        this.managerAlmacenamiento = (await import("../utils/storage.js")).default;
        const { default: Semana } = await import("./Semana.js");

        this.semana = new Semana();

        // Genera las claves iniciales en localStorage
        this.generarClaves();
    }
    constructor() {
        this.keys = {
            atracciones: "atracciones",  // la dejamos por compatibilidad, aunque hoy no se llena desde acá
            itinerarios: "itinerarios",
            newsletter: "newsletter",
            reservas: "reservas"
        };
        
        this.inicializar();
    }
    

    /**
     * Genera las claves dentro del almacenamiento si no existen
     */
    generarClaves() {
        for (let llave of Object.keys(this.keys)) {
            const claveReal = this.keys[llave];
            if (!this.existeClave(claveReal)) {
                this.managerAlmacenamiento.guardar(claveReal, { datos: [] }, "local");
            }
        }
    }

    /**
     * Chequea si la clave especificada existe en el almacenamiento
     * @param {String} clave 
     * @returns {Boolean} Valor de verdad
     */
    existeClave(clave) {
        const respuesta = this.managerAlmacenamiento.obtener(clave, "local");
        return (respuesta !== undefined && respuesta !== null);
    }

    /**
     * (Opcional) Devuelve la informacion de las atracciones si se hubieran guardado en storage.
     * Hoy NO se guardan acá (las trae apiService), pero dejamos el método por compatibilidad.
     * @returns {Array<object>} los datos de todas las atracciones
     */
    solicitarInformacionAtracciones() {
        const respuesta = this.managerAlmacenamiento.obtener(this.keys.atracciones, "local");
        if (respuesta && Array.isArray(respuesta.datos)) {
            return respuesta.datos;
        }
        return [];
    }

    /**
     * Busca la disponibilidad por día para visitas, de una atracción específica.
     * Mantengo la lógica original "aleatoria" independiente del JSON.
     * @param {String} idAtraccion identificador de la atraccion (nombre)
     * @returns {String[]} Lista de dias con disponibilidad
     */
    solicitarDisponibilidad(idAtraccion) {
        const listaDias = this.semana.getSemana();
        
        const disponibilidad = [];
        listaDias.forEach(dia => { 
            if (Math.random() < 0.5) { 
                disponibilidad.push(dia); 
            } 
        });

        return disponibilidad;
    }

    /**
     * Agrega un elemento a alguna clave en storage.js si existe
     * @param {String} clave 
     * @param {any} valor 
     */
    agregarLocalArrayActualizable(clave, valor) {
        const respuesta = this.managerAlmacenamiento.obtener(clave, "local");

        if (respuesta !== undefined && respuesta !== null) {
            const arrayDatos = respuesta.datos;

            if (arrayDatos !== null && arrayDatos !== undefined) {
                arrayDatos.push(valor);
                respuesta.datos = arrayDatos;

                this.managerAlmacenamiento.actualizar(clave, respuesta, "local");
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
