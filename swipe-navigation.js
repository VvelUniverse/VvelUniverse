/**
 * Swipe Navigation Utility
 * Enables left-to-right swipe gesture to go back to previous page
 * Works on both touch devices and desktop (with mouse drag)
 */

(function() {
  'use strict';

  // Configuration
  const SWIPE_THRESHOLD = 50; // Minimum distance in pixels to trigger swipe
  const EDGE_THRESHOLD = 20; // Distance from left edge to start detecting swipe
  const VERTICAL_THRESHOLD = 30; // Maximum vertical movement allowed (to ensure horizontal swipe)
  const SWIPE_VELOCITY_THRESHOLD = 0.3; // Minimum velocity for quick swipe

  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let touchStartTime = 0;
  let isSwipeActive = false;
  let swipeIndicator = null;

  // Create visual swipe indicator
  function createSwipeIndicator() {
    if (swipeIndicator) return;
    
    swipeIndicator = document.createElement('div');
    swipeIndicator.id = 'swipe-indicator';
    swipeIndicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 4px;
      height: 100vh;
      background: linear-gradient(180deg, rgba(96, 165, 250, 0.8) 0%, rgba(34, 211, 238, 0.8) 100%);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.2s ease, width 0.2s ease;
      pointer-events: none;
      box-shadow: 0 0 20px rgba(96, 165, 250, 0.5);
    `;
    document.body.appendChild(swipeIndicator);
  }

  // Show swipe indicator
  function showSwipeIndicator(width) {
    if (!swipeIndicator) createSwipeIndicator();
    swipeIndicator.style.width = Math.min(width, 100) + 'px';
    swipeIndicator.style.opacity = Math.min(width / 100, 0.8);
  }

  // Hide swipe indicator
  function hideSwipeIndicator() {
    if (swipeIndicator) {
      swipeIndicator.style.opacity = '0';
      setTimeout(() => {
        if (swipeIndicator) {
          swipeIndicator.style.width = '4px';
        }
      }, 200);
    }
  }

  // Check if touch started near left edge
  function isNearLeftEdge(x) {
    return x <= EDGE_THRESHOLD;
  }

  // Calculate swipe distance and direction
  function calculateSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);
    const deltaTime = Date.now() - touchStartTime;
    const velocity = Math.abs(deltaX) / deltaTime; // pixels per millisecond

    // Check if it's a valid horizontal swipe
    const isHorizontalSwipe = Math.abs(deltaX) > deltaY;
    const isRightSwipe = deltaX > 0;
    const isLongEnough = Math.abs(deltaX) >= SWIPE_THRESHOLD;
    const isQuickEnough = velocity >= SWIPE_VELOCITY_THRESHOLD || Math.abs(deltaX) >= SWIPE_THRESHOLD * 2;

    return {
      deltaX,
      deltaY,
      isHorizontalSwipe,
      isRightSwipe,
      isLongEnough,
      isQuickEnough,
      shouldGoBack: isHorizontalSwipe && isRightSwipe && isLongEnough && isQuickEnough
    };
  }

  // Navigate back
  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // If no history, go to categories page or index
      const fallbackUrl = document.querySelector('a[href*="categories"]') 
        ? 'categories.html' 
        : 'index.html';
      window.location.href = fallbackUrl;
    }
  }

  // Touch event handlers
  function handleTouchStart(e) {
    const touch = e.touches[0] || e.changedTouches[0];
    if (isNearLeftEdge(touch.clientX)) {
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = Date.now();
      isSwipeActive = true;
      
      // Prevent default to avoid scrolling conflicts
      e.preventDefault();
    }
  }

  function handleTouchMove(e) {
    if (!isSwipeActive) return;
    
    const touch = e.touches[0] || e.changedTouches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;
    const deltaX = currentX - touchStartX;

    // Only show indicator for rightward swipes
    if (deltaX > 0) {
      showSwipeIndicator(deltaX);
    } else {
      hideSwipeIndicator();
    }

    // Prevent default scrolling during swipe
    if (Math.abs(deltaX) > 10) {
      e.preventDefault();
    }
  }

  function handleTouchEnd(e) {
    if (!isSwipeActive) return;

    const touch = e.changedTouches[0] || e.touches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;

    const swipe = calculateSwipe();

    hideSwipeIndicator();

    if (swipe.shouldGoBack) {
      goBack();
    }

    // Reset
    isSwipeActive = false;
    touchStartX = 0;
    touchStartY = 0;
    touchEndX = 0;
    touchEndY = 0;
  }

  // Mouse event handlers (for desktop testing)
  function handleMouseDown(e) {
    if (e.button !== 0) return; // Only left mouse button
    if (isNearLeftEdge(e.clientX)) {
      touchStartX = e.clientX;
      touchStartY = e.clientY;
      touchStartTime = Date.now();
      isSwipeActive = true;
      e.preventDefault();
    }
  }

  function handleMouseMove(e) {
    if (!isSwipeActive) return;
    
    const deltaX = e.clientX - touchStartX;
    if (deltaX > 0) {
      showSwipeIndicator(deltaX);
    } else {
      hideSwipeIndicator();
    }
  }

  function handleMouseUp(e) {
    if (!isSwipeActive) return;

    touchEndX = e.clientX;
    touchEndY = e.clientY;

    const swipe = calculateSwipe();

    hideSwipeIndicator();

    if (swipe.shouldGoBack) {
      goBack();
    }

    // Reset
    isSwipeActive = false;
    touchStartX = 0;
    touchStartY = 0;
    touchEndX = 0;
    touchEndY = 0;
  }

  // Initialize
  function init() {
    // Create swipe indicator
    createSwipeIndicator();

    // Add touch event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    // Add mouse event listeners for desktop testing
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      if (swipeIndicator && swipeIndicator.parentNode) {
        swipeIndicator.parentNode.removeChild(swipeIndicator);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();






