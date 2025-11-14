

// ---- Informacion para pruebas o simular el backend ----
const subscripcionesNewsletter = [

];
const ReservasGeneradas = [

];
const ItinerariosCreados = [

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




// ---- Funciones utiles ------------------------------------------

/**
 * Permite la seleccion de una unica opcion, corroborando que este dentro de las propuestas
 *
 * @param {String[]} promptTxt - El prompt que se muestra al usuario
 * @param {String[]} opciones - Las opciones permitidas (debe ser completamente igual y numerica)
 * @returns {String} La opcion que eligio el usuario
 */
function promptSeleccionUnica(promptTxt, opciones){
    let elegido = "";

    while(true){
        let respuesta = prompt(promptTxt);

        // si la respuesta tiene mas de un caracter, se rechaza
        if(respuesta.length = 1){
            elegido = respuesta
            break;
        } else alert("Ingrese una sola opcion");
    }

    return elegido;
}


function validacionPrompts( respuesta ){
    // divide por coma > borra espacios en blanco > filtra para saber si las opciones son correctas
    if(respuesta)
        elegido = respuesta.split(",").map(opcion => opcion.trim()).filter(opcion => opciones.includes(opcion));

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

        let esValido = validacionPrompts(respuesta);
        if(esValido){
            break;
        }
        else alert("Por favor, seleccione una opcion");
    }

    return elegido;
}

/**
 * 
 * @param {string} email El email ingresado por el usuario 
 * @returns {Boolean} valor de verdad por si es un email o no
 */
function EsUnEmail( email ){
    // REGEX para emails: https://w3.unpocodetodo.info/utiles/regex-ejemplos.php?type=email
    return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(email)
}
/**
 * Permite ingresar un email, corroborando que sea un formato valido 
 */
function promptCorreoElectronico(){
    while(true){
        let respuesta = prompt("Ingresa tu correo electronico");

        let esEmail = EsUnEmail(respuesta);
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
 * @param {Number[]} ArrayChequeado - El arreglo que almacena los valores aceptados
 * @param {Number[]} ValoresBuscados - El arreglo de los valores a buscar
 * @returns {Boolean} Si el arreglo contiene algun elemento de los buscados
 */
function algunValorExiste(ArrayChequeado, ValoresBuscados){
    return ValoresBuscados.some(value => ArrayChequeado.includes(value));
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
    
        if(momentoOk, horarioOk, actividadOk, grupoOk) { 
            atraccionesFiltradas.push(atraccion);
        }
    });

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
    
    buscarAtracciones(respuestaMomento, respuestaHorario, respuestaActividad, respuestaGrupo);
}

// ----------------------------------------------------------------




// ---- Flujo 2: Subscripcion a newsletter ------------------------

/**
 * Solicita al backend que agregue al nuevo subscriptor para futuros avisos de la newsletter
 * 
 * @param {String} nombreCompleto - el nombre completo del nuevo subscriptor
 * @param {String[]} intereses - Los temas de interes del nuevo subscriptor
 * @param {String} email - El email de contacto para el nuevo subscriptor
 */
function finalizarSubscripcion(nombreCompleto, intereses, email){
    solicitud = { "nombreCompleto": nombreCompleto, "intereses": intereses, "email": email};

    console.log("Almacenando la subscripcion en el backend...");
    console.log(solicitud);

    let yaExiste = false;
    subscripcionesNewsletter.forEach(sub => {
        if(sub.email.toLowerCase() == solicitud.email.toLowerCase()) {
            yaExiste = true; 
        };
    });
    if(!yaExiste) {
        subscripcionesNewsletter.push(solicitud);
    }
    else { 
        alert("El email ya esta subscripto"); 
    }
}

/**
 * Solicita los datos del usuario, corrobora que sean correctos y lo subscribe a la newsletter
 */
function subscribirNewsletter(){
    let nombreCompleto = prompt("¿Como es tu nombre completo?");

    const opcionesIntereses = ["1", "2", "3"];
    const promptIntereses = `
        ¿En que te querrias mantener actualizado? (para ingresar varias opciones, separe con coma)\n
        1 - noticias\n
        2 - eventos\n
        3 - ofertas
    `;
    let intereses = promptSeleccionMultiple(promptIntereses, opcionesIntereses); 
    
    let correoElectronico = promptCorreoElectronico();

    alert("Subscripcion exitosa! Recibira la confirmacion en su correo");
    finalizarSubscripcion(nombreCompleto, intereses, correoElectronico);
}

// ----------------------------------------------------------------




// ---- Flujo 3: Creacion de tarjetas y carga de la informacion en web ----

/**
 * Solicita al backend que devuelva la disponibilidad de una atraccion
 * 
 * @param {String} atraccion - la atraccion solicitada
 */
function solicitarDisponibilidad(atraccion){

    console.log("Solicitando disponibilidad de la atraccion al backend...");
    console.log(atraccion);
    
    let listaDias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    
    // 50/50 de si el dia tiene cupos disponibles o no
    let disponibilidad = [];
    listaDias.forEach(dia => { 
        if(Math.random() < 0.5) { disponibilidad.push(dia); } 
    });

    return disponibilidad;
}

/**
 * Solicita al backend que devuelva las atracciones almacenadas en el sistema
 * 
 * @returns {Object[]} Una lista de atracciones, que contienen sus datos 
 */
function solicitarAtracciones(){

    console.log("Solicitando atracciones al backend...");
    
    let respuesta = atraccionTuristica;
    console.log("Respuesta recibida:");
    console.log(respuesta);

    return respuesta;
}

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
    ReservasGeneradas.push(datosReserva);

    console.log("Reserva Almacenada!");
    console.log(ReservasGeneradas);
}

