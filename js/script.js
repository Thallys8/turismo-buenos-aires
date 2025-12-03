import ConexionAlamacen from './models/ConexionAlmacen.js';
import FiltroAtracciones from './models/FiltroAtracciones.js';
import Itinerario from './models/Itinerario.js';
import Reserva from './models/Reserva.js';
import Semana from './models/Semana.js';
import Validador from './models/Validador.js';
import { obtenerAtracciones } from "./api/apiService.js";

const conexionAlamacen = new ConexionAlamacen();
const filtroAtracciones = new FiltroAtracciones();
const semana = new Semana();

const formularioAvanzado = document.getElementById("formulario-selector-avanzado");
const listaActividades = document.getElementById("lista-de-actividades");

AOS.init();

/**
 * esta funcion es llamada caundo se hace click en el boton de la tarjeta de atraccion.
 * Recibe la informacion de la reserva, la envia a almacenar y genera un popup avisando de su registro
 * @param {Event} event 
 * @param {HTMLFormElement} formulario 
 */
function concretarReserva(event, formulario){
    event.preventDefault();

    const formData = new FormData(formulario);
    const datos = Array.from(formData);

    const validador = new Validador();
    const emailError = document.getElementById("email-error");
    if(!(validador.esEmail(formData.get("email")))){
        emailError.textContent = "El email ingresado no es valido";
        return;
    }

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

            <label class="form-label" for="disponibilidad"> Seleccione una de los dias disponibles</label>
            <select required class="form-control mb-4 w-75" name="disponibilidad" id="disponibilidad">
                <option value=""> Seleccione una opcion </option>
                ${opcionesDisponibilidad.join(" ")}
            </select>

            <label class="form-label" for="visitantes"> ¿Cuantas personas van a asistir? </label>
            <input required class="form-control mb-4 w-75" type="number" name="visitantes" id="visitantes">

            <label for="email" class="form-label mt-4"> Ingrese su email de contacto </label>
            <input required type="email" name="email" id="email" class="form-control mb-4 w-75">
            <span id="email-error" class="email-error"></span>

        `, (event) => { concretarReserva(event, event.target); } );

        document.body.appendChild(nuevoElemento);
    }
}


/**
 * Recibe los parametros de busqueda y solicita las atracciones que los cumplan.
 * Generando las tarjetas nuevas en la web 
 * @param {Object} parametros Los parametros de busqueda para contrastar con las opciones
 */
async function handlerSubmitBusqueda(parametros, listaActividades){
    let elementosHTML = [];

    try {
        // 1) Pedimos los datos al apiService (fetch)
        // Usamos window.obtenerAtracciones para poder mockearla en los tests
        const todasLasAtracciones = await window.obtenerAtracciones();

        // 2) Filtramos usando la lógica de FiltroAtracciones
        const listaDatos = filtroAtracciones.buscarAtracciones(
            parametros.momento,
            parametros.horario,
            parametros.actividad,
            parametros.grupo,
            todasLasAtracciones     
        );

        // 3) Creamos las tarjetas a partir de los datos filtrados
        elementosHTML = crearAtracciones(listaDatos, generarMenuReserva);

        // 4) Limpiar y pintar en el DOM
        if(listaActividades){
            while (listaActividades.firstChild) {
                listaActividades.removeChild(listaActividades.firstChild);
            }

            if(elementosHTML.length > 0 ){
                elementosHTML.forEach(elemento => listaActividades.appendChild(elemento));
            } else {
                const cantAtracciones = todasLasAtracciones.length;
                listaActividades.innerHTML = `
                    <p class="text-center mb-5">
                        De las ${cantAtracciones} atracciones almacenadas, ninguna cumple con el criterio buscado.
                    </p>`;
            }

            listaActividades.scrollIntoView();
        }

    } catch (error) {
        console.error(error);
        if (listaActividades) {
            listaActividades.innerHTML = `
                <p class="text-center mb-5 text-danger">
                    ${error.message || "No pudimos cargar las atracciones. Probá nuevamente en unos minutos."}
                </p>`;
        }
    }
}

/**
 * Recibe el submit del formulario de busqueda y genera el FormData
 * @param {Event} event 
 */
function formularioSubmit(event){
    event.preventDefault();

    const formData = new FormData(formularioAvanzado);

    // Momento: semana / finde
    const momento = [];
    if (formData.get("semana") === "1")  momento.push(1);
    if (formData.get("finde")  === "2")  momento.push(2);
    if (momento.length === 0) momento.push(1, 2); // si no elige, tomamos ambos

    // Horario, actividad y grupo: un único valor cada uno
    const horarioValor    = formData.get("horario");         // "1" o "2"
    const actividadValor  = formData.get("tipo-actividad");  // "1","2","3","4" o "[1,2,3,4]"
    const grupoValor      = formData.get("tipo-grupo");      // "1","2","3","4" o "[1,2,3,4]"

    const horario   = horarioValor   ? [horarioValor]   : [];
    const actividad = actividadValor ? [actividadValor] : [];
    const grupo     = grupoValor     ? [grupoValor]     : [];

    const parametros = { momento, horario, actividad, grupo };
    handlerSubmitBusqueda(parametros, listaActividades);
}

if (formularioAvanzado != null && formularioAvanzado) 
    formularioAvanzado.addEventListener('submit', formularioSubmit);

// genera una lista con el numero de opciones [1...10]
const maxTipos = 10;
const opciones = [];
for (let i = 0; i <= maxTipos; i++) {
    opciones.push(i);
}

/**
 * Funcion para manejar los clicks al boton diurno, simulando hacer un submit del formulario de busqueda
 * Con un solo criterio
 */
function onclickAtraccionesDia(){
    const parametros = {momento: opciones, horario: [0], actividad: opciones, grupo: opciones};
    handlerSubmitBusqueda(parametros, listaActividades);
}

/**
 * Funcion para manejar los clicks al boton nocturno, simulando hacer un submit del formulario de busqueda
 * Con un solo criterio
 */
function onclickAtraccionesNoche(){
    const parametros = {momento: opciones, horario: [1], actividad: opciones, grupo: opciones};
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
 * @param {HTMLFormElement} formulario 
 */
function concretarSubscripcionNews( event, formulario ){
    event.preventDefault();
    const datosFormulario = new FormData(formulario);
    const validador = new Validador();

    const emailError = document.getElementById("email-error");
    if(!(validador.esEmail(datosFormulario.get("email")))){
        emailError.textContent = "El email ingresado no es valido";
        return;
    }
    emailError.textContent = "";
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
        <span id="email-error" class="email-error"></span>
        
    `, (event) => { concretarSubscripcionNews(event, event.target); });

    document.body.appendChild(nuevoElemento);
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
            <p> Tu itinerario se creo exitosamente. Sera enviado al correo: </p>
            <p> ${datosItinerario.email}</p>
            
            <div class="container-fluid overflow-scroll" >
                <table class="table" id="itinerario-creado">
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
            
        </div>
    `);

    document.body.appendChild(popup);
}

/**
 * Recibe los datos del formulario del itinerario durante el submit, cargandolo al itinerario
 * y si este esta completo, lo almacena
 * @param {HTMLFormElement} formulario 
 */
function almacenarDiaItinerario(formulario) {
    const formData = new FormData(formulario);
    const datosItinerario = { datos: []};
    
    const validador = new Validador();
    const emailError = document.getElementById("email-error");
    if(!(validador.esEmail(formData.get("email")))){
        emailError.textContent = "El email ingresado no es valido";
        return;
    }

    const diasSeleccionados = Array.from(
        formulario.querySelectorAll('input[name="dias"]:checked')
    ).map(cb => cb.value);
    
    diasSeleccionados.forEach(dia => {
        const diaFinal = {
            dia: dia,
            mañana: formData.get(`${dia}-mañana`),
            tarde: formData.get(`${dia}-tarde`),
            noche: formData.get(`${dia}-noche`)
        };
        datosItinerario.datos.push(diaFinal);
    });
    datosItinerario.email = formData.get("email");

    formulario.parentElement.remove();

    datosItinerario.datos.forEach( dia => {
        itinerario.cargarDiaItinerario(dia);
    });
    itinerario.cargarEmail(datosItinerario.email);

    popUpItinerarioCompleto();
    conexionAlamacen.ingresarInformacionItinerario(itinerario);
}

/**
 * Actualiza las tabs segun el dia elegido
 * @param {HTMLElement} contenedor 
 * @param {String[]} opciones 
 */
function actualizarTabs(contenedor, opciones) {
    const checkboxes = contenedor.querySelectorAll('input[name="dias"]:checked');
    const diasSeleccionados = Array.from(checkboxes).map(cb => cb.value);
    
    const tabsContainer = contenedor.querySelector('#tabs-container');
    const tabsHeader = contenedor.querySelector('#tabs-header');
    const tabsContent = contenedor.querySelector('#tabs-content');
    
    if (diasSeleccionados.length === 0) {
        tabsContainer.classList.remove('d-block');
        tabsContainer.classList.add('d-none');
        return;
    }
    tabsContainer.classList.remove('d-none');
    tabsContainer.classList.add('d-block');
    
    // Crear pestañas
    tabsHeader.innerHTML = diasSeleccionados.map((dia, index) => `
        <button type="button" class="tab-btn ${index === 0 ? 'btn-tab-active' : ''}" data-dia="${dia}">
            ${dia}
        </button>
    `).join('');

    console.log(contenedor, opciones);
    
    const valoresElegidos = {};
    const selects = tabsContent.querySelectorAll('select');
    
    selects.forEach(select => {
        if(select.value) {
            valoresElegidos[select.name] = select.value;
        }
    });

    // Crear contenido de pestañas
    tabsContent.innerHTML = diasSeleccionados.map((dia, index) => `
        <div class="tab-content ${index === 0 ? 'd-block' : 'd-none'}" data-dia="${dia}" id="${dia}">
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

    Object.keys(valoresElegidos).forEach(name => {
        const select = document.querySelector(`select[name="${name}"]`);
        if(select) {
            select.value = valoresElegidos[name];
        }
    });
    
    // Agregar eventos a las pestañas
    const tabBtns = tabsHeader.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const dia = btn.dataset.dia;
            
            // Actualizar botones
            tabBtns.forEach(b => {
                b.classList.remove('btn-tab-active');
            });
            btn.classList.add('btn-tab-active');
            
            // Mostrar contenido correspondiente
            const contents = tabsContent.querySelectorAll('.tab-content');
            contents.forEach(content => {
                content.classList.remove('d-block');
                content.classList.remove('d-none');
                content.classList.add(content.dataset.dia === dia ? 'd-block' : 'd-none');
            });
        });
    });
}

