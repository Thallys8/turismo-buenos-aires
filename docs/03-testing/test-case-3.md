# Test Case 3: Performance y Velocidad de Carga

## Objetivo
Evaluar el rendimiento de la página en términos de velocidad de carga y métricas Core Web Vitals.

## Herramientas Utilizadas
- Google PageSpeed Insights
- GTmetrix
- Chrome DevTools Lighthouse

## Capturas Requeridas
Se deben adjuntar **capturas de pantalla reales** de cada herramienta mostrando los resultados obtenidos. No se permite inventar datos.

1. **Google PageSpeed Insights**
   - Captura del puntaje de **Performance**.  
     ![Performance](../screenshots/pagespeed-performance.png)  
   - Captura de las métricas **FCP, LCP, CLS, FID**.  
     ![Metricas](../screenshots/pagespeed-metricas.png)  

2. **GTmetrix**
   - Captura del **GTmetrix Grade**.  
     ![GTmetrix Grade](../screenshots/gtmetrix.png)  
   - Captura de **Performance** y **Structure**.  
   - ![Performance](../screenshots/gtmetrix-performance.png)
     ![Structure](../screenshots/gtmetrix-structure.png)  
   - Captura de **Fully Loaded Time** y **Page Size**.  
   - ![Fully Loaded Time](../screenshots/gtmetrix-fully-loaded-time.png)
     ![Page Size](../screenshots/gtmetrix-page-size.png)  

3. **Chrome DevTools Lighthouse**
   - Captura del **report completo**.
   - Google Chrome versión 140
    ![Chrome DevTools Lighthouse](../screenshots/chrome-lighthouse.png)  

## Métricas Obtenidas
Se deben registrar los valores **tal como aparecen en las capturas**, por ejemplo:

### Google PageSpeed Insights
- **Performance Score:** 66/100
- **First Contentful Paint (FCP):** 0,2s
- **Largest Contentful Paint (LCP):** 6,5s
- **Cumulative Layout Shift (CLS):** 0.003
- **First Input Delay (FID):** 0ms

### GTmetrix Results
- **GTmetrix Grade:** A
- **Performance:** 100%
- **Structure:** 96%
- **Fully Loaded Time:** 1,2s
- **Page Size:** 1,64 MB

### Lighthouse Audit
![Lighthouse Report](../screenshots/lighthouse-report.png)

## Optimizaciones Implementadas
Se optimizo el tamaño de los assets utilizados en nuestro sistema para reducir la entrega de imagenes 
Issue relacionada: #47

## Comparativas Antes/Después
Todavía no se ha implementado optimizaciones.
