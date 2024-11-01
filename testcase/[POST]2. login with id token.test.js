const { test, expect } = require('@playwright/test');
const { BASE_URL, ID_TOKEN } = require('../config');
const endpoint = '/auth/v1.0/loginWithIDToken';
const urlendpoint = `${BASE_URL}${endpoint}`;

test('[POST]success (200)', async ({ request }) => {
    const response = await request.post(urlendpoint, {
        headers: {
            'authorization': `${ID_TOKEN}`
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
    } catch (error) {
        console.error('Error parsing JSON:', error);
        throw error;
    }

});

test('[POST]invalid-token (200)', async ({ request }) => {
    const response = await request.post(urlendpoint, {
        headers: {
            'authorization': `${ID_TOKEN}-25445`
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
        expect(responseBody).toHaveProperty('error', { "code": 4000, "message": "auth/argument-error" });
    } catch (error) {
        console.error('Error parsing JSON:', error);
        throw error;
    }
});

