# Framework - Vue.js
Vue es un framework progresivo de JavaScript orientado al desarrollo de interfaces de usuario reactivas. Por su diseño, basandose en una idea de flexibilidad y conveniencia, permite comenzar como un sistema ligero de vistas y escalar progresivamente agregando herramientas oficiales como Vue Router (enrutamiento) y Pinia (gestión de estado), evitando depender de soluciones externas no oficiales para funcionalidades centrales del framework (Por ej. React Router en React)

## Motivacion y justificacion
Actualmente la aplicacion desarrollada es mas simple, siendo una SPA sin grandes cambios de estructura, routing o una administracion de sesiones o usuarios. Esto es perfecto para Vue, que permite la ampliacion de sus funcionalidades a medida que la app web lo demande.  

Sumando que se basa en reactividad declarativa que mantiene sincronizado automáticamente el estado de la aplicación con el DOM, reduciendo la necesidad de manipulación manual y junto a su arquitectura basada en componentes que permite encapsular HTML, CSS y lógica en archivos autocontenidos (.vue). Se mejoraria la mantenibilidad y organizacion, y facilitaria futuras expansiones del sistema.

## Nivel de dificultad de adaptacion
Seria moderadamente complejo, ya que ayuda que el sistema ya este mayormente dividido en componentes. Lo mas complejo seria descomponer el script.js tan monolitico, migrar el estado a propiedades "computed" en vez del manejo imperativo actual y cambiar la forma en la que se renderiza los elementos de forma dinamica. En principio, se deberia:
- Reestructurar el HTML, CSS y JSS para que sean componentes .vue
- Integrar de un sistema de build como puede ser Vite
- Reemplazar la manipulación manual del DOM por renderizado declarativo 

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

<template>
    <article class="tarjeta col-6 container" :data-aos="fadeStyle" data-aos-delay="400">
        <div class="row pt-3 pb-3 h-md-100 col-12 col-md-6">
            <hgroup class="col-12">
                <h3>{{ titulo }}</h3>
                <p>{{ subtitulo }}</p>
            </hgroup>

            <p class="col-12">{{ descripcion }}</p>

            <details class="col-12">
                <summary>Horarios</summary>
                <p>{{ horarioAbierto }}</p>
            </details>

            <label class="direccion-label col-12">Direccion</label>
            <p class="col-12">{{ direccion }}</p>

            <iframe
                v-if="mapaSrc"
                class="google-maps ratio ratio-16x9 col-12"
                width="180"
                height="150"
                style="border: 0"
                loading="lazy"
                allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
                :src="mapaSrc"
            />
            <p v-else class="col-12 text-muted">Mapa no disponible</p>

            <button type="button" class="btn reservar-btn mt-3" :value="titulo" @click="onReservar">
                Reservar
            </button>
        </div>

        <img v-if="imgSrc" loading="lazy" :src="imgSrc" :alt="datosAtraccion.altFoto || titulo" class="col-12 col-md-6" />
    </article>
</template>

<script>
export default {
    name: "TarjetaAtraccion",

    props: {
        datosAtraccion: {
            type: Object,
            required: true,
        },
        fadeStyle: {
            type: String,
            default: "fade-up",
        },
    },

    emits: ["reservar"],

    computed: {
        titulo() {
            return this.datosAtraccion.titulo || this.datosAtraccion.nombreAtraccion || "Atracción";
        },
        subtitulo() {
            return this.datosAtraccion.subtitulo || "";
        },
        descripcion() {
            return this.datosAtraccion.descripcion || "";
        },
        horarioAbierto() {
            return this.datosAtraccion.horarioAbierto || "No informado";
        },
        direccion() {
            return this.datosAtraccion.direccionAtraccion || "Ciudad de Buenos Aires";
        },
        mapaSrc() {
            return this.datosAtraccion.promptMaps?.trim() || null;
        },
        imgSrc() {
            return this.datosAtraccion.imgSrc?.trim() || null;
        },
    },

    methods: {
        onReservar(event) {
            this.$emit("reservar", event);
        },
    },
};
</script>

<style scoped>
/* ... */
</style>

```
