
import ConexionAlamacen from './models/ConexionAlmacen.js';
import FiltroAtracciones from './models/FiltroAtracciones.js';
import Itinerario from './models/Itinerario.js';
import Reserva from './models/Reserva.js';
import Semana from './models/Semana.js';

const conexionAlamacen = new ConexionAlamacen();
const filtroAtracciones = new FiltroAtracciones();
const semana = new Semana();

const formularioAvanzado = document.getElementById("formulario-selector-avanzado");
const listaActividades = document.getElementById("lista-de-actividades");

/**
 * esta funcion es llamada caundo se hace click en el boton de la tarjeta de atraccion.
 * Recibe la informacion de la reserva, la envia a almacenar y genera un popup avisando de su registro
 * @param {Event} event 
 * @param {HTMLElement} formulario 
 */
function concretarReserva(event, formulario){
    event.preventDefault();

    const datos = Array.from( new FormData(formulario) );

    const reserva = new Reserva();
    reserva.guardarReserva(datos);
    
    formulario.parentElement.remove();

    let datosReserva = reserva.obtenerReserva();
    let nuevoPopUp = crearPopUpSimple(`
        <p> Todo listo! Ya tiene su reservacion con las siguientes caracteristicas: </p>
        <ul>
            <li> Atraccion: ${datosReserva["atraccion"]} </li>
            <li> Personas: ${datosReserva["visitantes"]} </li>
            <li> Dias: ${datosReserva["disponibilidad"]} </li>
            <li> Contacto: ${datosReserva["email"]} </li>
        </ul>
        <p> Pronto sera contactado en su correo, debera abonar $${datosReserva["precio"]} </p>
    `);
    document.body.appendChild(nuevoPopUp);
}

/**
 * Genera el menu HTML para que el usuario pueda generar una reserva en la atraccion especifica
 * @param {Event} event Evento de click en boton (este debe tener un value={id de la atraccion})
 */
function generarMenuReserva(event){
    const atraccion = event.target.value;
    const diasDisponibles = conexionAlamacen.solicitarDisponibilidad(atraccion);

    if(diasDisponibles.length > 0){
        // crea los elementos opcion para el selector
        const opcionesDisponibilidad = diasDisponibles.map( dia =>{
            console.log(`<option value="${dia}"> ${dia} </option>`);
            return `<option value="${dia}"> ${dia} </option>`;
        });

        const nuevoElemento = crearPopUpFormulario( `
            <input type="hidden" name="atraccion" value="${atraccion}">

            <label for="disponibilidad"> Seleccione una de los dias disponibles</label>
            <select required name="disponibilidad" id="disponibilidad">
                <option value=""> Seleccione una opcion </option>
                ${opcionesDisponibilidad.join(" ")}
            </select>

            <label for="visitantes"> ¿Cuantas personas van a asistir? </label>
            <input required type="number" name="visitantes" id="visitantes">

            <label for="email"> Ingrese su email de contacto </label>
            <input required type="email" name="email" id="email">

        `, (event) => { concretarReserva(event, event.target); } );

        document.body.appendChild(nuevoElemento);
    }
}


/**
 * Recibe los parametros de busqueda y solicita las atracciones que los cumplan.
 * Generando las tarjetas nuevas en la web 
 * @param {Number[]} parametros Los parametros de busqueda para contrastar con las opciones
 */
function handlerSubmitBusqueda(parametros, listaActividades){
    let elementosHTML = [];

    const valoresNulos = Array.from(parametros).filter( value =>{
        if ( !(value != null && value) )
            return value;
    });
    if(valoresNulos.length == 0)
        elementosHTML = crearAtracciones(parametros, generarMenuReserva);

    // destruye todos los elementos contenidos y agrega los nuevos
    
    if(listaActividades != null && listaActividades){
        while (listaActividades.firstChild) {
            listaActividades.removeChild(listaActividades.firstChild);
        }

        if(elementosHTML.length > 0 ){
        elementosHTML.forEach(elemento => {
            listaActividades.appendChild(elemento);
        });
        }
        else{
            let cantAtracciones = conexionAlamacen.solicitarInformacionAtracciones().length;
            listaActividades.innerHTML = `<p class=\"text-center mb-5\"> De las ${cantAtracciones} atracciones almacenadas, ninguno cumple con el criterio buscado </p>`;
        }

        listaActividades.scrollIntoView();
    }
}

