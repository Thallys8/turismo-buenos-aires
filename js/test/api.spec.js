import ApiService from '../api/apiService.js';

describe("ApiService - fetchData() éxito", function () {

  beforeEach(function () {
    // Mock de showLoading y hideLoading
    spyOn(ApiService, "showLoading");
    spyOn(ApiService, "hideLoading");

    // Mock del fetch global
    spyOn(window, "fetch").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: "Juan" }])
      })
    );
  });

  // ---- Test de función fetch con respuesta exitosa ----
  it("debe obtener los datos correctamente cuando la respuesta es exitosa", async function () {
    const datos = await ApiService.fetchData("/fake-endpoint");

    // Se llamó al fetch
    expect(window.fetch).toHaveBeenCalledWith("/fake-endpoint");

    // Loading UI
    expect(ApiService.showLoading).toHaveBeenCalled();
    expect(ApiService.hideLoading).toHaveBeenCalled();

    // Los datos devueltos deben coincidir con el mock
    expect(datos).toEqual([{ id: 1, name: "Juan" }]);
  });


  // ---- Test de función fetch con error HTTP ----
  it("debe manejar correctamente un error HTTP", async function () {
        // Mock de fetch que responde con error 404
        window.fetch.and.returnValue(
            Promise.resolve({
            ok: false,
            status: 404
            })
        );

        let errorCapturado;

        try {
            await ApiService.fetchData("/endpoint-404");
        } catch (error) {
            errorCapturado = error;
        }

        // Debe haberse lanzado un error
        expect(errorCapturado).toBeDefined();
        expect(errorCapturado.message).toContain("HTTP error");

        // hideLoading() debe ejecutarse siempre
        expect(ApiService.hideLoading).toHaveBeenCalled();

        // showError() debe invocarse con el mensaje predefinido
        expect(ApiService.showError).toHaveBeenCalledWith(
            "No fue posible cargar la lista de usuarios"
        );
    });


  // ---- Test de función fetch con error de red ----
    it("debe manejar correctamente un error de red", async function () {
        // Mock de fetch que falla con un error de red
        window.fetch.and.returnValue(
            Promise.reject(new Error("Network error"))
        );

        let errorCapturado;

        try {
            await ApiService.fetchData("/endpoint-network-error");
        } catch (error) {
            errorCapturado = error;
        }

        // Verifica que el error fue capturado
        expect(errorCapturado).toBeDefined();
        expect(errorCapturado.message).toContain("Network error");

        // hideLoading() debe ejecutarse incluso si fetch falla
        expect(ApiService.hideLoading).toHaveBeenCalled();

        // showError() debe llamarse con el mensaje genérico del servicio
        expect(ApiService.showError).toHaveBeenCalledWith(
            "No fue posible cargar la lista de usuarios"
        );
    });


  // ---- Test de procesamiento de datos con map/filter/reduce ----
  it("debe procesar datos usando map, filter y reduce correctamente", function () {
        // Datos crudos simulados (por ejemplo, usuarios)
        const rawData = [
            { id: 1, name: "Ana", active: true,  age: 25 },
            { id: 2, name: "Luis", active: false, age: 30 },
            { id: 3, name: "María", active: true,  age: 28 },
            { id: 4, name: "Juan", active: true,  age: 22 }
        ];

        // 1) filter -> nos quedamos solo con los usuarios activos
        const activeUsers = rawData.filter(user => user.active);

        // 2) map -> obtenemos solo los nombres de los usuarios activos
        const activeNames = activeUsers.map(user => user.name);

        // 3) reduce -> sumamos las edades de los usuarios activos
        const totalAgeActive = activeUsers.reduce((acc, user) => acc + user.age, 0);

        // 4) reduce extra -> contamos cuántos activos hay
        const totalActive = rawData.reduce(
            (acc, user) => acc + (user.active ? 1 : 0),
            0
        );

        // Expectativas
        expect(activeUsers.length).toBe(3);                   // Ana, María, Juan
        expect(activeNames).toEqual(["Ana", "María", "Juan"]);
        expect(totalAgeActive).toBe(25 + 28 + 22);           // 75
        expect(totalActive).toBe(3);
    });

});
