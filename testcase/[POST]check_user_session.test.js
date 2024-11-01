const { test, expect } = require('@playwright/test');
const { BASE_URL, TOKEN } = require('../config');
const endpoint = '/auth/v1.0/EYT3WDTPoDWbesowbdhMNVVRlmD2/checksession/user';
const urlendpoint = `${BASE_URL}${endpoint}`;

test('[POST]vaild-Token (0)', async ({ request }) => {
    const response = await request.post(urlendpoint, {
        headers: {
            'authorization': `${TOKEN}`
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
        //console.log('Parsed response body:', responseBody);

        //Check error object properties
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toHaveProperty('code', 0);
        expect(responseBody.error).toHaveProperty('message', 'success');
        //Check data object properties
        expect(responseBody).toHaveProperty('data');
        expect(responseBody.data).toHaveProperty('uid', 'EYT3WDTPoDWbesowbdhMNVVRlmD2');
        expect(responseBody.data).toHaveProperty('idToken');
        expect(typeof responseBody.data.idToken).toBe('string');
        expect(responseBody.data).toHaveProperty('duration', 31536000);

    } catch (error) {
        console.error('Error parsing JSON:', error);
        throw error;
    }

});

test('[POST]Expired-Token (402)', async ({ request }) => {
    const response = await request.post(urlendpoint, {
        headers: {
            'authorization': `${TOKEN}-225`
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
        //console.log('Parsed response body:', responseBody);
        //Check error object properties
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toHaveProperty('code', 402);
        expect(responseBody.error).toHaveProperty('message', 'Login Session Has Been Expired.');

    } catch (error) {
        console.error('Error parsing JSON:', error);
        throw error;
    }

});

test('[POST]Invalid-Token (405)', async ({ request }) => {
    const response = await request.post(urlendpoint, {
        headers: {
            'authorization': '155ssd'
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
        //console.log('Parsed response body:', responseBody);
        //Check error object properties
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toHaveProperty('code', 405);
        expect(responseBody.error).toHaveProperty('message', 'Invalid Token.');

    } catch (error) {
        console.error('Error parsing JSON:', error);
        throw error;
    }

});

test('[POST]Access-Denied. (401)', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/v1.0/1554/checksession/user`, {
        headers: {
            'authorization': `${TOKEN}`
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
        //console.log('Parsed response body:', responseBody);
        //Check error object properties
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toHaveProperty('code', 401);
        expect(responseBody.error).toHaveProperty('message', 'Access Denied.');

    } catch (error) {
        console.error('Error parsing JSON:', error);
        throw error;
    }

});