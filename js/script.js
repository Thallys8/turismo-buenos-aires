
import constructorHTML from './models/ConstructorHTML.js';
import filtroAtracciones from './models/FiltroAtracciones.js';
import conexionAlamacen from './models/ConexionAlmacen.js';
import Itinerario from './models/Itinerario.js';

// esta funcion es llamada caundo se hace click en el boton de la tarjeta de atraccion
function concretarReserva(event, formulario){
    event.preventDefault();

    const datosFormulario = new FormData(formulario);

    // guardar la reserva

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
    const idAtraccion = event.target.value;
    const diasDisponibles = conexionAlamacen.solicitarDisponibilidad(idAtraccion);

    console.log(diasDisponibles);
    if(diasDisponibles.length > 0){
        // crea los elementos opcion para el selector
        const opcionesDisponibilidad = [];
        for(let i = 0; i < diasDisponibles.lenght; i++){
            opcionesDisponibilidad.push(`<option value="${posInt}">${nombreDia}</option>`);
        }

        const nuevoElemento = constructorHTML.crearPopUpFormulario( `
            <input type="hidden" name="atraccion" value="${idAtraccion}">

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

function formularioSubmit(event){
    event.preventDefault();

    const formData = new FormData(formularioAvanzado);
    
    const momento = [];
    
    if (formData.get("semana") === "1")  
        momento.push(1);
    if (formData.get("finde")  === "2")
        momento.push(2);

    const horario = [formData.get("horario")];
    const actividad = [formData.get("tipo-actividad")];
    const grupo = [formData.get("tipo-grupo")];
    
    
    const listaDatos = filtroAtracciones.buscarAtracciones(momento, horario, actividad, grupo);
    const elementosHTML = constructorHTML.crearAtracciones(listaDatos, generarMenuReserva.name);


    // destruye todos los elementos contenidos y agrega los nuevos
    while (listaActividades.firstChild) {
        listaActividades.removeChild(listaActividades.firstChild);
    }
    elementosHTML.forEach(elemento => {
        listaActividades.appendChild(elemento);
    });
}
formularioAvanzado.addEventListener('submit', formularioSubmit);

function concretarSubscripcionNews( event, formulario ){
    event.preventDefault();
    const datosFormulario = new FormData(formulario);

    // guardar la subscripcion

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
            <select required name"mañana"> 
                <option value=""> Seleccione una opcion </option>
                ${opciones} 
            </select>
        </div>
        
        <div class="itinerario-fila">
            <label for="media-mañana"> Media mañana </label>
            <select required name"media-mañana"> 
                <option value=""> Seleccione una opcion </option>
                ${opciones} 
            </select>
        </div>

        <div class="itinerario-fila">
            <label for="media-tarde"> Media tarde </label>
            <select required name"media-tarde"> 
                <option value=""> Seleccione una opcion </option>
                ${opciones} 
            </select>
        </div>

        <div class="itinerario-fila">
            <label for="tarde"> Tarde </label>
            <select required name"tarde"> 
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

    const atracciones = filtroAtracciones.arrayAtracciones.map(atraccion => {return atraccion.nombre});
    for(let i = 0; i < atracciones.lenght; i++){
        opcionesAtraccion.push(`<option value="${atracciones[i]}">${atracciones[i]}</option>`);
    }
    opcionesAtraccion.push(`<option value="ninguna"> Ninguna </option>`);

    generarMenuItinerario(listaDias[0], opcionesAtraccion);

    // generar el itinerario y envialo por email (no de verdad) 
}
const botonItinerario = document.getElementById("btn-itinerario");
botonItinerario.addEventListener("click", generarItinerario);





document.getElementById("1234").addEventListener("click", generarMenuReserva);