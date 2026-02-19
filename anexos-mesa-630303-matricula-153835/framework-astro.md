# Framework - Astro.js
Astro es un framework moderno orientado a la construcción de sitios web altamente optimizados, con enfoque principal en el rendimiento y el SEO. Se basa en el concepto de "Islands Architecture", donde el HTML se genera en el servidor y solo se agrega funcionalidad con JavaScript en los componentes estrictamente necesarios.  
A diferencia de frameworks tradicionales centrados en aplicaciones SPA completas, Astro prioriza el envío de HTML estático al navegador, reduciendo significativamente la cantidad de JavaScript ejecutado en el cliente.  

También permite integrarse con otros frameworks como Vue o React mediante adaptadores oficiales, ofreciendo soporte para renderizado estático (SSG) y renderizado en servidor (SSR).

## Motivacion y justificacion
La aplicación actual funciona como una SPA, donde el contenido se renderiza dinámicamente en el cliente mediante manipulación manual del DOM. Esto significa que gran parte del HTML se genera después de que el navegador carga y ejecuta JavaScript.  

En este contexto, Astro es una buena alternativa al permitir generar el HTML directamente en el servidor o durante el build, evitando construir el DOM manualmente. Tambien reduce la cantidad de JavaScript enviado al cliente al renderizar el contenido de forma estática.  

Siendo que actualmente se presenta contenido estructurado (títulos, descripciones, imágenes, mapas) con interactividad puntual (botones de reserva), Astro permite mantener la interactividad solo donde es necesaria y mejorando el SEO y rendimiento en gran medida, logrando ser más eficiente y alineado con el tipo de contenido del proyecto.  

Dado que la aplicación está orientada al turismo, donde la visibilidad en buscadores es muy importante, la optimización SEO y el rendimiento inicial son prioritarios.

## Nivel de dificultad de adaptacion
La adaptacion seria mas compleja que en la opcion de Vue. Ya que actualmente todo se recibe y sucede en el lado del cliente, pero al integrar a esta framework se pasara a renderizar en el servidor agregando el funcionamiento de manera selectiva según lo requiera el componente.  

Tambien existiria la complicacion del cambio de paradigma a islas y al tener una adopcion reciente y moderada, habria una menor comunidad y soporte en caso de confusiones.  

La implementacion se haria de la siguiente forma:  
- Reestructurar la aplicación hacia generación estática o híbrida.
- Separar mas la logica de renderizado y lógica interactiva.
- Adaptar el sistema de componentes al formato .astro.
- Configurar un sistema de build (Astro utiliza Vite internamente).


## Ejemplo de codigo - "Antes y despues":

```javascript

function crearTarjetaHTML(datosAtraccion, callback, fadeStyle) {
    const elementoHTML = document.createElement("article");
    elementoHTML.className = "tarjeta col-6 container";
    elementoHTML.setAttribute("data-aos", fadeStyle);
    elementoHTML.setAttribute("data-aos-delay", "400");

    // Usamos campos reales del JSON + defaults
    const titulo = datosAtraccion.titulo || datosAtraccion.nombreAtraccion || "Atracción";
    const subtitulo = datosAtraccion.subtitulo || "";
    const descripcion = datosAtraccion.descripcion || "";
    const horarioAbierto = datosAtraccion.horarioAbierto || "No informado";
    const direccion = datosAtraccion.direccionAtraccion || "Ciudad de Buenos Aires";

    const mapaSrc = datosAtraccion.promptMaps && datosAtraccion.promptMaps.trim()
        ? datosAtraccion.promptMaps
        : null;

    const imgSrc = datosAtraccion.imgSrc && datosAtraccion.imgSrc.trim()
        ? datosAtraccion.imgSrc
        : null;

    const iframeHTML = mapaSrc
        ? `
        <iframe class="google-maps ratio ratio-16x9 col-12"
            width="180"
            height="150"
            style="border:0"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
            src="${mapaSrc}">
        </iframe>
        `
        : `<p class="col-12 text-muted">Mapa no disponible</p>`;

    const imagenHTML = imgSrc
        ? `<img loading="lazy" src="${imgSrc}" alt="${datosAtraccion.altFoto || titulo}" class="col-12 col-md-6">`
        : "";

    elementoHTML.innerHTML = `
        <div class="row pt-3 pb-3 h-md-100 col-12 col-md-6">
            <hgroup class="col-12">
                <h3>${titulo}</h3>
                <p>${subtitulo}</p>
            </hgroup>
            <p class="col-12">${descripcion}</p>

            <details class="col-12">
                <summary>Horarios</summary>
                <p>${horarioAbierto}</p>
            </details>
            <label class="direccion-label col-12">Direccion</label>
            <p class="col-12">${direccion}</p>
            ${iframeHTML}

            <button type="button" class="btn reservar-btn mt-3" value="${titulo}">Reservar</button>
        </div>

        ${imagenHTML}
    `;

    const button = elementoHTML.querySelector(".reservar-btn");
    button.addEventListener("click", (event) => {
        callback(event);
    });

    return elementoHTML;
}

```

```

---
interface Props {
  datosAtraccion: {
    titulo?: string;
    nombreAtraccion?: string;
    subtitulo?: string;
    descripcion?: string;
    horarioAbierto?: string;
    direccionAtraccion?: string;
    promptMaps?: string;
    imgSrc?: string;
    altFoto?: string;
  };
  fadeStyle?: string;
}

const { datosAtraccion, fadeStyle = "fade-up" } = Astro.props;

const titulo = datosAtraccion.titulo || datosAtraccion.nombreAtraccion || "Atracción";
const subtitulo = datosAtraccion.subtitulo || "";
const descripcion = datosAtraccion.descripcion || "";
const horarioAbierto = datosAtraccion.horarioAbierto || "No informado";
const direccion = datosAtraccion.direccionAtraccion || "Ciudad de Buenos Aires";
const mapaSrc = datosAtraccion.promptMaps?.trim() || null;
const imgSrc = datosAtraccion.imgSrc?.trim() || null;
---

<article
  class="tarjeta col-6 container"
  data-aos={fadeStyle}
  data-aos-delay="400"
>
  <div class="row pt-3 pb-3 h-md-100 col-12 col-md-6">
    <hgroup class="col-12">
      <h3>{titulo}</h3>
      <p>{subtitulo}</p>
    </hgroup>

    <p class="col-12">{descripcion}</p>

    <details class="col-12">
      <summary>Horarios</summary>
      <p>{horarioAbierto}</p>
    </details>

    <label class="direccion-label col-12">Direccion</label>
    <p class="col-12">{direccion}</p>

    {mapaSrc ? (
      <iframe
        class="google-maps ratio ratio-16x9 col-12"
        width="180"
        height="150"
        style="border:0"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
        src={mapaSrc}
      />
    ) : (
      <p class="col-12 text-muted">Mapa no disponible</p>
    )}

    <button type="button" class="btn reservar-btn mt-3" data-titulo={titulo}>
      Reservar
    </button>
  </div>

  {imgSrc && (
    <img
      loading="lazy"
      src={imgSrc}
      alt={datosAtraccion.altFoto || titulo}
      class="col-12 col-md-6"
    />
  )}
</article>

<script>
  document.querySelectorAll(".reservar-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const titulo = (event.currentTarget as HTMLButtonElement).dataset.titulo;
      document.dispatchEvent(new CustomEvent("reservar", { detail: { titulo } }));
    });
  });
</script>

<style>
  /* ... */
</style>

```