
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
        <label for="nombre" class="form-label "> Ingrese su nombre completo </label>
        <input required type="text" name="nombre" id="nombre" class="form-control w-75">

        <label for="id-intereses" class="form-label mt-4"> ¿Que informacion le interesa? </label>
        <ul class="list-group list-group-horizontal-md">
            <li class="list-group-item">
                <label class="form-label"> <input type="checkbox" name="noticias" value="1" class="form-check-input"> <span>Noticias</span></label>
            </li>
            <li class="list-group-item"><label class="form-label"> 
                <input type="checkbox" name="eventos" value="2" class="form-check-input"> <span>Eventos</span></label>
            </li>
            <li class="list-group-item"><label class="form-label"> 
                <input type="checkbox" name="ofertas" value="3" class="form-check-input"> <span>Ofertas</span></label>
            </li>
        </ul>

        <label for="email" class="form-label mt-4"> Ingrese su correo electronico</label>
        <input required type="email" name="email" id="email" class="form-control mb-4 w-75">
        
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
function almacenarDiaItinerario(formulario) {
    const formData = new FormData(formulario);
    const datosItinerario = { datos: []};
    
    const diasSeleccionados = Array.from(formulario.querySelectorAll('input[name="dias"]:checked'))
        .map(cb => cb.value);
    
    diasSeleccionados.forEach(dia => {
        const diaFinal = {
            dia: dia,
            mañana: formData.get(`${dia}-mañana`),
            tarde: formData.get(`${dia}-tarde`),
            noche: formData.get(`${dia}-noche`)
        }
        datosItinerario.datos.push(diaFinal);
    });
    console.log(diasSeleccionados);
    console.log(datosItinerario);
    formulario.parentElement.remove();

    datosItinerario.datos.forEach( dia => {
        console.log(dia);
        itinerario.cargarDiaItinerario(dia);
    });
    
    popUpItinerarioCompleto();
    conexionAlamacen.ingresarInformacionItinerario(itinerario);
}

/**
 * Actualiza las tabs segun el dia elegido
 * @param {HTMLElement} contenedor 
 * @param {HTMLElement[]} opciones 
 */
function actualizarTabs(contenedor, opciones) {
    const checkboxes = contenedor.querySelectorAll('input[name="dias"]:checked');
    const diasSeleccionados = Array.from(checkboxes).map(cb => cb.value);
    
    const tabsContainer = contenedor.querySelector('#tabs-container');
    const tabsHeader = contenedor.querySelector('#tabs-header');
    const tabsContent = contenedor.querySelector('#tabs-content');
    
    if (diasSeleccionados.length === 0) {
        tabsContainer.style.display = 'none';
        return;
    }
    
    tabsContainer.style.display = 'block';
    
    // Crear pestañas
    tabsHeader.innerHTML = diasSeleccionados.map((dia, index) => `
        <button type="button" class="tab-btn ${index === 0 ? 'active' : ''}" data-dia="${dia}">
            ${dia}
        </button>
    `).join('');
    
    // Crear contenido de pestañas
    tabsContent.innerHTML = diasSeleccionados.map((dia, index) => `
        <div class="tab-content" data-dia="${dia}" style="display: ${index === 0 ? 'block' : 'none'};">
            <label for="${dia}-mañana" class="form-label mt-2">Mañana</label>
            <select required name="${dia}-mañana" class="form-select">
                <option value="">Seleccione una opción</option>
                ${opciones}
            </select>
            
            <label for="${dia}-tarde" class="form-label mt-2">Tarde</label>
            <select required name="${dia}-tarde" class="form-select">
                <option value="">Seleccione una opción</option>
                ${opciones}
            </select>
            
            <label for="${dia}-noche" class="form-label mt-2">Noche</label>
            <select required name="${dia}-noche" class="form-select mb-4">
                <option value="">Seleccione una opción</option>
                ${opciones}
            </select>
        </div>
    `).join('');
    
    // Agregar eventos a las pestañas
    const tabBtns = tabsHeader.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const dia = btn.dataset.dia;
            
            // Actualizar botones
            tabBtns.forEach(b => {
                b.style.background = '#f0f0f0';
                b.style.borderBottom = 'none';
                b.classList.remove('active');
            });
            btn.style.background = '#fff';
            btn.style.borderBottom = '3px solid #4a7c59';
            btn.classList.add('active');
            
            // Mostrar contenido correspondiente
            const contents = tabsContent.querySelectorAll('.tab-content');
            contents.forEach(content => {
                content.style.display = content.dataset.dia === dia ? 'block' : 'none';
            });
        });
    });
}

/**
 * Genera el HTML necesario para ingresar el itinerario y lo agrega al DOM
 * @param {HTMLElement[]} opciones Las opciones para el tag <Select> 
 */
function generarMenuItinerario(opciones) {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    // Crear checkboxes para seleccionar días
    const checkboxesDias = diasSemana.map(dia => `
        <li class="list-group-item">
            <label class="form-label">
                <input type="checkbox" name="dias" value="${dia}" class="form-check-input">
                ${dia}
            </label>
        </li>
    `).join('');

    const nuevoElemento = crearPopUpFormulario(`
        <h2>Armar itinerario semanal</h2>
        
        <div>
            <strong>Seleccioná los días:</strong>
            <div>
                <ul class="list-group list-group-horizontal-md mb-4">
                    ${checkboxesDias}
                </ul>
            </div>
        </div>

        <div id="tabs-container">
            <div id="tabs-header" >
            </div>
            
            <div id="tabs-content">
            </div>
        </div>
    `, (event) => { 
        event.preventDefault();
        almacenarDiaItinerario(event.target); 
    });

    // Agregar evento para los checkboxes
    const checkboxes = nuevoElemento.querySelectorAll('input[name="dias"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            actualizarTabs(nuevoElemento, opciones);
        });
    });

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

    generarMenuItinerario(opcionesAtraccion);

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
                <p>${datosAtraccion.horarioAbierto || "No informado"}</p>
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