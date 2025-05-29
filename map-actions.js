document.addEventListener('DOMContentLoaded', () => {
  // Referencias a los botones
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const centerMapBtn = document.getElementById('centerMapBtn');
  const filterBtn = document.getElementById('filterBtn');
  const exportBtn = document.getElementById('exportBtn');
  const refreshBtn = document.getElementById('refreshBtn');

  // Coordenadas del centro del mapa (México)
  const defaultCenter = [23.634501, -102.552784];
  const defaultZoom = 5;

  // Funcionalidad de zoom
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      if (map) {
        map.setZoom(map.getZoom() + 1);
      }
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      if (map) {
        map.setZoom(map.getZoom() - 1);
      }
    });
  }

  // Centrar mapa
  if (centerMapBtn) {
    centerMapBtn.addEventListener('click', () => {
      if (map) {
        map.setView(defaultCenter, defaultZoom);
      }
    });
  }

  // Mostrar/ocultar filtros
  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      const filterContainer = document.querySelector('.filter-container');
      if (filterContainer) {
        filterContainer.style.display = filterContainer.style.display === 'none' ? 'flex' : 'none';
        filterBtn.classList.toggle('active');
      }
    });
  }

  // Exportar datos
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (!geojsonData) return;
      
      const dataStr = JSON.stringify(geojsonData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = 'clientes_data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  }

  // Actualizar datos
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      refreshBtn.classList.add('active');
      const rotateAnimation = [
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(360deg)' }
      ];
      const rotateOptions = {
        duration: 1000,
        iterations: 1
      };
      refreshBtn.querySelector('i').animate(rotateAnimation, rotateOptions);
      
      if (typeof loadGeoJSON === 'function') {
        loadGeoJSON().then(() => {
          setTimeout(() => {
            refreshBtn.classList.remove('active');
          }, 1000);
        });
      }
    });
  }

  // Añadir tooltips a los botones
  const mapActionButtons = document.querySelectorAll('.map-action-button');
  mapActionButtons.forEach(button => {
    const tooltip = button.querySelector('.map-action-tooltip');
    if (tooltip) {
      button.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
      });
      button.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
      });
    }
  });
}); 