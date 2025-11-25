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
    - **Relaciones:** Se relaciona con filtroAtracciones que depende de Validador, ya que provee sus servicios para los datos ingresados en el filtro
    - **Justificacion de diseño:** Encapsula y facilita funciones utiles para cualquier clase que necesite chequear sus datos
* **ConexionAlmacen**
    - **Descripcion:** Gestiona las conexiones con el almacenamiento interno del sistema
    - **Responsabilidad:** Funciona como intermediario entre el sistema de guardado/acceso de datos y el sistema de clases, separandolo logicamente
    - **Relaciones:** Depende de Semana y FiltroAtracciones, proveyendo acceso a la informacion, y con Itinerario con un guardado desde script.js
    - **Justificacion de diseño:** Facilita la interaccion del sisetma con el sistema "externo" de guardado
* **Reserva**
    - **Descripcion:** Representa los datos de una reserva, con su formato almacenado
    - **Responsabilidad:** Almacena la informacion que ingreso el usuario y facilita su manejo
    - **Relaciones:** Depende de FiltroAtracciones y ConexionAlmacen, ya que los utiliza para filtrar informacion o guardarse al ser completado
    - **Justificacion de diseño:** Contiene el codigo de administracion de una reserva y su informacion
* **Itinerario**
    - **Descripcion:** Representa un itinerario completo, separado por dias
    - **Responsabilidad:** Se encarga de gestionar el almacenamiento de los dias planeados y comentarios, tambien se guarda a si mismo si se lo solicita
    - **Relaciones:** Se relaciona con ConexionAlmacen (Dependencia) para el guardado y Semana (Dependencia) para utilizar sus datos, el resto de los procesos se comunican con script.js
    - **Justificacion de diseño:** Facilita el almacenamiento de la informacion del itinerario y su guardado
* **Semana**
    - **Descripcion:** Representa una semana con sus respectivos dias
    - **Responsabilidad:** Se encarga de proveer la informacion sobre los dias de la semana
    - **Relaciones:** Se relaciona con ConexionAlmacen (Dependencia) e Itinerario (Dependencia), ya que ambos utilizan esta clase
    - **Justificacion de diseño:** Provee informacion sobre la semana