import { getAccessToken } from '../utils/auth';
import { BASE_URL } from '../config';

const ENDPOINTS = {
  // Auth
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
  MY_USER_INFO: `${BASE_URL}/users/me`,

  STORY_LIST: `${BASE_URL}/stories`,
  STORE_NEW_REPORT: `${BASE_URL}/stories`,

};

export async function getRegistered({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getLogin({ email, password }) {
  try {
    const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const responseData = await fetchResponse.json();

    return {
      ok: fetchResponse.ok,
      status: fetchResponse.status,
      message: responseData.message || '',
      data: responseData.data || responseData 
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      ok: false,
      message: error.message
    };
  }
}

export async function getMyUserInfo() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.MY_USER_INFO, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getAllReports({ page, size, location } = {}) {
  const accessToken = getAccessToken();
  
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (size) params.append('size', size);
  if (location !== undefined) params.append('location', location ? '1' : '0');

  const url = `${BASE_URL}/stories?${params.toString()}`;
  
  try {
    const response = await fetch(url, {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    return {
      ok: !data.error, 
      message: data.message,
      data: data.listStory || [] 
    };
  } catch (error) {
    console.error('getAllReports error:', error);
    return {
      ok: false,
      message: error.message,
      data: []
    };
  }
}

export async function storeNewReport({
  description,
  photo,
  lat,
  lon
}) {
  const accessToken = getAccessToken();

  const formData = new FormData();
  formData.append('description', description);
  formData.append('photo', photo);
  
  if (lat !== undefined) formData.append('lat', lat.toString());
  if (lon !== undefined) formData.append('lon', lon.toString());

  try {
    const response = await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: formData
    });

    const data = await response.json();

    return {
      ok: !data.error,
      message: data.message,
      data: data
    };
  } catch (error) {
    console.error('storeNewReport error:', error);
    return {
      ok: false,
      message: error.message,
      data: null
    };
  }

}

export async function subscribePushNotification(subscription) {
  const accessToken = getAccessToken();
  const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      }
    })
  });
  return response.json();
} 

export async function unsubscribePushNotification(endpoint) {
  const accessToken = getAccessToken();
  const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ endpoint })
  });
  return response.json();
}



