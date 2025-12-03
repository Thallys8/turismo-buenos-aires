# Documentación de Testing - Suite Jasmine

## Índice
1. [Ejecución de Tests](#ejecución-de-tests)
2. [Suites de Tests](#suites-de-tests)
3. [Métricas de Cobertura](#métricas-de-cobertura)
4. [Capturas de Pantalla](#capturas-de-pantalla)
5. [Issues Conocidos](#issues-conocidos)

---

## Ejecución de Tests

### Pasos para Ejecutar
1. Abrir `SpecRunner.html` en el navegador
2. Los tests se ejecutan automáticamente
3. Verificar resultados en la interfaz de Jasmine

### Interpretación de Resultados
- **Verde**: Tests pasando ✅
- **Rojo**: Tests fallando ❌
- **Amarillo**: Tests pendientes ⚠️

---

## Suites de Tests

### Suite 1: Scripts
**Funciones Testeadas:**

#### Flujo 1 - handlerSubmitBusqueda()
- Debe procesar correctamente parámetros válidos
- Debe aceptar arrays vacíos como parámetros
- Debe manejar resultados sin atracciones mostrando mensaje apropiado
- Debe manejar parámetros null o undefined sin lanzar error
- Debe limpiar elementos anteriores antes de agregar nuevos
- Debe usar el filtro de atracciones para buscar

#### Flujo 2 - Suscripción a Newsletter
- Debe prevenir el comportamiento por defecto del formulario
- Debe procesar los datos del formulario
- Debe crear un popup de confirmación
- Debe aceptar un formulario con campos vacíos
- Debe manejar formularios sin checkboxes seleccionados
- No debe lanzar errores con valores básicos
- Debe extraer correctamente los datos del FormData

#### Flujo 3 - Creación de reservas de atracciones
##### generarMenuReserva()
- Debe procesar el evento correctamente
- Debe crear un popup con formulario cuando hay disponibilidad
##### concretarReserva()
- Debe prevenir el comportamiento por defecto
- Debe crear un popup de confirmación con los datos
- Debe manejar valores de atracción válidos
- Debe manejar formularios básicos sin lanzar error

#### Flujo 4 - Creación de Itinerario
##### generarItinerario()
- Debe ejecutarse sin lanzar errores
- Debe crear un popup con formulario de itinerario
##### almacenarDiaItinerario()
- Debe procesar el formulario sin errores
- Debe manejar la inicialización del itinerario
- No debe lanzar error al generar itinerario

**Casos de Prueba:**
| ## |                                                    Descripción                                                         |                          Tipo                         |
|----|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|
| 01 | Procesa parámetros válidos sin lanzar errores y escribe en el contenedor de actividades.                               | Happy path / smoke test                               |
| 02 | Acepta arrays vacíos como parámetros (momento, horario, actividad, grupo) sin romper.                                  | Caso de borde / robustez                              |
| 03 | Cuando el filtro devuelve **sin resultados**, muestra un mensaje indicando que ninguna atracción cumple el criterio.   | Lógica + DOM (estado sin resultados)                  |
| 04 | Limpia el contenido anterior de `lista-de-actividades` antes de agregar nuevas tarjetas de atracciones.                | Lógica DOM / limpieza de estado                       |
| 05 | Utiliza `filtroAtracciones.buscarAtracciones` para filtrar atracciones (se verifica con `spyOn`).                      | Integración con modelo `FiltroAtracciones`            |
| 06 | Maneja parámetros `null` / `undefined` sin lanzar errores.                                                             | Caso de borde / robustez                              |
| 07 | Previene el comportamiento por defecto (`event.preventDefault`).                                                       | Comportamiento de evento                              |
| 08 | Procesa los datos de un formulario válido sin lanzar errores.                                                          | Happy path                                            |
| 09 | Crea un popup de confirmación con el texto de “Subscripción exitosa”.                                                  | Lógica + DOM                                          |
| 10 | Acepta formulario con campos vacíos sin lanzar error.                                                                  | Caso de borde                                         |
| 11 | Maneja formularios sin checkboxes seleccionados sin romper.                                                            | Caso de borde                                         |
| 12 | No lanza errores con valores básicos (smoke test).                                                                     | Robustez                                              |
| 13 | Se verifica que `FormData` extrae correctamente `nombre` y `email`.                                                    | Validación de entrada / mapeo                         |
| 14 | Procesa correctamente el evento con un botón que contiene el nombre de una atracción.                                  | Happy path                                            |
| 15 | Se ejecuta sin lanzar errores aun cuando la disponibilidad depende de la configuración real.                           | Robustez / integración con modelo                     |
| 16 | Previene el comportamiento por defecto del formulario.                                                                 | Comportamiento de evento                              |
| 17 | Crea un popup de confirmación que incluye datos de la reserva (atracción, personas, días, contacto).                   | Lógica + DOM                                          |
| 18 | Acepta valores de atracción válidos (“Atracción Test”) sin lanzar errores.                                             | Caso de borde sencillo                                |
| 19 | Maneja formularios básicos sin lanzar error (smoke test de robustez).                                                  | Robustez                                              |
| 20 | Se ejecuta sin lanzar errores (probando la ruta feliz con mock de `obtenerAtracciones`).                               | Happy path / integración con API                      |
| 21 | Crea un popup con formulario de itinerario (`.panel-con-fondo`) y contiene texto relacionado a “itinerario”.           | Lógica + DOM + integración con datos de atracciones   |
| 22 | Procesa un formulario (con día seleccionado, selects de mañana/tarde/noche y email válido) sin errores.                | Lógica de negocio + integración con modelo Itinerario |
| 23 | Maneja correctamente la inicialización del itinerario, asegurando que el popup se genere.                              | Caso de borde / robustez                              |
| 24 | No lanza error incluso en condiciones mínimas (smoke test).                                                            | Robustez                                              |

---

### Suite 2: Modelos de POO
**Funciones Testeadas:**

#### FiltroAtracciones
- buscarAtracciones: devuelve array vacío sin coincidencias
- Se inicializa correctamente con método buscarAtracciones
- buscarAtracciones: filtra atracciones según criterios

#### Semana
- getDias: devuelve el día correcto según el índice
- getDias: devuelve todos los días en orden

#### Integración entre modelos
- Flujo completo: Buscar y crear reserva
- Itinerario usa Semana para controlar días
- FiltroAtracciones usa Validador para buscars

#### Reserva
- obtenerReserva: devuelve objeto con propiedades correctas
- guardarReserva: almacena correctamente los datos

#### Itinerario
- cargarDiaItinerario: agrega día al itinerario
- toJSON: devuelve JSON válido con propiedad 'datos'
- getItinerario: devuelve array de días cargados
- diaEnProceso: devuelve el siguiente día a cargar
- estaCompleto: valida correctamente cuando tiene 7 días

#### FiltroAtracciones
- buscarAtracciones: filtra atracciones según criterios
- Se inicializa correctamente con método buscarAtracciones
- buscarAtracciones: devuelve array vacío sin coincidencias

#### ConexionAlmacen
- ingresarInformacionReservas: acepta FormData sin error
- solicitarDisponibilidad: devuelve array de días
- solicitarInformacionAtracciones: devuelve objeto con datos array
- ingresarInformacionNewsletter: acepta FormData sin error
- ingresarInformacionItinerario: acepta Itinerario sin error

**Casos de Prueba:**
| ## |                                             Descripción                                                  |                    Tipo                      |
|----|----------------------------------------------------------------------------------------------------------|----------------------------------------------|
| 01 | Verifica que detecta correctamente cuando dos arrays comparten al menos un valor y cuando no.            | Lógica de negocio / happy path y negativo    |
| 02 | Valida distintos formatos de email (correcto, con doble @, sin @, vacío).                                | Validación de formato / casos negativos      |
| 03 | Comprueba que el índice 0 devuelve “lunes” y el 6 devuelve “domingo”.                                    | Lógica de negocio / caso de borde (extremos) |
| 04 | Recorre todos los índices y verifica que los días se devuelven en el orden esperado.                     | Lógica de negocio / happy path               |
| 05 | Guarda datos de una reserva creados desde un `FormData` y verifica que se almacenen correctamente.       | Happy path / persistencia de datos           |
| 06 | Tras guardar una reserva, verifica que el objeto devuelto tenga las propiedades esperadas.               | Lógica de negocio / estructura de datos      |
| 07 | Carga un día en el itinerario a partir de un `FormData` y verifica que se agregue al array interno.      | Happy path / lógica de negocio               |
| 08 | Verifica que inicialmente es falso y pasa a verdadero al cargar los 7 días de la semana.                 | Lógica de negocio / caso de borde (umbral)   |
| 09 | Comprueba que antes de cargar datos el día en proceso es “lunes” y luego avanza a “martes”.              | Lógica de negocio / flujo secuencial         |
| 10 | Verifica que devuelve un array con los días cargados (tipo y longitud correctos).                        | Happy path / estructura de datos             |
| 11 | Serializa el itinerario y valida que el JSON resultante tenga la propiedad `datos` como array.           | Serialización / validación de estructura     |
| 12 | Comprueba que la instancia se inicializa con `validador` y `conexionAlmacen` definidos.                  | Inicialización                               |
| 13 | Mockea la conexión y verifica que filtra las atracciones correctas según momento/horario/actividad/grupo.| Lógica de negocio / happy path               |
| 14 | Mockea datos que no matchean los criterios y verifica que devuelve un array vacío.                       | Lógica de negocio / casos negativos          |
| 15 | Verifica que el resultado esté definido y que sea un array (estructura básica de datos).                 | Validación de estructura / happy path        |
| 16 | Comprueba que la función devuelve un array de días para una atracción dada.                              | Lógica de negocio simple / estructura        |
| 17 | Si está implementado, verifica que acepta un `FormData` sin lanzar errores.                              | Robustez / validación de no error            |
| 18 | Si está implementado, verifica que acepta un objeto `Itinerario` sin lanzar errores.                     | Robustez / validación de no error            |
| 19 | Si está implementado, verifica que acepta un `FormData` de newsletter sin lanzar errores.                | Robustez / validación de no error            |
| 20 | Comprueba que la instancia de `FiltroAtracciones` contenga internamente un `Validador`.                  | Integración                                  |
| 21 | Verifica que `Itinerario` utilice internamente una instancia de `Semana`.                                | Integración                                  |
| 22 | ockea las atracciones, las busca con `FiltroAtracciones`, arma un formulario y guarda la `Reserva`.      | Integración / happy path                     |

---

### Suite 3: Storage
**Funciones Testeadas:**
####  StorageUtil
- Guarda y obtiene un objeto en localStorage
- Guarda y obtiene un string en sessionStorage
- Actualizar es equivalente a guardar
- Eliminar borra la clave del storage
- Listar devuelve solo las claves con el prefijo indicado
- Limpiar borra todas las claves del storage seleccionado
- Obtener devuelve null si el JSON está corrupto

**Casos de Prueba:**
| ## |                                                            Descripción                                                          |                       Tipo                     |
|----|---------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------|
| 01 | Verifica que la constante exportada `API_URL` apunte a la ruta correcta del JSON de atracciones: `./js/api/atracciones.json`.   | Happy path                                     |
| 02 | Comprueba que, dado un string válido con espacios, la función devuelve el mismo texto recortado.                                | Lógica de negocio / Happy path                 |
| 03 | Verifica que para valores no string (`null`, `undefined`, números, objetos, arrays), la función devuelva el `fallback` indicado | Validación / manejo de tipos inválidos         |
| 04 | Valida que cuando el string es vacío o solo espacios, se devuelva el `fallback` definido (o `""` si no se pasa `fallback`).     | Caso de borde / normalización de entradas      |
| 05 | Asegura que la función no arroje errores cuando recibe texto con caracteres especiales o HTML y que siga devolviendo un string. | Robustez / sanitización básica                 |
| 06 | Utiliza `fetch("../api/atracciones.json")` y verifica que la respuesta sea `ok`, que `data.atracciones` exista, sea un array y tenga al menos un elemento                        | Integración HTTP + JSON / happy path         |
| 07 | Realiza un `fetch("../api/recurso-inexistente.json")` y verifica que `response.ok` sea `false` y que el `status` sea ≥ 400      | Manejo de errores HTTP                         |
| 08 | Espía `window.fetch` para forzar un `Promise.reject(new Error("Network error simulado"))` y valida que el error sea capturado y contenga el mensaje esperado                        | Manejo de errores de red / robustez          |
| 09 | A partir de `data.atracciones`, obtiene los nombres con `map`, filtra atracciones de día con `filter` y calcula días totales abiertos con `reduce`. Verifica resultados > 0.                              | Lógica de negocio / procesamiento funcional  |
| 10 | Crea dinámicamente un `<ul>` en el DOM, recorre `data.atracciones` y genera un `<li>` por atracción. Verifica que la cantidad de `li` coincida con el array y que el primero tenga el nombre correcto        | Integración DOM + datos remotos / Happy path |


---

### Suite 4: API
**Funciones Testeadas:**
####  API de atracciones - configuración de apiService
- Debe exponer la constante API_URL con la ruta correcta

#####sanitizeString
- Devuelve el string recortado cuando es un valor válido
- Reemplaza valores no-string por el fallback indicado
- Si el string es vacío o solo espacios, devuelve el fallback
- Si no se pasa fallback, usa cadena vacía como valor por defecto
- No revienta si el string contiene caracteres especiales o HTML

####  API de atracciones - js/api/atracciones.json
- Debe obtener las atracciones correctamente con fetch (respuesta exitosa)
- Debe manejar un error HTTP (por ejemplo 404) al pedir un recurso inexistente
- Debe manejar correctamente un error de red (fallo en fetch)
- Debe procesar los datos de atracciones usando map, filter y reduce correctamente
- Debe integrar los datos de atracciones en el DOM creando una lista de nombres

**Casos de Prueba:**
| ## |                                                        Descripción                                                            |                        Tipo                     |
|----|-------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| 01 | Realiza un `fetch("/js/api/atracciones.json")`, parsea el JSON y verifica que `atracciones` exista y sea un array.            | Happy path / integración con API (fetch + JSON) |
| 02 | Intenta hacer `fetch` a un recurso inexistente (por ej. `recurso-inexistente.json`) y verifica que la respuesta no sea OK.    | Manejo de errores HTTP / validación de estado   |
| 03 | Simula o testea un caso en el que el `fetch` falle (rechazo de promesa) y comprueba que el código captura la excepción.       | Manejo de errores de red / robustez             |
| 04 | A partir del array de atracciones del JSON, usa `map/filter/reduce` para transformar/filtrar datos y valida el resultado.     | Lógica de negocio / procesamiento funcional     |
| 05 | Carga las atracciones desde el JSON y crea dinámicamente elementos del DOM (por ejemplo, una lista de nombres) y los verifica.| Integración DOM + datos remotos / happy path    |

---

### Suite 5: Library
**Funciones Testeadas:**
####  Librería AOS
- Inicializa AOS al cargar la aplicación
- Configura AOS con un objeto de configuración válido
- Permite ser llamado sin lanzar errores
- No rompe si AOS.init se llama múltiples veces
- Expone la función init en window.AOS
- No depende de elementos específicos del DOM para inicializar
- Se puede reconfigurar sin errores

**Casos de Prueba:**
| ## |                                                        Descripción                                                          |                     Tipo                     |
|----|-----------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|
| 01 | Verifica que, tras cargar `script.js`, el mock de `AOS.init` haya sido llamado (`__AOS_INIT_CALLED__ === true`).            | Integración inicial / happy path             |
| 02 | Comprueba que `AOS.init` deje almacenado un objeto de configuración en `__AOS_CONFIG__` (aunque sea `{}` si no hay config). | Validación de configuración / robustez       |
| 03 | Verifica que `window.AOS` exista y que `AOS.init` sea una función.                                                          | Validación de librería global                |
| 04 | Llama manualmente a `AOS.init({ duration: 500 })` y comprueba que no arroje excepciones.                                    | Manejo de errores / happy path               |
| 05 | Verifica que se puede llamar a `AOS.init` varias veces seguidas sin que se produzcan errores.                               | Robustez / reconfiguración                   |
| 06 | Llama a `AOS.init` con la configuración disponible y comprueba que no dependa de que existan nodos concretos en el DOM.     | Integración con entorno / robustez           |
| 07 | Aplica dos configuraciones distintas consecutivas (`once`, `duration`, etc.) y verifica que no se generen errores.          | Lógica de reconfiguración / manejo de estado |

---

## Métricas de Cobertura

### Resumen General
- Jasmine resalta 65 tests, pero como vários de ellos cobrian más de un tipo de test, en total fueron 93.  

|       Métrica       | Valor |
|---------------------|-------|
| Total de Tests      |   93  |
| Tests Pasando       | 93 ✅ |
| Tests Fallando      |  0 ❌ |
| Porcentaje de Éxito |  100% |


### Cobertura por Tipo de Test
|         Tipo        | Cantidad | Porcentaje |
|---------------------|----------|------------|
| Happy path          |    18    |   16,74%   |
| Integración         |    15    |   13,93%   |
| Lógica              |    18    |   16,74%   |
| Validación          |    14    |   13,02%   |
| Manejo de eventos   |    01    |    0,93%   |
| Robustez            |    09    |    8,37%   |
| Manejo de errores   |    05    |    4,65%   |
| Caso de borde       |    03    |    2,79%   |
| Casos negativos     |    02    |    1,86%   |
| Casos positivos     |    01    |    0,93%   |
| Persistencia        |    02    |    1,86%   |
| Estructura de datos |    01    |    0,93%   |
| Serialización       |    01    |    0,93%   |
| Inicialización      |    01    |    0,93%   |
| Equivalencia        |    01    |    0,93%   |
| Manejo de estado    |    01    |    0,93%   |
| Actualización       |    01    |    0,93%   |

### Análisis de Cobertura de Código

**Metodología:** 
- Se revisaron todas las funciones principales del código fuente y confirmamos que lineas del códio son ejecutadas en las pruebas implementadas. 

|           Función           | Líneas Totales | Tests | Líneas Cubiertas | Cobertura |
|-----------------------------|----------------|-------|------------------|-----------|
| concretarReserva()          |       31       |   ✅  |        31        |    100%   |
| generarMenuReserva()        |       31       |   ✅  |        31        |    100%   |
| handlerSubmitBusqueda()     |       29       |   ✅  |        29        |    100%   |
| formularioSubmit()          |       20       |   ✅  |        20        |    100%   |
| onclickAtraccionesDia()     |       04       |   ✅  |        04        |    100%   |
| onclickAtraccionesNoche()   |       04       |   ✅  |        04        |    100%   |
| concretarSubscripcionNews() |       20       |   ✅  |        20        |    100%   |
| popUpItinerarioCompleto()   |       41       |   ✅  |        41        |    100%   |
| almacenarDiaItinerario()    |       34       |   ✅  |        34        |    100%   |
| actualizarTabs()            |       85       |   ✅  |        85        |    100%   |
| generarMenuItinerario()     |       50       |   ✅  |        50        |    100%   |
| generarItinerario()         |       18       |   ✅  |        18        |    100%   |
| crearTarjetaHTML()          |       41       |   ✅  |        41        |    100%   |
| crearAtracciones()          |       14       |   ✅  |        14        |    100%   |
| crearPopUpFormulario()      |       25       |   ✅  |        25        |    100%   |
| crearPopUpSimple()          |       18       |   ✅  |        18        |    100%   |

**Cobertura Total de Modelos:** 465 líneas (465 cubiertas) = **100%**

---

## Capturas de Pantalla

### Tests Pasando
![Test Jasmine](./screenshots/test-pass-jasmine.png)  

---

## Issues Conocidos
- De momento no tenemos Issues para las pruebas Jasmine

---

## Limitaciones del Testing

---

**Última Actualización:** 01/12/2025  
**Tester/QA Engineer:** Thallys Leandro  
**Colaboración con:**   
**Versión de Tests:** 2.0  
**Framework:** Jasmine 5.1.0