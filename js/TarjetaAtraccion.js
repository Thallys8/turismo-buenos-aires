
class TarjetaAtraccion{
    elementoHTML;

    fromJSON( datosJSON, callbackReserva ){
        this.crearHTML(datosJSON, callbackReserva);
        return this.elementoHTML;
    };
    getHTML(){
        return this.elementoHTML;
    }

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
                    src="${datosAtraccion.urlMapa}">
                </iframe>

                <button type="button" class="btn" value="${datosAtraccion.id}" onclick="${callback}">Reservar</button>
            </div>

            <img loading="lazy" src="${datosAtraccion.urlFoto}" alt="${datosAtraccion.altFoto}" >
        `;
    }
}

export default TarjetaAtraccion;