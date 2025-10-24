
const AtraccionTuristica = [
    {
        nombre: "atraccion 1",
        imgSrc: "",
        promptMaps: "",
        momento: "",
        horario: "",
        actividad: "",
        grupo: ""
    },
    {
        nombre: "atraccion 2",
        imgSrc: "",
        promptMaps: "",
        momento: "",
        horario: "",
        actividad: "",
        grupo: ""
    }
];

function PromptBusqueda(promptTxt, opciones){
    let elegido = [];

    while(true){
        let respuesta = prompt(promptTxt);
        console.log(respuesta);
        if(respuesta)
            elegido = respuesta.split(",").map(opcion => opcion.trim()).filter(opcion => opciones.includes(opcion));

        if(respuesta.split(",").length > elegido.length)
            alert(`Se eliminaron las opciones invalidas de la solicitud: ${respuesta.split(",").filter(opcion => !elegido.includes(opcion)).toString()}`)

        if(elegido.length > 0){
            break;
        }
        else alert("Por favor, seleccione una opcion");
    }

    return elegido;
}

// ---- Flujo 1: Validacion de datos ingresados en formulario ----

function BuscarAtracciones(momento, horario, actividad, grupo){
    Solicitud = { "momento": momento, "horario": horario, "actividad": actividad, "grupo": grupo}

    console.log(`Enviando la siguiente solicitud al backend...`);
    console.log(Solicitud);
}

function GenerarBusqueda(){
    const opcionesMomento = ["1", "2"];
    const promptMomento = `
        ¿En que momento de la semana? (para ingresar varias opciones, separe con coma)\n
        1 - durante la semana\n
        2 - durante el fin de semana
    `;
    const opcionesHorario = ["1", "2"];
    const promptHorario = `
        ¿En que momento del dia? (para ingresar varias opciones, separe con coma)\n
        1 - me gusta salir de dia\n
        2 - me gusta salir de noche
    `;
    const opcionesActividad = ["1", "2", "3", "4"];
    const promptActividad = `
        ¿Que tipo de actividad te interesa? (para ingresar varias opciones, separe con coma)\n
        1 - Deporte\n
        2 - Fiesta\n
        3 - Cultura\n
        4 - Relajacion
    `;
    const opcionesGrupo = ["1", "2", "3", "4"];
    const promptGrupo = `
        ¿Con quien te gustaria ir? (para ingresar varias opciones, separe con coma)\n
        1 - familia\n
        2 - amigos\n
        3 - parejas\n
        4 - desconocidos
    `;
    const respuestaMomento = PromptBusqueda(promptMomento, opcionesMomento);
    const respuestaHorario = PromptBusqueda(promptHorario, opcionesHorario);
    const respuestaActividad = PromptBusqueda(promptActividad, opcionesActividad);
    const respuestaGrupo = PromptBusqueda(promptGrupo, opcionesGrupo);
    
    BuscarAtracciones(respuestaMomento, respuestaHorario, respuestaActividad, respuestaGrupo)
}


// ---- Flujo 2: Subscripcion a newsletter ----
function PromptCorreoElectronico(){
    while(true){
        let respuesta = prompt("Ingresa tu correo electronico");

        // REGEX: https://w3.unpocodetodo.info/utiles/regex-ejemplos.php?type=email
        let esEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(respuesta)
        if(!esEmail){
            alert("El formato del email no es correcto");
        } 
        else return respuesta;
    }
    
}
function FinalizarSubscripcion(nombreCompleto, intereses, email){
    Solicitud = { "nombreCompleto": nombreCompleto, "intereses": intereses, "email": email};

    console.log("Enviando la siguiente solicitud al backend...");
    console.log(Solicitud);
}
function SubscribirNewsletter(){
    let nombreCompleto = prompt("¿Como es tu nombre completo?");

    const opcionesIntereses = ["1", "2", "3"];
    const promptIntereses = `
        ¿En que te querrias mantener actualizado? (para ingresar varias opciones, separe con coma)\n
        1 - noticias\n
        2 - eventos\n
        3 - ofertas
    `;
    let intereses = PromptBusqueda(promptIntereses, opcionesIntereses); 
    
    let correoElectronico = PromptCorreoElectronico();

    alert("Subscripcion exitosa! Recibira la confirmacion en su correo");
    FinalizarSubscripcion(nombreCompleto, intereses, correoElectronico);
}

// ---- Flujo 3: Creacion de tarjetas y carga de la informacion en web ----
function SolicitarDisponibilidad(){

}
function SolicitarAtracciones(){

    console.log("Solicitando atracciones al backend...");
    
    let respuesta = AtraccionTuristica;
    console.log("Respuesta recibida:");
    console.log(respuesta);

    return respuesta;
}
function ConcretarReserva(respuestaAtraccion, respuestaGrupo, respuestaDias, respuestaEmail){
    const datosReserva = {
        "atraccion": respuestaAtraccion, 
        "grupo": respuestaGrupo, 
        "dias": respuestaDias, 
        "email": respuestaEmail
    };

    console.log("Enviando los datos de la reserva al backend...");
    console.log(datosReserva);
}
function CrearUnaReserva()
{
    let opciones = [];
    let promptOpciones = `
        Seleccione la atraccion en la que quiera reservar (Solo una por solicitud):\n
    `;
    
    let atracciones = SolicitarAtracciones();

    for(let i = 0; i < atracciones.length; i++){
        opciones.push("" + (i + 1));
        promptOpciones.concat( `${i + 1} - ${atracciones.nombre}`);
    }
    
    let respuestaAtraccion = prompt(promptOpciones); //TODO: PromptSeleccionUnica

    let disponibilidad = SolicitarDisponibilidad(); //TODO

    let dias = [];
    let prompDias = `
        Seleccione uno de los dias disponibles para reservar una visita\n
    `;
    for(let i = 0; i < disponibilidad.length; i++){
        dias.push("" + (i + 1));
        promptDias.concat( `${i + 1} - ${disponibilidad.nombre}`);
    }

    let respuestaDias = prompt(promptDias);

    let respuestaGrupo = prompt("¿Cuantas personas van a asistir?");

    // chequear si respuestagrupo es numerico

    let respuestaEmail = PromptCorreoElectronico();

    let precioAtraccion = atracciones[respuestaAtraccion];
    let precio = (precioAtraccion * respuestaDias.length) * respuestaGrupo

    let diasEscritos = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] 
    let diasElegidos = "";
    respuestaDias.forEach(numDia => { diasElegidos.concat(diasEscritos[int(numDia)], " ") });
    
    alert(`
        Todo listo! Ya tiene su reservacion con las siguientes caracteristicas:\n
        - Atraccion: ${atracciones[respuestaAtraccion].nombre}\n
        - Personas: ${respuestaGrupo}\n
        - Dias: ${diasElegidos.trim()}\n
        - Contacto: ${respuestaEmail}
        Pronto sera contactado en su correo, debera abonar $${precio}
        `);

    ConcretarReserva(respuestaAtraccion, respuestaGrupo, respuestaDias, respuestaEmail);
}

// ---- Flujo 4 Creacion de un itinerario: ----
function CrearUnItinerario(){}


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
            GenerarBusqueda();
            break;
        }
        case "2": {
            SubscribirNewsletter();
            break;
        }
        case "3": {
            CrearUnaReserva()
            break;
        }
        case "4": {
            CrearUnItinerario()
            break;
        }
        default:{
            alert("La opcion elegida no es valida, por favor reingrese su eleccion")
        }
    }
}

menuDeUsuario();