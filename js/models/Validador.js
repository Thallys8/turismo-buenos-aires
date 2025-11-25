
/**
 * Contiene funciones de validacion para diferentes datos o procesos
 */
export default class Validador{

    constructor(){

    }

    /**
     * Verifica si un arreglo contiene o no al menos un valor presente en otro
     * @param {Number[]} arrayChequeado - El arreglo que almacena los valores aceptados
     * @param {Number[]} valoresBuscados - El arreglo de los valores a buscar
     * @returns {Boolean} Si el arreglo contiene algun elemento de los buscados
     */
    algunValorExiste(arrayChequeado, valoresBuscados){
        if(arrayChequeado != null && arrayChequeado){
            const chequeadoEnNumero = arrayChequeado.map(valor => Number(valor));
            const buscadoEnNumero = valoresBuscados.map(valor => Number(valor));

            return buscadoEnNumero.some(value => chequeadoEnNumero.includes(value));
        }
        return false;
    }

    /**
     * Chequea que el string recibido representa a un email valido
     * @param {string} email El email ingresado por el usuario 
     * @returns {Boolean} valor de verdad por si es un email o no
     */
    esEmail( email ){
        // REGEX para emails: https://w3.unpocodetodo.info/utiles/regex-ejemplos.php?type=email
        return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(email)
    }
}