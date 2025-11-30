/** * Servicio para consumo de API externa */ 

const ApiService = { 
    /** 
	* Obtiene datos de la API 
	* @param {string} endpoint - Endpoint a consultar 
	* @returns {Promise<Object>} Datos obtenidos 
	*/ 
    async fetchData(endpoint) { 
        try { 
            // Mostrar estado de carga 
            this.showLoading(); 

            const response = await fetch(endpoint); 

            if (!response.ok) { 
                throw new Error(`HTTP error! status: ${response.status}`);
            } 

            const data = await response.json(); 
            this.hideLoading(); 
            return data; 

        } catch (error) { 
            this.hideLoading(); 
            // Llamar a showError con un mensaje personalizado
            this.showError('No fue posible cargar la lista de usuarios');
            throw error; 
        } 
    }, 

    /** 
     * Obtiene los usuarios desde el endpoint de JSONPlaceholder 
     * @returns {Promise<Object>} Datos de usuarios obtenidos 
     */ 
    async fetchUsers() {
        const endpoint = 'https://jsonplaceholder.typicode.com/users';
        return this.fetchData(endpoint);
    },

    showLoading() { 
        // Actualizar UI con estado de carga 
    }, 

    hideLoading() { 
        // Ocultar estado de carga 
    }, 

    showError(message) { 
        // Mostrar mensaje de error en UI
        console.error(message); // Por ejemplo, imprime el mensaje en la consola
        alert(message); // O muestra una alerta al usuario
    } 
}; 

export default ApiService;