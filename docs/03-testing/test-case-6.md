
# Test Case 6: Responsive – Migración a Bootstrap

## Objetivo
Verificar la adaptabilidad responsive en dispositivos móviles, tablets y desktops tras la migración del proyecto a Bootstrap, asegurando que el diseño se mantenga coherente con el mockup `disenio-bootstrap.png`.

## Herramientas Utilizadas
- BrowserStack Real Device Testing
- Chrome DevTools Device Simulation
- Lighthouse / PageSpeed Insights

## Dispositivos Probados
| Dispositivo   | Resolución | Navegador | Orientación         | Resultado |
|---------------|------------|-----------|---------------------|-----------|
| iPhone 14 Pro | 393x852    | Safari    | Portrait/Landscape  | ✅ |
| Galaxy S23    | 360x780    | Chrome    | Portrait/Landscape  | ✅ |
| iPad Air      | 820x1180   | Safari    | Portrait/Landscape  | ✅ |

## Breakpoints Verificados
- **Mobile:** 320px – 768px  
- **Tablet:** 768px – 1024px  
- **Desktop:** 1024px+  

## Capturas por Dispositivo
- Incluir capturas en **portrait y landscape** para cada dispositivo probado.  
- Marcar en cada captura si la visualización coincide con el mockup `disenio-bootstrap.png`.

- #### iPhone 14 Pro:  
- Portrait:  
  ![iPhone Portrait](../screenshots/t6-iphone-14-pro-portrait.png)  
  
- Landscape:    
  ![iPhone Landscape](../screenshots/t6-iphone-14-pro-landscape.png)  

#### Galaxy S23:  
- Portrait:  
  ![Galaxy Portrait](../screenshots/t6-galaxy-s23-portrait.png)  
  
- Landscape:  
  ![Galaxy Landscape](../screenshots/t6-galaxy-s23-landscape.png)  

#### iPad Air:  
- Portrait:  
  ![iPad Portrait](../screenshots/t6-ipad-air-portrait.png)  

- Landscape:  
  ![iPad Landscape](../screenshots/t6-ipad-air-landscape.png)  

  
## Media Queries Validadas
-
  ![min-width: 320px](../screenshots/t6-media-querie-320px.png)  
  ![min-width: 481px](../screenshots/t6-media-querie-481px.png)  
  ![min-width: 768px](../screenshots/t6-media-querie-768px.png)  
  ![min-width: 866px](../screenshots/t6-media-querie-866px.png) 
  ![min-width: 1024px](../screenshots/t6-media-querie-1024px.png)  
  ![min-width: 1080px](../screenshots/t6-media-querie-1080px.png)    
 
- Otras media queries personalizadas presentes en `responsive.css`.  

- Mobile Portrait:  
  ![Mobile Portrait](../screenshots/device-portrait-mobile-320px.png)
- Mobile Landscape:  
  ![Mobile Landscape](../screenshots/device-landscape-mobile-320px.png)
  
- Tablet Portrait:  
  ![Tablet Portrait](../screenshots/device-portrait-tablet-768px.png)
- Tablet Landscape:  
  ![Tablet Landscape](../screenshots/device-landscape-tablet-768px.png)
  
- Desktop Portrait:  
  ![Desktop Portrait](../screenshots/device-portrait-desktop-1024px.png)
- Desktop Landscape:  
  ![Desktop Landscape](../screenshots/device-landscape-desktop-1024px.png)

---

## Sistema de Grillas de Bootstrap
### Validaciones
- Verificar que las clases `col-`, `col-sm-`, `col-md-`, `col-lg-`, etc. se adapten correctamente en cada resolución.  
- Confirmar que no haya **scroll horizontal no deseado en mobile**.  

### Capturas esperadas
1. **Mobile (iPhone 14 Pro, ~393px ancho)**  
   - Captura de una sección con distribución en **una sola columna (`col-12`)**.  
   - Confirmar ausencia de scroll horizontal.  
- Mobile Portrait:  
  ![Mobile Portrait](../screenshots/t6-iphone-14-pro-portrait-vet.png)  
- Mobile Landscape:  
  ![Mobile Landscape](../screenshots/t6-iphone-14-pro-landscape-hor.png)  
  
2. **Tablet (iPad Air, ~820px ancho)**  
   - Captura mostrando la **redistribución en 2 o 3 columnas (`col-md-*`)**.
   - 
- Tablet Portrait:  
  ![Tablet Portrait](../screenshots/t6-ipad-air-portrait-vet.png)  
- Tablet Landscape:  
  ![Tablet Landscape](../screenshots/t6-ipad-air-landscape-hor.png)  
  
3. **Desktop (>1024px)**  
   - Captura mostrando la distribución completa en múltiples columnas (`col-lg-*` o `col-xl-*`).  

- Desktop Portrait:  
  ![Desktop Portrait](../screenshots/t6-desktop-portrait-vet.png)  
- Desktop Landscape:  
  ![Desktop Landscape](../screenshots/t6-desktop-landscape-hor.png)  


---

## Performance en Mobile
### Validaciones
- Medir con **Lighthouse o PageSpeed** si no aumentó demasiado el tiempo de carga tras integrar Bootstrap.  
- Verificar el peso del **CSS cargado por CDN** y confirmar que no bloquee la renderización.  

### Capturas esperadas
1. **Reporte de Lighthouse / PageSpeed**  
   - Captura del resultado global (Performance, Accessibility, Best Practices, SEO).
   - Comparar resultados *antes y después* de la migración a Bootstrap.
     
   - Performance Mobile:  
     ![Performance Mobile](../screenshots/t6-mobile-performance.png)

   - Performance Desktop:  
   ![Performance Desktop](../screenshots/t6-desktop-performance.png)

2. **Detalle de recursos en Network (Chrome DevTools)**  
   - Captura mostrando el tamaño del archivo `bootstrap.min.css` cargado desde el CDN.  
     ![Bootstrap size](../screenshots/t6-boots-size.png)  
   - Confirmar que no aparezca como recurso bloqueante en la columna "Blocking".  

---

## Resultado Esperado
- El layout debe adaptarse correctamente en **mobile, tablet y desktop** sin pérdida de coherencia visual.  
- No debe existir **scroll horizontal inesperado** en mobile.  
- El impacto en **performance** debe ser mínimo y el CSS de Bootstrap debe cargarse correctamente desde el CDN.

----
## Issues encontrados
Durante la ejecución de este test se detectaron los siguientes problemas, documentados en el repositorio:  

| IssueID | Descripción 
|----|-------------|
| [#58](https://github.com/Thallys8/turismo-buenos-aires/issues/58) | Problemas de performance causador por el cargamento de las imágenes en dispositivos mobile |
test-case-6.md

Mostrando test-case-6.md
