# Frontend Integration Examples

This document provides example code snippets for integrating the authentication system into your frontend.

## Table of Contents
1. [Google Login Button](#google-login-button)
2. [Instagram Login Button](#instagram-login-button)
3. [Registration Form](#registration-form)
4. [Login Form](#login-form)
5. [Check Authentication Status](#check-authentication-status)
6. [Logout](#logout)

---

## Google Login Button

Simple HTML link that initiates Google OAuth:

```html
<a href="/api/auth/google" class="social-btn">
  <span class="icon">🌐</span>
  Sign in with Google
</a>
```

**Or with JavaScript click handler:**

```html
<button onclick="handleGoogleLogin()" class="social-btn">
  Sign in with Google
</button>

<script>
function handleGoogleLogin() {
  window.location.href = '/api/auth/google';
}
</script>
```

---

## Instagram Login Button

Simple HTML link that initiates Instagram OAuth:

```html
<a href="/api/auth/instagram" class="social-btn">
  <span class="icon">📸</span>
  Sign in with Instagram
</a>
```

**Or with JavaScript click handler:**

```html
<button onclick="handleInstagramLogin()" class="social-btn">
  Sign in with Instagram
</button>

<script>
function handleInstagramLogin() {
  window.location.href = '/api/auth/instagram';
}
</script>
```

---

## Registration Form

Complete registration form with error handling:

```html
<form id="registerForm" onsubmit="event.preventDefault(); handleRegister();">
  <div class="field">
    <label for="fullname">Full Name</label>
    <input id="fullname" type="text" required />
  </div>
  <div class="field">
    <label for="email">Email</label>
    <input id="email" type="email" required />
  </div>
  <div class="field">
    <label for="mobile">Mobile Number</label>
    <input id="mobile" type="tel" required />
  </div>
  <div class="field">
    <label for="password">Password</label>
    <input id="password" type="password" required />
  </div>
  <div class="field">
    <label for="confirmPassword">Confirm Password</label>
    <input id="confirmPassword" type="password" required />
  </div>
  <button type="submit">Create Account</button>
</form>

<div id="errorMessage"></div>

<script>
const API_BASE = '/api';

async function handleRegister() {
  const name = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const mobile = document.getElementById('mobile').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Client-side validation
  if (!name || !email || !mobile || !password || !confirmPassword) {
    showError('Please fill in all fields');
    return;
  }

  if (password !== confirmPassword) {
    showError('Passwords do not match');
    return;
  }

  if (password.length < 6) {
    showError('Password must be at least 6 characters long');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name,
        email,
        mobile,
        password
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Registration successful, redirect to categories
      window.location.href = '/categories.html';
    } else {
      // Show error message
      showError(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    showError('Network error. Please try again.');
  }
}

function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}
</script>
```

---

## Login Form

Complete login form with error handling:

```html
<form id="loginForm" onsubmit="event.preventDefault(); handleLogin();">
  <div class="field">
    <label for="email">Email</label>
    <input id="email" type="email" required />
  </div>
  <div class="field">
    <label for="password">Password</label>
    <input id="password" type="password" required />
  </div>
  <button type="submit">Sign In</button>
</form>

<div id="errorMessage"></div>

<script>
const API_BASE = '/api';

async function handleLogin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Client-side validation
  if (!email || !password) {
    showError('Please provide both email and password');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Login successful, redirect to categories
      window.location.href = '/categories.html';
    } else {
      // Show error message
      showError(data.message || 'Login failed');
      // Possible error messages:
      // - "Incorrect password"
      // - "You're not a registered user"
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('Network error. Please try again.');
  }
}

function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}
</script>
```

---

## Check Authentication Status

Check if user is currently authenticated:

```javascript
async function checkAuthStatus() {
  try {
    const response = await fetch('/api/auth/status', {
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.success && data.authenticated) {
      console.log('User is authenticated:', data.user);
      // User is logged in
      return data.user;
    } else {
      console.log('User is not authenticated');
      // User is not logged in
      return null;
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return null;
  }
}

// Example usage on page load
window.addEventListener('DOMContentLoaded', async () => {
  const user = await checkAuthStatus();
  if (user) {
    // User is logged in, show protected content
    console.log('Welcome, ' + user.name);
  } else {
    // User is not logged in, redirect to login
    window.location.href = '/index.html';
  }
});
```

---

## Logout

Logout the current user:

```html
<button onclick="handleLogout()">Logout</button>

<script>
async function handleLogout() {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'GET',
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Logout successful, redirect to login page
      window.location.href = '/index.html';
    } else {
      console.error('Logout failed:', data.message);
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}
</script>
```

---

## Complete Example: Protected Route Check

Example of checking authentication and redirecting if not logged in:

```javascript
// Check authentication before showing protected content
async function protectRoute() {
  try {
    const response = await fetch('/api/auth/status', {
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!data.success || !data.authenticated) {
      // User is not authenticated, redirect to login
      window.location.href = '/index.html';
      return false;
    }
    
    // User is authenticated, show content
    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    window.location.href = '/index.html';
    return false;
  }
}

// Call on page load for protected pages
window.addEventListener('DOMContentLoaded', protectRoute);
```

---

## Error Message Handling

Different error scenarios and how to handle them:

```javascript
// Possible error messages from registration:
// - "User already exists" (409 Conflict)
// - "Please provide all required fields" (400 Bad Request)
// - "Password must be at least 6 characters long" (400 Bad Request)

// Possible error messages from login:
// - "Incorrect password" (401 Unauthorized)
// - "You're not a registered user" (404 Not Found)
// - "This account was created with a social login" (400 Bad Request)

function handleError(response, data) {
  if (response.status === 409) {
    // Duplicate user
    showError('User already exists');
  } else if (response.status === 401) {
    // Wrong password
    showError('Incorrect password');
  } else if (response.status === 404) {
    // User not found
    showError("You're not a registered user");
  } else {
    // Generic error
    showError(data.message || 'An error occurred');
  }
}
```

---

## Notes

- Always use `credentials: 'include'` in fetch requests to maintain session cookies
- The API base URL is `/api` when frontend and backend are on the same origin
- OAuth redirects happen automatically - user will be redirected back after authentication
- After successful registration/login/OAuth, users are redirected to `/categories.html`
- Error messages are user-friendly and match the requirements exactly