/**
 * Recibe el submit del formulario de busqueda y genera el FormData
 * @param {Event} event 
 */
function formularioSubmit(event){
    event.preventDefault();

    const formData = new FormData(formularioAvanzado);

    const momento = [];
    
    if (formData.get("semana") === "1")  
        momento.push(1);
    if (formData.get("finde")  === "2")
        momento.push(2);

    if(momento.length == 0) momento.push(1, 2);

    const horario = [...formData.get("horario")];
    const actividad = [...formData.get("tipo-actividad")];
    const grupo = [...formData.get("tipo-grupo")];

    const parametros = {momento: momento, horario: horario, actividad: actividad, grupo: grupo}
    handlerSubmitBusqueda(parametros, listaActividades);
}
if (formularioAvanzado != null && formularioAvanzado) 
    formularioAvanzado.addEventListener('submit', formularioSubmit);

// genera una lista con el numero de opciones [1...10]
const maxTipos = 10;
const opciones = [];
for (var i = 0; i <= maxTipos; i++) {
    opciones.push(i);
}

/**
 * Funcion para manejar los clicks al boton diurno, simulando hacer un submit del formulario de busqueda
 * Con un solo criterio
 */
function onclickAtraccionesDia(){
    const parametros = {momento: opciones, horario: [0], actividad: opciones, grupo: opciones}
    handlerSubmitBusqueda(parametros, listaActividades);
}

/**
 * Funcion para manejar los clicks al boton nocturno, simulando hacer un submit del formulario de busqueda
 * Con un solo criterio
 */
function onclickAtraccionesNoche(){
    const parametros = {momento: opciones, horario: [1], actividad: opciones, grupo: opciones}
    handlerSubmitBusqueda(parametros, listaActividades);
}
const btnNoche = document.getElementById("atracciones-noche-elegir");
const btnDia = document.getElementById("atracciones-dia-elegir");

if(btnNoche != null && btnNoche)
    btnNoche.addEventListener("click", onclickAtraccionesNoche);
if(btnDia != null && btnDia)
    btnDia.addEventListener("click", onclickAtraccionesDia);

/**
 * Recibe el formulario HTML con la informacion de la informacion, almacenandolo y
 * generando un aviso de subscripcion correcta
 * @param {Event} event 
 * @param {HTMLElement} formulario 
 */
function concretarSubscripcionNews( event, formulario ){
    event.preventDefault();
    const datosFormulario = new FormData(formulario);

    conexionAlamacen.ingresarInformacionNewsletter( datosFormulario );

    formulario.parentElement.remove();

    let nuevoPopUp = crearPopUpSimple(`
        <p> Subscripcion exitosa! Recibira la confirmacion en su correo </p>
        <p> Correo: ${datosFormulario.get("email")}
    `);
    document.body.appendChild(nuevoPopUp);
}

/**
 * Genera el formulario HTML para ingresar los datos de subscripcion a la newsletter
 * y lo presenta en el DOM
 * @param {Event} event evento de click
 */
function subscripcionNewsletter(event){

    // generar html para nuevo formulario de subscripcion
    // este nuevo html se encarga de la validacion
    const nuevoElemento = crearPopUpFormulario(`
        <label for="nombre"> Ingrese su nombre completo </label>
        <input required type="text" name="nombre" id="nombre">

        <label for="id-intereses"> ¿Que informacion le interesa? </label>
        <div id="id-intereses">
            <label> <input type="checkbox" name="noticias" value="1" > <span>Noticias</span></label>
            <label> <input type="checkbox" name="eventos" value="2" > <span>Eventos</span></label>
            <label> <input type="checkbox" name="ofertas" value="3" > <span>Ofertas</span></label>
        </div>

        <label for="email"> Ingrese su correo electronico</label>
        <input required type="email" name="email" id="email">

        
    `, (event) => { concretarSubscripcionNews(event, event.target); });

    document.body.appendChild(nuevoElemento);
    // con los datos del formulario, generar subscripcion
}
const botonNewsletter = document.getElementById("btn-newsletter");
if(botonNewsletter != null && botonNewsletter) 
    botonNewsletter.addEventListener("click", subscripcionNewsletter);

