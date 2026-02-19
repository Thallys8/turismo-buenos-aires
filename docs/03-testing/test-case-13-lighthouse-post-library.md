Test Case 13: Auditoría Lighthouse - Post Library 
## Información General 
- **Fecha de ejecución:** [25/11/2025] 
- **URL testeada:** [[URL de GitHub Pages](https://thallys8.github.io/turismo-buenos-aires/)] 
- **Rama:** develop (con feature/dev-libreria-externa integrada) 
- **Cambios implementados:** 
- Consumo de API [nombre] con fetch 
- Procesamiento asíncrono de datos 
- Actualización dinámica del DOM

## Resultados Obtenidos Desktop

### Performance: [97] 
- First Contentful Paint: [0.6s] 
- Largest Contentful Paint: [1.2s] 
- Total Blocking Time: [0ms] 
- Cumulative Layout Shift: [0] 
- Speed Index: [0.8s] 

![Captura Performance](./screenshots/lighthouse-post-library-performance.png)

### Accessibility: [100] 
- [Listar problemas encontrados] 
![Captura Accessibility](./screenshots/lighthouse-post-library-accessibility.png) 

### Best Practices: [96] 
- [Listar observaciones] 

### SEO: [91] 
- [Listar observaciones]

## Comparación con Baseline 
|    Métrica     | Post-Fetch | Post-Library | Diferencia | 
|----------------|------------|--------------|------------| 
| Performance    |     73     |      97      |   +24 ✅   | 
| Accessibility  |    100     |     100      |    0 ✅    | 
| Best Practices |     96     |      96      |    0 ✅    | 
| SEO            |     91     |      91      |    0 ✅    | 

### Análisis de Impacto
- **Performance:** Hubo un incremento considerable del redimiento despues de las prubas con Post-Feth y Post Library. 
- **Recomendaciones:** 
    - La página responde dentro de los paramentros exigidos. 



## Resultados Obtenidos Mobile

### Performance: [61] 
- First Contentful Paint: [2.0s] 
- Largest Contentful Paint: [4.3s] 
- Total Blocking Time: [0ms] 
- Cumulative Layout Shift: [0.66] 
- Speed Index: [2.0s] 

![Captura Performance Mobile](./screenshots/lighthouse-post-library-performance-mobile.png)

### Accessibility: [100] 
- [Listar problemas encontrados] 
![Captura Accessibility Mobile](./screenshots/lighthouse-post-library-accessibility-mobile.png) 

### Best Practices: [96] 
- [Listar observaciones] 
![Captura Best Practices Mobile](./screenshots/lighthouse-post-library-best-practices-mobile.png) 

### SEO: [91] 
- [Listar observaciones]
![Captura SEO Mobile](./screenshots/lighthouse-post-library-seo-mobile.png) 

## Comparación con Baseline 
|    Métrica     | Post-Fetch | Post-Library | Diferencia | 
|----------------|------------|--------------|------------| 
| Performance    |     72     |      61      |   -11 ❌   | 
| Accessibility  |    100     |     100      |    0 ✅    | 
| Best Practices |     96     |      96      |    0 ✅    | 
| SEO            |     91     |      91      |    0 ✅    | 

### Análisis de Impacto
- **Performance:** Hubo un incremento considerable del redimiento despues de las prubas con Post-Feth y Post Library. 
- **Recomendaciones:** 
    - La página responde dentro de los paramentros exigidos. 

## Issues Generadas 
### Issue #[130]([Desarrolador html] Adecuación de imagenes para mejorar desipeño Mobile)

## Conclusiones 
- [En la pueba Desktop realizada después de la implementación de la Post-Library la pagina respondió dentro de los parametros exigidos].  
- [En la pueba Mobile realizada después de la implementación de la Post-Library la performance de pagina se ve afectada y debe de ser corrigida por medio de adecuación en cargar los imagenes.]. 