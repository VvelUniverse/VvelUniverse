// Shared JavaScript functions for all science category pages

const postRatings = {};

function ratePost(postId, rating) {
  const starsContainer = document.getElementById(`stars-${postId}`);
  const stars = starsContainer.querySelectorAll('.star');
  const ratingText = document.getElementById(`rating-text-${postId}`);

  stars.forEach((star, index) => {
    const starRating = parseInt(star.getAttribute('data-rating'));
    star.classList.remove('active', 'animated');
    
    if (starRating <= rating) {
      star.classList.add('active');
      setTimeout(() => {
        star.classList.add('animated');
        setTimeout(() => {
          star.classList.remove('animated');
        }, 600);
      }, index * 100);
    }
  });

  postRatings[postId] = rating;
  ratingText.textContent = `Rate ${rating}`;
}

function toggleMenu(menuId) {
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    if (menu.id !== menuId) {
      menu.classList.remove('show');
    }
  });

  const menu = document.getElementById(menuId);
  menu.classList.toggle('show');
}

document.addEventListener('click', function(event) {
  if (!event.target.closest('.three-dots-menu')) {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.classList.remove('show');
    });
  }
});

function showAboutProfile(name) {
  alert(`About ${name}'s Profile\n\nThis feature will show detailed profile information.`);
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.classList.remove('show');
  });
}

function hideAndRestrict(name) {
  if (confirm(`Hide & Restrict ${name}?\n\nThis will hide this user's posts from your feed.`)) {
    alert(`${name} has been hidden and restricted.`);
  }
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.classList.remove('show');
  });
}

function lovePost(postId) {
  const button = event.target.closest('button');
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const directions = [
    { tx: -200, ty: -200 },
    { tx: 200, ty: -200 },
    { tx: -200, ty: 200 },
    { tx: 200, ty: 200 },
    { tx: 0, ty: -250 },
    { tx: 0, ty: 250 },
    { tx: -250, ty: 0 },
    { tx: 250, ty: 0 }
  ];

  directions.forEach((dir, index) => {
    setTimeout(() => {
      const rose = document.createElement('div');
      rose.className = 'rose-explosion';
      rose.textContent = '🌹';
      rose.style.left = centerX + 'px';
      rose.style.top = centerY + 'px';
      rose.style.setProperty('--tx', dir.tx + 'px');
      rose.style.setProperty('--ty', dir.ty + 'px');
      document.body.appendChild(rose);

      setTimeout(() => {
        rose.remove();
      }, 1500);
    }, index * 30);
  });

  alert(`You loved post ${postId} 🌹`);
}

