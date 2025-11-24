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
        this.datosReserva = {};
    }

    /**
     * 
     * @param {Array<(string, any)>} keyValueArray 
     */
    guardarReserva( keyValueArray ){
        const resultado = keyValueArray.reduce((objeto, [id, valor]) => {
            if(this.keysObligatorias.includes(id)){
                objeto[id] = valor;
            };
            return objeto;
        }, {});
        

        if( Object.keys(resultado).length === this.keysObligatorias.length){
            resultado["precio"] = this.calcularPrecio(resultado);
            this.datosReserva = resultado;
            conexionAlamacen.ingresarInformacionReservas(this.datosReserva);
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
        
        if(atraccion != null && atraccion){
            let precio = (atraccion.precio * reserva.disponibilidad.length) * reserva.visitantes;
            return precio;
        }
        else return "No se pudo calcular";
    }
}