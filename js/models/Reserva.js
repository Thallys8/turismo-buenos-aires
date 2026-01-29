// js/models/Reserva.js
import { obtenerAtracciones } from "../api/apiService.js";
import storage from "../utils/storage.js";

export default class Reserva {

    constructor(atraccion, visitantes, disponibilidad, email) {
        this.atraccion = atraccion;
        this.visitantes = Number(visitantes) || 0;
        this.disponibilidad = disponibilidad;
        this.email = email;
        this.precio = 0;
    }

    // Busca la atracción y calcula precio usando fetch
    async calcularPrecio() {
        const listaAtracciones = await obtenerAtracciones();

        const datosAtraccion = listaAtracciones.find(
            a => a.nombreAtraccion === this.atraccion
        );

        if (!datosAtraccion) {
            throw new Error("No se encontró la atracción seleccionada");
        }

        const precioBase = datosAtraccion.precioAtraccion || 0;
        this.precio = precioBase * this.visitantes;
    }

    async guardar() {
        await this.calcularPrecio();

        const reservaFinal = {
            atraccion: this.atraccion,
            visitantes: this.visitantes,
            disponibilidad: this.disponibilidad,
            email: this.email,
            precio: this.precio
        };

        // Guardar en storage
        const reservas = storage.obtener("reservas").datos ?? [];
        reservas.push(reservaFinal);
        storage.guardar("reservas", reservas);

        return reservaFinal;
    }

    obtenerReserva() {
        return {
            atraccion: this.atraccion,
            visitantes: this.visitantes,
            disponibilidad: this.disponibilidad,
            email: this.email,
            precio: this.precio
        };
    }
}
