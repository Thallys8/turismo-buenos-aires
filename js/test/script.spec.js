    /* 1 ********************************** 1 *********************************** 1 ************************************ 1 */
     
    /* Test para la Suscribir News Letter. Lineas 111 a 127 */
    describe('Flujo 1: SubscribirNewsletter', () => { // La esprecipn Function() fue ree;plazada por () =>
        beforeEach(() => {
            // Mock prompt
            spyOn(window, 'prompt').and.returnValue('Juan Pérez');
            // Mock alert
            spyOn(window, 'alert');
            // Mock PromptBusqueda
            window.PromptBusqueda = jasmine.createSpy('PromptBusqueda').and.returnValue(['1', '3']);
            // Mock PromptCorreoElectronico
            window.PromptCorreoElectronico = jasmine.createSpy('PromptCorreoElectronico').and.returnValue('juanperez@mail.com');
            // Spy para FinalizarSubscripcion
            spyOn(window, 'FinalizarSubscripcion');
        });

        it('debería solicitar información y finalizar la subscripción correctamente', () => {
            SubscribirNewsletter();

            expect(window.prompt).toHaveBeenCalledWith("¿Como es tu nombre completo?");
            expect(window.PromptBusqueda).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Array));
            expect(window.PromptCorreoElectronico).toHaveBeenCalled();
            expect(window.alert).toHaveBeenCalledWith("Subscripcion exitosa! Recibira la confirmacion en su correo");
            expect(window.FinalizarSubscripcion).toHaveBeenCalledWith(
                'Juan Pérez',
                ['1', '3'],
                'juanperez@mail.com'
            );
        });
    }); 

    /* 2 ********************************** 2 *********************************** 2 ************************************ 2 */
    
    /* Test para la Validar formato de Email. Lineas 92 a 104 */
    describe('Flujo 2: PromptCorreoElectronico', () => {
        beforeEach(() => {
            // Mock prompt
            spyOn(window, 'prompt');

            // Mock alert
            spyOn(window, 'alert');
        });

        it('debería pedir el email y devolverlo cuando tiene un formato correcto en la primera entrada', () => {
            window.prompt.and.returnValue('usuario@mail.com');

            const resultado = PromptCorreoElectronico();

            expect(window.prompt).toHaveBeenCalled();
            expect(window.alert).not.toHaveBeenCalled();
            expect(resultado).toBe('usuario@mail.com');
        });

        it('debería solicitar varias veces si el formato es incorrecto y devolver el email correcto', () => {
            // Primera entrada incorrecta, segunda correcta
            window.prompt
                .and.returnValues('correo-invalido', 'correcto@mail.com');

            const resultado = PromptCorreoElectronico();

            expect(window.prompt.calls.count()).toBe(2);
            expect(window.alert).toHaveBeenCalledWith("El formato del email no es correcto");
            expect(resultado).toBe('correcto@mail.com');
        });

        it('debería seguir pidiendo hasta que el usuario ingrese un email correcto', () => {
            // Varias entradas incorrectas seguidas, finalmente una correcta
            window.prompt
                .and.returnValues(
                    'mailinvalido1',
                    'mailinvalido2',
                    'otroinvalido',
                    'valido@mail.com'
                );

            const resultado = PromptCorreoElectronico();

            expect(window.prompt.calls.count()).toBe(4);
            expect(window.alert.calls.count()).toBe(3); // Alert se llama en los intentos incorrectos
            expect(resultado).toBe('valido@mail.com');
        });
    }); 

    /* 3 ********************************** 3 *********************************** 3 ************************************ 3 */

    /* Test para la Selecionar Atraciones. Lineas 133 a 141 */
    describe('Flujo 3: Función SolicitarAtracciones', () => {

        // Simulamos el objeto AtraccionTuristica que viene del JSON
        const AtraccionTuristicaMock = [
            { id: 1, nombre: 'Rosedal de Palermo' },
            { id: 2, nombre: 'Obelisco' }
        ];

        beforeEach(() => {
            // Inyectamos el mock en el ámbito global
            window.AtraccionTuristica = AtraccionTuristicaMock;

            // Espiamos la consola para no mostrar logs en los tests
            spyOn(console, 'log');
        });

        it('debería retornar la lista de atracciones', () => {
            const resultado = SolicitarAtracciones();
            expect(resultado).toEqual(AtraccionTuristicaMock);
        });

        it('debería mostrar los mensajes correctos en consola', () => {
            SolicitarAtracciones();

            expect(console.log).toHaveBeenCalledWith('Solicitando atracciones al backend...');
            expect(console.log).toHaveBeenCalledWith('Respuesta recibida:');
            expect(console.log).toHaveBeenCalledWith(AtraccionTuristicaMock);
        });
    });

    /* 4 ********************************** 4 *********************************** 4 ************************************ 4 */

    /* Test para la Menu de Usuario. Lineas 212 a 243 */
    describe('Flujo 4: Función menuDeUsuario', () => {

    beforeEach(() => {
        // Espiamos as funções globais chamadas dentro do menu
        spyOn(window, 'GenerarBusqueda');
        spyOn(window, 'SubscribirNewsletter');
        spyOn(window, 'CrearUnaReserva');
        spyOn(window, 'CrearUnItinerario');
        spyOn(window, 'alert');

        // Espiamos o prompt para controlar a opção digitada pelo usuário
        spyOn(window, 'prompt');
    });

    it('debe llamar a GenerarBusqueda cuando elige la opción 1', () => {
        prompt.and.returnValue("1");
        menuDeUsuario();
        expect(GenerarBusqueda).toHaveBeenCalled();
    });

    it('debe llamar a SubscribirNewsletter cuando elige la opción 2', () => {
        prompt.and.returnValue("2");
        menuDeUsuario();
        expect(SubscribirNewsletter).toHaveBeenCalled();
    });

    it('debe llamar a CrearUnaReserva cuando elige la opción 3', () => {
        prompt.and.returnValue("3");
        menuDeUsuario();
        expect(CrearUnaReserva).toHaveBeenCalled();
    });

    it('debe llamar a CrearUnItinerario cuando elige la opción 4', () => {
        prompt.and.returnValue("4");
        menuDeUsuario();
        expect(CrearUnItinerario).toHaveBeenCalled();
    });

    it('debe mostrar un alert cuando la opción no es válida', () => {
        prompt.and.returnValue("999");
        menuDeUsuario();
        expect(alert).toHaveBeenCalledWith("La opcion elegida no es valida, por favor reingrese su eleccion");
    });
});
