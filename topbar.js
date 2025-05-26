document.addEventListener('DOMContentLoaded', function() {
    // Manejar el menú desplegable del perfil
    const userProfile = document.querySelector('.user-profile');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (userProfile && dropdownMenu) {
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        // Cerrar el menú al hacer clic fuera
        document.addEventListener('click', function() {
            dropdownMenu.classList.remove('show');
        });
    }

    // Manejar la barra de búsqueda
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            // Aquí puedes implementar la lógica de búsqueda
            console.log('Buscando:', e.target.value);
        });
    }

    // Efecto de scroll en la barra superior
    window.addEventListener('scroll', function() {
        const topbar = document.querySelector('.topbar');
        if (topbar) {
            if (window.scrollY > 10) {
                topbar.classList.add('scrolled');
            } else {
                topbar.classList.remove('scrolled');
            }
        }
    });

    // Manejar notificaciones y mensajes (ejemplo)
    const icons = document.querySelectorAll('.icons i');
    icons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Aquí puedes implementar la lógica para cada icono
            console.log('Icono clickeado:', this.className);
        });
    });
}); 