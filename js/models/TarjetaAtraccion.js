
/**
 * Representa una tarjeta HTML para una atraccion turistica
 */
class TarjetaAtraccion{
    elementoHTML;

    /**
     * Recibe datos en formato de objeto JSON y crea el html de la tarjeta utilizandolos 
     * @param {JSON} datosJSON Los datos en formato de objeto JSON
     * @param {Function} callbackReserva Callback para el boton de reserva
     * @returns {HTMLElement} El elemento HTML
     */
    fromJSON( datosJSON, callbackReserva ){
        this.crearHTML(datosJSON, callbackReserva);
        return this.elementoHTML;
    };

    /**
     * Permite acceder al HTML de la tarjeta
     * @returns {HTMLElement} El elemento HTML
     */
    getHTML(){
        return this.elementoHTML;
    }

    /**
     * Crea y le da formato al HTML de la tarjeta utilizando los datos proporcionados
     * @param {*} datosAtraccion Los datos de la atraccion
     * @param {*} callback Callback para el boton de reserva
     */
    crearHTML( datosAtraccion, callback ){
        this.elementoHTML = document.createElement("article");
        this.elementoHTML.className = "tarjeta col-6 container";

        this.elementoHTML.innerHTML = `
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
                    src="${datosAtraccion.promptMaps}">
                </iframe>

                <button type="button" class="btn reservar-btn" value="${datosAtraccion.titulo}">Reservar</button>
            </div>

            <img loading="lazy" src="${datosAtraccion.imgSrc}" alt="${datosAtraccion.altFoto}" >
        `;

        const button = this.elementoHTML.querySelector('.reservar-btn');
        button.addEventListener('click', (event) => {
            callback(event);
        });
    }
}

export default TarjetaAtraccion;