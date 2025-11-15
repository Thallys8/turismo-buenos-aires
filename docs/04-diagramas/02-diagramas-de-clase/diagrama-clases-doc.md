# Documentacion sobre el diagrama de clases

Este documento presenta la informacion relacionada a las clases presentes en el sistema

## Listado de clases
* **FiltroAtracciones**
    - **Descripcion:** Esta clase almacena las acciones de filtrado por diferentes criterios, sobre la informacion almacenada
    - **Responsabilidad:** Permitir funciones de busqueda de elementos especificos segun caracteristicas solicitadas
    - **Relaciones:** Es accedido por script.js, mantiene relacion de Dependencia con el validador y conexionAlmacen
    - **Justificacion de diseño:** Esta clase es util para encapsular la logica de busqueda y filtrado de datos en los elementos almacenados
* **Validador**
    - **Descripcion:** Esta clase contiene funciones de validacion en general, como si es un email o si un valor existe en un array
    - **Responsabilidad:** Se encarga de lo relacionado con validaciones de datos o verdades (por ej. este es un correo? si, no)
    - **Relaciones:** Se relaciona con filtroAtracciones, ya que provee sus servicios para los datos ingresados en el filtro
    - **Justificacion de diseño:** Encapsula y facilita funciones utiles para cualquier clase que necesite chequear sus datos
* **ConexionAlmacen**
    - **Descripcion:** Gestiona las conexiones con el almacenamiento interno del sistema
    - **Responsabilidad:** Funciona como intermediario entre el sistema de guardado/acceso de datos y el sistema de clases, separandolo logicamente
    - **Relaciones:** Se relaciona con FiltroAtracciones, proveyendo acceso a la informacion, y con TarjetaAtraccion e Itinerario con funciones de guardado
    - **Justificacion de diseño:** Facilita la interaccion del sisetma con el sistema "externo" de guardado
* **ConstructorHTML**
    - **Descripcion:** Se encarga de contruir elementos html con informacion que reciba como parametros
    - **Responsabilidad:** generar elementos HTML estando listos para que puedan ser ingresados al DOM
    - **Relaciones:** Se relaciona con FiltroAtracciones (lo utiliza para generar las tarjetas html) y TarjetaAtraccion, que es el elemento que representa una tarjeta 
    - **Justificacion de diseño:** Separa la creacion del HTML para elementos con formatos comunes como formularios, popups, etc.
* **TarjetaAtraccion**
    - **Descripcion:** Representa una tarjeta html, con su formato almacenado
    - **Responsabilidad:** Almacena su informacion html y facilita su creacion, tambien se guarda a si mismo si se lo solicita
    - **Relaciones:** Se relaciona con ConstructorHTML, ya que este es quien crea y maneja las tarjetas
    - **Justificacion de diseño:** Contiene el codigo de creacion de una tarjeta y facilita su representacion
* **Itinerario**
    - **Descripcion:** Representa un itinerario completo, separado por dias
    - **Responsabilidad:** Se encarga de gestionar el almacenamiento de los dias planeados y comentarios, tambien se guarda a si mismo si se lo solicita
    - **Relaciones:** Se relaciona con ConexionAlmacen para el guardado, el resto de los procesos se comunican con script.js
    - **Justificacion de diseño:** Facilita el almacenamiento de la informacion del itinerario y su guardado