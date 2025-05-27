// Función para generar el calendario
function generateCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDay = firstDay.getDay();
  const monthLength = lastDay.getDate();
  
  const calendar = document.querySelector('.calendar');
  calendar.innerHTML = '';

  // Agregar encabezados de días
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  days.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-day header';
    dayHeader.textContent = day;
    calendar.appendChild(dayHeader);
  });

  // Agregar espacios en blanco para los días antes del primer día del mes
  for (let i = 0; i < startingDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    calendar.appendChild(emptyDay);
  }

  // Agregar los días del mes
  for (let i = 1; i <= monthLength; i++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    dayDiv.innerHTML = `<span>${i}</span>`;
    
    // Aquí se agregarían los eventos del día si existen
    // Por ahora agregamos algunos eventos de ejemplo
    if (i === 4) {
      const event = document.createElement('div');
      event.className = 'calendar-event';
      event.textContent = 'Cita: Invernaderos Bonanza';
      dayDiv.appendChild(event);
    }
    if (i === 10) {
      const event = document.createElement('div');
      event.className = 'calendar-event';
      event.textContent = 'Llamada: Finca La Paloma';
      dayDiv.appendChild(event);
    }
    if (i === 19) {
      const event = document.createElement('div');
      event.className = 'calendar-event';
      event.textContent = 'Cita: Frutos de la Sierra';
      dayDiv.appendChild(event);
    }

    calendar.appendChild(dayDiv);
  }
}

// Variables para mantener el mes y año actual
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Función para actualizar el título del mes
function updateMonthTitle() {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  document.querySelector('.calendar-header h2').textContent = `${months[currentMonth]} ${currentYear}`;
}

// Event listeners para los botones de navegación
document.getElementById('prevMonth').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  updateMonthTitle();
  generateCalendar(currentYear, currentMonth);
});

document.getElementById('nextMonth').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  updateMonthTitle();
  generateCalendar(currentYear, currentMonth);
});

// Event listener para el botón de nueva cita
document.querySelector('.add-event-button').addEventListener('click', () => {
  // Aquí iría la lógica para abrir un modal o formulario para agregar nueva cita
  alert('Funcionalidad de agregar nueva cita en desarrollo');
});

// Inicializar el calendario
document.addEventListener('DOMContentLoaded', () => {
  updateMonthTitle();
  generateCalendar(currentYear, currentMonth);
});