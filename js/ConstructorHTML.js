import filtroAtracciones from "./FiltroAtracciones.js";

class ConstructorHTML {

    /**
     * Crea las tarjetas de las atraciones utilizando la informacion almacenada
     * @param {object} datosAtraccion Datos de la atraccion
     * @returns {HTMLElement} tarjetaHTML con los datos de atraccion recibidos
    */
    CrearTarjetaAtraccion( datosAtraccion, callbackReserva ){
    
        let container = document.createElement("article");
        container.className = "tarjeta col-6 container";

        container.innerHTML = `
            <div class="row h-md-100">
                <hgroup class="col-12">
                    <h3>${datosAtraccion.titulo}</h3>
                    <p>${datosAtraccion.subtitulo}</p>
                </hgroup>
                <p class="col-12">${datosAtraccion.descripcion}</p>

                <details class="col-12">
                    <summary>Horarios</summary>
                    <p>${datosAtraccion.horarios}</p>
                </details>
                <label class="direccion-label col-12">Direccion</label> <br>
                <iframe class="google-maps ratio ratio-16x9 col-12" id="${datosAtraccion.idMapa}"
                    width="180"
                    height="150"
                    style="border:0"
                    loading="lazy"
                    allowfullscreen
                    referrerpolicy="no-referrer-when-downgrade"
                    src="${datosAtraccion.urlMapa}">
                </iframe>

                <button type="button" class="btn" value="${datosAtraccion.id}" onclick="${callbackReserva}">Reservar</button>
            </div>

            <img loading="lazy" src="${datosAtraccion.urlFoto}" alt="${datosAtraccion.altFoto}" >
        `;

        return container;
    }

    
    crearAtracciones( criterios, callbackReserva )
    {
        const nuevasTarjetas = [];
        const listaDatos = filtroAtracciones.buscarAtracciones(
            criterios.momento, criterios.horario, criterios.actividad, criterios.grupo
        );
        listaDatos.forEach( atraccion => {
            nuevasTarjetas.push( this.CrearTarjetaAtraccion(atraccion, callbackReserva) );
        });

        return nuevasTarjetas;
    }

    crearPopUpFormulario( nuevoInnerHtml, nuevoOnSubmit){
        const contenedor = document.createElement("div");
        contenedor.className = "panel-con-fondo";
        const formulario = document.createElement("form");
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
        const contenedor = document.createElement("div");
        contenedor.className = "panel-con-fondo";

        const boton = document.createElement("button")
        boton.addEventListener("click", () => { contenedor.remove(); });
        boton.innerText = "Cerrar";

        contenedor.innerHTML = nuevoInnerHtml;
        contenedor.appendChild(boton);

        return contenedor;
    }
}

const constructorHTML = new ConstructorHTML();
export default constructorHTML;