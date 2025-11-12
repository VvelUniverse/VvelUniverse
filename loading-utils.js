/**
 * Loading Animation Utility for Vvel Universe
 * Provides reusable loading indicators and functions
 */

// Global loading overlay
let globalLoadingOverlay = null;

/**
 * Create and show a full-page loading overlay
 */
function showLoadingOverlay(message = 'Loading...') {
  if (globalLoadingOverlay) {
    hideLoadingOverlay();
  }

  globalLoadingOverlay = document.createElement('div');
  globalLoadingOverlay.className = 'loading-overlay';
  globalLoadingOverlay.innerHTML = `
    <div class="loading-content">
      <div class="spinner"></div>
      <p class="loading-message">${message}</p>
    </div>
  `;
  
  document.body.appendChild(globalLoadingOverlay);
  
  // Trigger animation
  setTimeout(() => {
    globalLoadingOverlay.classList.add('show');
  }, 10);
}

/**
 * Hide the full-page loading overlay
 */
function hideLoadingOverlay() {
  if (globalLoadingOverlay) {
    globalLoadingOverlay.classList.remove('show');
    setTimeout(() => {
      if (globalLoadingOverlay && globalLoadingOverlay.parentNode) {
        globalLoadingOverlay.parentNode.removeChild(globalLoadingOverlay);
      }
      globalLoadingOverlay = null;
    }, 300);
  }
}

/**
 * Show inline loading spinner
 */
function createInlineLoader(size = 'medium') {
  const loader = document.createElement('div');
  loader.className = `inline-loader inline-loader-${size}`;
  loader.innerHTML = '<div class="spinner-small"></div>';
  return loader;
}

/**
 * Show button loading state
 */
function setButtonLoading(button, isLoading, loadingText = 'Loading...') {
  if (!button) return;
  
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.disabled = true;
    button.innerHTML = `<span class="button-spinner"></span> ${loadingText}`;
    button.classList.add('button-loading');
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || button.textContent;
    button.classList.remove('button-loading');
  }
}

/**
 * Show skeleton loader for content areas
 */
function createSkeletonLoader(type = 'card', count = 1) {
  const container = document.createElement('div');
  container.className = 'skeleton-container';
  
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = `skeleton skeleton-${type}`;
    container.appendChild(skeleton);
  }
  
  return container;
}

/**
 * Show loading state for search/results
 */
function showResultsLoading(container) {
  if (!container) return;
  
  const loader = createSkeletonLoader('result', 3);
  loader.className = 'results-loading';
  container.innerHTML = '';
  container.appendChild(loader);
}

/**
 * Wrap async function with loading overlay
 */
async function withLoadingOverlay(asyncFn, message = 'Loading...') {
  try {
    showLoadingOverlay(message);
    const result = await asyncFn();
    return result;
  } finally {
    hideLoadingOverlay();
  }
}

/**
 * Show loading state for social login buttons
 */
function setSocialButtonLoading(button, isLoading) {
  if (!button) return;
  
  if (isLoading) {
    button.classList.add('social-button-loading');
    button.style.pointerEvents = 'none';
    const icon = button.querySelector('.icon') || button.querySelector('span');
    if (icon) {
      icon.innerHTML = '<div class="spinner-tiny"></div>';
    }
  } else {
    button.classList.remove('social-button-loading');
    button.style.pointerEvents = '';
    // Restore original icon (you may need to customize this based on your implementation)
  }
}






