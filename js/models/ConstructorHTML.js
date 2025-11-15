import filtroAtracciones from "./FiltroAtracciones.js";
import TarjetaAtraccion from "./TarjetaAtraccion.js";

class ConstructorHTML {

    /**
     * Crea las tarjetas de las atraciones utilizando la informacion almacenada
     * @param {object} criterios parametros de las atracciones deseadas
     * @param {Function} callbackReserva funcion a ejecutarse al hacer click en "Reservar"
     * @returns {HTMLElement[]} tarjetaHTML con los datos de atraccion recibidos
    */
    crearAtracciones( criterios, callbackReserva )
    {
        const nuevasTarjetas = [];
        const listaDatos = filtroAtracciones.buscarAtracciones(
            criterios.momento, criterios.horario, criterios.actividad, criterios.grupo
        );
        listaDatos.forEach( atraccion => {
            const tarjeta = new TarjetaAtraccion().crearHTML(atraccion, callbackReserva);
            nuevasTarjetas.push( tarjeta.getHTML() );
        });

        return nuevasTarjetas;
    }

    crearPopUpFormulario( nuevoInnerHtml, nuevoOnSubmit){
        const contenedor = document.createElement("div");
        contenedor.className = "panel-con-fondo";
        const formulario = document.createElement("form");
        formulario.className = "panel-con-fondo-frente";
        formulario.addEventListener("submit", nuevoOnSubmit);

        contenedor.appendChild(formulario);

        const boton = document.createElement("button")
        boton.addEventListener("click", () => { contenedor.remove(); });
        boton.innerText = "Cerrar";

        const botonSubmit = document.createElement("button")
        botonSubmit.type = "submit";
        botonSubmit.innerText = "Finalizar";

        formulario.innerHTML = nuevoInnerHtml;
        formulario.appendChild(botonSubmit);
        formulario.appendChild(boton);

        return contenedor;
    }
    crearPopUpSimple( nuevoInnerHtml ){
        const fondo = document.createElement("div");
        fondo.className = "panel-con-fondo";
        const contenedor = document.createElement("div");
        contenedor.className = "panel-con-fondo-frente";

        const boton = document.createElement("button")
        boton.addEventListener("click", () => { contenedor.remove(); });
        boton.innerText = "Cerrar";

        contenedor.innerHTML = nuevoInnerHtml;
        contenedor.appendChild(boton);

        fondo.appendChild(contenedor);
        return fondo;
    }
}

const constructorHTML = new ConstructorHTML();
export default constructorHTML;