let opcionesAtraccion = [];
let itinerario;

/**
 * Pop up para mostrar la informacion del itinerario generado
 */
function popUpItinerarioCompleto(){

    let datosItinerario = itinerario.getItinerario();
    console.log(datosItinerario);
    let htmlDatosDeTabla = datosItinerario.reduce( (objeto, dia) => {
        objeto.push( `
            <tr>
                <td> ${dia["dia"]} </td>
                <td> ${dia["mañana"]} </td>
                <td> ${dia["media-mañana"]} </td>
                <td> ${dia["media-tarde"]} </td>
                <td> ${dia["tarde"]} </td>
                <td> ${dia["noche"]} </td>
            </tr>
        `);

        return objeto;
    }, []);

    const popup = crearPopUpSimple(`
        <div class="container-fluid text-center">
            <h2> Itinerario </h2>
            <p> Tu itinerario se creo exitosamente </p>
            
            <table class="table">
                <thead>
                    <th> Dia </th>
                    <th> Mañana </th>
                    <th> Media mañana </th>
                    <th> Media tarde </th>
                    <th> Tarde </th>
                    <th> Noche </th>
                </thead>
                <tbody>
                    ${htmlDatosDeTabla.join(" ")}
                </tbody>
            </table>
        </div>
    `);

    document.body.appendChild(popup);
}

/**
 * Recibe los datos del formulario del itinerario durante el submit, cargandolo al itinerario
 * y si este esta completo, lo almacena
 * @param {Event} event 
 * @param {HTMLElement} formulario 
 */
function almacenarDiaItinerario(event, formulario){
    event.preventDefault();
    itinerario.cargarDiaItinerario( Array.from(new FormData(formulario)) );

    formulario.parentElement.remove();
    
    if(itinerario.estaCompleto()){
        popUpItinerarioCompleto();
        conexionAlamacen.ingresarInformacionItinerario(itinerario);
    }
    else{
        generarMenuItinerario(itinerario.diaEnProceso(), opcionesAtraccion);
    }
        
};

/**
 * Genera el HTML necesario para ingresar el itinerario y lo agrega al DOM
 * @param {String} dia El nombre del dia referenciado actualmente
 * @param {HTMLElement[]} opciones Las opciones para el tag <Select> 
 */
function generarMenuItinerario(dia, opciones){
    const nuevoElemento = crearPopUpFormulario(`
        <p> itinerario para el dia ${dia} </p>
        <input type="hidden" name="dia" value="${dia}">

        <div class="itinerario-fila">
            <label for="mañana"> Mañana </label>
            <select required name="mañana"> 
                <option value=""> Seleccione una opcion </option>
                ${opciones} 
            </select>
        </div>
        
        <div class="itinerario-fila">
            <label for="media-mañana"> Media mañana </label>
            <select required name="media-mañana"> 
                <option value=""> Seleccione una opcion </option>
                ${opciones} 
            </select>
        </div>

        <div class="itinerario-fila">
            <label for="media-tarde"> Media tarde </label>
            <select required name="media-tarde"> 
                <option value=""> Seleccione una opcion </option>
                ${opciones} 
            </select>
        </div>

        <div class="itinerario-fila">
            <label for="tarde"> Tarde </label>
            <select required name="tarde"> 
                <option value=""> Seleccione una opcion </option>
                ${opciones} 
            </select>
        </div>

        <div class="itinerario-fila">
            <label for="noche"> Tarde </label>
            <select required name="noche"> 
                <option value=""> Seleccione una opcion </option>
                ${opciones} 
            </select>
        </div>
        
    `, (event) => { almacenarDiaItinerario(event, event.target); });

    document.body.appendChild(nuevoElemento);
}

/**
 * Funcion de inicio para la generacion del itinerario, genera el setup inicial 
 * y solicita crear la pantalla que continuara con la creacion
 */
