// test-api.js
const API_BASE = 'http://localhost:3000';
const sid = "69fd236d2fc2344693371b96";

async function testLogin() {
    try {
        const loginData = {
            email: "rhemaamasi12@gmail.com",
            password: "Rhemarex12@."
        };

        console.log('Sending login request...');

        const loginRes = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });

        const loginResult = await loginRes.json();
        console.log('Login Response:', loginResult);

        if (loginRes.ok) {
            const token = loginResult.access_token;
            console.log('Access Token received');

            // Now test a protected route
            await testProtectedRoute(token);
            await enrollStudent(sid, "6a11e67c7dbe5ca0a3b831aa", token);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function testProtectedRoute(token) {
    console.log('\nTesting protected route...');

    const res = await fetch(`${API_BASE}/students/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const data = await res.json();
    console.log('Protected Route Response:', data);
}

async function enrollStudent(studentId, courseId, accessToken) {
    if (!accessToken) {
        console.log('No token. Logging in first...');
        await login();
    }

    try {
        console.log(` Enrolling student ${studentId} in course ${courseId}...`);

        const res = await fetch(`${API_BASE}/students/${studentId}/enroll/${courseId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();

        if (res.ok) {
            console.log('Enrollment Successful!');
            console.log('Updated Student:', data);
        } else {
            console.error(' Enrollment Failed:', data);
        }

        return data;
    } catch (err) {
        console.error(' Request Error:', err.message);
    }
}
testLogin();