const { test, expect } = require('@playwright/test');
const { BASE_URL } = require('../config');
const endpoint = '/auth/v1.0/login';
const urlendpoint = `${BASE_URL}${endpoint}`;

test('[POST]success (200)', async ({ request }) => {
    const response = await request.post(urlendpoint, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Device': 'iPad'
        },
        data: new URLSearchParams({
            email: 'panida.2554@hotmail.com',
            password: 'panida092'
        }).toString()
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

test('[POST]invaild-email (200))', async ({ request }) => {
    const response = await request.post(urlendpoint, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Device': 'iPad'
        },
        data: new URLSearchParams({
            email: 'invalid.email@example.com',
            password: 'panida092'
        }).toString()
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
        expect(responseBody).toHaveProperty('error', { "code": 4000, "message": "There is no user record corresponding to this identifier. The user may have been deleted." });
    } catch (error) {
        console.error('Error parsing JSON:', error);
        throw error;
    }

});

test('[POST]unformat-email (200))', async ({ request }) => {
    const response = await request.post(urlendpoint, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Device': 'iPad'
        },
        data: new URLSearchParams({
            email: 'invalid.email',
            password: 'panida092'
        }).toString()
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
        expect(responseBody).toHaveProperty('error', { "code": 4000, "message": "The email address is badly formatted." });
    } catch (error) {
        console.error('Error parsing JSON:', error);
        throw error;
    }

});

test('[POST]invaild-password (200))', async ({ request }) => {
    const response = await request.post(urlendpoint, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Device': 'iPad'
        },
        data: new URLSearchParams({
            email: 'panida.2554@hotmail.com',
            password: '123456'
        }).toString()
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
        expect(responseBody).toHaveProperty('error', { "code": 4000, "message": "The email address is badly formatted." });
    } catch (error) {
        console.error('Error parsing JSON:', error);
        throw error;
    }

});

