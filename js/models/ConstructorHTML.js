import filtroAtracciones from "./FiltroAtracciones.js";
import TarjetaAtraccion from "./TarjetaAtraccion.js";

/**
 * Se encarga de contruir los elementos HTML mas complejos
 */
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
            const tarjeta = new TarjetaAtraccion();
            tarjeta.crearHTML(atraccion, callbackReserva);

            nuevasTarjetas.push( tarjeta.getHTML() );
        });

        return nuevasTarjetas;
    }

    /**
     * Crea un popup con un formulario, con el formato recibido como parametro
     * @param {String} nuevoInnerHtml formato y contenido 
     * @param {Function} nuevoOnSubmit callback para usar durante el submit
     * @returns {HTMLElement} El popup creado 
     */
    crearPopUpFormulario( nuevoInnerHtml, nuevoOnSubmit){
        // contenedor que da el fondo semi-transparente
        const contenedor = document.createElement("div");
        contenedor.className = "panel-con-fondo";

        // funciona formulario y panel
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

    /**
     * Crea un popup mas simple y sin interaccion, para generar avisos o respuestas
     * @param {String} nuevoInnerHtml formato y contenido
     * @returns {HTMLElement} El popup creado
     */
    crearPopUpSimple( nuevoInnerHtml ){
        // contenedor que da el fondo semi-transparente
        const fondo = document.createElement("div");
        fondo.className = "panel-con-fondo";

        // funciona como panel
        const contenedor = document.createElement("div");
        contenedor.className = "panel-con-fondo-frente";

        const boton = document.createElement("button")
        boton.addEventListener("click", () => { contenedor.parentElement.remove(); });
        boton.innerText = "Cerrar";

        contenedor.innerHTML = nuevoInnerHtml;
        contenedor.appendChild(boton);

        fondo.appendChild(contenedor);
        return fondo;
    }
}

const constructorHTML = new ConstructorHTML();
export default constructorHTML;