function showFeedback(postId) {
  const commentSection = document.getElementById(`comment-section-${postId}`);
  if (commentSection) {
    commentSection.classList.toggle('show');
    if (commentSection.classList.contains('show')) {
      commentSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

function submitComment(postId) {
  const commentInput = document.querySelector(`#comment-section-${postId} .comment-input`);
  const comment = commentInput.value.trim();
  if (comment) {
    alert(`Feedback submitted for post ${postId}:\n\n"${comment}"`);
    commentInput.value = '';
    document.getElementById(`comment-section-${postId}`).classList.remove('show');
  } else {
    alert('Please enter your feedback before submitting.');
  }
}

function sharePost(postId) {
  alert(`Sharing post ${postId}...`);
}

// Connection storage and count management
let connectionCount = 0;
const connectionsKey = 'user_connections';

// Load connection count from API
async function loadConnectionCount() {
  try {
    const response = await fetch('/api/connect-requests/my-connections-count', {
      credentials: 'include'
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        connectionCount = data.count || 0;
        updateAllConnectionButtons();
        return connectionCount;
      }
    }
  } catch (error) {
    console.error('Failed to load connection count:', error);
  }
  
  // Fallback to localStorage
  const stored = localStorage.getItem(connectionsKey);
  if (stored) {
    const connections = JSON.parse(stored);
    connectionCount = Object.keys(connections).filter(key => connections[key]).length;
  }
  updateAllConnectionButtons();
  return connectionCount;
}

// Update all connection buttons with current count
function updateAllConnectionButtons() {
  document.querySelectorAll('.connect-button.connected').forEach(button => {
    const buttonText = button.querySelector('.text-sm') || button.querySelector('span');
    if (buttonText) {
      if (connectionCount > 0) {
        buttonText.textContent = `Connected (${connectionCount})`;
      } else {
        buttonText.textContent = 'Connected';
      }
    }
  });
}

// Store connection in localStorage
function storeConnection(influencerName, connected) {
  const stored = localStorage.getItem(connectionsKey);
  const connections = stored ? JSON.parse(stored) : {};
  connections[influencerName] = connected;
  localStorage.setItem(connectionsKey, JSON.stringify(connections));
}

// Check if influencer is connected
function isConnected(influencerName) {
  const stored = localStorage.getItem(connectionsKey);
  if (!stored) return false;
  const connections = JSON.parse(stored);
  return connections[influencerName] === true;
}

// Connect with influencer function with dramatic animation
async function connectInfluencer(influencerName, buttonElement) {
  const button = buttonElement || event.target.closest('button');
  if (!button) return;

  // Check if already connected - then disconnect
  if (button.classList.contains('connected')) {
    disconnectInfluencer(influencerName, button);
    return;
  }

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'connection-overlay';
  document.body.appendChild(overlay);

  // Create container
  const container = document.createElement('div');
  container.className = 'connection-container';
  overlay.appendChild(container);

  // Create user profile
  const userProfile = document.createElement('div');
  userProfile.className = 'connection-profile user-profile';
  userProfile.innerHTML = '👤';
  container.appendChild(userProfile);

  // Create celebrity profile
  const celebrityProfile = document.createElement('div');
  celebrityProfile.className = 'connection-profile celebrity-profile';
  celebrityProfile.innerHTML = '⭐';
  container.appendChild(celebrityProfile);

  // Create connection line
  const connectionLine = document.createElement('div');
  connectionLine.className = 'connection-line';
  container.appendChild(connectionLine);

  // Create success message
  const successMsg = document.createElement('div');
  successMsg.className = 'connection-success';
  successMsg.textContent = '✓ Connected!';
  container.appendChild(successMsg);

  // Show overlay
  setTimeout(() => {
    overlay.classList.add('show');
  }, 10);

  // Animate profiles moving together
  setTimeout(() => {
    userProfile.classList.add('connecting');
    celebrityProfile.classList.add('connecting');
    connectionLine.classList.add('active');

    // Create sparkles
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'connection-sparkle';
        const angle = (i / 20) * Math.PI * 2;
        const radius = 100;
        sparkle.style.left = `calc(50% + ${Math.cos(angle) * radius}px)`;
        sparkle.style.top = `calc(50% + ${Math.sin(angle) * radius}px)`;
        sparkle.style.animationDelay = `${i * 0.05}s`;
        container.appendChild(sparkle);
      }, i * 30);
    }
  }, 300);

  // Fade out and remove overlay
  setTimeout(async () => {
    overlay.classList.remove('show');
    setTimeout(async () => {
      overlay.remove();
      
      // Store connection
      storeConnection(influencerName, true);
      
      // Create connection request via API
      try {
        await fetch('/api/connect-requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            influencerName: influencerName,
            sessionTitle: `Connection with ${influencerName}`,
            sessionType: 'video',
            durationMinutes: 30,
            amount: 0,
            message: `Connection request for ${influencerName}`
          })
        });
      } catch (error) {
        console.error('Failed to create connection request:', error);
      }
      
      // Update connection count
      connectionCount++;
      await loadConnectionCount(); // Refresh from API
      
      // Update button
      button.classList.add('connected');
      const buttonText = button.querySelector('.text-sm') || button.querySelector('span');
      if (buttonText) {
        if (connectionCount > 0) {
          buttonText.textContent = `Connected (${connectionCount})`;
        } else {
          buttonText.textContent = 'Connected';
        }
      }
      
      // Show profile page after animation
      showProfilePage(influencerName);
    }, 500);
  }, 2500);
}

// Disconnect function with breach animation
async function disconnectInfluencer(influencerName, buttonElement) {
  const button = buttonElement || event.target.closest('button');
  if (!button) return;

  // Create breach overlay
  const overlay = document.createElement('div');
  overlay.className = 'breach-overlay';
  document.body.appendChild(overlay);

  // Create container
  const container = document.createElement('div');
  container.className = 'breach-container';
  overlay.appendChild(container);

  // Create user profile
  const userProfile = document.createElement('div');
  userProfile.className = 'breach-profile user-profile';
  userProfile.innerHTML = '👤';
  container.appendChild(userProfile);

  // Create celebrity profile
  const celebrityProfile = document.createElement('div');
  celebrityProfile.className = 'breach-profile celebrity-profile';
  celebrityProfile.innerHTML = '⭐';
  container.appendChild(celebrityProfile);

  // Create connection line (that will break)
  const breachLine = document.createElement('div');
  breachLine.className = 'breach-line';
  container.appendChild(breachLine);

  // Create crack effect
  const crack = document.createElement('div');
  crack.className = 'breach-crack';
  container.appendChild(crack);

  // Create breach message
  const breachMsg = document.createElement('div');
  breachMsg.className = 'breach-message';
  breachMsg.textContent = '✗ Disconnected';
  container.appendChild(breachMsg);

  // Show overlay
  setTimeout(() => {
    overlay.classList.add('show');
  }, 10);

  // Animate breach
  setTimeout(() => {
    userProfile.style.setProperty('--breach-x', '-100px');
    celebrityProfile.style.setProperty('--breach-x', '100px');
    userProfile.classList.add('breaching');
    celebrityProfile.classList.add('breaching');
    breachLine.classList.add('breaking');
  }, 300);

  // Fade out and remove overlay
  setTimeout(async () => {
    overlay.classList.remove('show');
    setTimeout(async () => {
      overlay.remove();
      
      // Remove connection from storage
      storeConnection(influencerName, false);
      
      // Update connection count
      if (connectionCount > 0) {
        connectionCount--;
      }
      await loadConnectionCount(); // Refresh from API
      
      // Reset button to original state
      button.classList.remove('connected', 'disconnected');
      const buttonText = button.querySelector('.text-sm') || button.querySelector('span');
      if (buttonText) {
        buttonText.textContent = 'Connect';
      }
      
      // Update all other connected buttons
      updateAllConnectionButtons();
    }, 500);
  }, 2000);
}

