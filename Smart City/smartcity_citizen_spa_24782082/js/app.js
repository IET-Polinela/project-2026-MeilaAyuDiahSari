let currentTab = 'my_reports';
let currentPage = 1;
let editingReportId = null;
let dashboardRefreshInterval = null;
let currentReports = [];
let currentSearchKeyword = '';


function updateNavbar() {
    const navMenu = document.getElementById('nav-menu');
    const accessToken = localStorage.getItem('access_token');

    if (!navMenu) {
        return;
    }

    if (accessToken) {
        const username = localStorage.getItem('current_username') || 'Warga';

        navMenu.innerHTML = `
            <div class="nav-user-wrapper">
                <div class="nav-user-info">
                    <i class="bi bi-person-circle me-1"></i>
                    Halo, ${username}
                </div>

                <button id="logoutBtn" class="btn btn-light btn-sm fw-bold">
                    <i class="bi bi-box-arrow-right me-1"></i>
                    Logout
                </button>
            </div>
        `;

        document.getElementById('logoutBtn').addEventListener('click', function() {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('current_username');

            alert('Logout berhasil.');
            window.location.hash = '#login';
            updateNavbar();
        });
    } else {
        navMenu.innerHTML = `
            <div class="d-flex gap-2">
                <a href="#login" class="nav-auth-btn nav-auth-login">
                    Masuk
                </a>

                <a href="#register" class="nav-auth-btn nav-auth-register">
                    Daftar
                </a>
            </div>
        `;
    }
}


async function loadDashboardData(tab = currentTab, page = 1) {
    currentTab = tab;
    currentPage = page;

    const result = await requestAPI(
        `/api/report/?tab=${tab}&page=${page}`,
        'GET'
    );

    if (!result.ok) {
        console.log(result.data);
        alert('Gagal mengambil data laporan.');
        return;
    }

    currentReports = result.data.results || [];

    renderFilteredReports();
    renderPagination(result.data);
    loadSummaryStats();
}


function renderFilteredReports() {
    if (!currentSearchKeyword) {
        renderList(currentReports);
        return;
    }

    const filteredReports = currentReports.filter(report => {
        return reportMatchesKeyword(report, currentSearchKeyword);
    });

    renderList(filteredReports, currentSearchKeyword);
}


function reportMatchesKeyword(report, keyword) {
    const progress = getProgressInfo(report.status);
    const searchText = [
        report.title,
        report.reporter,
        report.category,
        report.location,
        report.description,
        report.status,
        progress.label
    ].join(' ').toLowerCase();

    return searchText.includes(keyword.toLowerCase());
}


function highlightText(text, keyword) {
    const safeText = escapeHTML(String(text || ''));

    if (!keyword) {
        return safeText;
    }

    const safeKeyword = escapeRegExp(keyword);

    if (!safeKeyword) {
        return safeText;
    }

    const regex = new RegExp(`(${safeKeyword})`, 'gi');

    return safeText.replace(
        regex,
        '<span class="search-highlight">$1</span>'
    );
}


