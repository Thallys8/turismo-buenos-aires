## Datos que se almacenan

### localStorage (persistente entre sesiones)

Se usa para guardar información que debe permanecer aunque el usuario cierre el navegador.  

| Dato                       | Ejemplo                     | Motivo                     |
| -------------------------- | --------------------------- | -------------------------- |
| Datos de atracciones   | `"atracciones"`      | Facilitar su acceso        |
| Itinerarios | `"itinerarios"` | Son sus itinerarios generados |
| Reservas   | `"newsletter"`    | Son sus reservas generadas    |
| Subscripciones             | `"reservas"`       | Son sus subscripciones al newsletter  |


### sessionStorage (solo durante la sesión/pestaña actual)

Se usa para datos temporales, sensibles o que no deben persistir.  

| Dato                           | Ejemplo                 | Motivo                    |
| ------------------------------ | ----------------------- | ------------------------- |
|                                |                         |                           |



## Estructura de claves

Las claves siguen la estructura: "nombre"

| Clave | Tipo de almacenamiento | Descripcion |
|--------|------------------------|--------------|
| `atracciones` | localStorage | Información de las atracciones  |
| `itinerarios` | localStorage | Datos del itinerario en formato JSON |
| `newsletter` | sessionStorage | Datos de las subscripciones en formato JSON |
| `reservas` | localStorage | Datos de las reservas en formato JSON |



## Formato de datos (Schemas JSON)

### Reserva
Cada usuario debe selecionar los días de la semana, numero de personas en el grupo, selecionar la atracción y ingrsar su email.  

```json
{
  "atraccion": "1",
  "grupo": 4,
  "dias": ["lunes", "martes"],
  "email": "usuario@example.com"
}
```

### Itinerario
El usuario seleciona el día de la semana, la secuencia de atracciones y un comentário sobre la atracción.  

```json
{
  "dia": "lunes",
  "atracciones": ["2", "3"],
  "comentario": "llevar protector"
}
```

### Filtros de búsqueda
Los filtros en dende el usuario seleciona que atraciones están disponibles según su agenda.  

```json
{
  "momento": ["mañana"],
  "horario": ["tarde"],
  "actividad": ["paseo"],
  "grupo": ["familia"]
}
```


### Preferencias del usuario
Usuário ingresa su correo y informa sus preferencias, así podemos usar esa información para futuras pubicidades o avisos al usuario.  

```json
{
  "email": "usuario@example.com",
  "favoritos": ["atraccion 1", "atraccion 2"]
}
```

## Diferencias entre localStorage y sessionStorage en este proyecto

| Característica             | localStorage                                     | sessionStorage                          |
| -------------------------- | ------------------------------------------------ | --------------------------------------- |
| Persistencia               | ✔️ Permanece al cerrar el navegador              | ❌ Se borra al cerrar pestaña            |
| Se comparte entre pestañas | ✔️ Sí                                            | ❌ No                                    |
| Ideal para                 | Datos del usuario, últimas reservas, itinerarios | Flujos temporales, estados transitorios |
| Ejemplo clave              | `"reservas"`                           | `"sin ejemplo"`                     |


## Ejemplos reales de uso

### Guardar un elemento en su clave correspondiente

```js
// Guardar un elemento en almacenamiento local.  [ConexionAlmacen.js : 69]
agregarLocalArrayActualizable(clave, valor){
  const respuesta = managerAlmacenamiento.obtener(clave, "local");

  if(respuesta !== undefined && respuesta){
    const arrayDatos = respuesta.datos;

    if( arrayDatos !== null && arrayDatos){
      arrayDatos.push(valor);
      respuesta.datos = arrayDatos;
          
      managerAlmacenamiento.actualizar(clave, respuesta, "local");
    }
  }
}
```

### Guardado de claves iniciales
 
```js
// Guarda las claves inicialmente [ConexionAlmacen.js : 10]
constructor(){
  this.keys = {
    atracciones: "atracciones",
    itinerarios: "itinerarios",
    newsletter: "newsletter",
    reservas: "reservas"
  };
          
  for( let llave of Object.keys(this.keys)){
    if (!this.existeClave(llave))
      managerAlmacenamiento.guardar(llave, { datos: []}, "local");
  }
}
```

### Almacenamiento de newsletter, itinerario o reservas

```js
// Proceso de almacenamiento para una newsletter, itinerario o reserva [ConexionAlmacen.js : 102]
ingresarInformacionNewsletter( subscripcionForm ){
  const subscripcion = this.dataFormToJSON(subscripcionForm);
  this.agregarLocalArrayActualizable(this.keys.newsletter, subscripcion);
}

ingresarInformacionItinerario( itinerarioObj ){
  const itinerario = itinerarioObj.toJSON();
  this.agregarLocalArrayActualizable(this.keys.itinerarios, itinerario);
}

ingresarInformacionReservas( reservaForm ){
  const reserva = this.dataFormToJSON(reservaForm);
  this.agregarLocalArrayActualizable(this.keys.reservas, reserva);
}
```
