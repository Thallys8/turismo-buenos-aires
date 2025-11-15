// ===============================
// Tests para utils/storage.js
// ===============================

describe("Storage utils", function () {

    beforeEach(function () {
        // Limpia ambos storages antes de cada test
        localStorage.clear();
        sessionStorage.clear();

        // Espiamos errores en consola
        spyOn(console, "error");
        spyOn(console, "warn");
    });

    // ------------------------------------------
    // CRUD - GUARDAR / OBTENER
    // ------------------------------------------
    describe("guardar() y obtener()", function () {

        it("debe guardar y recuperar datos en localStorage", function () {
            Storage.guardar("app:test:1", { nombre: "Juan" });

            const resultado = Storage.obtener("app:test:1");

            expect(resultado).toEqual({ nombre: "Juan" });
        });

        it("debe guardar y recuperar datos en sessionStorage", function () {
            Storage.guardar("app:test:2", ["a", "b"], "session");

            const resultado = Storage.obtener("app:test:2", "session");

            expect(resultado).toEqual(["a", "b"]);
        });

        it("debe devolver null si la clave no existe", function () {
            const resultado = Storage.obtener("clave_inexistente");
            expect(resultado).toBeNull();
        });
    });

    // ------------------------------------------
    // Actualizar
    // ------------------------------------------
    describe("actualizar()", function () {

        it("debe actualizar correctamente un valor existente", function () {
            Storage.guardar("app:user", { nombre: "Ana" });

            Storage.actualizar("app:user", { nombre: "Ana", edad: 25 });

            expect(Storage.obtener("app:user")).toEqual({ nombre: "Ana", edad: 25 });
        });

        it("debe advertir si la clave no existe", function () {
            Storage.actualizar("clave_inexistente", { test: 1 });

            expect(console.warn).toHaveBeenCalled();
        });
    });

    // ------------------------------------------
    // Eliminar
    // ------------------------------------------
    describe("eliminar()", function () {

        it("debe eliminar una clave existente", function () {
            Storage.guardar("app:temp", "test");
            Storage.eliminar("app:temp");

            expect(Storage.obtener("app:temp")).toBeNull();
        });
    });

    // ------------------------------------------
    // Listar por prefijo
    // ------------------------------------------
    describe("listar()", function () {

        it("debe listar solo claves que coincidan con el prefijo", function () {
            Storage.guardar("app:user:1", 1);
            Storage.guardar("app:user:2", 2);
            Storage.guardar("otro:valor", 3);

            const claves = Storage.listar("app:user:");

            expect(claves.length).toBe(2);
            expect(claves).toContain("app:user:1");
            expect(claves).toContain("app:user:2");
        });
    });

    // ------------------------------------------
    // Limpiar storage completo
    // ------------------------------------------
    describe("limpiar()", function () {

        it("debe limpiar completamente localStorage", function () {
            Storage.guardar("a", 1);
            Storage.guardar("b", 2);

            Storage.limpiar();

            expect(localStorage.length).toBe(0);
        });

        it("debe limpiar completamente sessionStorage", function () {
            Storage.guardar("a", 1, "session");

            Storage.limpiar("session");

            expect(sessionStorage.length).toBe(0);
        });
    });

    // ------------------------------------------
    // Manejo de errores
    // ------------------------------------------
    describe("Errores y datos corruptos", function () {

        it("debe atrapar errores si storage está lleno (simulado)", function () {
            spyOn(localStorage, "setItem").and.throwError("quota exceeded");

            Storage.guardar("a", { test: 1 });

            expect(console.error).toHaveBeenCalled();
        });

        it("debe manejar JSON corrupto sin lanzar excepción", function () {
            localStorage.setItem("datoCorrupto", "{ esto no es JSON");

            const resultado = Storage.obtener("datoCorrupto");

            expect(resultado).toBeNull();
            expect(console.error).toHaveBeenCalled();
        });
    });

});
