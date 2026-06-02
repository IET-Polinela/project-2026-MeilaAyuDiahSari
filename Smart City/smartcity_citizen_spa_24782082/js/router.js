const routes = {
    '#login': `
        <div class="row justify-content-center mt-5">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card shadow-sm border-0 p-4">
                    <h4 class="text-center fw-bold mb-4">
                        <i class="bi bi-person-circle me-2"></i>
                        Login Warga
                    </h4>

                    <form id="loginForm">
                        <input
                            type="text"
                            id="loginUsername"
                            class="form-control mb-3"
                            placeholder="Username"
                            required
                        >

                        <input
                            type="password"
                            id="loginPassword"
                            class="form-control mb-3"
                            placeholder="Password"
                            required
                        >

                        <button
                            type="submit"
                            class="btn btn-primary w-100 fw-bold"
                        >
                            Masuk
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `,

    '#dashboard': `
        <div class="row g-4">
            <aside class="col-12 col-lg-3">
                <div class="card border-0 p-3 shadow-sm sticky-top" style="top: 20px;">
                    <button class="btn btn-primary btn-lg w-100 fw-bold mb-3">
                        <i class="bi bi-plus-circle-fill me-2"></i>
                        Laporan Baru
                    </button>

                    <div class="alert alert-info mb-0">
                        <i class="bi bi-info-circle-fill me-2"></i>
                        Portal ini digunakan untuk membuat dan memantau laporan warga.
                    </div>
                </div>
            </aside>

            <section class="col-12 col-lg-6">
                <div class="card border-0 p-5 shadow-sm text-center text-muted border-dashed">
                    <i class="bi bi-inbox fs-1"></i>
                    <h5 class="mt-3">Selamat Datang!</h5>
                    <p class="small">
                        Koneksi API untuk data laporan akan diimplementasikan pada Lab 12.
                    </p>
                </div>
            </section>

            <aside class="col-12 col-lg-3 d-none d-lg-block">
                <div class="card border-0 p-3 shadow-sm sticky-top" style="top: 20px;">
                    <h6 class="fw-bold">
                        <i class="bi bi-info-circle-fill text-primary me-2"></i>
                        Pengumuman
                    </h6>

                    <p class="small text-muted mb-0">
                        Gunakan akun warga untuk masuk ke Citizen Portal.
                    </p>
                </div>
            </aside>
        </div>
    `
};


function handleRouting() {
    const hash = window.location.hash || '#login';
    const appContent = document.getElementById('app-content');

    appContent.innerHTML = routes[hash] || routes['#login'];

    if (hash === '#login' && typeof setupLoginForm === 'function') {
        setupLoginForm();
    }
}


window.addEventListener('hashchange', handleRouting);
window.addEventListener('DOMContentLoaded', handleRouting);