function escapeHTML(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


function escapeRegExp(value) {
    return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


function renderList(reports, keyword = currentSearchKeyword) {
    const reportList = document.getElementById('reportList');

    if (!reportList) {
        return;
    }

    if (reports.length === 0) {
        reportList.innerHTML = `
            <div class="card border-0 shadow-sm p-4 text-center text-muted">
                <i class="bi bi-inbox fs-1"></i>
                <p class="mt-3 mb-0">
                    ${keyword ? 'Laporan tidak ditemukan.' : 'Belum ada laporan.'}
                </p>
            </div>
        `;
        return;
    }

    reportList.innerHTML = reports.map(report => {
        const progress = getProgressInfo(report.status);

        return `
            <div class="card border-0 shadow-sm mb-3">
                <div class="card-body">

                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h5 class="fw-bold mb-1">
                                ${highlightText(report.title, keyword)}
                            </h5>
                            <small class="text-muted">
                                <i class="bi bi-person-circle me-1"></i>
                                ${highlightText(report.reporter, keyword)}
                            </small>
                        </div>

                        <span class="badge ${progress.badge}">
                            ${highlightText(progress.label, keyword)}
                        </span>
                    </div>

                    <p class="mb-1">
                        <i class="bi bi-tags me-1"></i>
                        ${highlightText(report.category, keyword)}
                    </p>

                    <p class="mb-2">
                        <i class="bi bi-geo-alt me-1"></i>
                        ${highlightText(report.location, keyword)}
                    </p>

                    <p class="text-muted small">
                        ${highlightText(report.description, keyword)}
                    </p>

                    <div class="progress mb-3" style="height: 10px;">
                        <div
                            class="progress-bar ${progress.bar}"
                            style="width: ${progress.percent}%">
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            Update: ${formatDate(report.updated_at)}
                        </small>

                        <div>
                            ${renderActionButtons(report)}
                        </div>
                    </div>

                </div>
            </div>
        `;
    }).join('');
}


function renderActionButtons(report) {
    if (report.status === 'DRAFT' && report.is_owner) {
        return `
            <button
                class="btn btn-sm btn-outline-secondary me-1"
                onclick="editDraft(${report.id})">
                <i class="bi bi-pencil-square me-1"></i>
                Edit
            </button>

            <button
                class="btn btn-sm btn-primary"
                onclick="submitDraft(${report.id})">
                <i class="bi bi-send-fill me-1"></i>
                Ajukan
            </button>
        `;
    }

    return `
        <span class="text-muted small">
            Tidak ada aksi
        </span>
    `;
}


function getProgressInfo(status) {
    const statusMap = {
        DRAFT: {
            label: 'Draft',
            percent: 10,
            badge: 'bg-secondary',
            bar: 'bg-secondary'
        },
        REPORTED: {
            label: 'Reported',
            percent: 35,
            badge: 'bg-danger',
            bar: 'bg-danger'
        },
        VERIFIED: {
            label: 'Verified',
            percent: 60,
            badge: 'bg-warning text-dark',
            bar: 'bg-warning'
        },
        IN_PROGRESS: {
            label: 'In Progress',
            percent: 80,
            badge: 'bg-primary',
            bar: 'bg-primary'
        },
        RESOLVED: {
            label: 'Resolved',
            percent: 100,
            badge: 'bg-success',
            bar: 'bg-success'
        }
    };

    return statusMap[status] || statusMap.DRAFT;
}


function getPaginationPages(current, total) {
    const pages = [];

    if (total <= 7) {
        for (let page = 1; page <= total; page++) {
            pages.push(page);
        }

        return pages;
    }

    pages.push(1);

    if (current > 3) {
        pages.push('...');
    }

    const startPage = Math.max(2, current - 1);
    const endPage = Math.min(total - 1, current + 1);

    for (let page = startPage; page <= endPage; page++) {
        pages.push(page);
    }

    if (current < total - 2) {
        pages.push('...');
    }

    pages.push(total);

    return pages;
}


function renderPagination(data) {
    const pagination = document.getElementById('pagination');

    if (!pagination) {
        return;
    }

    const totalItems = data.count || 0;
    const pageSize = 10;
    const totalPages = Math.ceil(totalItems / pageSize);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    const pages = getPaginationPages(currentPage, totalPages);

    const pageButtons = pages.map(page => {
        if (page === '...') {
            return `
                <span class="pagination-ellipsis">
                    ...
                </span>
            `;
        }

        return `
            <button
                class="pagination-btn ${page === currentPage ? 'active' : ''}"
                onclick="loadDashboardData('${currentTab}', ${page})">
                ${page}
            </button>
        `;
    }).join('');

    pagination.innerHTML = `
        <div class="custom-pagination-wrapper">
            <button
                class="pagination-nav ${!data.previous ? 'disabled' : ''}"
                ${!data.previous ? 'disabled' : ''}
                onclick="loadDashboardData('${currentTab}', ${currentPage - 1})">
                <i class="bi bi-chevron-left"></i>
                Previous
            </button>

            <div class="pagination-pages">
                ${pageButtons}
            </div>

            <button
                class="pagination-nav ${!data.next ? 'disabled' : ''}"
                ${!data.next ? 'disabled' : ''}
                onclick="loadDashboardData('${currentTab}', ${currentPage + 1})">
                Next
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>
    `;
}


async function loadSummaryStats() {
    const result = await requestAPI(
        '/api/report/?tab=my_reports&page_size=1000',
        'GET'
    );

    if (!result.ok) {
        return;
    }

    const reports = result.data.results || [];

    const draftCount = reports.filter(
        report => report.status === 'DRAFT'
    ).length;

    const reportedCount = reports.filter(
        report => report.status === 'REPORTED'
    ).length;

    const verifiedCount = reports.filter(
        report => report.status === 'VERIFIED'
    ).length;

    const progressCount = reports.filter(
        report => report.status === 'IN_PROGRESS'
    ).length;

    const doneCount = reports.filter(
        report => report.status === 'RESOLVED'
    ).length;

    document.getElementById('statDraft').textContent = draftCount;
    document.getElementById('statReported').textContent = reportedCount;
    document.getElementById('statVerified').textContent = verifiedCount;
    document.getElementById('statProgress').textContent = progressCount;
    document.getElementById('statDone').textContent = doneCount;
}


function openReportModal() {
    editingReportId = null;

    document.getElementById('reportModalLabel').innerHTML = `
        <i class="bi bi-pencil-square me-2"></i>
        Buat Laporan Baru
    `;

    document.getElementById('reportForm').reset();

    const modal = new bootstrap.Modal(
        document.getElementById('reportModal')
    );

    modal.show();
}


async function editDraft(id) {
    const result = await requestAPI(
        `/api/report/${id}/`,
        'GET'
    );

    if (!result.ok) {
        alert('Gagal mengambil data draft.');
        return;
    }

    const report = result.data;
    editingReportId = id;

    document.getElementById('reportModalLabel').innerHTML = `
        <i class="bi bi-pencil-square me-2"></i>
        Edit Draft
    `;

    document.getElementById('reportTitle').value = report.title;
    document.getElementById('reportCategory').value = report.category;
    document.getElementById('reportLocation').value = report.location;
    document.getElementById('reportDescription').value = report.description;

    const modal = new bootstrap.Modal(
        document.getElementById('reportModal')
    );

    modal.show();
}


async function saveReport(asSubmit = false) {
    const payload = {
        title: document.getElementById('reportTitle').value,
        category: document.getElementById('reportCategory').value,
        location: document.getElementById('reportLocation').value,
        description: document.getElementById('reportDescription').value
    };

    let endpoint = '/api/report/';
    let method = 'POST';

    if (editingReportId !== null) {
        endpoint = `/api/report/${editingReportId}/`;
        method = 'PUT';
    }

    const result = await requestAPI(
        endpoint,
        method,
        payload
    );

    if (result.status !== 200 && result.status !== 201) {
        console.log(result.data);
        alert('Gagal menyimpan laporan.');
        return;
    }

    let reportId = editingReportId;

    if (reportId === null) {
        reportId = result.data.id;
    }

    if (asSubmit) {
        const submitResult = await requestAPI(
            `/api/report/${reportId}/submit/`,
            'PATCH'
        );

        if (!submitResult.ok) {
            console.log(submitResult.data);
            alert('Draft tersimpan, tetapi gagal diajukan.');
            return;
        }
    }

    const modalElement = document.getElementById('reportModal');
    const modal = bootstrap.Modal.getInstance(modalElement);

    modal.hide();

    document.getElementById('reportForm').reset();
    editingReportId = null;

    alert('Laporan berhasil disimpan.');

    loadDashboardData(currentTab, currentPage);
}


async function submitDraft(id) {
    const result = await requestAPI(
        `/api/report/${id}/submit/`,
        'PATCH'
    );

    if (!result.ok) {
        console.log(result.data);
        alert('Gagal mengajukan laporan.');
        return;
    }

    alert('Laporan berhasil diajukan.');
    loadDashboardData(currentTab, currentPage);
}


function setupReportForm() {
    const openButton = document.getElementById('openReportModal');
    const btnDraft = document.getElementById('btnDraft');
    const btnSubmitReport = document.getElementById('btnSubmitReport');

    if (openButton) {
        openButton.addEventListener('click', openReportModal);
    }

    if (btnDraft) {
        btnDraft.addEventListener('click', function() {
            saveReport(false);
        });
    }

    if (btnSubmitReport) {
        btnSubmitReport.addEventListener('click', function() {
            saveReport(true);
        });
    }
}


function setupTabButtons() {
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            const selectedTab = this.dataset.tab;

            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-outline-secondary');
            });

            this.classList.remove('btn-outline-secondary');
            this.classList.add('btn-primary');

            currentSearchKeyword = '';

            const searchInput = document.getElementById('searchInput');

            if (searchInput) {
                searchInput.value = '';
            }

            loadDashboardData(selectedTab, 1);
        });
    });
}


function setupSearchBar() {
    const searchInput = document.getElementById('searchInput');

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener('input', function() {
        currentSearchKeyword = this.value.trim();
        renderFilteredReports();
    });
}


function formatDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}


function startDashboardAutoRefresh() {
    if (dashboardRefreshInterval) {
        clearInterval(dashboardRefreshInterval);
    }

    dashboardRefreshInterval = setInterval(function() {
        if (window.location.hash === '#dashboard') {
            loadDashboardData(currentTab, currentPage);
        }
    }, 5000);
}


function initDashboard() {
    setupReportForm();
    setupTabButtons();
    setupSearchBar();
    loadDashboardData('my_reports', 1);
    startDashboardAutoRefresh();
}


window.addEventListener('DOMContentLoaded', updateNavbar);
window.addEventListener('hashchange', updateNavbar);