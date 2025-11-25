/** * Módulo de utilidades para Storage (localStorage y sessionStorage) */
const StorageUtil = {

   /**
   * Guarda cualquier valor en localStorage o sessionStorage
   * @param {string} clave - Clave bajo la cual se almacenará el valor
   * @param {any} valor - Valor a guardar
   * @param {'local'|'session'} tipo - Tipo de storage
   */  
    guardar(clave, valor, tipo = "local") {
        try {
            const storage = tipo === "session" ? sessionStorage : localStorage;

            let tamaño = new TextEncoder().encode(valor).length

            if(tamaño < 200){
                storage.setItem(clave, JSON.stringify(valor));
            }
            else throw new Error(`El archivo es mas grande que los 200 bytes permitidos`);
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('Se exedio el espacion de almacenamiento disponible. por favor, liberar espacio');
            } else {
                console.error(`Error guardando '${clave}' en ${tipo}Storage:`, error);
            }
        }
    },


   /**
   * Obtiene un valor en el storage seleccionado.
   * @param {string} clave - Clave del valor a obtener
   * @param {'local'|'session'} tipo - Tipo de storage
   * @returns {any|null} Valor deserializado o null si no existe o hay error
   */  
    // Obtiene un valor
    obtener(clave, tipo = "local") {
        try {
            const storage = tipo === "session" ? sessionStorage : localStorage;
            const valor = storage.getItem(clave);

            return valor ? JSON.parse(valor) : null;
        } catch (error) {
            console.error(`Error obteniendo '${clave}' en ${tipo}Storage:`, error);
            return null;
        }
    },

   /**
   * Actualiza un valor existente
   * @param {string} clave - Clave del valor a actualizar
   * @param {any} nuevoValor - Valor a guardar
   * @param {'local'|'session'} tipo - Tipo de storage
   * @returns {boolean} true si se guardó correctamente, false en caso de error
   */
    actualizar(clave, nuevoValor, tipo = "local") {
        if (this.obtener(clave, tipo) === null) {
            console.warn(`La clave '${clave}' no existe en ${tipo}Storage.`);
        }
        this.guardar(clave, nuevoValor, tipo);
    },

   /**
   * Elimina una clave existente
   * @param {string} clave - Clave del valor a eliminar
   * @param {'local'|'session'} tipo - Tipo de storage
   * @returns {boolean} true si se eliminó correctamente, false en caso de error
   */
    eliminar(clave, tipo = "local") {
        const storage = tipo === "session" ? sessionStorage : localStorage;
        storage.removeItem(clave);
    },

   /**
   * Lista todas las claves con cierto prefijo
   * @param {string} prefijo - Prefijo de las claves a listar
   * @param {'local'|'session'} tipo - Tipo de storage
   * @returns {string[]} Lista de claves encontradas
   */
    listar(prefijo = "app:", tipo = "local") {
        const storage = tipo === "session" ? sessionStorage : localStorage;

        const claves = [];
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key.startsWith(prefijo)) claves.push(key);
        }

        return claves;
    },

   /**
   * Limpia el storage completo
   * @param {'local'|'session'} tipo - Tipo de storage
   * @returns {boolean} true si se limpió correctamente
   */
    limpiar(tipo = "local") {
        const storage = tipo === "session" ? sessionStorage : localStorage;
        storage.clear();
    }
};


export default StorageUtil;