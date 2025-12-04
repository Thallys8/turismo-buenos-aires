// js/models/Reserva.js
import { obtenerAtracciones } from "../api/apiService.js";

export default class Reserva {
    constructor() {
        /**
         * Estructura interna de la reserva:
         * {
         *   atraccion: string,
         *   visitantes: number,
         *   disponibilidad: string,
         *   email: string,
         *   precio: number
         * }
         */
        this.reserva = {};
    }

    /**
     * Guarda los datos de la reserva a partir de un Array de entries de FormData
     * y calcula el precio usando los datos de la atracción (vía fetch/apiService).
     * @param {[string, FormDataEntryValue][]} entries
     */
    async guardarReserva(entries) {
        // Pasamos de entries (Array) a objeto plano { clave: valor }
        this.reserva = entries.reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

        // Calcula y agrega el precio
        await this.calcularPrecio();
    }

    /**
     * Calcula el precio de la reserva usando la info de la atracción.
     * Usa fetch a través de obtenerAtracciones() (apiService).
     */
    async calcularPrecio() {
        const atracciones = await obtenerAtracciones();

        const nombreElegido = this.reserva.atraccion;
        const visitantes = Number(this.reserva.visitantes || 1);

        // Buscamos la atracción por nombre
        const atr = atracciones.find(a =>
            a.nombreAtraccion === nombreElegido ||
            a.titulo === nombreElegido // por si usás titulo en las tarjetas
        );

        // Lógica de precio (inventada, podés ajustarla a tu criterio)
        // --- EJEMPLO ---
        // Base por persona
        let precioBasePorPersona = 5000;

        // Si la atracción tiene turno de noche, encarece un poco
        if (atr && Array.isArray(atr.turnoAtraccion) && atr.turnoAtraccion.includes("noche")) {
            precioBasePorPersona *= 1.2;
        }

        // Si es "fiesta", suma un poco más
        if (atr && Array.isArray(atr.estiloAtraccion) && atr.estiloAtraccion.includes("fiesta")) {
            precioBasePorPersona *= 1.1;
        }

        // Precio final = base * cantidad de personas
        const precioFinal = Math.round(precioBasePorPersona * visitantes);

        this.reserva.precio = precioFinal;
    }

    /**
     * Devuelve el objeto con los datos de la reserva (incluyendo precio).
     */
    obtenerReserva() {
        return this.reserva;
    }
}
