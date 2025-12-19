/**
 * VvelUniverse Java Backend API Client
 * Spring Boot 3 + JWT Authentication
 */

const JAVA_API_BASE = 'http://localhost:8080/api';

class JavaBackendAPI {
    constructor() {
        this.baseURL = JAVA_API_BASE;
        this.token = localStorage.getItem('jwt_token');
    }

    // Get JWT token from storage
    getToken() {
        return localStorage.getItem('jwt_token');
    }

    // Set JWT token to storage
    setToken(token) {
        localStorage.setItem('jwt_token', token);
        this.token = token;
    }

    // Clear JWT token
    clearToken() {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');
        this.token = null;
    }

    // Get headers with JWT
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (includeAuth && this.getToken()) {
            headers['Authorization'] = `Bearer ${this.getToken()}`;
        }
        
        return headers;
    }

    // Generic API request
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders(options.requireAuth !== false),
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ==================== AUTHENTICATION ====================

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
            requireAuth: false,
        });
    }

    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            requireAuth: false,
        });

        if (response.success && response.data) {
            this.setToken(response.data.token);
            localStorage.setItem('user_data', JSON.stringify(response.data));
        }

        return response;
    }

    async checkAuthStatus() {
        return this.request('/auth/status', {
            method: 'GET',
            requireAuth: false,
        });
    }

    logout() {
        this.clearToken();
    }

    // Get current user data
    getCurrentUser() {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    }

    // Check if user is admin
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.isAdmin === true;
    }

    // ==================== CATEGORIES ====================

    async getAllCategories(activeOnly = false) {
        const endpoint = activeOnly ? '/categories?active=true' : '/categories';
        return this.request(endpoint, {
            method: 'GET',
            requireAuth: false,
        });
    }

    async getCategoryById(id) {
        return this.request(`/categories/${id}`, {
            method: 'GET',
            requireAuth: false,
        });
    }

    async createCategory(categoryData) {
        return this.request('/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData),
        });
    }

    async updateCategory(id, categoryData) {
        return this.request(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData),
        });
    }

    async deleteCategory(id) {
        return this.request(`/categories/${id}`, {
            method: 'DELETE',
        });
    }

    async toggleCategoryStatus(id) {
        return this.request(`/categories/${id}/toggle`, {
            method: 'PUT',
        });
    }
}

// Create singleton instance
const javaAPI = new JavaBackendAPI();

// Export for use in other files
if (typeof window !== 'undefined') {
    window.JavaBackendAPI = JavaBackendAPI;
    window.javaAPI = javaAPI;
}

