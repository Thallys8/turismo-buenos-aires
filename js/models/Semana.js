
/**
 * Representa los datos de la semana
 */
export default class Semana{
    dias;

    constructor(){
        dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    }

    /**
     * Devuelve los dias de una semana completa
     * @returns {string[]} Los dias de la semana
     */
    getDias(){
        return this.dias;
    };

    /**
     * Devuelve un dia especifico de la semana
     * @param {Number} posicion numero de dia de la semana
     * @returns {string} dia especifico
     */
    getDias( posicion){
        if(posicion > 0 && posicion < this.dias.length)
            return this.dias[posicion];
    }
}