
import { ConstructorHTML } from './placeholder.js';
import { FiltroAtracciones } from './placeholder2.js';

// esta funcion es llamada caundo se hace click en el boton de la tarjeta de atraccion
function generarReserva(){
    
    // generar html para nuevo formulario para la reserva
    // este nuevo html se encarga de la validacion

    // teniendo la reserva, se guarda en un archivo de reservas
}

const formularioAvanzado = document.getElementById("formulario-selector-avanzado");
const listaActividades = document.getElementsByClassName("lista-de-actividades");

function formularioSubmit(event){
    event.preventDefault();

    formData = new FormData(formularioAvanzado);
    
    const momento = [];
    
    if (formData.get("semana") === "1")  
        momento.push(1);
    if (formData.get("finde")  === "2")
        momento.push(2);

    const horario = [formData.get("horario")];
    const actividad = [formData.get("tipo-actividad")];
    const grupo = [formData.get("tipo-grupo")];
    
    const listaDatos = FiltroAtracciones.buscarAtracciones(momento, horario, actividad, grupo);
    const elementosHTML = elementosHTML = ConstructorHTML.crearAtracciones(listaDatos, generarReserva.name);

    elementosHTML.forEach(elemento => {
        listaActividades.appendChild(elemento);
    });
    
}
myForm.addEventListener('submit', formularioSubmit);


function subscripcionNewsletter(event){

    // generar html para nuevo formulario de subscripcion
    // este nuevo html se encarga de la validacion

    // con los datos del formulario, generar subscripcion
}
const botonNewsletter = document.getElementById("btn-newsletter");
botonNewsletter.addEventListener('onclick', subscripcionNewsletter);

function generarItinerario(){

    //generar una ventana html que permita ingresar los datos del itinerario
    //este nuevo html se encarga de la validacion

    // generar el itinerario y envialo por email (no de verdad) 
}
const botonItinerario = document.getElementById("btn-itinerario");
botonNewsletter.addEventListener('onclick', generarItinerario);





