/**
 * Profile Icon Component with Slide-out Sidebar
 * Hamburger menu icon in top-left corner that opens a sidebar
 * Sidebar contains the profile icon and other menu items
 */

(function() {
  'use strict';

  // User info
    let userInitial = '👤';
    let userPhoto = null;
  let userName = 'User';

    // Try to get user from localStorage or fetch
    async function loadUserInfo() {
      try {
        const response = await fetch('/api/auth/status', {
          credentials: 'include'
        });
        const data = await response.json();

        if (data.success && data.authenticated && data.user) {
          const user = data.user;
        userName = user.name || 'User';
          
          // Try to get full profile with photo
          try {
            const profileResponse = await fetch('/api/profile', {
              credentials: 'include'
            });
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              if (profileData.success && profileData.data.profilePhoto) {
                userPhoto = profileData.data.profilePhoto;
              }
            }
          } catch (e) {
            // If profile fetch fails, continue with basic info
          }
          
          if (!userPhoto && user.name) {
            userInitial = user.name.charAt(0).toUpperCase();
          }
        updateProfileIcon();
        }
      } catch (error) {
        console.error('Failed to load user info:', error);
      }
    }

  function updateProfileIcon() {
    const profileIconEl = document.getElementById('sidebarProfileIcon');
    if (!profileIconEl) return;

    const photoEl = profileIconEl.querySelector('.profile-icon-photo');
      if (photoEl) {
        if (userPhoto) {
          photoEl.innerHTML = '<img src="' + userPhoto + '" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">';
        } else {
        const isMobile = window.innerWidth <= 480;
        const fontSize = isMobile ? '18px' : '20px';
        photoEl.innerHTML = '<span style="font-size: ' + fontSize + '; color: white; font-weight: 700;">' + userInitial + '</span>';
      }
    }

    // Update user name in sidebar
    const userNameEl = document.getElementById('sidebarUserName');
    if (userNameEl) {
      userNameEl.textContent = userName;
    }
  }

  function toggleSidebar() {
    const sidebar = document.getElementById('slideSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
      const isOpen = sidebar.classList.contains('open');
      
      if (isOpen) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  }

  function closeSidebar() {
    const sidebar = document.getElementById('slideSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function createMenuIcon() {
    // Check if menu icon already exists
    if (document.getElementById('menuIconBtn')) {
      return;
    }

    // Create hamburger menu icon button
    const menuBtn = document.createElement('button');
    menuBtn.id = 'menuIconBtn';
    menuBtn.className = 'menu-icon-btn';
    menuBtn.setAttribute('aria-label', 'Open Menu');
    menuBtn.onclick = toggleSidebar;

    // Hamburger icon SVG with rounded ends (pill-like appearance)
    menuBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" y1="6" x2="20" y2="6"></line>
        <line x1="4" y1="12" x2="20" y2="12"></line>
        <line x1="4" y1="18" x2="20" y2="18"></line>
      </svg>
    `;

    return menuBtn;
  }

  function createSidebar() {
    // Check if sidebar already exists
    if (document.getElementById('slideSidebar')) {
      return;
    }

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'sidebarOverlay';
    overlay.className = 'sidebar-overlay';
    overlay.onclick = closeSidebar;

    // Create sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'slideSidebar';
    sidebar.className = 'slide-sidebar';

    sidebar.innerHTML = `
      <div class="sidebar-header">
        <button class="sidebar-close-btn" onclick="window.closeSidebar && window.closeSidebar()" aria-label="Close Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="sidebar-content">
        <div class="sidebar-profile-section">
          <div id="sidebarProfileIcon" class="sidebar-profile-icon" onclick="window.location.href='/pages/profile/profile.html'">
            <div class="profile-icon-photo">
              <span style="font-size: 20px; color: white; font-weight: 700;">${userInitial}</span>
            </div>
          </div>
          <div class="sidebar-user-info">
            <div id="sidebarUserName" class="sidebar-user-name">${userName}</div>
            <div class="sidebar-view-profile" onclick="window.location.href='/pages/profile/profile.html'">View Profile</div>
          </div>
        </div>
        
        <div class="sidebar-menu-items">
          <a id="sidebarHomeLink" href="/pages/categories/categories.html" class="sidebar-menu-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Home</span>
          </a>
          <a href="/pages/profile/profile.html" class="sidebar-menu-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Profile</span>
          </a>
          <a href="/pages/features/community.html" class="sidebar-menu-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>Community</span>
          </a>
          <a href="/pages/features/wallet.html" class="sidebar-menu-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            <span>Wallet</span>
          </a>
          <div class="sidebar-menu-item" onclick="handleLogout()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </div>
        </div>
      </div>
    `;

    // Make closeSidebar available globally
    window.closeSidebar = closeSidebar;

    // Logout handler
    window.handleLogout = async function() {
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'GET',
          credentials: 'include'
        });
        if (response.ok) {
          window.location.href = '/pages/auth/index.html';
        }
      } catch (error) {
        console.error('Logout error:', error);
        window.location.href = '/index.html';
      }
    };

    return { sidebar, overlay };
  }

  function addStyles() {
    if (document.getElementById('menuSidebarStyles')) {
      return;
    }

      const style = document.createElement('style');
    style.id = 'menuSidebarStyles';
    style.textContent = `
      /* Hamburger Menu Icon */
      .menu-icon-btn {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 10000;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: rgba(13, 31, 74, 0.4);
        border: 1.4px solid rgba(23, 78, 166, 0.55);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        cursor: pointer;
        display: flex !important;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: 0 8px 24px rgba(3, 10, 24, 0.4);
        padding: 0;
        margin: 0;
        color: white;
      }
      
      .menu-icon-btn:hover {
        transform: scale(1.1);
        border-color: rgba(23, 78, 166, 0.85);
        box-shadow: 0 12px 32px rgba(23, 78, 166, 0.5);
        background: rgba(13, 31, 74, 0.6);
      }
      
      .menu-icon-btn:active {
        transform: scale(1.05);
      }

      /* Sidebar Overlay */
      .sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        z-index: 9998;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }

      .sidebar-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      /* Slide Sidebar */
      .slide-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        width: 320px;
        max-width: 85vw;
        height: 100vh;
        background: rgba(11, 26, 58, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-right: 1.4px solid rgba(23, 78, 166, 0.55);
        box-shadow: 4px 0 24px rgba(3, 10, 24, 0.6);
        z-index: 9999;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }

      .slide-sidebar.open {
        transform: translateX(0);
      }

      .sidebar-header {
        padding: 20px;
        display: flex;
        justify-content: flex-end;
        border-bottom: 1px solid rgba(23, 78, 166, 0.3);
      }

      .sidebar-close-btn {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .sidebar-close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
      }

      .sidebar-content {
        flex: 1;
        padding: 24px 20px;
      }

      .sidebar-profile-section {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        background: rgba(23, 78, 166, 0.15);
        border: 1px solid rgba(23, 78, 166, 0.3);
        border-radius: 16px;
        margin-bottom: 24px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .sidebar-profile-section:hover {
        background: rgba(23, 78, 166, 0.25);
        transform: translateY(-2px);
      }

      .sidebar-profile-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;
        flex-shrink: 0;
        cursor: pointer;
      }

      .profile-icon-photo {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-weight: 700;
        overflow: hidden;
      }

      .sidebar-user-info {
        flex: 1;
        min-width: 0;
      }

      .sidebar-user-name {
        font-size: 18px;
        font-weight: 700;
        color: white;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .sidebar-view-profile {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        transition: color 0.2s ease;
      }

      .sidebar-view-profile:hover {
        color: rgba(23, 78, 166, 1);
    }

      .sidebar-menu-items {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .sidebar-menu-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 14px 16px;
        color: white;
        text-decoration: none;
        border-radius: 12px;
        transition: all 0.2s ease;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .sidebar-menu-item:hover {
        background: rgba(23, 78, 166, 0.2);
        border-color: rgba(23, 78, 166, 0.4);
        transform: translateX(4px);
      }

      .sidebar-menu-item svg {
        flex-shrink: 0;
        color: rgba(255, 255, 255, 0.8);
      }

      .sidebar-menu-item span {
        font-size: 16px;
        font-weight: 500;
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .menu-icon-btn {
          width: 44px;
          height: 44px;
          top: 12px;
          left: 16px;
    }

        .slide-sidebar {
          width: 280px;
        }
      }

      @media (max-width: 480px) {
        .menu-icon-btn {
          width: 44px;
          height: 44px;
          top: max(12px, env(safe-area-inset-top, 12px));
          left: max(12px, env(safe-area-inset-left, 12px));
        }

        .slide-sidebar {
          width: 85vw;
        }

        .sidebar-profile-icon {
          width: 56px;
          height: 56px;
        }
      }

      @media (max-width: 360px) {
        .menu-icon-btn {
          width: 40px;
          height: 40px;
          top: max(10px, env(safe-area-inset-top, 10px));
          left: max(10px, env(safe-area-inset-left, 10px));
        }
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    if (!document.body) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        setTimeout(init, 50);
      }
      return;
    }

    // Add styles
    addStyles();

    // Create menu icon
    const menuBtn = createMenuIcon();
    document.body.appendChild(menuBtn);

    // Create sidebar
    const { sidebar, overlay } = createSidebar();
    document.body.appendChild(overlay);
    document.body.appendChild(sidebar);

    // Load user info
    loadUserInfo();

    // Update icon periodically
    setInterval(loadUserInfo, 30000);
  }

  function updateCategoryHomeLink() {
    // Detect category from current page URL or path
    const path = window.location.pathname;
    const categoryMap = {
      'medical': '/pages/categories/medical/medical-home.html',
      'business': '/pages/categories/business/business-home.html',
      'cinema': '/pages/categories/cinema/cinema-home.html',
      'education': '/pages/categories/education/education-home.html',
      'influencers': '/pages/categories/influencers/influencers-home.html',
      'law': '/pages/categories/law/law-home.html',
      'politics': '/pages/categories/politics/politics-home.html',
      'science': '/pages/categories/science/science-home.html',
      'sports': '/pages/categories/sports/sports-home.html'
    };

    for (const [category, homeUrl] of Object.entries(categoryMap)) {
      if (path.includes(category)) {
        const homeLink = document.getElementById('sidebarHomeLink');
        if (homeLink) {
          homeLink.href = homeUrl;
        }
        break;
      }
    }
  }

  // Start initialization
  init();
})();
