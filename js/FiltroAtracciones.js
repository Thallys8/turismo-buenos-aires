import conexionAlmacen from "./ConexionAlmacen.js";
import validador from "./Validador.js"
class FiltroAtracciones {
    arrayAtracciones = [
        {
            nombre: "Rosedal de palermo",
            imgSrc: "./assets/rosedales.webp",
            promptMaps: "https://www.google.com/maps/embed/v1/place?key=AIzaSyBbT4vX8IWZ4W_9QIdK5w1KVPOJOxevglA&q=jardin+botanico,buenos+aires",
            momento: [1],
            horario: [1],
            actividad: [3],
            grupo: [1, 2, 3],
            precio: 10000
        },
        {
            nombre: "Jardin Japones",
            imgSrc: "./assets/japones.webp",
            promptMaps: "https://www.google.com/maps/embed/v1/place?key=AIzaSyBbT4vX8IWZ4W_9QIdK5w1KVPOJOxevglA&q=jardin+japones,buenos+aires",
            momento: ["1"],
            horario: ["1"],
            actividad: ["1", "3"],
            grupo: ["1", "2", "3"],
            precio: 7000
        },
        {
            nombre: "Rey de Copas Bar",
            imgSrc: "./assets/bar.webp",
            promptMaps: "https://www.google.com/maps/embed/v1/place?key=AIzaSyBbT4vX8IWZ4W_9QIdK5w1KVPOJOxevglA&q=bar+rey+de+copas,buenos+aires",
            momento: [1, 2],
            horario: [2],
            actividad: [1, 4],
            grupo: [2, 3],
            precio: 0
        }
    ]; //test

    /**
     * Solicita al backend que devuelva las atracciones que cumplen con los requisitos
     * 
     * @param {String[]} momento - Los momentos de la semana seleccionados
     * @param {String[]} horario - Los horarios del dia seleccionados
     * @param {String[]} actividad - Los tipos de actividades seleccionados
     * @param {String[]} grupo - Los tipos de grupos seleccionados
     * @returns {Object[]} Las atracciones que cumplan con los parametros
     */
    buscarAtracciones(momento, horario, actividad, grupo){
        const arrayAtracciones = conexionAlmacen.solicitarInformacionAtracciones() || this.arrayAtracciones; //test
        console.log("momento:" + momento + "horario:" + horario + "actividad:" + actividad + "grupo:" + grupo);
        
        let atraccionesFiltradas = arrayAtracciones.filter( atraccion => {
            let momentoOk = validador.algunValorExiste(momento, atraccion.momento);
            let horarioOk = validador.algunValorExiste(horario, atraccion.horario);
            let actividadOk = validador.algunValorExiste(actividad, atraccion.actividad);
            let grupoOk = validador.algunValorExiste(grupo, atraccion.grupo);

            console.log(momentoOk + " " + horarioOk + " " + actividadOk + " " + grupoOk);
            return momentoOk && horarioOk && actividadOk && grupoOk;
        });

        console.log(atraccionesFiltradas);
        return atraccionesFiltradas;
    }
}

const filtroAtracciones = new FiltroAtracciones();
export default filtroAtracciones;