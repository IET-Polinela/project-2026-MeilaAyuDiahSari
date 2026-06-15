const API_BASE_URL = 'http://103.151.63.88:8002';

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