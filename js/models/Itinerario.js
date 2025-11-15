import conexionAlmacen from "./ConexionAlmacen.js";

class Itinerario{
    listaDias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    itinerario = [];

    cargarDiaItinerario( formulario ){
        const datosFormulario = new FormData(formulario);
        const datosItinerario = {
            dia: datosFormulario.get("dia"),
            mañana: { eleccion: datosFormulario.get("mañana"), comentario: datosFormulario.get("mañana-comentario") },
            mediaMañana: { eleccion: datosFormulario.get("media-mañana"), comentario: datosFormulario.get("media-mañana-comentario")},
            mediaTarde: { eleccion: datosFormulario.get("media-tarde"), comentario: datosFormulario.get("media-tarde-comentario")},
            tarde: { eleccion: datosFormulario.get("tarde"), comentario: datosFormulario.get("tarde-comentario")},
            noche: { eleccion: datosFormulario.get("noche"), comentario: datosFormulario.get("noche-comentario")}
        };
        this.itinerario.push(datosItinerario);
    }
    estaCompleto(){
        return this.itinerario.length === this.listaDias.length
    }
    diaEnProceso(){
        return this.listaDias[this.itinerario.length]
    }

    toJSON(){
        JSON.parse(this.itinerario);
    }
    almacenarElemento(){
        let datos = this.toJSON();
        conexionAlmacen.ingresarInformacionItinerario(datos);
    }
}

export default Itinerario;