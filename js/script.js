
import constructorHTML from './ConstructorHTML.js';
import filtroAtracciones from './FiltroAtracciones.js';
import conexionAlamacen from './ConexionAlmacen.js';
import Itinerario from './Itinerario.js';

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
    const diasDisponibles = filtroAtracciones.solicitarDisponibilidad(idAtraccion);

    console.log(diasDisponibles);
    if(diasDisponibles.length > 0){
        // crea los elementos opcion para el selector
        const opcionesDisponibilidad = [];
        for(let i = 0; i < diasDisponibles.lenght; i++){
            opcionesDisponibilidad.push(`<option value="${posInt}">${nombreDia}</option>`);
        }

// ---- Informacion para pruebas o simular el backend ----
const subscripcionesNewsletter = [

];
const reservasGeneradas = [

];
const itinerariosCreados = [

];
const atraccionTuristica = [
    {
        nombre: "Rosedal de palermo",
        imgSrc: "./assets/rosedales.webp",
        promptMaps: "https://www.google.com/maps/embed/v1/place?key=AIzaSyBbT4vX8IWZ4W_9QIdK5w1KVPOJOxevglA&q=jardin+botanico,buenos+aires",
        momento: [1],
        horario: [1],
        actividad: [3],
        grupo: [1, 2, 3],
        precio: 10000
    },
    {
        nombre: "Jardin Japones",
        imgSrc: "./assets/japones.webp",
        promptMaps: "https://www.google.com/maps/embed/v1/place?key=AIzaSyBbT4vX8IWZ4W_9QIdK5w1KVPOJOxevglA&q=jardin+japones,buenos+aires",
        momento: [1],
        horario: [1],
        actividad: [1, 3],
        grupo: [1, 2, 3],
        precio: 7000
    },
    {
        nombre: "Rey de Copas Bar",
        imgSrc: "./assets/bar.webp",
        promptMaps: "https://www.google.com/maps/embed/v1/place?key=AIzaSyBbT4vX8IWZ4W_9QIdK5w1KVPOJOxevglA&q=bar+rey+de+copas,buenos+aires",
        momento: [1, 2],
        horario: [2],
        actividad: [1, 4],
        grupo: [2, 3],
        precio: 0
    }
];
// ----------------------------------------------------------------



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
 * Valida los datos ingresados en los prompts multiples
 * @param {string} respuesta 
 * @param {string[]} opciones 
 * @returns {boolean} si es una respuesta valida
 */
function validacionPrompts( respuesta, elegido ){

    if( respuesta === null || respuesta === undefined){
        return false;
    }

    // si hubo opciones rechazadas, avisa cuales
    let valoresInvalidos = respuesta.split(",").length > elegido.length;
    if(valoresInvalidos)
        alert(`Existen opciones invalidas en la solicitud: ${respuesta.split(",").filter(opcion => !elegido.includes(opcion)).toString()}`);
        
    // si no hubo opciones validas, avisa
    if(elegido.length > 0 && !valoresInvalidos){
        return true;
    }
    return false;
}
/**
 * Permite la seleccion de multiples opciones, corroborando que este dentro de las propuestas
 *
 * @param {String[]} promptTxt - El prompt que se muestra al usuario
 * @param {String[]} opciones - Las opciones permitidas (debe ser completamente igual y numerica)
 * @returns {String[]} Las opciones que eligio el usuario
 */
function promptSeleccionMultiple(promptTxt, opciones){
    let elegido = [];

    while(true){
        let respuesta = prompt(promptTxt);

        // divide por coma > borra espacios en blanco > filtra para saber si las opciones son correctas
        if(respuesta)
            elegido = respuesta.split(",").map(opcion => opcion.trim()).filter(opcion => opciones.includes(opcion));

        let esValido = validacionPrompts(respuesta, elegido);
        if(esValido){
            break;
        }
        else alert("Por favor, seleccione una opcion");
    }

function formularioSubmit(event){
    event.preventDefault();

/**
 * 
 * @param {string} email El email ingresado por el usuario 
 * @returns {Boolean} valor de verdad por si es un email o no
 */
function esUnEmail( email ){
    // REGEX para emails: https://w3.unpocodetodo.info/utiles/regex-ejemplos.php?type=email
    return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(email)
}
/**
 * Permite ingresar un email, corroborando que sea un formato valido 
 */
function promptCorreoElectronico(){
    while(true){
        let respuesta = prompt("Ingresa tu correo electronico");

        let esEmail = esUnEmail(respuesta);
        if(!esEmail){
            alert("El formato del email no es correcto");
        } 
        else return respuesta;
    }
    
}

// ----------------------------------------------------------------

// ---- Flujo 1: Buscar atracciones segun informacion ingresada en el formulario ----

/**
 * Verifica si un arreglo contiene o no al menos un valor presente en otro
 * 
 * @param {Number[]} arrayChequeado - El arreglo que almacena los valores aceptados
 * @param {Number[]} valoresBuscados - El arreglo de los valores a buscar
 * @returns {Boolean} Si el arreglo contiene algun elemento de los buscados
 */
function algunValorExiste(arrayChequeado, valoresBuscados){
    let chequeadoNumero = arrayChequeado.map( valor => {return parseInt(valor)});
    let valoresNumero = valoresBuscados.map( valor => {return parseInt(valor)});

    return valoresNumero.some(value => chequeadoNumero.includes(value));
}

/**
 * Solicita al backend que devuelva las atracciones que cumplen con los requisitos
 * 
 * @param {String[]} momento - Los momentos de la semana seleccionados
 * @param {String[]} horario - Los horarios del dia seleccionados
 * @param {String[]} actividad - Los tipos de actividades seleccionados
 * @param {String[]} grupo - Los tipos de grupos seleccionados
 * @returns {Object[]} Las atracciones que cumplan con los parametros
 */
function buscarAtracciones(momento, horario, actividad, grupo){
    const solicitud = { "momento": momento, "horario": horario, "actividad": actividad, "grupo": grupo}

    console.log(`Enviando la siguiente solicitud al backend...`);
    console.log(solicitud);

    // simulacion de la busqueda en el listado de atracciones
    let arrayAtracciones = solicitarAtracciones();
    let atraccionesFiltradas = [];
    arrayAtracciones.forEach(atraccion => {
        let momentoOk = algunValorExiste(solicitud.momento, atraccion.momento);
        let horarioOk = algunValorExiste(solicitud.horario, atraccion.horario);
        let actividadOk = algunValorExiste(solicitud.actividad, atraccion.actividad);
        let grupoOk = algunValorExiste(solicitud.grupo, atraccion.grupo);
    
        if(momentoOk && horarioOk && actividadOk && grupoOk) { 
            atraccionesFiltradas.push(atraccion);
        }
    });

    console.log("Estos elementos cumplen con los criterios: ");
    console.log(atraccionesFiltradas);
    return atraccionesFiltradas;
}

/**
 * Consulta y recibe los parametros por parte del usuario y busca las atracciones que los cumplan todos 
 */
function generarBusqueda(){
    const opcionesMomento = ["1", "2"];
    const promptMomento = `
        ¿En que momento de la semana? (para ingresar varias opciones, separe con coma)\n
        1 - durante la semana\n
        2 - durante el fin de semana
    `;
    const opcionesHorario = ["1", "2"];
    const promptHorario = `
        ¿En que momento del dia?\n
        1 - me gusta salir de dia\n
        2 - me gusta salir de noche
    `;
    const opcionesActividad = ["1", "2", "3", "4"];
    const promptActividad = `
        ¿Que tipo de actividad te interesa?\n
        1 - Deporte\n
        2 - Fiesta\n
        3 - Cultura\n
        4 - Relajacion
    `;
    const opcionesGrupo = ["1", "2", "3", "4"];
    const promptGrupo = `
        ¿Con quien te gustaria ir?\n
        1 - familia\n
        2 - amigos\n
        3 - parejas\n
        4 - desconocidos
    `;

    const respuestaMomento = promptSeleccionMultiple(promptMomento, opcionesMomento);
    const respuestaHorario = promptSeleccionMultiple(promptHorario, opcionesHorario);
    const respuestaActividad = promptSeleccionMultiple(promptActividad, opcionesActividad);
    const respuestaGrupo = promptSeleccionMultiple(promptGrupo, opcionesGrupo);
    
    
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

/**
 * Envia al backend la informacion de la nueva reserva
 * 
 * @param {String} respuestaAtraccion La atraccion donde se quiere reservar 
 * @param {Integer} respuestaGrupo La cantidad de personas en el grupo
 * @param {String[]} respuestaDias La cantidad de dias para reservar 
 * @param {String} respuestaEmail El email de contacto para la reserva 
 */
function concretarReserva(respuestaAtraccion, respuestaGrupo, respuestaDias, respuestaEmail){
    const datosReserva = {
        "atraccion": respuestaAtraccion, 
        "grupo": respuestaGrupo, 
        "dias": respuestaDias, 
        "email": respuestaEmail
    };

    console.log("Enviando los datos de la reserva al backend...");
    console.log(datosReserva);
    reservasGeneradas.push(datosReserva);

    console.log("Reserva Almacenada!");
    console.log(reservasGeneradas);
}
function subscripcionNewsletter(event){

/**
 * Calcula el precio de una atraccion = precio de la atraccion * cant. de dias * cant. de personas (grupo)
 * @param {object} atraccion 
 * @param {Number} cantDias 
 * @param {Number} cantPersonas 
 * @returns 
 */
function calculadorPrecio(atraccion, cantDias, cantPersonas){
    let precioAtraccion = atraccion.precio;
    return (precioAtraccion * cantDias) * cantPersonas
}

/**
 * convierte los dias de numeros a letras. Por ej: ["1", "3"] > ["lunes", "miercoles"]
 * @param {Number[]} respuestaDias 
 */
function convertidorDeDias( respuestaDias ){
    let diasEscritos = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] 
    let diasElegidos = "";
    respuestaDias.forEach(numDia => { 
        diasElegidos = diasElegidos.concat(diasEscritos[parseInt(numDia, 10)], " "); 
    });
    return diasElegidos;
}
/**
 * Permite al usuario crear una reserva, recibiendo su informacion y validandola
 */
function crearUnaReserva()
{
    let opciones = [];
    let promptOpciones = `
        Seleccione la atraccion en la que quiera reservar (Solo una por solicitud):\n
    `;
    
    let atracciones = solicitarAtracciones();

    for(let i = 0; i < atracciones.length; i++){
        opciones.push("" + (i + 1));
        promptOpciones = promptOpciones.concat( `${i + 1} - ${atracciones[i].nombre} \n`);
    }
    
    let respuestaAtraccion = promptSeleccionUnica(promptOpciones, opciones)

    let disponibilidad = solicitarDisponibilidad(respuestaAtraccion);

        <label for="id-intereses"> ¿Que informacion le interesa? </label>
        <div id="id-intereses">
            <label> <input type="checkbox" name="noticias" value="1" > <span>Noticias</span></label>
            <label> <input type="checkbox" name="eventos" value="2" > <span>Eventos</span></label>
            <label> <input type="checkbox" name="ofertas" value="3" > <span>Ofertas</span></label>
        </div>

        <label for="email"> Ingrese su correo electronico</label>
        <input required type="email" name="email" id="email">

        
        if(!isNaN(nuevoNumero) && String(nuevoNumero) == respuestaGrupo){
            break;
        } alert("El elemento ingresado no es un numero entero");
    }


    let respuestaEmail = promptCorreoElectronico();

    let precio = calculadorPrecio(atracciones[respuestaAtraccion], respuestaDias.length, respuestaGrupo);

    let diasElegidos = convertidorDeDias( respuestaDias );

    alert(`
        Todo listo! Ya tiene su reservacion con las siguientes caracteristicas:\n
        - Atraccion: ${atracciones[respuestaAtraccion].nombre}\n
        - Personas: ${respuestaGrupo}\n
        - Dias: ${diasElegidos.trim()}\n
        - Contacto: ${respuestaEmail}
        Pronto sera contactado en su correo, debera abonar $${precio}
    `);

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

    const datosFormulario = new FormData(formulario);
    itinerario.cargarDiaItinerario(datosFormulario);

    formulario.parentElement.remove();
    
    if(itinerario.estaCompleto())
        conexionAlamacen.ingresarInformacionItinerario(itinerario);
    else
        generarMenuItinerario(listaDias[itinerario.length], opcionesAtraccion);
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

    console.log("Itinerario enviado al backend...");
    console.log(envio);
    itinerariosCreados.push(envio);

    console.log("Itinerario almacenado!");
    console.log(itinerariosCreados);
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