/**
 * Genera el HTML necesario para ingresar el itinerario y lo agrega al DOM
 * @param {String[]} opciones Las opciones para el tag <Select> 
 */
function generarMenuItinerario(opciones) {
    const diasSemana = semana.getSemana();
    
    // Crear checkboxes para seleccionar días
    const checkboxesDias = diasSemana.map(dia => `
        <li class="col-6 col-md-2 flex-nowrap">
            <label class="form-label">
                <input type="checkbox" name="dias" value="${dia}" class="form-check-input">
                ${dia}
            </label>
        </li>
    `).join('');

    const nuevoElemento = crearPopUpFormulario(`
        <h2>Armar itinerario semanal</h2>
        
        <div class="container-fluid">
            <strong>Seleccioná los días:</strong>
            <div class="container">
                <ul class="list-unstyled row mb-4">
                    ${checkboxesDias}
                </ul>
            </div>
        </div>

        <label for="email" class="form-label mt-4"> Ingrese su correo electronico</label>
        <input required type="email" name="email" id="email" class="form-control mb-4 w-75">
        <span id="email-error" class="email-error"></span>

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
async function generarItinerario(){
    itinerario = new Itinerario();
    opcionesAtraccion = [];

    try {
        const datosAtracciones = await window.obtenerAtracciones(); // apiService (mockeable en tests)

        const atracciones = datosAtracciones.map(a => a.nombreAtraccion);

        for (let i = 0; i < atracciones.length; i++) {
            opcionesAtraccion.push(`<option value="${atracciones[i]}">${atracciones[i]}</option>`);
        }
        opcionesAtraccion.push(`<option value="ninguna" selected> Ninguna </option>`);

        generarMenuItinerario(opcionesAtraccion);
    } catch (error) {
        console.error(error);
        alert(error.message || "No pudimos cargar las atracciones para el itinerario.");
    }
}

const botonItinerario = document.getElementById("btn-itinerario");
if(botonItinerario != null && botonItinerario) 
    botonItinerario.addEventListener("click", generarItinerario);

/**
 * Crea y le da formato al HTML de la tarjeta utilizando los datos proporcionados
 * @param {*} datosAtraccion Los datos de la atraccion
 * @param {Function} callback Callback para el boton de reserva
 * @param {String} fadeStyle estilo de animación AOS
 */
function crearTarjetaHTML( datosAtraccion, callback, fadeStyle ){
    let elementoHTML = document.createElement("article");
    elementoHTML.className = "tarjeta col-6 container";
    elementoHTML.setAttribute("data-aos", fadeStyle);
    elementoHTML.setAttribute("data-aos-delay", "400");
    
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
 * Crea las tarjetas de las atracciones utilizando la informacion filtrada
 * @param {Object[]} listaDatos lista de datos de atracciones (ya filtradas)
 * @param {Function} callbackReserva funcion a ejecutarse al hacer click en "Reservar"
 * @returns {HTMLElement[]} tarjetaHTML con los datos de atraccion recibidos
*/
function crearAtracciones( listaDatos, callbackReserva ){
    let fadeStyle = "fade-right";
    return listaDatos.map( atraccion => {
        const tarjeta = crearTarjetaHTML(atraccion, callbackReserva, fadeStyle);
        fadeStyle = (fadeStyle === "fade-right") ? "fade-left" : "fade-right";
        return tarjeta;
    });
}

/**
 * Crea un popup con un formulario, con el formato recibido como parametro
 * @param {String} nuevoInnerHtml formato y contenido 
 * @param {Function} nuevoOnSubmit callback para usar durante el submit
 * @returns {HTMLElement} El popup creado 
 */
function crearPopUpFormulario( nuevoInnerHtml, nuevoOnSubmit ){
    // contenedor que da el fondo semi-transparente
    const contenedor = document.createElement("div");
    contenedor.className = "panel-con-fondo container-fluid row overflow-scroll";

    // funciona formulario y panel
    const formulario = document.createElement("form");
    formulario.className = "panel-con-fondo-frente col-10 col-md-6";
    formulario.addEventListener("submit", nuevoOnSubmit);

    contenedor.appendChild(formulario);

    const boton = document.createElement("button");
    boton.addEventListener("click", () => { contenedor.remove(); });
    boton.innerText = "Cerrar";

    const botonSubmit = document.createElement("button");
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

    const boton = document.createElement("button");
    boton.addEventListener("click", () => { contenedor.parentElement.remove(); });
    boton.innerText = "Cerrar";

    contenedor.innerHTML = nuevoInnerHtml;
    contenedor.appendChild(boton);

    fondo.appendChild(contenedor);
    return fondo;
}
