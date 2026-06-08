function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener('submit', async function(event) {

        // Mencegah reload halaman
        event.preventDefault();

        const username =
            document.getElementById('loginUsername').value;

        const password =
            document.getElementById('loginPassword').value;

        const payload = {
            username: username,
            password: password
        };

        const result = await requestAPI(
            '/api/token/',
            'POST',
            payload
        );

        if (result.status === 200) {

            localStorage.setItem(
                'access_token',
                result.data.access
            );

            localStorage.setItem(
                'refresh_token',
                result.data.refresh
            );

            localStorage.setItem(
                'current_username',
                username
            );

            alert('Login berhasil!');

            window.location.hash = '#dashboard';

            updateNavbar();

        } else {

            alert(
                'Login gagal. Periksa username dan password.'
            );

            console.log(result.data);
        }
    });
}


function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');

    if (!registerForm) {
        return;
    }

    registerForm.addEventListener('submit', async function(event) {

        // Mencegah reload halaman
        event.preventDefault();

        const username =
            document.getElementById('registerUsername').value;

        const email =
            document.getElementById('registerEmail').value;

        const password =
            document.getElementById('registerPassword').value;

        const payload = {
            username: username,
            email: email,
            password: password
        };

        const result = await requestAPI(
            '/api/register/',
            'POST',
            payload
        );

        if (result.status === 200 || result.status === 201) {

            alert('Registrasi berhasil. Silakan login.');

            window.location.hash = '#login';

            updateNavbar();

        } else {

            alert(
                'Registrasi gagal. Periksa kembali data yang dimasukkan.'
            );

            console.log(result.data);
        }
    });
}