/**
 * Calcula el precio de una atraccion = precio de la atraccion * cant. de dias * cant. de personas (grupo)
 * @param {object} atraccion 
 * @param {Number} cantDias 
 * @param {Number} cantPersonas 
 * @returns 
 */
function CalculadorPrecio(atraccion, cantDias, cantPersonas){
    let precioAtraccion = atraccion.precio;
    return (precioAtraccion * cantDias) * cantPersonas
}

/**
 * convierte los dias de numeros a letras. Por ej: ["1", "3"] > ["lunes", "miercoles"]
 * @param {Number[]} respuestaDias 
 */
function ConvertidorDeDias( respuestaDias ){
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

    let dias = [];
    let promptDias = `
        Seleccione uno de los dias disponibles para reservar una visita\n
    `;
    for(let i = 0; i < disponibilidad.length; i++){
        dias.push("" + (i + 1));
        promptDias = promptDias.concat( `${i + 1} - ${disponibilidad[i]} \n`);
    }

    let respuestaDias = promptSeleccionMultiple(promptDias, dias);

    // Recibe del usuario el numero de personas en el grupo (si no es numerico, entonces rechaza)
    let respuestaGrupo
    while(true){
        respuestaGrupo = prompt("¿Cuantas personas van a asistir?");

        const nuevoNumero = parseInt(respuestaGrupo, 10);
        
        if(!isNaN(nuevoNumero) && String(nuevoNumero) == respuestaGrupo){
            break;
        } alert("El elemento ingresado no es un numero entero");
    }


    let respuestaEmail = promptCorreoElectronico();

    let precio = CalculadorPrecio(atracciones[respuestaAtraccion], respuestaDias.length, respuestaGrupo);

    let diasElegidos = ConvertidorDeDias( respuestaDias );

    alert(`
        Todo listo! Ya tiene su reservacion con las siguientes caracteristicas:\n
        - Atraccion: ${atracciones[respuestaAtraccion].nombre}\n
        - Personas: ${respuestaGrupo}\n
        - Dias: ${diasElegidos.trim()}\n
        - Contacto: ${respuestaEmail}
        Pronto sera contactado en su correo, debera abonar $${precio}
    `);

    concretarReserva(respuestaAtraccion, respuestaGrupo, respuestaDias, respuestaEmail);
}

// ----------------------------------------------------------------




// ---- Flujo 4 Creacion de un itinerario: ------------------------

/**
 * Envia al backend el nuevo itinerario generado
 * 
 * @param {String} email El correo electronico a donde enviar el itinerario 
 * @param {Object[]} itinerario El nuevo itinerario generado
 */
function finalizarItinerario(email, itinerario)
{
    const envio = {"email": email, "itinerario": itinerario}

    console.log("Itinerario enviado al backend...");
    console.log(envio);
    ItinerariosCreados.push(envio);

    console.log("Itinerario almacenado!");
    console.log(ItinerariosCreados);
}

/**
 * Recibe la informacion del itinerario del usuario a travez de prompts y lo genera
 */
function crearUnItinerario(){
    let atracciones = solicitarAtracciones();

    let listaDias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] 
    let listaOpciones = ["x"];
    
    // genera las opciones habilitadas y la lista para el prompt con formato *numero* - *descripcion*
    let promptAtracciones = "";
    for(let i = 0; i < atracciones.length; i++){
        listaOpciones.push("" + (i + 1));
        promptAtracciones = promptAtracciones.concat( `${i + 1} - ${atracciones[i].nombre} \n`);
    }


    // itera sobre los dias, generando un itinerario de atracciones ordenado por dias
    const resultado = []
    for(let i = 0; i < listaDias.length; i++){
        const promptTxt = `
            Seleccione las atracciones que desea agregar a su itinerario en el dia ${listaDias[i]} (ingrese X si no desea ninguna):\n
        `.concat(promptAtracciones);

        let respuesta;
        while(true){
            respuesta = promptSeleccionMultiple(promptTxt, listaOpciones);
            
            //si eligio la opcion "x" junto a otras, avisa del error
            if(respuesta.filter(item => item.toLowerCase() == "x").length != 0 && respuesta.length > 1){
                alert("La opcion X debe ingresarse sola");
            } else break;
        }
        

        if(!(respuesta[0] == "x")){
            let comentario = prompt("Escriba un comentario/recordatorio para las actividades del dia (deje vacio si no desea agregarlo)");
            
            resultado.push({"dia": listaDias[i], "atracciones": respuesta, "comentario": comentario});
        }
    }
    
    let correo = promptCorreoElectronico();
    alert("Itinerario generado con exito, pronto sera enviado a su correo");
    
    finalizarItinerario(correo, resultado);
}

/**
 * Menu de usuario para la seleccion de flujos
 */
function menuDeUsuario(){
    const opcionElegida = prompt(`
        Seleccione la opcion deseada\n
        1 - Completar formulario de busqueda\n
        2 - Subscribirse a Newsletter\n
        3 - Crea una reserva\n
        4 - Crea tu itinerario
        `
    );

    switch (opcionElegida) {
        case "1": {
            generarBusqueda();
            break;
        }
        case "2": {
            subscribirNewsletter();
            break;
        }
        case "3": {
            crearUnaReserva()
            break;
        }
        case "4": {
            crearUnItinerario()
            break;
        }
        default:{
            alert("La opcion elegida no es valida, por favor reingrese su eleccion")
        }
    }
}


window.onload = menuDeUsuario;
