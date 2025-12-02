import StorageUtil from "../utils/storage.js";

describe("StorageUtil", () => {

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // =============================================================
  // 1) Guarda y obtiene un objeto en localStorage
  // =============================================================
  it("guarda y obtiene un objeto en localStorage", () => {
    const clave = "test-objeto";
    const objeto = { a: 1, b: 2 };

    // Firma real: guardar(clave, valor, tipo)
    StorageUtil.guardar(clave, objeto, "local");

    // Firma real: obtener(clave, tipo)
    const resultado = StorageUtil.obtener(clave, "local");

    expect(resultado).toEqual(objeto);
  });

  // =============================================================
  // 2) Guarda y obtiene un string en sessionStorage
  // =============================================================
  it("guarda y obtiene un string en sessionStorage", () => {
    const clave = "test-string";
    const valor = "Hola mundo";

    // Espiamos sessionStorage.setItem
    spyOn(sessionStorage, "setItem").and.callThrough();

    // guardar(clave, valor, tipo)
    StorageUtil.guardar(clave, valor, "session");

    // Verificamos que sessionStorage.setItem haya sido llamado
    expect(sessionStorage.setItem).toHaveBeenCalled();

    const resultado = StorageUtil.obtener(clave, "session");
    expect(resultado).toBe(valor);
  });

  // =============================================================
  // 3) actualizar es equivalente a guardar
  // =============================================================
  it("actualizar es equivalente a guardar", () => {
    const clave = "clave-actualizar";
    const valor = { x: 1 };

    spyOn(localStorage, "setItem").and.callThrough();

    // Firma real: actualizar(clave, valor, tipo)
    StorageUtil.actualizar(clave, valor, "local");

    expect(localStorage.setItem)
      .toHaveBeenCalledWith(clave, JSON.stringify(valor));
  });

  // =============================================================
  // 4) eliminar borra la clave del storage
  // =============================================================
  it("eliminar borra la clave del storage", () => {
    const clave = "test-eliminar";

    localStorage.setItem(clave, "valor");

    // Firma real: eliminar(clave, tipo)
    StorageUtil.eliminar(clave, "local");

    expect(localStorage.getItem(clave)).toBeNull();
  });

  // =============================================================
  // 5) listar devuelve solo las claves con el prefijo indicado
  // =============================================================
  it("listar devuelve solo las claves con el prefijo indicado", () => {
    localStorage.clear();
    localStorage.setItem("prefijo-1", "a");
    localStorage.setItem("prefijo-2", "b");
    localStorage.setItem("otra-3", "c");

    // Firma real: listar(prefijo, tipo)
    const resultado = StorageUtil.listar("prefijo-", "local");

    // Asumimos que devuelve un array de claves
    expect(Array.isArray(resultado)).toBeTrue();
    expect(resultado.length).toBe(2);
    expect(resultado).toEqual(["prefijo-1", "prefijo-2"]);
  });

  // =============================================================
  // 6) limpiar borra todas las claves del storage seleccionado
  // =============================================================
  it("limpiar borra todas las claves del storage seleccionado", () => {
    localStorage.setItem("a", "1");
    localStorage.setItem("b", "2");

    // Firma real: limpiar(tipo)
    StorageUtil.limpiar("local");

    expect(localStorage.length).toBe(0);
  });

  // =============================================================
  // 7) obtener devuelve null si el JSON está corrupto
  // =============================================================
  it("obtener devuelve null si el JSON está corrupto", () => {
    const clave = "json-malo";

    localStorage.setItem(clave, "{no es json válido");

    const resultado = StorageUtil.obtener(clave, "local");

    expect(resultado).toBeNull();
  });

});