// Profile page functionality
let selectedRatio = null;
let selectedTime = null;

function showProfilePage(influencerName) {
  const overlay = document.getElementById('profilePageOverlay');
  if (!overlay) {
    console.error('Profile page overlay not found');
    return;
  }
  
  const profileNameElement = document.getElementById('profileName');
  if (profileNameElement) {
    profileNameElement.textContent = influencerName;
  }
  
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Show overlay with animation
  setTimeout(() => {
    overlay.classList.add('show');
  }, 100);
}

function closeProfilePage() {
  const overlay = document.getElementById('profilePageOverlay');
  if (!overlay) return;
  
  overlay.classList.remove('show');
  
  // Reset selections
  selectedRatio = null;
  selectedTime = null;
  
  // Reset UI
  document.querySelectorAll('.ratio-button').forEach(btn => btn.classList.remove('selected'));
  document.querySelectorAll('.time-button').forEach(btn => btn.classList.remove('selected'));
  const timeOptions = document.getElementById('timeOptions');
  const sendRequestButton = document.getElementById('sendRequestButton');
  if (timeOptions) timeOptions.classList.remove('show');
  if (sendRequestButton) sendRequestButton.classList.remove('show');
}

function selectRatio(ratio, buttonElement) {
  // Remove previous selection
  document.querySelectorAll('.ratio-button').forEach(btn => btn.classList.remove('selected'));
  
  // Select new ratio
  buttonElement.classList.add('selected');
  selectedRatio = ratio;
  
  // Show time options
  const timeOptions = document.getElementById('timeOptions');
  if (timeOptions) {
    timeOptions.classList.add('show');
  }
  
  // Reset time selection
  selectedTime = null;
  document.querySelectorAll('.time-button').forEach(btn => btn.classList.remove('selected'));
  const sendRequestButton = document.getElementById('sendRequestButton');
  if (sendRequestButton) sendRequestButton.classList.remove('show');
}

function selectTime(minutes, buttonElement) {
  // Remove previous selection
  document.querySelectorAll('.time-button').forEach(btn => btn.classList.remove('selected'));
  
  // Select new time
  buttonElement.classList.add('selected');
  selectedTime = minutes;
  
  // Show send request button
  const sendRequestButton = document.getElementById('sendRequestButton');
  if (sendRequestButton) {
    sendRequestButton.classList.add('show');
  }
}

function sendConnectionRequest() {
  if (!selectedRatio || !selectedTime) {
    alert('Please select both connection ratio and time duration.');
    return;
  }

  // Show scheduling animation
  const sendButton = document.getElementById('sendRequestButton');
  if (!sendButton) return;
  
  sendButton.textContent = 'Sending...';
  sendButton.disabled = true;

  // Simulate request sending
  setTimeout(() => {
    // Show confirmation
    const confirmation = document.getElementById('requestConfirmation');
    if (confirmation) {
      confirmation.classList.add('show');
    }
    
    // Reset button
    sendButton.textContent = 'Send Request';
    sendButton.disabled = false;
    
    // Hide confirmation after 3 seconds
    setTimeout(() => {
      if (confirmation) {
        confirmation.classList.remove('show');
      }
      // Optionally close profile page after confirmation
      setTimeout(() => {
        closeProfilePage();
      }, 500);
    }, 3000);
  }, 1000);
}

function switchTab(tabName, buttonElement) {
  // Update active tab
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  buttonElement.classList.add('active');
  
  // Update posts grid based on tab
  const postsGrid = document.getElementById('postsGrid');
  if (!postsGrid) return;
  
  const icons = {
    videos: '📹',
    photos: '📷',
    collaborations: '🤝'
  };
  
  // Update placeholder icons
  postsGrid.querySelectorAll('.post-placeholder').forEach((placeholder) => {
    placeholder.textContent = icons[tabName] || '📹';
  });
}

// Close profile page on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('profilePageOverlay');
    if (overlay && overlay.classList.contains('show')) {
      closeProfilePage();
    }
  }
})
// Initialize connection buttons on page load
document.addEventListener('DOMContentLoaded', async () => {
  // Load connection count
  await loadConnectionCount();
  
  // Mark already connected buttons
  document.querySelectorAll('.connect-button').forEach(button => {
    const onclick = button.getAttribute('onclick');
    if (onclick) {
      const match = onclick.match(/connectInfluencer\(['"]([^'"]+)['"]/);
      if (match) {
        const influencerName = match[1];
        if (isConnected(influencerName)) {
          button.classList.add('connected');
          const buttonText = button.querySelector('.text-sm') || button.querySelector('span');
          if (buttonText) {
            if (connectionCount > 0) {
              buttonText.textContent = `Connected (${connectionCount})`;
            } else {
              buttonText.textContent = 'Connected';
            }
          }
        }
      }
    }
  });
});;
