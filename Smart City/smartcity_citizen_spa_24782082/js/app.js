function updateNavbar() {
    const navMenu = document.getElementById('nav-menu');
    const accessToken = localStorage.getItem('access_token');

    if (!navMenu) {
        return;
    }

    if (accessToken) {
        navMenu.innerHTML = `
            <button id="logoutBtn" class="btn btn-light btn-sm fw-bold">
                <i class="bi bi-box-arrow-right me-1"></i>
                Logout
            </button>
        `;

        document.getElementById('logoutBtn').addEventListener('click', function() {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');

            alert('Logout berhasil.');
            window.location.hash = '#login';
            updateNavbar();
        });
    } else {
        navMenu.innerHTML = `
            <a href="#login" class="btn btn-light btn-sm fw-bold">
                <i class="bi bi-box-arrow-in-right me-1"></i>
                Login
            </a>
        `;
    }
}


window.addEventListener('DOMContentLoaded', updateNavbar);
window.addEventListener('hashchange', updateNavbar);