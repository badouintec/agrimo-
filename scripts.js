document.addEventListener("DOMContentLoaded", () => {
    // =======================================
    // 1. SCROLL SUAVE Y RESALTADO DEL MENÚ (opcional)
    // =======================================
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".scroll-link");
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === "#" + id) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      { threshold: 0.3 }
    );
    
    sections.forEach((section) => observer.observe(section));
    
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        document.getElementById(targetId).scrollIntoView({ behavior: "smooth" });
      });
    });
    
    // =======================================
    // 2. INICIALIZACIÓN DEL MAPA
    // =======================================
    const map = L.map("map").setView([23.634501, -102.552784], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);
    
    // Variables globales para la carga del GeoJSON
    let geojsonLayer = null;
    let geojsonData = null;
    
    // Función para actualizar la capa GeoJSON en el mapa
    function updateGeoJSONLayer(data) {
      if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
      }
      geojsonLayer = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          // Personaliza el marcador según prioridad de venta
          let color = "#1d5c59";
          if (feature.properties.prioridad_venta === "Alta") {
            color = "#1d5c59";
          } else if (feature.properties.prioridad_venta === "Baja") {
            color = "#C62828";
          }
          return L.circleMarker(latlng, {
            radius: 8,
            fillColor: color,
            color: "#fff",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
        },
        onEachFeature: function (feature, layer) {
          const props = feature.properties;
          // Recordando que en GeoJSON, las coordenadas vienen en [lng, lat]
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
        },
      }).addTo(map);
    }
    
    // Función para actualizar la lista de clientes en el dashboard
    function updateClientesList(features) {
      const clientesUl = document.getElementById("clientesUl");
      if (!clientesUl) return;
      clientesUl.innerHTML = "";
      features.forEach((feature) => {
        const li = document.createElement("li");
        li.innerText = feature.properties.nom_estab;
        clientesUl.appendChild(li);
      });
    }
    
    // Función para cargar el GeoJSON
    function loadGeoJSON() {
      fetch("nube.geojson")
        .then((response) => response.json())
        .then((data) => {
          geojsonData = data;
          updateGeoJSONLayer(data);
          updateClientesList(data.features);
        })
        .catch((err) => console.error("Error cargando el GeoJSON:", err));
    }
    
    loadGeoJSON();
    
    // =======================================
    // 3. FILTROS BASADOS EN GEOJSON
    // =======================================
    const filterEstado = document.getElementById("filterEstado");
    const filterPrioridad = document.getElementById("filterPrioridad");
    const applyFiltersBtn = document.getElementById("applyFiltersBtn");
    
    function applyFilters() {
      if (!geojsonData) return;
      const estadoValor = filterEstado ? filterEstado.value : "";
      const prioridadValor = filterPrioridad ? filterPrioridad.value : "";
    
      const filteredFeatures = geojsonData.features.filter((feature) => {
        const props = feature.properties;
        const matchEstado = estadoValor ? props.estado === estadoValor : true;
        const matchPrioridad = prioridadValor ? props.prioridad_venta === prioridadValor : true;
        return matchEstado && matchPrioridad;
      });
    
      const filteredGeoJSON = {
        type: "FeatureCollection",
        features: filteredFeatures,
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
    
    // =======================================
    // 4. KPI y GRÁFICA CON CHART.JS
    // =======================================
    if (document.getElementById("kpiLitros") && document.getElementById("chartAhorro")) {
      animarKPI("kpiLitros", 3500, 2000);
      const ctx = document.getElementById("chartAhorro").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
          datasets: [
            {
              label: "Litros Ahorrados",
              data: [500, 800, 1200, 1800, 2700, 3500],
              borderColor: "#1d5c59",
              backgroundColor: "rgba(29, 92, 89, 0.2)",
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 4,
              pointBackgroundColor: "#1d5c59",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 1500 },
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "Litros" } },
            x: { title: { display: true, text: "Mes" } },
          },
          plugins: { legend: { display: false } },
        },
      });
    }
    
    // =======================================
    // 5. CHATBOT FALSO
    // =======================================
    const chatbotBtn = document.getElementById("chatbotBtn");
    const chatbotWindow = document.getElementById("chatbotWindow");
    const closeChatbot = document.getElementById("closeChatbot");
    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const sendChatBtn = document.getElementById("sendChatBtn");
    
    let chatbotOpen = false;
    if (chatbotBtn) {
      chatbotBtn.addEventListener("click", () => {
        chatbotOpen = !chatbotOpen;
        chatbotWindow.style.display = chatbotOpen ? "flex" : "none";
      });
    }
    if (closeChatbot) {
      closeChatbot.addEventListener("click", () => {
        chatbotOpen = false;
        chatbotWindow.style.display = "none";
      });
    }
    if (sendChatBtn && chatInput) {
      sendChatBtn.addEventListener("click", sendMessage);
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendMessage();
      });
    }
    function sendMessage() {
      const msg = chatInput.value.trim();
      if (!msg) return;
      const userMsg = document.createElement("div");
      userMsg.classList.add("chat-message", "user");
      userMsg.innerText = msg;
      chatMessages.appendChild(userMsg);
      chatInput.value = "";
      const botMsg = document.createElement("div");
      botMsg.classList.add("chat-message", "bot");
      botMsg.innerText = "Este es un chatbot ficticio. En una versión real, podría ayudarte con tus dudas.";
      chatMessages.appendChild(botMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Función para abrir el modal de Demo Login
    window.abrirModalLogin = function() {
      document.getElementById("modalLogin").style.display = "flex";
    };

    // Función para cerrar el modal de Demo Login
    window.cerrarModalLogin = function() {
      document.getElementById("modalLogin").style.display = "none";
    };

    // Función para validar el login y redirigir a home.html
    window.demoLogin = function(e) {
      e.preventDefault();
      const user = document.getElementById("loginUser").value;
      const pass = document.getElementById("loginPass").value;
      if (user === "user" && pass === "user") {
        alert("Login exitoso.");
        window.location.href = "home.html";
      } else {
        alert("Usuario o contraseña incorrectos.");
      }
      return false;
    };

    // Evita que al hacer clic dentro del contenido del modal se cierre automáticamente
    const modalContent = document.getElementById("demoLoginModal");
    if (modalContent) {
      modalContent.addEventListener("click", function(e) {
        e.stopPropagation();
      });
    }

    // Opcional: Si deseas que al hacer clic fuera del contenido se cierre el modal
    const modal = document.getElementById("modalLogin");
    if (modal) {
      modal.addEventListener("click", function(e) {
        if (e.target === modal) {
          cerrarModalLogin();
        }
      });
    }

    // Nuevo: Ajustar transparencia del topbar al hacer scroll
    const topbar = document.getElementById("topbarSection");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        topbar.classList.add("scrolled");
      } else {
        topbar.classList.remove("scrolled");
      }
    });
  });
  
  // =======================================
  // FUNCIONES EXTERNAS
  // =======================================
  
  // Animar el KPI (conteo ascendente)
  function animarKPI(elementId, endValue, duration) {
    let startValue = 0;
    const increment = endValue / (duration / 16);
    const obj = document.getElementById(elementId);
    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= endValue) {
        startValue = endValue;
        clearInterval(timer);
      }
      obj.textContent = Math.floor(startValue);
    }, 16);
  }
  
  // Funciones para modales de cursos/detalles
  function abrirModalCurso(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
      modal.style.display = "flex";
    }
  }
  function cerrarModalCurso(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
      modal.style.display = "none";
    }
  }
  
  // Funciones para popups de alertas
  function mostrarAlerta(titulo) {
    document.getElementById("tituloAlerta").innerText = titulo;
    document.getElementById("overlayAlerta").style.display = "flex";
  }
  function cerrarAlerta() {
    document.getElementById("overlayAlerta").style.display = "none";
  }
  
  // =======================================
  // FUNCIONES PARA EL MODAL DE PROPUESTA DE VENTA
  // =======================================
  let salesStatus = {}; // Guarda estado de venta por id
  function openProposalModal(companyId) {
    window.currentCompanyId = companyId;
    // Aquí puedes buscar más información en tu geojsonData si lo necesitas
    document.getElementById("proposalCompanyName").innerText = "Empresa " + companyId;
    document.getElementById("saleStatusText").innerText = salesStatus[companyId] || "Pendiente";
    document.getElementById("proposalModal").style.display = "flex";
  }
  window.openProposalModal = openProposalModal;
  
  const closeProposalModalBtn = document.getElementById("closeProposalModal");
  if (closeProposalModalBtn) {
    closeProposalModalBtn.addEventListener("click", () => {
      document.getElementById("proposalModal").style.display = "none";
    });
  }
  window.addEventListener("click", (e) => {
    if (e.target === document.getElementById("proposalModal")) {
      document.getElementById("proposalModal").style.display = "none";
    }
  });
  
  const markSaleClosedBtn = document.getElementById("markSaleClosedBtn");
  if (markSaleClosedBtn) {
    markSaleClosedBtn.addEventListener("click", () => {
      if (window.currentCompanyId) {
        salesStatus[window.currentCompanyId] = "Cerrado";
        document.getElementById("saleStatusText").innerText = "Cerrado";
      }
    });
  }
  const markSalePendingBtn = document.getElementById("markSalePendingBtn");
  if (markSalePendingBtn) {
    markSalePendingBtn.addEventListener("click", () => {
      if (window.currentCompanyId) {
        salesStatus[window.currentCompanyId] = "Pendiente";
        document.getElementById("saleStatusText").innerText = "Pendiente";
      }
    });
  }

  function redirectToHome() {
    window.location.href = "home.html";
  }

