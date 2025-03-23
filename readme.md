# Agrimonitor 🚜📈

Este proyecto es un tablero de ventas para el sector agrícola, diseñado para ayudar a los agentes de ventas a visualizar datos, filtrar clientes potenciales y consultar estadísticas, gráficos y alertas en tiempo real.

## Contenido del Proyecto

- **home.html** 🏠  
  Este archivo es la página principal del tablero.  
  - Incluye la estructura HTML de la interfaz del usuario.
  - Presenta secciones para la barra lateral (sidebar) con el menú de navegación.
  - En la sección principal se muestran: filtros (para segmentar clientes potenciales), un mapa interactivo, un calendario de citas, KPIs y gráficos de ventas.
  - Además, incorpora modales para mostrar detalles, cursos de ventas y una ventana emergente para alertas.
  - Se usan varias librerías externas como **Leaflet** para el mapa, **Chart.js** para la gráfica, **PapaParse** para parsear CSV y **Font Awesome** para los íconos.

- **mapa.js** 🗺️  
  Este archivo gestiona la funcionalidad del mapa interactivo.  
  - Se inicializa el mapa con **Leaflet** y se establece la vista central.
  - Se carga un archivo GeoJSON (nube.geojson) para mostrar la localización de clientes según sus propiedades.
  - Implementa funciones para actualizar el mapa, filtrar los datos con base a 3 filtros (Estado, Prioridad y Canal), y actualizar la lista de clientes potenciales.
  - También se añaden marcadores extra y una leyenda en el mapa.
  
## Flujo de la Aplicación

1. **Inicialización**:  
   Al cargarse la página (`home.html`), se invoca el script `mapa.js` que inicializa el mapa y carga los datos de `nube.geojson`.  
   🌟 **Evento DOMContentLoaded** garantiza que el DOM esté listo antes de ejecutar el JavaScript.

2. **Carga de Datos**:  
   El archivo `mapa.js` usa `fetch` para leer el archivo GeoJSON, el cual contiene la información de clientes potenciales (coordenadas, propiedades, etc.).  
   📥 Los resultados se usan para actualizar el mapa y la lista de clientes.

3. **Filtros y Actualización**:  
   Se implementan filtros (Estado, Prioridad y Canal) para segmentar la visualización de los datos en el mapa.  
   🔍 Al cambiar los filtros, se vuelve a renderizar el mapa con solo la información filtrada.

4. **Componentes Adicionales**:  
   La aplicación también muestra KPIs, gráficos de evolución de ventas mediante **Chart.js** y modales para cursos y detalles de clientes.  
   💡 Los pop-ups y modales se utilizan para ofrecer más información sin salir de la página.

## Tecnologías Utilizadas

- **HTML5 & CSS3**: Estructura y estilos de la interfaz.
- **JavaScript**: Lógica de la aplicación.
- **Leaflet**: Mapa interactivo.
- **Chart.js**: Visualización de datos (gráficos).
- **PapaParse**: Parseo de archivos CSV.
- **Font Awesome**: Íconos vectoriales.

¡Disfruta de Agrimonitor y optimiza la gestión de tus ventas agrícolas! 🌱🚀
