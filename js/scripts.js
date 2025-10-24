
const AtraccionTuristica = [
    {
        nombre: "atraccion 1",
        imgSrc: "",
        promptMaps: "",
        momento: "",
        horario: "",
        actividad: "",
        grupo: "",
        precio: 10000
    },
    {
        nombre: "atraccion 2",
        imgSrc: "",
        promptMaps: "",
        momento: "",
        horario: "",
        actividad: "",
        grupo: "",
        precio: 7000
    }
];

function PromptSeleccionUnica(promptTxt, opciones){
    let elegido = "";

    while(true){
        let respuesta = prompt(promptTxt);

        console.log("re:" + respuesta);
        
        if(respuesta.length = 1){
            elegido = respuesta
            break;
        } else alert("Ingrese una sola opcion");
    }

    return elegido;
}
function PromptSeleccionMultiple(promptTxt, opciones){
    let elegido = [];

    while(true){
        let respuesta = prompt(promptTxt);

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

// ---- Flujo 1: Buscar atracciones segun informacion ingresada en el formulario ----

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
    const respuestaMomento = PromptSeleccionMultiple(promptMomento, opcionesMomento);
    const respuestaHorario = PromptSeleccionMultiple(promptHorario, opcionesHorario);
    const respuestaActividad = PromptSeleccionMultiple(promptActividad, opcionesActividad);
    const respuestaGrupo = PromptSeleccionMultiple(promptGrupo, opcionesGrupo);
    
    BuscarAtracciones(respuestaMomento, respuestaHorario, respuestaActividad, respuestaGrupo)
}


// ---- Flujo 2: Subscripcion a newsletter ----
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
    let intereses = PromptSeleccionMultiple(promptIntereses, opcionesIntereses); 
    
    let correoElectronico = PromptCorreoElectronico();

    alert("Subscripcion exitosa! Recibira la confirmacion en su correo");
    FinalizarSubscripcion(nombreCompleto, intereses, correoElectronico);
}

// ---- Flujo 3: Creacion de tarjetas y carga de la informacion en web ----
function SolicitarDisponibilidad(){

    console.log("Solicitando disponibilidad de la atraccion al backend...");

    let listaDias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    
    let disponibilidad = [];
    listaDias.forEach(dia => { 
        if(Math.random() < 0.5) { disponibilidad.push(dia); } 
    });

    return disponibilidad;
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
        promptOpciones = promptOpciones.concat( `${i + 1} - ${atracciones[i].nombre} \n`);
    }
    
    let respuestaAtraccion = PromptSeleccionUnica(promptOpciones, opciones)

    let disponibilidad = SolicitarDisponibilidad();
    console.log(disponibilidad);
    let dias = [];
    let promptDias = `
        Seleccione uno de los dias disponibles para reservar una visita\n
    `;
    for(let i = 0; i < disponibilidad.length; i++){
        dias.push("" + (i + 1));
        promptDias = promptDias.concat( `${i + 1} - ${disponibilidad[i]} \n`);
    }

    console.log(dias);
    console.log(promptDias);
    let respuestaDias = PromptSeleccionMultiple(promptDias, dias);

    let respuestaGrupo
    while(true){
        respuestaGrupo = prompt("¿Cuantas personas van a asistir?");

        const nuevoNumero = parseInt(respuestaGrupo, 10);
        
        if(!isNaN(nuevoNumero) && String(nuevoNumero) == respuestaGrupo){
            break;
        } alert("El elemento ingresado no es un numero entero");
    }

    let respuestaEmail = PromptCorreoElectronico();

    let precioAtraccion = atracciones[respuestaAtraccion].precio;
    let precio = (precioAtraccion * respuestaDias.length) * respuestaGrupo

    let diasEscritos = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] 
    let diasElegidos = "";
    respuestaDias.forEach(numDia => { 
        diasElegidos = diasElegidos.concat(diasEscritos[parseInt(numDia, 10)], " "); 
    });
    
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
function FinalizarItinerario(email, itinerario)
{
    const envio = {"email": email, "itinerario": itinerario}

    console.log("Itinerario enviado al backend...");
    console.log(envio);
}
function CrearUnItinerario(){
    let atracciones = SolicitarAtracciones();

    let listaDias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] 
    let listaOpciones = ["x"];
    
    let promptAtracciones = "";
    for(let i = 0; i < atracciones.length; i++){
        listaOpciones.push("" + (i + 1));
        promptAtracciones = promptAtracciones.concat( `${i + 1} - ${atracciones[i].nombre} \n`);
    }


    const resultado = []

    for(let i = 0; i < listaDias.length; i++){
        const promptTxt = `
            Seleccione las atracciones que desea agregar a su itinerario en el dia ${listaDias[i]} (ingrese X si no desea ninguna):\n
        `.concat(promptAtracciones);

        let respuesta;
        while(true){
            respuesta = PromptSeleccionMultiple(promptTxt, listaOpciones);
            
            if(respuesta.filter(item => item.toLowerCase() == "x").length != 0 && respuesta.length > 1){
                alert("La opcion X debe ingresarse sola");
            } else break;
        }
        

        if(!(respuesta[0] == "x")){
            let comentario = prompt("Escriba un comentario/recordatorio para las actividades del dia (deje vacio si no desea agregarlo)");
            
            resultado.push({"dia": listaDias[i], "atracciones": respuesta, "comentario": comentario});
        }
    }
    
    let correo = PromptCorreoElectronico();
    alert("Itinerario generado con exito, pronto sera enviado a su correo");
    
    FinalizarItinerario(correo, resultado);
}


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

window.onload = menuDeUsuario();
