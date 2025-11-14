
class Itinerario{
    listaDias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    itinerario = [];

    cargarDiaItinerario( datosFormulario ){
        const datosFormulario = new FormData(formulario);
        const datosItinerario = {
            dia: datosFormulario.get("dia"),
            mañana: { eleccion: datosFormulario.get("mañana"), comentario: datosFormulario.get("mañana-comentario") },
            mediaMañana: { eleccion: datosFormulario.get("media-mañana"), comentario: datosFormulario.get("media-mañana-comentario")},
            mediaTarde: { eleccion: datosFormulario.get("media-tarde"), comentario: datosFormulario.get("media-tarde-comentario")},
            tarde: { eleccion: datosFormulario.get("tarde"), comentario: datosFormulario.get("tarde-comentario")},
            noche: { eleccion: datosFormulario.get("noche"), comentario: datosFormulario.get("noche-comentario")}
        };
        itinerario.push(datosItinerario);
    }
    estaCompleto(){
        return this.itinerario.length < this.listaDias.length
    }
}

export default Itinerario;