// Función para el scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Efecto fade-in para elementos
const fadeInElements = document.querySelectorAll('.fade-in, .dashboard-details, .contacto, .equipo-container');
function handleScroll() {
  fadeInElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.classList.add('show');
    }
  });
}
window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);

// Lógica para el modal Dashboard
document.getElementById("btnDashboard")?.addEventListener("click", () => {
  document.getElementById("dashboardModal").style.display = "flex";
});
document.getElementById("closeDashboardModal")?.addEventListener("click", () => {
  document.getElementById("dashboardModal").style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === document.getElementById("dashboardModal")) {
    document.getElementById("dashboardModal").style.display = "none";
  }
});

// Cargar CSV con clientes reales y actualizar lista y alertas
Papa.parse("clientes_potenciales_fertilizantes_enhanced.csv", {
  download: true,
  header: true,
  complete: function(results) {
    const data = results.data;
    // Actualizar lista de clientes potenciales
    const clientesUl = document.getElementById("clientesUl");
    if (clientesUl) {
      clientesUl.innerHTML = "";
      data.forEach(item => {
        const li = document.createElement("li");
        li.innerText = `${item.nom_estab} (${item.entidad})`;
        clientesUl.appendChild(li);
      });
    }
    // Actualizar alertas con los tres primeros clientes
    const alertsContainer = document.querySelector(".alerts");
    if (alertsContainer && data.length >= 3) {
      alertsContainer.innerHTML = `
        <h2>Notificaciones</h2>
        <div class="alert-item">
          <p><strong>OFICINAS ADMINISTRATIVAS DE INVERNADEROS BONANZA 2001 (Jalisco)</strong><br>Cliente respondió y agendó cita.</p>
          <button onclick="mostrarAlerta('OFICINAS ADMINISTRATIVAS DE INVERNADEROS BONANZA 2001 (Jalisco)')">Ver Detalles</button>
        </div>
        <div class="alert-item">
          <p><strong>${data[1].nom_estab}</strong> (${data[1].entidad})<br>Cliente confirmó interés.</p>
          <button onclick="mostrarAlerta('${data[1].nom_estab} (${data[1].entidad})')">Ver Detalles</button>
        </div>
        <div class="alert-item">
          <p><strong>${data[2].nom_estab}</strong> (${data[2].entidad})<br>Cliente solicita seguimiento.</p>
          <button onclick="mostrarAlerta('${data[2].nom_estab} (${data[2].entidad})')">Ver Detalles</button>
        </div>
      `;
    }
  }
});

document.addEventListener("DOMContentLoaded", function() {
  handleScroll(); // Llamar a handleScroll al cargar para que los elementos visibles se animen
  
  // Confirmar envío del formulario de contacto
  document.getElementById("contactForm")?.addEventListener("submit", function(e) {
    e.preventDefault();
    alert("¡Gracias por tu mensaje! Te contactaremos pronto.");
    this.reset();
  });
});

// Active nav link highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

const observerOptions = {
  root: null,
  rootMargin: '-50% 0px -50% 0px',
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));