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
Se optimizo el tamaño y resolucion de los assets utilizados en nuestro sistema para reducir los problemas durante la entrega de imagenes  
Issue relacionada: [#47](https://github.com/Thallys8/turismo-buenos-aires/issues/47)

## Comparativas Antes/Después
| Metrica | Antes | Despues |
|---|---|---|
| Performance | 70% | 95% |
| First Contentful Paint | 0.4s | 0.4s |
| Speed Index | 1.1s | 0.4s |
| Total Blocking Time | 810ms | 0ms |
| Largest Contentful Paint | 1.2s | 1.6s |
| Cumulative Layout Shift | 0.003 | 0.018s |
