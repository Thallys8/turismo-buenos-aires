//import managerAlmacenamiento from "../utils/storage.js";

class ConexionAlamacen { 
    
    solicitarInformacionAtracciones(){
        // solicita las atracciones
    }

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

    ingresarInformacionNewsletter(){
        // almacena nueva informacion
    }

    ingresarInformacionItinerario(){
        // almacena nueva informacion
    }

    ingresarInformacionReservas(){
        // almacena nueva informacion
    }
}

const conexionAlamacen = new ConexionAlamacen();
export default conexionAlamacen;