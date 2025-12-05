/**
 * Alerts Icon Component
 * Moves the Alerts icon from bottom nav to top-right corner on all pages
 */

(function() {
  'use strict';

  // Inject CSS if not already present
  function injectCSS() {
    if (document.getElementById('alertsIconStyles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'alertsIconStyles';
    style.textContent = `
      #alertsIconTop {
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 1000;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        border: 2.5px solid rgba(255, 255, 255, 0.4);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #fff;
        box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4), 0 0 0 0 rgba(245, 158, 11, 0.1);
        transition: all 0.2s ease;
        overflow: hidden;
        position: relative;
      }

      #alertsIconTop:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(245, 158, 11, 0.6), 0 0 0 4px rgba(245, 158, 11, 0.1);
      }

      #alertsIconTop .alert-badge {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 18px;
        height: 18px;
        background: #ef4444;
        border: 2px solid #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: 700;
        color: #fff;
      }

      /* Hide alerts from bottom nav */
      .bottom-nav button[onclick*="alerts"],
      .bottom-nav button[onclick*="Alerts"],
      .bottom-nav a[href*="alerts"],
      .bottom-nav a[href*="Alerts"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Create alerts icon in top-right
  function createAlertsIcon() {
    // Check if icon already exists
    if (document.getElementById('alertsIconTop')) {
      return;
    }

    // Inject CSS first
    injectCSS();

    // Find the alerts link/button in bottom nav to get its href/onclick
    const bottomNav = document.querySelector('.bottom-nav');
    let alertsHref = 'alerts.html';
    let alertsOnClick = null;

    if (bottomNav) {
      const alertsButton = bottomNav.querySelector('button[onclick*="alerts"], button[onclick*="Alerts"]');
      const alertsLink = bottomNav.querySelector('a[href*="alerts"], a[href*="Alerts"]');
      
      if (alertsButton) {
        const onclick = alertsButton.getAttribute('onclick');
        if (onclick) {
          // Extract href from onclick like: window.location.href='sports-alerts.html'
          const match = onclick.match(/['"]([^'"]*alerts[^'"]*)['"]/i);
          if (match) {
            alertsHref = match[1];
          }
          alertsOnClick = onclick;
        }
      } else if (alertsLink) {
        alertsHref = alertsLink.getAttribute('href') || 'alerts.html';
      }
    }

    // Create alerts icon
    const alertsIcon = document.createElement('div');
    alertsIcon.id = 'alertsIconTop';
    alertsIcon.innerHTML = `
      <i data-lucide="bell" class="w-5 h-5"></i>
      <span class="alert-badge" id="alertBadge" style="display: none;">0</span>
    `;

    // Add click handler
    if (alertsOnClick) {
      alertsIcon.setAttribute('onclick', alertsOnClick);
    } else {
      alertsIcon.addEventListener('click', function() {
        window.location.href = alertsHref;
      });
    }

    // Add to body
    document.body.appendChild(alertsIcon);

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Load alert count (if API exists)
    loadAlertCount();
  }

  // Load alert count
  async function loadAlertCount() {
    try {
      // Try to fetch alert count from API
      const response = await fetch('/api/alerts/count', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.count > 0) {
          const badge = document.getElementById('alertBadge');
          if (badge) {
            badge.textContent = data.count > 99 ? '99+' : data.count;
            badge.style.display = 'flex';
          }
        }
      }
    } catch (error) {
      // API might not exist yet, that's okay
      console.log('Alert count API not available');
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createAlertsIcon);
  } else {
    createAlertsIcon();
  }

  // Re-initialize if page is dynamically loaded
  if (window.addEventListener) {
    window.addEventListener('load', createAlertsIcon);
  }
})();

