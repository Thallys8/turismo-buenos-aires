
import constructorHTML from './models/ConstructorHTML.js';
import conexionAlamacen from './models/ConexionAlmacen.js';
import Itinerario from './models/Itinerario.js';

// para simular que hay algo en el storage
import storage from "./utils/storage.js";

// esta funcion es llamada caundo se hace click en el boton de la tarjeta de atraccion
function concretarReserva(event, formulario){
    event.preventDefault();

    const datosFormulario = new FormData(formulario);

    conexionAlamacen.ingresarInformacionReservas(datosFormulario);

    formulario.parentElement.remove();
    let precio = 0; //TODO calcular precio

    let nuevoPopUp = constructorHTML.crearPopUpSimple(`
        <p> Todo listo! Ya tiene su reservacion con las siguientes caracteristicas: </p>
        <ul>
            <li> Atraccion: ${datosFormulario.get("atraccion")} </li>
            <li> Personas: ${datosFormulario.get("visitantes")} </li>
            <li> Dias: ${datosFormulario.get("disponibilidad")} </li>
            <li> Contacto: ${datosFormulario.get("email")} </li>
        </ul>
        <p> Pronto sera contactado en su correo, debera abonar $${precio} </p>
    `);
    document.body.appendChild(nuevoPopUp);
}
function generarMenuReserva(event){
    const atraccion = event.target.value;
    const diasDisponibles = conexionAlamacen.solicitarDisponibilidad(atraccion);

    if(diasDisponibles.length > 0){
        // crea los elementos opcion para el selector
        const opcionesDisponibilidad = [];
        for(let i = 0; i < diasDisponibles.length; i++){

            console.log(`<option value="${i}"> ${diasDisponibles[i]} </option>`);
            opcionesDisponibilidad.push(`<option value="${diasDisponibles[i]}"> ${diasDisponibles[i]} </option>`);
        }

        const nuevoElemento = constructorHTML.crearPopUpFormulario( `
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

const formularioAvanzado = document.getElementById("formulario-selector-avanzado");
const listaActividades = document.getElementById("lista-de-actividades");

function HandlerSubmitBusqueda(parametros){
    
    const elementosHTML = constructorHTML.crearAtracciones(parametros, generarMenuReserva);

    // destruye todos los elementos contenidos y agrega los nuevos
    while (listaActividades.firstChild) {
        listaActividades.removeChild(listaActividades.firstChild);
    }
    elementosHTML.forEach(elemento => {
        listaActividades.appendChild(elemento);
    });
}
function formularioSubmit(event){
    event.preventDefault();

    const formData = new FormData(formularioAvanzado);
    console.log(formData);

    const momento = [];
    
    if (formData.get("semana") === "1")  
        momento.push(1);
    if (formData.get("finde")  === "2")
        momento.push(2);

    const horario = [formData.get("horario")];
    const actividad = [formData.get("tipo-actividad")];
    const grupo = [formData.get("tipo-grupo")];

    const parametros = {momento: momento, horario: horario, actividad: actividad, grupo: grupo}
    HandlerSubmitBusqueda(parametros);
}
formularioAvanzado.addEventListener('submit', formularioSubmit);

const maxTipos = 10;
const opciones = [];
for (var i = 0; i <= maxTipos; i++) {
    opciones.push(i);
}
function onclickAtraccionesDia(){
    const parametros = {momento: opciones, horario: [0], actividad: opciones, grupo: opciones}
    HandlerSubmitBusqueda(parametros);
}
function onclickAtraccionesNoche(){
    const parametros = {momento: opciones, horario: [1], actividad: opciones, grupo: opciones}
    HandlerSubmitBusqueda(parametros);
}
document.getElementById("atracciones-noche-elegir").addEventListener("click", onclickAtraccionesNoche);
document.getElementById("atracciones-dia-elegir").addEventListener("click", onclickAtraccionesDia);


function concretarSubscripcionNews( event, formulario ){
    event.preventDefault();
    const datosFormulario = new FormData(formulario);

    conexionAlamacen.ingresarInformacionNewsletter();

    formulario.parentElement.remove();

    let nuevoPopUp = constructorHTML.crearPopUpSimple(`
        <p> Subscripcion exitosa! Recibira la confirmacion en su correo </p>
        <p> Correo: ${datosFormulario.get("email")}
    `);
    document.body.appendChild(nuevoPopUp);
}
function subscripcionNewsletter(event){

    // generar html para nuevo formulario de subscripcion
    // este nuevo html se encarga de la validacion
    const nuevoElemento = constructorHTML.crearPopUpFormulario(`
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
botonNewsletter.addEventListener("click", subscripcionNewsletter);


const listaDias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
let opcionesAtraccion = [];
let itinerario;

function almacenarDiaItinerario(event, formulario){
    event.preventDefault();
    itinerario.cargarDiaItinerario(formulario);

    formulario.parentElement.remove();
    
    if(itinerario.estaCompleto())
        conexionAlamacen.ingresarInformacionItinerario(itinerario);
    else
        generarMenuItinerario(itinerario.diaEnProceso(), opcionesAtraccion);
};
function generarMenuItinerario(dia, opciones){
    const nuevoElemento = constructorHTML.crearPopUpFormulario(`
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

function generarItinerario(){
    itinerario = new Itinerario();
    opcionesAtraccion = [];

    const datosAtracciones = conexionAlamacen.solicitarInformacionAtracciones();

    const atracciones = datosAtracciones.datos.map(atraccion => {return atraccion.nombre});
    

    for(let i = 0; i < atracciones.length; i++){
        console.log(atracciones[i]);
        opcionesAtraccion.push(`<option value="${atracciones[i]}">${atracciones[i]}</option>`);
    }
    opcionesAtraccion.push(`<option value="ninguna"> Ninguna </option>`);

    generarMenuItinerario(listaDias[0], opcionesAtraccion);

    // generar el itinerario y envialo por email (no de verdad) 
}
const botonItinerario = document.getElementById("btn-itinerario");
botonItinerario.addEventListener("click", generarItinerario);

// para agregar informacion inicial si no existe

if(storage.obtener("atracciones") === null){
    fetch("../../assets/datosmock.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json(); // Parse the JSON data
        })
        .then(json => {
            storage.guardar("atracciones", json, "local");
        });
}
