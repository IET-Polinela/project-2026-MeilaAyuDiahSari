const routes = {
    '#login': `
        <div class="auth-wrapper">
            <div class="auth-card">
                <div class="text-center mb-4">
                    <h3 class="auth-title">
                        <i class="bi bi-box-arrow-in-right me-2"></i>
                        Masuk Portal Warga
                    </h3>
                    <p class="auth-subtitle">
                        Silakan masuk menggunakan akun citizen Anda.
                    </p>
                </div>

                <form id="loginForm">
                    <div class="mb-3">
                        <label for="loginUsername" class="form-label fw-semibold">
                            Username
                        </label>
                        <input
                            type="text"
                            id="loginUsername"
                            class="form-control auth-input"
                            placeholder="Masukkan username"
                            required
                        >
                    </div>

                    <div class="mb-4">
                        <label for="loginPassword" class="form-label fw-semibold">
                            Password
                        </label>
                        <input
                            type="password"
                            id="loginPassword"
                            class="form-control auth-input"
                            placeholder="Masukkan password"
                            required
                        >
                    </div>

                    <button
                        type="submit"
                        class="btn btn-primary w-100 fw-bold auth-main-btn"
                    >
                        Masuk
                    </button>
                </form>

                <p class="auth-link-text mt-4 mb-0">
                    Belum punya akun?
                    <a href="#register" class="auth-link">Daftar di sini</a>
                </p>
            </div>
        </div>
    `,

    '#register': `
        <div class="auth-wrapper">
            <div class="auth-card">
                <div class="text-center mb-4">
                    <h3 class="auth-title">
                        <i class="bi bi-person-plus-fill me-2"></i>
                        Daftar Akun Citizen
                    </h3>
                    <p class="auth-subtitle">
                        Buat akun untuk mulai mengirim dan memantau laporan.
                    </p>
                </div>

                <form id="registerForm">
                    <div class="mb-3">
                        <label for="registerUsername" class="form-label fw-semibold">
                            Username
                        </label>
                        <input
                            type="text"
                            id="registerUsername"
                            class="form-control auth-input"
                            placeholder="Masukkan username"
                            required
                        >
                    </div>

                    <div class="mb-3">
                        <label for="registerEmail" class="form-label fw-semibold">
                            Email
                        </label>
                        <input
                            type="email"
                            id="registerEmail"
                            class="form-control auth-input"
                            placeholder="Masukkan email"
                            required
                        >
                    </div>

                    <div class="mb-4">
                        <label for="registerPassword" class="form-label fw-semibold">
                            Password
                        </label>
                        <input
                            type="password"
                            id="registerPassword"
                            class="form-control auth-input"
                            placeholder="Masukkan password"
                            required
                        >
                    </div>

                    <button
                        type="submit"
                        class="btn btn-primary w-100 fw-bold auth-main-btn"
                    >
                        Daftar
                    </button>
                </form>

                <p class="auth-link-text mt-4 mb-0">
                    Sudah punya akun?
                    <a href="#login" class="auth-link">Masuk di sini</a>
                </p>
            </div>
        </div>
    `,

    '#dashboard': `
        <div class="row g-4">

            <aside class="col-12 col-lg-3">
                <div class="card border-0 p-3 shadow-sm sticky-top" style="top: 20px;">
                    <button
                        id="openReportModal"
                        class="btn btn-primary btn-lg w-100 fw-bold mb-3">
                        <i class="bi bi-plus-circle-fill me-2"></i>
                        Laporan Baru
                    </button>

                    <div class="summary-status-card">
                        <h6 class="summary-status-title">
                            <i class="bi bi-bar-chart-fill"></i>
                            Rekap Status
                        </h6>

                        <div class="summary-status-item">
                            <div class="summary-status-label">
                                <i class="bi bi-pencil-square icon-draft"></i>
                                <span>Draft</span>
                            </div>
                            <span id="statDraft" class="summary-status-badge badge-draft">0</span>
                        </div>

                        <div class="summary-status-item">
                            <div class="summary-status-label">
                                <i class="bi bi-send-fill icon-reported"></i>
                                <span>Diajukan</span>
                            </div>
                            <span id="statReported" class="summary-status-badge badge-reported">0</span>
                        </div>

                        <div class="summary-status-item">
                            <div class="summary-status-label">
                                <i class="bi bi-patch-check-fill icon-verified"></i>
                                <span>Diverifikasi</span>
                            </div>
                            <span id="statVerified" class="summary-status-badge badge-verified">0</span>
                        </div>

                        <div class="summary-status-item">
                            <div class="summary-status-label">
                                <i class="bi bi-gear-fill icon-progress"></i>
                                <span>Diproses</span>
                            </div>
                            <span id="statProgress" class="summary-status-badge badge-progress">0</span>
                        </div>

                        <div class="summary-status-item">
                            <div class="summary-status-label">
                                <i class="bi bi-check-circle-fill icon-done"></i>
                                <span>Selesai</span>
                            </div>
                            <span id="statDone" class="summary-status-badge badge-done">0</span>
                        </div>
                    </div>
                </div>
            </aside>

            <section class="col-12 col-lg-6">
                <div class="d-flex gap-2 mb-3">
                    <button
                        id="tabMyReports"
                        class="btn btn-primary tab-btn"
                        data-tab="my_reports">
                        <i class="bi bi-person-lines-fill me-1"></i>
                        Laporan Saya
                    </button>

                    <button
                        id="tabFeedKota"
                        class="btn btn-outline-secondary tab-btn"
                        data-tab="feed">
                        <i class="bi bi-rss-fill me-1"></i>
                        Feed Kota
                    </button>
                </div>

                <div class="search-wrapper mb-3">
                    <i class="bi bi-search search-icon"></i>
                    <input
                        type="text"
                        id="searchInput"
                        class="form-control search-input"
                        placeholder="Cari laporan berdasarkan judul, kategori, lokasi, status, atau deskripsi..."
                    >
                </div>

                <div id="reportList"></div>

                <div
                    id="pagination"
                    class="mt-3 d-flex justify-content-center gap-2">
                </div>
            </section>

            <aside class="col-12 col-lg-3 d-none d-lg-block">
                <div class="card border-0 p-3 shadow-sm sticky-top" style="top: 20px;">
                    <h6 class="fw-bold">
                        <i class="bi bi-info-circle-fill text-primary me-2"></i>
                        Informasi
                    </h6>

                    <p class="small text-muted mb-0">
                        Tab Laporan Saya menampilkan laporan milik warga.
                        Tab Feed Kota menampilkan laporan publik dari warga lain
                        yang sudah bukan DRAFT.
                    </p>
                </div>
            </aside>

        </div>
    `
};


function handleRouting() {
    const hash = window.location.hash || '#login';
    const appContent = document.getElementById('app-content');
    const accessToken = localStorage.getItem('access_token');

    // AUTH GUARD:
    // Kondisi 1: Tidak ada token → akses #dashboard → redirect ke #login
    if (!accessToken) {
        if (hash === '#dashboard') {
            window.location.hash = '#login';
            return;
        }
    }

    // Kondisi 2: Ada token → akses #login atau #register → redirect ke #dashboard
    if (accessToken) {
        if (hash === '#login' || hash === '#register') {
            window.location.hash = '#dashboard';
            return;
        }
    }

    appContent.innerHTML = routes[hash] || routes['#login'];

    if (hash === '#login' && typeof setupLoginForm === 'function') {
        setupLoginForm();
    }

    if (hash === '#register' && typeof setupRegisterForm === 'function') {
        setupRegisterForm();
    }

    if (hash === '#dashboard' && typeof initDashboard === 'function') {
        initDashboard();
    }
}


window.addEventListener('hashchange', handleRouting);
window.addEventListener('DOMContentLoaded', handleRouting);