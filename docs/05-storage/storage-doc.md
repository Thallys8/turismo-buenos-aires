## Datos que se almacenan

### localStorage (persistente entre sesiones)

Se usa para guardar información que debe permanecer aunque el usuario cierre el navegador.  

| Dato                       | Ejemplo                     | Motivo                     |
| -------------------------- | --------------------------- | -------------------------- |
| Última reserva realizada   | `"app:reserva:ultima"`      | Recuperarla después        |
| Último itinerario generado | `"app:itinerario:reciente"` | Mostrar resumen al usuario |
| Preferencias de búsqueda   | `"app:busqueda:filtros"`    | Mantener filtros usados    |
| Email del usuario          | `"app:usuario:email"`       | Autocompletar formularios  |


### sessionStorage (solo durante la sesión/pestaña actual)

Se usa para datos temporales, sensibles o que no deben persistir.  

| Dato                           | Ejemplo                 | Motivo                    |
| ------------------------------ | ----------------------- | ------------------------- |
| Estado temporal del flujo      | `"app:flow:estado"`     | Continuar paso actual     |
| Selecciones de itinerario      | `"app:itinerario:temp"` | Antes de finalizar        |
| Datos parciales de formularios | `"app:form:temp"`       | Evitar pérdida accidental |



## Estructura de claves

Las claves siguen la estructura: app:<modulo>:<nombre>  

| Clave | Tipo de almacenamiento | Descripcion |
|--------|------------------------|--------------|
| `app:user:email` | localStorage | Información personal del usuario  |
| `app:reserva:ultima` | localStorage | Información con los dates de una reserva creada |
| `app:busqueda:filtros` | sessionStorage | Filtros de pa lpagina usados para selecionar una atracción |
| `app:itinerario:reciente` | localStorage | Creado por el usuario despues de selecionar los una atración |
| `app:itinerario:temp` | sessionStorage | Información selecionada por el usuario pero no guardada |



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
| Ejemplo clave              | `"app:reserva:ultima"`                           | `"app:flow:estado"`                     |


## Ejemplos reales de uso

### Guardar una reserva

```js
// Guardar una reserva creada por el usuario.  
Storage.guardar("app:reserva:ultima", {
    atraccion: "3",
    grupo: 2,
    dias: ["jueves"],
    email: "usuario@test.com"
});
```

### Obtener un itinerario reciente

```js
// Obtener el último itinerario creado por el usuario.  
const itinerario = StorageUtil.obtener("app:itinerario:reciente");
console.log(itinerario);
```

### Actualizar preferencias del usuario
 
```js
// Actualizar la lista de proferencias del usuario. 
const usuario = StorageUtil.obtener("app:user:email");
StorageUtil.actualizar("app:user:email", "nuevo@mail.com");
```

### Lista de todas las reservas almacenadas

```js
// Listar las reservas almacenadas en local.  
const claves = StorageUtil.listar("app:reserva:");
console.log(claves);
```

### Limpiar todo sessionStorage
```js
// Limpia datos permanentes
StorageUtil.limpiar('local');

// Limpia datos de sesión
StorageUtil.limpiar('session');
```
