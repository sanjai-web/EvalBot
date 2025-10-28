const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    return await response.json();
  },

  async signup(userData) {
    return this.request('/signup', {
      method: 'POST',
      body: userData,
    });
  },

  async login(credentials) {
    return this.request('/login', {
      method: 'POST',
      body: credentials,
    });
  },

  async getProfile() {
    return this.request('/profile');
  },
};