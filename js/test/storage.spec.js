import StorageUtil from "../utils/storage.js";

describe("StorageUtil", () => {

    // ==========================
    // Mock simple de Storage
    // ==========================
    function crearMockStorage() {
        let store = {};
        return {
            getItem: jasmine.createSpy("getItem").and.callFake(key => store[key] || null),
            setItem: jasmine.createSpy("setItem").and.callFake((key, value) => store[key] = value),
            removeItem: jasmine.createSpy("removeItem").and.callFake(key => delete store[key]),
            clear: jasmine.createSpy("clear").and.callFake(() => store = {}),
            key: jasmine.createSpy("key").and.callFake(i => Object.keys(store)[i] || null),
            get length() { return Object.keys(store).length; }
        };
    }

    let localMock, sessionMock;

    beforeEach(() => {
        localMock = crearMockStorage();
        sessionMock = crearMockStorage();

        // reemplazar los storages reales con mocks
        window.localStorage = localMock;
        window.sessionStorage = sessionMock;
    });

    // =============================================================
    // 1) Guarda y obtiene un objeto en localStorage
    // =============================================================
    it("guarda y obtiene un objeto en localStorage", () => {
        const obj = { a: 1, b: 2 };

        StorageUtil.guardar("objeto", obj, "local");
        expect(localStorage.setItem).toHaveBeenCalled();

        const resultado = StorageUtil.obtener("objeto", "local");
        expect(resultado).toEqual(obj);
    });

    // =============================================================
    // 2) Guarda y obtiene un string en sessionStorage
    // =============================================================
    it("guarda y obtiene un string en sessionStorage", () => {
        const texto = "hola mundo";

        StorageUtil.guardar("texto", texto, "session");
        expect(sessionStorage.setItem).toHaveBeenCalled();

        const resultado = StorageUtil.obtener("texto", "session");
        expect(resultado).toEqual(texto);
    });

    // =============================================================
    // 3) actualizar es equivalente a guardar
    // =============================================================
    it("actualizar es equivalente a guardar", () => {
        StorageUtil.actualizar("clave", { x: 1 }, "local");

        expect(localStorage.setItem)
            .toHaveBeenCalledWith("clave", JSON.stringify({ x: 1 }));
    });

    // =============================================================
    // 4) eliminar borra la clave del storage
    // =============================================================
    it("eliminar borra la clave del storage", () => {
        StorageUtil.guardar("borrar", { t: 1 }, "local");

        StorageUtil.eliminar("borrar", "local");
        expect(localStorage.removeItem).toHaveBeenCalledWith("borrar");
    });

    // =============================================================
    // 5) listar devuelve solo las claves con el prefijo indicado
    // =============================================================
    it("listar devuelve solo las claves con el prefijo indicado", () => {
        StorageUtil.guardar("app:uno", 1, "local");
        StorageUtil.guardar("app:dos", 2, "local");
        StorageUtil.guardar("otro:tres", 3, "local");

        const lista = StorageUtil.listar("app:", "local");
        expect(lista).toEqual(["app:uno", "app:dos"]);
    });

    // =============================================================
    // 6) limpiar borra todas las claves del storage seleccionado
    // =============================================================
    it("limpiar borra todas las claves del storage seleccionado", () => {
        StorageUtil.guardar("a", 1, "local");
        StorageUtil.guardar("b", 2, "local");

        StorageUtil.limpiar("local");
        expect(localStorage.clear).toHaveBeenCalled();
        expect(localStorage.length).toBe(0);
    });

    // =============================================================
    // 7) obtener devuelve null si el JSON está corrupto
    // =============================================================
    it("obtener devuelve null si el JSON está corrupto", () => {
        localStorage.setItem("corrupto", "{esto no es json");

        const resultado = StorageUtil.obtener("corrupto", "local");

        expect(resultado).toBeNull();
    });

});
