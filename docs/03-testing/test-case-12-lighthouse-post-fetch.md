Test Case 12: Auditoría Lighthouse - Post Fetch/API 
## Información General 
- **Fecha de ejecución:** [25/11/2025] 
- **URL testeada:** [[URL de GitHub Pages](https://thallys8.github.io/turismo-buenos-aires/)] 
- **Rama:** develop (con feature/dev-async-fetch-api integrada) 
- **Cambios implementados:** 
- Consumo de API [nombre] con fetch 
- Procesamiento asíncrono de datos 
- Actualización dinámica del DOM

## Resultados Obtenidos 

### Performance: [73] 
- First Contentful Paint: [0.6s] 
- Largest Contentful Paint: [1.4s] 
- Total Blocking Time: [0ms] 
- Cumulative Layout Shift: [0.8] 
- Speed Index: [0.6s] 

![Captura Performance](./screenshots/lighthouse-post-fetch-performance.png)

### Accessibility: [100] 
- [Listar problemas encontrados] 
![Captura Accessibility](./screenshots/lighthouse-post-fetch-accessibility.png) 

### Best Practices: [96] 
- [Listar observaciones] 

### SEO: [91] 
- [Listar observaciones]

## Comparación con Baseline 
| Métrica | Baseline | Post-Fetch | Diferencia | 
|---------|----------|------------|------------| 
| Performance | 73 | 73 | 0 ✅ | 
| Accessibility | 100 | 100 | 0 ✅ | 
| Best Practices | 96 | 96 | 0 ✅ | 
| SEO | 91 | 91 | 0 ✅ | 

### Análisis de Impacto
- **Performance:** No identificamos perdida de rendimiento.  
- **Recomendaciones:** 
    - El redimiento ya está por debajo del minim exigido, que es de 80.  

## Issues Generadas 
- [#124] Optimizar tamaño de imágenes para mejorar LCP y CLS (mimdo issue del test case 11 por tratarse del mismo problema).  

## Conclusiones 
[Identificamos que no hubo cambios del rendimiento, pero que la performanse sigue por de bajo del minimo exigido].  