function generarItinerario(){
    itinerario = new Itinerario();
    opcionesAtraccion = [];

    const datosAtracciones = conexionAlamacen.solicitarInformacionAtracciones();
    
    let atracciones = [];
    if(datosAtracciones != null && datosAtracciones) 
        atracciones = datosAtracciones.map(atraccion => {return atraccion.titulo});

    for(let i = 0; i < atracciones.length; i++){
        opcionesAtraccion.push(`<option value="${atracciones[i]}">${atracciones[i]}</option>`);
    }
    opcionesAtraccion.push(`<option value="ninguna"> Ninguna </option>`);

    generarMenuItinerario(semana.getDias(0), opcionesAtraccion);

    // generar el itinerario y envialo por email (no de verdad) 
}
const botonItinerario = document.getElementById("btn-itinerario");
if(botonItinerario != null && botonItinerario) 
    botonItinerario.addEventListener("click", generarItinerario);

/**
 * Crea y le da formato al HTML de la tarjeta utilizando los datos proporcionados
 * @param {*} datosAtraccion Los datos de la atraccion
 * @param {*} callback Callback para el boton de reserva
 */
function crearTarjetaHTML( datosAtraccion, callback ){
    let elementoHTML = document.createElement("article");
    elementoHTML.className = "tarjeta col-6 container";

    elementoHTML.innerHTML = `
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

    const button = elementoHTML.querySelector('.reservar-btn');
    button.addEventListener('click', (event) => {
        callback(event);
    });

    return elementoHTML;
}
/**
 * Crea las tarjetas de las atraciones utilizando la informacion almacenada
 * @param {object} criterios parametros de las atracciones deseadas
 * @param {Function} callbackReserva funcion a ejecutarse al hacer click en "Reservar"
 * @returns {HTMLElement[]} tarjetaHTML con los datos de atraccion recibidos
*/
function crearAtracciones( criterios, callbackReserva )
{
    const nuevasTarjetas = [];
    const listaDatos = filtroAtracciones.buscarAtracciones(
        criterios.momento, criterios.horario, criterios.actividad, criterios.grupo
    );
    listaDatos.forEach( atraccion => {
        nuevasTarjetas.push( crearTarjetaHTML(atraccion, callbackReserva) );
    });

    return nuevasTarjetas;
}

/**
 * Crea un popup con un formulario, con el formato recibido como parametro
 * @param {String} nuevoInnerHtml formato y contenido 
 * @param {Function} nuevoOnSubmit callback para usar durante el submit
 * @returns {HTMLElement} El popup creado 
 */
function crearPopUpFormulario( nuevoInnerHtml, nuevoOnSubmit){
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
function crearPopUpSimple( nuevoInnerHtml ){
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

if (typeof window !== 'undefined') {
    // Funciones principales
    window.handlerSubmitBusqueda = handlerSubmitBusqueda;
    window.formularioSubmit = formularioSubmit;
    window.onclickAtraccionesDia = onclickAtraccionesDia;
    window.onclickAtraccionesNoche = onclickAtraccionesNoche;
    
    // Funciones de reserva
    window.concretarReserva = concretarReserva;
    window.generarMenuReserva = generarMenuReserva;
    
    // Funciones de newsletter
    window.concretarSubscripcionNews = concretarSubscripcionNews;
    window.subscripcionNewsletter = subscripcionNewsletter;
    
    // Funciones de itinerario
    window.almacenarDiaItinerario = almacenarDiaItinerario;
    window.generarMenuItinerario = generarMenuItinerario;
    window.generarItinerario = generarItinerario;
    window.popUpItinerarioCompleto = popUpItinerarioCompleto;
    
    // Funciones helper de creación HTML
    window.crearAtracciones = crearAtracciones;
    window.crearTarjetaHTML = crearTarjetaHTML;
    window.crearPopUpFormulario = crearPopUpFormulario;
    window.crearPopUpSimple = crearPopUpSimple;
    
    // Instancias globales
    window.formularioAvanzado = formularioAvanzado;
    window.listaActividades = listaActividades;
    window.conexionAlamacen = conexionAlamacen;
    window.filtroAtracciones = filtroAtracciones;
    window.semana = semana;
}