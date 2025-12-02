// js/test/library.spec.js

describe("Librería AOS", () => {

  it("inicializa AOS al cargar la aplicación", () => {
    // script.js ya se importó desde test-runner, y ahí se supone que se llama a AOS.init(...)
    // Si no se llamó, __AOS_INIT_CALLED__ seguirá en false
    expect(window.__AOS_INIT_CALLED__).toBeTrue();
  });

  it("configura AOS con un objeto de configuración válido", () => {
    // Siempre que tu script.js llame a AOS.init({ ... })
    // el mock deja el config en window.__AOS_CONFIG__
    expect(typeof window.__AOS_CONFIG__).toBe("object");
  });

  it("permite ser llamado sin lanzar errores", () => {
    expect(() => {
      AOS.init({ duration: 500 });
    }).not.toThrow();
  });

  it("no rompe si AOS.init se llama múltiples veces", () => {
    expect(() => {
      AOS.init({ duration: 400 });
      AOS.init({ duration: 800 });
    }).not.toThrow();
  });

  it("expone la función init en window.AOS", () => {
    expect(window.AOS).toBeDefined();
    expect(typeof window.AOS.init).toBe("function");
  });

  it("no depende de elementos específicos del DOM para inicializar", () => {
    // La idea es que AOS.init pueda llamarse aunque no haya tarjetas todavía
    // Si tu script hace algo raro con el DOM antes de AOS.init, acá se vería
    expect(() => {
      AOS.init(window.__AOS_CONFIG__ || {});
    }).not.toThrow();
  });

  it("se puede reconfigurar sin errores", () => {
    const primeraConfig = { duration: 600, once: true };
    const segundaConfig = { duration: 1200, once: false };

    expect(() => {
      AOS.init(primeraConfig);
      AOS.init(segundaConfig);
    }).not.toThrow();
  });
});
