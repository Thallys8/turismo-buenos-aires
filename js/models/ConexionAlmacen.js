import managerAlmacenamiento from "../utils/storage.js";


class ConexionAlamacen { 
    keyAtracciones = "atracciones";
    keyItinerarios = "itinerarios";
    keyNewsletter = "newsletter";
    keyReservas = "reservas";

    solicitarInformacionAtracciones(){
        return managerAlmacenamiento.obtener(this.keyAtracciones, "local");
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

    agregarLocalArrayActualizable(clave, valor, propiedad){
        let datos = managerAlmacenamiento.obtener(clave, "local");

        if(datos !== null){
            let arrayDatos = datos[propiedad];

            if( arrayDatos !== null){
                arrayDatos.append(valor);
                datos.subscripciones = arrayDatos;
                
                managerAlmacenamiento.actualizar(datos);
            }
        }
        
        else{ managerAlmacenamiento.guardar(this.keyNewsletter, valor, "local");}
    }
    DataFormToJSON(subscripcionForm){
        var subscripcion = {};
        subscripcionForm.forEach(function(value, key){
            subscripcion[key] = value;
        });
    }
    ingresarInformacionNewsletter( subscripcionForm ){
        const subscripcion = this.DataFormToJSON(subscripcionForm);
        this.agregarLocalArrayActualizable(this.keyNewsletter, subscripcion, "subscripciones");
    }

    ingresarInformacionItinerario( itinerarioObj ){
        const itinerario = itinerarioObj.toJSON();
        this.agregarLocalArrayActualizable(this.keyItinerarios, itinerario, "generados");
    }
    ingresarInformacionReservas( reservaForm ){
        const reserva = this.DataFormToJSON(reservaForm);
        this.agregarLocalArrayActualizable(this.keyReservas, reserva, "generados");
    }
}

const conexionAlamacen = new ConexionAlamacen();
export default conexionAlamacen;