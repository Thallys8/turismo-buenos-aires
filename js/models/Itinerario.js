import conexionAlmacen from "./ConexionAlmacen.js";

class Itinerario{
    listaDias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    itinerario = [];

    cargarDiaItinerario( formulario ){
        const datosFormulario = new FormData(formulario);

        /*const datosItinerario = {
            dia: datosFormulario.get("dia").toString(),
            mañana: { eleccion: datosFormulario.get("mañana").toString() , comentario: datosFormulario.get("mañana-comentario").toString() },
            mediaMañana: { eleccion: datosFormulario.get("media-mañana").toString(), comentario: datosFormulario.get("media-mañana-comentario").toString()},
            mediaTarde: { eleccion: datosFormulario.get("media-tarde").toString(), comentario: datosFormulario.get("media-tarde-comentario").toString()},
            tarde: { eleccion: datosFormulario.get("tarde").toString(), comentario: datosFormulario.get("tarde-comentario").toString()},
            noche: { eleccion: datosFormulario.get("noche").toString(), comentario: datosFormulario.get("noche-comentario").toString()}
        };*/

        var datosItinerario = {};
        datosFormulario.forEach(function(value, key){
            datosItinerario[key] = value;
        });

        /*const datosItinerario = {
            dia: datosFormulario.get("dia").toString(),
            mañana: datosFormulario.get("mañana").toString(),
            mediaMañana: datosFormulario.get("media-mañana").toString(),
            mediaTarde: datosFormulario.get("media-tarde").toString(),
            tarde: datosFormulario.get("tarde").toString(),
            noche: datosFormulario.get("noche").toString()
        };*/

        this.itinerario.push(datosItinerario);
    }
    estaCompleto(){
        return this.itinerario.length === this.listaDias.length
    }
    diaEnProceso(){
        return this.listaDias[this.itinerario.length]
    }

    toJSON(){
        console.log(this.itinerario);
        return JSON.stringify({ datos: this.itinerario });
    }
}

export default Itinerario;