import FiltroAtracciones from "./FiltroAtracciones.js";
import ConexionAlmacen from "./ConexionAlmacen.js";

export default class Reserva{
    conexionAlamacen;
    filtroAtracciones;
    keysObligatorias;
    datosReserva;

    constructor(){
        this.conexionAlamacen = new ConexionAlmacen();
        this.filtroAtracciones = new FiltroAtracciones();
        this.keysObligatorias = ["atraccion", "visitantes", "disponibilidad", "email"];
    }

    /**
     * 
     * @param {Array<(string, any)>} keyValueArray 
     */
    guardarReserva( keyValueArray ){
        const resultado = keyValueArray.reduce((objeto, [id, valor]) => {
            if(this.keysObligatorias.includes(key)){
                objeto[id] = valor;
            };
            return objeto;
        }, {});
        

        if(resultado.length === this.datosReserva.length){
            resultado["precio"] = this.calcularPrecio(resultado).
            this.datosReserva = resultado;
            conexionAlamacen.ingresarInformacionReservas(datos);
        }
        else{
            // error en los datos ingresados
        }
    }

    /**
     * 
     */
    obtenerReserva(){
        return this.datosReserva;
    }

    /**
     * Calcula el precio de la reserva segun sus caracteristicas
     * @param {Object} reserva 
     * @returns {Number} el precio
     */
    calcularPrecio(reserva){
        let atraccion = this.filtroAtracciones.buscarAtraccionPorNombre(reserva.atraccion);
        
        if(atraccion){
            let precio = (atraccion.precio * reserva.disponibilidad) * reserva.visitantes;
            return precio;
        }
        else return NaN;
    }
}