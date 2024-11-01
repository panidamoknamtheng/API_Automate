const { test, expect } = require('@playwright/test');
const config = require('../config');
const { BASE_URL } = config;

const loginEndpoint = '/auth/v1.0/login';
const idTokenEndpoint = '/auth/v1.0/loginWithIDToken';
const loginUrl = `${BASE_URL}${loginEndpoint}`;
const urlendpoint = `${BASE_URL}${idTokenEndpoint}`;

test.describe('Login and Use ID Token', () => {
    test.beforeAll(async ({ request }) => {
        // ทำการล็อกอินเพื่อรับ ID_TOKEN และตั้งค่าใน config
        const loginResponse = await request.post(loginUrl, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Device': 'iPad'
            },
            data: new URLSearchParams({
                email: 'panida.2554@hotmail.com',
                password: 'panida092'
            }).toString()
        });

        expect(loginResponse.status()).toBe(200);
        const loginText = await loginResponse.text();

        let loginBody;
        try {
            loginBody = JSON.parse(loginText);
            expect(loginBody).toHaveProperty('data');
            expect(loginBody.data).toHaveProperty('idToken');

            // ตั้งค่า ID_TOKEN ใน config
            config.ID_TOKEN = loginBody.data.idToken;

        } catch (error) {
            console.error('Error parsing login response JSON:', error);
            throw error;
        }
    });

    test('[POST]success with ID_TOKEN (200)', async ({ request }) => {
        const response = await request.post(urlendpoint, {
            headers: {
                'authorization': `${config.ID_TOKEN}`
            }
        });

        console.log('Response status:', response.status());
        expect(response.status()).toBe(200);

        const responsetext = await response.text();
        console.log('Response body as text:', responsetext);

        if (!responsetext) {
            throw new Error('Response body is empty');
        }

        let responseBody;
        try {
            responseBody = JSON.parse(responsetext);

            // ตรวจสอบ object error
            expect(responseBody).toHaveProperty('error');
            expect(responseBody.error).toHaveProperty('code', 0);
            expect(responseBody.error).toHaveProperty('message', 'success');

        } catch (error) {
            console.error('Error parsing JSON:', error);
            throw error;
        }
    });
});

test('[POST]invalid-token (200)', async ({ request }) => {
    const response = await request.post(urlendpoint, {
        headers: {
            'authorization': `${config.ID_TOKEN}-25445`
        }
    });
    console.log('Response status:', response.status());
    expect(response.status()).toBe(200);
    const responsetext = await response.text();
    console.log('Response body as text:', responsetext);

    if (!responsetext) {
        throw new Error('Response body is empty');
    }
    let responseBody;
    try {
        responseBody = JSON.parse(responsetext);
        console.log('Parsed response body:', responseBody);
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toHaveProperty('code', 4000);
        expect(responseBody.error).toHaveProperty('message', 'auth/argument-error');
    } catch (error) {
        console.error('Error parsing JSON:', error);
        throw error;
    }
});

