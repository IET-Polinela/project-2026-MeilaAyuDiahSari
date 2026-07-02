const API_BASE_URL = 'http://127.0.0.1:8000';

async function requestAPI(endpoint, method = 'GET', bodyData = null) {
    const accessToken = localStorage.getItem('access_token');

    const headers = {
        'Content-Type': 'application/json'
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const config = {
        method: method,
        headers: headers,
        mode: 'cors'
    };

    if (bodyData) {
        config.body = JSON.stringify(bodyData);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // ✅ INTERCEPTOR 401: Ketika server menolak dengan Unauthorized
        // Ini menangani AUTH-05 (access token expired) dan AUTH-06 (kedua token expired)
        // Test mock SEMUA api response menjadi 401, interceptor harus:
        //   1. Tampilkan alert
        //   2. Bersihkan localStorage
        //   3. Redirect ke #login
        if (response.status === 401) {
            alert('Sesi Anda telah habis atau Anda belum login.');
            localStorage.clear();
            window.location.hash = '#login';
            return null;
        }

        let data = null;

        try {
            data = await response.json();
        } catch (error) {
            data = null;
        }

        return {
            status: response.status,
            ok: response.ok,
            data: data
        };

    } catch (error) {
        console.error('Gagal menghubungi API:', error);

        return {
            status: 0,
            ok: false,
            data: {
                message: 'Gagal menghubungi server API. Kemungkinan Mixed Content, CORS, atau koneksi API diblokir browser.'
            }
        };
    }
}