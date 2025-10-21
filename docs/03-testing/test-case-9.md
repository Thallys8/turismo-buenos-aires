# Test Case 9: Responsive – Implementación de Componente Avanzado HTML (1)

## Objetivo
Validar la integración, compatibilidad y comportamiento responsive del primer componente avanzado HTML implementado un elemento detail + summary con los horarios de los establecimientos en diferentes dispositivos y navegadores.  

## Herramientas Utilizadas
- BrowserStack Mobile Testing  
- Chrome DevTools Device Mode  
- Google PageSpeed Insights  
- Can I Use (verificación de compatibilidad por navegador)  
- W3C HTML Validator (validación de estándares HTML5)  

## Dispositivos Probados
| Dispositivo       | Resolución | Navegador | Orientación         | Resultado |
|-------------------|------------|-----------|---------------------|-----------|
| iPhone 14 Pro     | 393x852    | Safari    | Portrait/Landscape  | ✅ |
| Galaxy S23        | 360x780    | Chrome    | Portrait/Landscape  | ✅ |
| iPad Air          | 820x1180   | Safari    | Portrait/Landscape  | ✅ |
| Desktop (Laptop)  | >1024px    | Chrome    | Landscape           | ✅ |

## Breakpoints Verificados
- **Mobile:** 320px – 768px  
- **Tablet:** 768px – 1024px  
- **Desktop:** 1024px+  

---

## Validaciones específicas
- Confirmar que el componente HTML se adapte a diferentes resoluciones de pantalla.  ✅ Se adapta correctamente
- Verificar que **no genere scroll horizontal indeseado**. ✅ No genera scroll horizontal
- Validar compatibilidad de controles (play, pause, zoom, interacción táctil). ✅ Tiene interaccion correcta (aunque son limitadas con google maps)
- Revisar si el contenido embebido se adapta correctamente al **sistema de grillas de Bootstrap**. ✅ Se adapta correctamente  
- Chequear que los estilos personalizados en `css/styles.css`, `css/components.css` y `css/bootstrap-overrides.css` mantengan coherencia visual con el resto del proyecto.  ✅ Se mantiene la coherencia

---

## Uso de herramientas de compatibilidad y validación @TODO
- **Can I Use:** Verificar compatibilidad del componente HTML con navegadores principales (ej: Safari iOS, Chrome Android, Edge, Firefox).  
  **Capturas necesarias:**  
  1. Pantalla de resultados de [caniuse.com](https://caniuse.com) mostrando la tabla de soporte del componente.  
  2. Evidencia de compatibilidad o limitaciones (ej: íconos verdes/rojos).  

![alt text](../screenshots/html-test-detail-caniuse.png)  
 

- **W3C HTML Validator:** Validar que la implementación del componente sea conforme a HTML5 y no genere errores o warnings de semántica.  

**Capturas necesarias:**  
1. Resultado del validador con el mensaje **“Document checking completed. No errors or warnings to show.”** en caso de éxito.  
![alt text](../screenshots/html-test-w3c.png)  
 
2. En caso de errores: listado de errores y warnings reportados.  

❌ Bad value for attribute action on element form: Must be non-empty. 
- From line 85, column 13; to line 85, column 28   

❌ Bad value https://www.google.com/maps/embed/v1/place?key=AIzaSyBbT4vX8IWZ4W_9QIdK5w1KVPOJOxevglA&q=rosedal+de+palermo,buenos+aires for attribute src on element iframe: Tab, new line or carriage return found. 
- (From line 156, column 29; to line 164, column 72)    
- From line 219, column 29; to line 227, column 68
- From line 247, column 29; to line 255, column 71
- From line 287, column 29; to line 295, column 70
- From line 316, column 29; to line 324, column 67
- From line 345, column 29; to line 353, column 69
- From line 374, column 29; to line 382, column 67  

❌ Duplicate ID id-mapa-bar. 
- From line 185, column 29; to line 193, column 69
- From line 345, column 29; to line 353, column 69

---

## Performance en Mobile
- Medir el impacto del componente en la **performance total de la página** con PageSpeed.  

**Capturas necesarias:**  
1. Resultados del test de Google PageSpeed para **mobile**.  
![alt text](../screenshots/html-test-resultado-completo.png)  

2. Gráfico de puntuación general (Performance, Accessibility, Best Practices, SEO).  
![imagen de valores generales en mobile](../screenshots/test-general-mobile.png)  

- Confirmar que los recursos cargados (ej: scripts de YouTube o mapas) no bloqueen renderización. 

La carga de diferentes recursos se encuentra bloqueando la renderizacion:
| Bloqueante | Tiempo |
|---|---|
| Bootstrap | 1,080s |
| CSS | 1,620s |

**Capturas necesarias:**  
1. Sección de “Opportunities” y “Diagnostics” de PageSpeed donde se evidencie si hay recursos de bloqueo de renderizado.  
![insights y diagnostico](../screenshots/html-test-insight-diagnostico.png)

2. Comparación del **First Contentful Paint (FCP)** y **Largest Contentful Paint (LCP)** antes y después de agregar el componente.  

**Antes**
![alt text](../screenshots/html-test-performance-antes.jpg)  

**despues**
![alt text](../screenshots/html-test-performance-despues.jpg)  


---

## Capturas esperadas @TODO
1. **Mobile (iPhone 14 Pro y Galaxy S23)**
**Landscape**
![alt text](../screenshots/html-test-iphone-14-land.png)
![alt text](../screenshots/html-test-samsung-s23-land.png)

**Portrait**
![alt text](../screenshots/html-test-samsung-s24-port.png)
![alt text](../screenshots/html-test-iphone-14-port.png)

2. **Tablet (iPad Air)** verificando correcta visualización e interacción.  
![alt text](../screenshots/html-test-ipad-air-land.png)
![alt text](../screenshots/html-test-ipad-air.port.png)  

3. **Desktop** confirmando la visualización completa y sin pérdida de funcionalidades.  
![alt text](../screenshots/html-test-desktop-funcion.png)

4. **Prueba de interacción táctil** (ej: reproducir video, mover mapa, usar controles). 
- Visualizacion: Permite correctamente el uso de detail y su contenido (posiblemente incomodo al intentar tocar)
- Uso de controles: Se puede utilizar correctamente, abriendo y cerrandose al hacer click
- Movimientos: No posee grandes movimientos, pero se expande y mueve otros elementos (aunque no daña el diseño)

5. **Reporte Lighthouse/PageSpeed** confirmando que no hubo degradación significativa de performance.  
![alt text](../screenshots/html-test-rendimiento-mejor.png)

6. **Reporte W3C Validator** mostrando documento validado sin errores críticos.  
![alt text](html-test-w3c-mejor.png)

---

## Resultado Esperado
- El componente HTML se adapta y funciona correctamente en todos los dispositivos probados.  
- Mantiene la coherencia del diseño e integración con Bootstrap.  
- No afecta de forma crítica la performance en mobile.  
- Es compatible con los principales navegadores según **Can I Use** y válido según **W3C HTML Validator**.  

---

## Issues encontrados
No se encontraron problemas relacionados a este elemento en especifico

| IssueID | Descripción 
|----|-------------|
| [#60](https://github.com/Thallys8/turismo-buenos-aires/issues/60)  | Se detectaron errores de implementacion en el HTML |
| [#58](https://github.com/Thallys8/turismo-buenos-aires/issues/58)  | Se detectaron errores de rendimiento (informados primero por test 6) |
