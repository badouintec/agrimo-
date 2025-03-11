// mapa.js
document.addEventListener("DOMContentLoaded", () => {
    // =======================================
    // INICIALIZACIÓN DEL MAPA
    // =======================================
    const map = L.map("map").setView([23.634501, -102.552784], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // =======================================
    // FUNCION PARA ACTUALIZAR LISTA DE CLIENTES
    // =======================================
    function updateClientesList(features) {
      const clientesUl = document.getElementById("clientesUl");
      if (clientesUl) {
        clientesUl.innerHTML = "";
        features.forEach(feature => {
          const props = feature.properties;
          const li = document.createElement("li");
          li.innerText = `${props.nom_estab} (${props.entidad})`;
          clientesUl.appendChild(li);
        });
      }
    }
    
    // =======================================
    // CARGA DEL ARCHIVO GEOJSON
    // =======================================
    let geojsonLayer = null;
    let geojsonData = null;
    
    function updateGeoJSONLayer(data) {
      if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
      }
      geojsonLayer = L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
          let color = "#4CAF50";
          if (feature.properties.prioridad_venta === "Alta") {
            color = "#1B5E20";
          } else if (feature.properties.prioridad_venta === "Baja") {
            color = "#C62828";
          }
          return L.circleMarker(latlng, {
            radius: 8,
            fillColor: color,
            color: "#fff",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
        },
        onEachFeature: function(feature, layer) {
          const props = feature.properties;
          const lat = feature.geometry.coordinates[1];
          const lng = feature.geometry.coordinates[0];
          layer.bindPopup(`
            <b>ID:</b> ${props.id}<br>
            <b>Establecimiento:</b> ${props.nom_estab}<br>
            <b>Razón Social:</b> ${props.raz_social}<br>
            <b>Actividad:</b> ${props.nombre_act}<br>
            <b>Teléfono:</b> ${props.telefono}<br>
            <b>Correo:</b> ${props.correoelec}<br>
            <b>Página Web:</b> ${props.www ? props.www : "No disponible"}<br>
            <b>Entidad:</b> ${props.entidad}<br>
            <b>Municipio:</b> ${props.municipio}<br>
            <b>Localidad:</b> ${props.localidad}<br>
            <b>Coordenadas:</b> ${lat}, ${lng}<br><br>
            <button onclick="openProposalModal(${props.id})">Generar Propuesta</button>
          `);
        }
      }).addTo(map);
    }
    
    function loadGeoJSON() {
      fetch("nube.geojson")
        .then(response => response.json())
        .then(data => {
          geojsonData = data;
          updateGeoJSONLayer(data);
          updateClientesList(data.features);
        })
        .catch(err => console.error("Error cargando el GeoJSON:", err));
    }
    
    loadGeoJSON();
    
    // =======================================
    // FILTROS BASADOS EN GEOJSON
    // =======================================
    const filterEstado = document.getElementById("filterEstado");
    const filterPrioridad = document.getElementById("filterPrioridad");
    const applyFiltersBtn = document.getElementById("applyFiltersBtn");
    
    function applyFilters() {
      if (!geojsonData) return;
      const estadoValor = filterEstado ? filterEstado.value : "";
      const prioridadValor = filterPrioridad ? filterPrioridad.value : "";
      const filteredFeatures = geojsonData.features.filter(feature => {
        const props = feature.properties;
        const matchEstado = estadoValor ? props.estado === estadoValor : true;
        const matchPrioridad = prioridadValor ? props.prioridad_venta === prioridadValor : true;
        return matchEstado && matchPrioridad;
      });
      const filteredGeoJSON = {
        type: "FeatureCollection",
        features: filteredFeatures
      };
      updateGeoJSONLayer(filteredGeoJSON);
      updateClientesList(filteredFeatures);
    }
    
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener("click", applyFilters);
    }
    if (filterEstado) {
      filterEstado.addEventListener("change", applyFilters);
    }
    if (filterPrioridad) {
      filterPrioridad.addEventListener("change", applyFilters);
    }
    
    // Resto de funciones y scripts (KPI, modales, chatbot, etc.) se mantienen igual.
    // ...
    
    // 4. Leyenda de Colores (esquina inferior derecha)
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      const div = L.DomUtil.create("div", "map-legend");
      div.innerHTML = `
        <strong>Prioridad de Venta</strong><br/>
        <i style="background:#C62828; width:12px; height:12px; display:inline-block; margin-right:4px;"></i>Alta<br/>
        <i style="background:#FDD835; width:12px; height:12px; display:inline-block; margin-right:4px;"></i>Media<br/>
        <i style="background:#4CAF50; width:12px; height:12px; display:inline-block; margin-right:4px;"></i>Baja<br/>
      `;
      return div;
    };
    legend.addTo(map);
  
    // Agregar marcadores para puntos de venta o clientes importantes
    L.marker([19.4326, -99.1332]).addTo(map)
      .bindPopup('CDMX: 42 ventas')
      .openPopup();
      
    L.marker([25.6866, -100.3161]).addTo(map)
      .bindPopup('Monterrey: 28 ventas');
      
    L.marker([20.6597, -103.3496]).addTo(map)
      .bindPopup('Guadalajara: 35 ventas');
  
    // Podrías agregar más lógica (CSV, KPI, etc.) en este mismo archivo o en scripts.js
  });
  
  .map-container {
    margin-top: 1rem;
    height: 350px;
    border: 1px solid #ccc;
    border-radius: 6px;
    overflow: hidden;
  }
  
  #map {
    width: 100%;
    height: 100%;
  }