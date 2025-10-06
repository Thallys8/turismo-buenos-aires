# Test Case 9: Responsive – Implementación de Componente Avanzado HTML (1)

## Objetivo
Validar la integración, compatibilidad y comportamiento responsive del primer componente avanzado HTML implementado que es un mapa con la localizacion registrada de la atraccion turista en diferentes dispositivos y navegadores.  

## Herramientas Utilizadas
- BrowserStack Mobile Testing  
- Chrome DevTools Device Mode  
- Google PageSpeed Insights  
- Can I Use (verificación de compatibilidad por navegador)  
- W3C HTML Validator (validación de estándares HTML5)  

## Dispositivos Probados
| Dispositivo       | Resolución | Navegador | Orientación         | Resultado |
|-------------------|------------|-----------|---------------------|-----------|
| iPhone 14 Pro     | 393x852    | Safari    | Portrait/Landscape  | ✅/❌ |
| Galaxy S23        | 360x780    | Chrome    | Portrait/Landscape  | ✅/❌ |
| iPad Air          | 820x1180   | Safari    | Portrait/Landscape  | ✅/❌ |
| Desktop (Laptop)  | >1024px    | Chrome    | Landscape           | ✅/❌ |

## Breakpoints Verificados
- **Mobile:** 320px – 768px  
- **Tablet:** 768px – 1024px  
- **Desktop:** 1024px+  

---

## Validaciones específicas @TODO
- Confirmar que el componente HTML se adapte a diferentes resoluciones de pantalla.  
- Verificar que **no genere scroll horizontal indeseado**.  
- Validar compatibilidad de controles (play, pause, zoom, interacción táctil).  
- Revisar si el contenido embebido se adapta correctamente al **sistema de grillas de Bootstrap**.  
- Chequear que los estilos personalizados en `css/styles.css`, `css/components.css` y `css/bootstrap-overrides.css` mantengan coherencia visual con el resto del proyecto.  

---

## Uso de herramientas de compatibilidad y validación @TODO
- **Can I Use:** Verificar compatibilidad del componente HTML con navegadores principales (ej: Safari iOS, Chrome Android, Edge, Firefox).  
  **Capturas necesarias:**  
  1. Pantalla de resultados de [caniuse.com](https://caniuse.com) mostrando la tabla de soporte del componente.  
  2. Evidencia de compatibilidad o limitaciones (ej: íconos verdes/rojos).  

- **W3C HTML Validator:** Validar que la implementación del componente sea conforme a HTML5 y no genere errores o warnings de semántica.  
  **Capturas necesarias:**  
  1. Resultado del validador con el mensaje **“Document checking completed. No errors or warnings to show.”** en caso de éxito.  
  2. En caso de errores: listado de errores y warnings reportados.  

---

## Performance en Mobile @TODO
- Medir el impacto del componente en la **performance total de la página** con PageSpeed.  
  **Capturas necesarias:**  
  1. Resultados del test de Google PageSpeed para **mobile**.  
  2. Gráfico de puntuación general (Performance, Accessibility, Best Practices, SEO).  

- Confirmar que los recursos cargados (ej: scripts de YouTube o mapas) no bloqueen renderización.  
  **Capturas necesarias:**  
  1. Sección de “Opportunities” y “Diagnostics” de PageSpeed donde se evidencie si hay recursos de bloqueo de renderizado.  
  2. Comparación del **First Contentful Paint (FCP)** y **Largest Contentful Paint (LCP)** antes y después de agregar el componente.  

---

## Capturas esperadas @TODO
1. **Mobile (iPhone 14 Pro y Galaxy S23)** mostrando el componente adaptado en portrait y landscape.  
2. **Tablet (iPad Air)** verificando correcta visualización e interacción.  
3. **Desktop** confirmando la visualización completa y sin pérdida de funcionalidades.  
4. **Prueba de interacción táctil** (ej: reproducir video, mover mapa, usar controles).  
5. **Reporte Lighthouse/PageSpeed** confirmando que no hubo degradación significativa de performance.  
6. **Reporte W3C Validator** mostrando documento validado sin errores críticos.  

---

## Resultado Esperado @TODO
- El componente HTML se adapta y funciona correctamente en todos los dispositivos probados.  
- Mantiene la coherencia del diseño e integración con Bootstrap.  
- No afecta de forma crítica la performance en mobile.  
- Es compatible con los principales navegadores según **Can I Use** y válido según **W3C HTML Validator**.  

---

## Issues encontrados @TODO
Registrar aquí los problemas detectados y su correspondiente issue en el repositorio:  

| IssueID | Descripción 
|----|-------------|
| [#101](https://github.com/tu-org/tu-repo/issues/101) | Ejemplo: Iframe no escala en versión mobile (iPhone 14 Pro) 