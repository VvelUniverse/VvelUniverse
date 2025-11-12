#!/usr/bin/env python3
"""
Script to generate remaining sports category pages and sports versions of common pages
"""

import os

# Sports category configurations
SPORTS_CATEGORIES = {
    'stick-sports': {
        'title': 'Stick Sports',
        'icon': '🏑',
        'emoji': '🏑',
        'community': 'Stick Sports Community',
        'bg_gradient': 'linear-gradient(to bottom, #0f2a5a, #123571, #000000)',
        'posts': [
            {'name': 'Coach Wilson', 'emoji': '🏑', 'content': 'Field hockey championship highlights! The precision and teamwork on display was incredible. Every pass, every goal, a testament to dedication.\n\n"Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing." - Pelé'},
            {'name': 'Sarah Chen', 'emoji': '🏒', 'content': 'Ice hockey playoff action! The speed, the skill, the intensity - this is what makes hockey special. Breaking down the game-winning goal that sent us to the finals! 🏒'},
            {'name': 'Mike O\'Connor', 'emoji': '🥍', 'content': 'Lacrosse season opener! The fastest game on two feet is back. Analyzing the key plays and strategies that defined this match. Pure athleticism meets tactical brilliance! 🥍'}
        ]
    },
    'water-sports': {
        'title': 'Water Sports',
        'icon': '🏊',
        'emoji': '🏊',
        'community': 'Water Sports Community',
        'bg_gradient': 'linear-gradient(to bottom, #0a4a6e, #0d5a7f, #000000)',
        'posts': [
            {'name': 'Coach Marina', 'emoji': '🏊', 'content': 'Swimming championship finals! World records broken, personal bests achieved. The pool was electric with energy.\n\n"Champions aren\'t made in gyms. Champions are made from something they have deep inside them - a desire, a dream, a vision." - Muhammad Ali'},
            {'name': 'Surf Pro Alex', 'emoji': '🏄', 'content': 'Surfing competition highlights! Riding the perfect wave, the connection between athlete and ocean. These moments define the sport. 🏄'},
            {'name': 'Rowing Coach', 'emoji': '🚣', 'content': 'Rowing regatta championship! Synchronized power, perfect timing, and unwavering determination. Teamwork at its finest on the water! 🚣'}
        ]
    },
    'motor-sports': {
        'title': 'Motor Sports',
        'icon': '🏎️',
        'emoji': '🏎️',
        'community': 'Motor Sports Community',
        'bg_gradient': 'linear-gradient(to bottom, #1a1a1a, #2d2d2d, #000000)',
        'posts': [
            {'name': 'Racing Pro', 'emoji': '🏎️', 'content': 'Formula 1 Grand Prix highlights! Speed, strategy, and split-second decisions. The race was a masterclass in precision driving.\n\n"To finish first, you must first finish." - Rick Mears'},
            {'name': 'Moto Champion', 'emoji': '🏍️', 'content': 'MotoGP race analysis! The skill, the courage, the speed - motorcycle racing at its absolute peak. Breaking down the overtaking maneuvers that defined this race! 🏍️'},
            {'name': 'Rally Driver', 'emoji': '🚗', 'content': 'Rally championship stage! Navigating treacherous terrain at breakneck speeds. The ultimate test of driver and machine. Pure adrenaline! 🚗'}
        ]
    },
    'gymnastics': {
        'title': 'Gymnastics',
        'icon': '🤸',
        'emoji': '🤸',
        'community': 'Gymnastics Community',
        'bg_gradient': 'linear-gradient(to bottom, #4a1a5c, #6b2a7d, #000000)',
        'posts': [
            {'name': 'Gymnastics Coach', 'emoji': '🤸', 'content': 'Gymnastics championship finals! Grace, power, and precision in perfect harmony. Every routine was a work of art.\n\n"Success is the sum of small efforts repeated day in and day out." - Robert Collier'},
            {'name': 'Rhythmic Star', 'emoji': '🎀', 'content': 'Rhythmic gymnastics showcase! The combination of athleticism and artistry is breathtaking. Every movement tells a story. 🎀'},
            {'name': 'Artistic Pro', 'emoji': '🏅', 'content': 'Artistic gymnastics competition! The strength, the flexibility, the courage to perform at the highest level. Breaking down the perfect 10 routines! 🏅'}
        ]
    },
    'ice-sports': {
        'title': 'Ice Sports',
        'icon': '⛸️',
        'emoji': '⛸️',
        'community': 'Ice Sports Community',
        'bg_gradient': 'linear-gradient(to bottom, #1e3a5f, #2d4a7f, #000000)',
        'posts': [
            {'name': 'Figure Skater', 'emoji': '⛸️', 'content': 'Figure skating championship! The elegance, the technical difficulty, the emotional connection. Every performance was magical.\n\n"The only way to do great work is to love what you do." - Steve Jobs'},
            {'name': 'Speed Skater', 'emoji': '🏁', 'content': 'Speed skating world record! Breaking barriers, pushing limits. The pursuit of perfection on ice. Pure speed and precision! 🏁'},
            {'name': 'Ice Hockey Pro', 'emoji': '🏒', 'content': 'Ice hockey playoff action! The intensity, the skill, the teamwork. Every shift matters in the quest for the championship! 🏒'}
        ]
    },
    'animal-sports': {
        'title': 'Animal Sports',
        'icon': '🐴',
        'emoji': '🐴',
        'community': 'Animal Sports Community',
        'bg_gradient': 'linear-gradient(to bottom, #3d2a1f, #5a3d2a, #000000)',
        'posts': [
            {'name': 'Equestrian Pro', 'emoji': '🐴', 'content': 'Equestrian championship! The bond between rider and horse, the precision of dressage, the thrill of show jumping.\n\n"Riding a horse is not a gentle hobby, to be picked up and laid down like a game of solitaire. It is a grand passion." - Ralph Waldo Emerson'},
            {'name': 'Polo Champion', 'emoji': '🏇', 'content': 'Polo tournament highlights! The speed, the strategy, the partnership with the horse. A sport like no other! 🏇'},
            {'name': 'Rodeo Star', 'emoji': '🤠', 'content': 'Rodeo competition! The skill, the courage, the connection with the animals. True western tradition and athleticism! 🤠'}
        ]
    },
    'contact-team-sport': {
        'title': 'Contact Team Sport',
        'icon': '🥊',
        'emoji': '🥊',
        'community': 'Contact Team Sport Community',
        'bg_gradient': 'linear-gradient(to bottom, #5a1a1a, #7a2a2a, #000000)',
        'posts': [
            {'name': 'Rugby Coach', 'emoji': '🏉', 'content': 'Rugby championship final! The physicality, the strategy, the camaraderie. A true test of strength and will.\n\n"Rugby is a game for barbarians played by gentlemen." - Oscar Wilde'},
            {'name': 'American Football', 'emoji': '🏈', 'content': 'Football playoff highlights! The intensity, the strategy, the execution. Every play matters in the quest for victory! 🏈'},
            {'name': 'Boxing Trainer', 'emoji': '🥊', 'content': 'Boxing championship fight! The discipline, the technique, the heart. Breaking down the knockout that defined this match! 🥊'}
        ]
    }
}

def generate_sports_category_page(category_key, config):
    """Generate a sports category page with feed structure"""
    posts_html = ''
    for idx, post in enumerate(config['posts'], 1):
        posts_html += f'''
    <!-- Post {idx} -->
    <article class="post-card rounded-2xl shadow-lg backdrop-blur-lg bg-white/10 p-4 md:p-6">
      <!-- Profile Overlay -->
      <div class="profile-overlay rounded-xl px-4 py-2 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 flex-shrink-0">
          <div class="hexagon w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
            <div class="hexagon w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
              <span class="text-base">{post['emoji']}</span>
            </div>
          </div>
          <div class="flex flex-col">
            <h3 class="text-white font-semibold text-sm glow-text cursor-pointer hover:opacity-80 transition">{post['name']}</h3>
          </div>
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
          <div class="flex items-center gap-2">
            <div class="stars-container" id="stars-{idx}">
              <span class="star" data-rating="1" onclick="ratePost({idx}, 1)">⭐</span>
              <span class="star" data-rating="2" onclick="ratePost({idx}, 2)">⭐</span>
              <span class="star" data-rating="3" onclick="ratePost({idx}, 3)">⭐</span>
              <span class="star" data-rating="4" onclick="ratePost({idx}, 4)">⭐</span>
              <span class="star" data-rating="5" onclick="ratePost({idx}, 5)">⭐</span>
            </div>
            <span class="text-gray-300 text-xs" id="rating-text-{idx}">Rate</span>
          </div>
          <div class="three-dots-menu">
            <button onclick="toggleMenu('menu-{idx}')" class="text-white hover:text-gray-300 transition p-1">
              <i data-lucide="more-vertical" class="w-5 h-5"></i>
            </button>
            <div class="dropdown-menu" id="menu-{idx}">
              <div class="dropdown-item" onclick="showAboutProfile('{post['name']}')">About Profile</div>
              <div class="dropdown-item" onclick="hideAndRestrict('{post['name']}')">Hide & Restrict</div>
            </div>
          </div>
        </div>
      </div>

      <div class="media-placeholder rounded-xl h-64 md:h-96 mb-4 flex items-center justify-center">
        <p class="text-gray-300 text-sm">📸 Image/Video Placeholder</p>
      </div>
      <div class="caption mb-4">
        <p class="text-white drop-shadow-md">
          {post['content']}
        </p>
      </div>
      <div class="flex items-center gap-4 flex-wrap">
        <button onclick="lovePost({idx})" class="love-button flex items-center gap-2 px-4 py-2 rounded-lg transition">
          <span class="text-lg">🌹</span>
          <span class="text-sm">Love</span>
        </button>
        <button onclick="sharePost({idx})" class="share-button flex items-center gap-2 px-4 py-2 rounded-lg transition">
          <i data-lucide="share-2" class="w-5 h-5"></i>
          <span class="text-sm">Share</span>
        </button>
        <button onclick="showFeedback({idx})" class="feedback-button flex items-center gap-2 px-4 py-2 rounded-lg transition">
          <i data-lucide="message-circle" class="w-5 h-5"></i>
          <span class="text-sm">Feedback</span>
        </button>
        <button onclick="connectInfluencer('{post['name']}', this)" class="connect-button flex items-center gap-2 px-4 py-2 rounded-lg transition font-semibold text-white">
          <i data-lucide="user-plus" class="w-4 h-4"></i>
          <span class="text-sm">Connect</span>
        </button>
      </div>
      <div class="comment-section" id="comment-section-{idx}">
        <textarea class="comment-input" placeholder="Write your feedback here..."></textarea>
        <button class="submit-comment" onclick="submitComment({idx})">Submit Feedback</button>
      </div>
    </article>
'''
    
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vvel Universe | {config['title']}</title>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;800&family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    * {{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }}

    body {{
      font-family: 'Outfit', sans-serif;
      background: {config['bg_gradient']};
      min-height: 100vh;
      color: white;
      padding-bottom: 80px;
    }}

    .post-card {{
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }}

    .post-card:hover {{
      transform: scale(1.02);
    }}

    .glow-text {{
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }}

    .bottom-nav {{
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      background: rgba(255, 255, 255, 0.1);
    }}

    .nav-icon {{
      transition: all 0.3s ease;
    }}

    .nav-icon:hover {{
      transform: scale(1.2);
      filter: drop-shadow(0 0 8px rgba(147, 197, 253, 0.8));
    }}

    .media-placeholder {{
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(14, 165, 233, 0.3));
    }}

    .hexagon {{
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    }}

    .post-card {{
      position: relative;
    }}

    .profile-overlay {{
      position: absolute;
      top: 16px;
      left: 16px;
      right: 16px;
      z-index: 10;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      width: calc(100% - 32px);
    }}

    .stars-container {{
      display: flex;
      gap: 2px;
      align-items: center;
    }}

    .star {{
      cursor: pointer;
      transition: all 0.2s ease;
      color: #6b7280;
      font-size: 14px;
    }}

    .star:hover {{
      color: #fbbf24;
      transform: scale(1.2);
    }}

    .star.active {{
      color: #fbbf24;
    }}

    .star.animated {{
      animation: starExplode 0.6s ease-out;
    }}

    @keyframes starExplode {{
      0% {{
        transform: scale(1);
        opacity: 1;
      }}
      50% {{
        transform: scale(1.5) rotate(180deg);
        opacity: 0.8;
      }}
      100% {{
        transform: scale(1) rotate(360deg);
        opacity: 1;
      }}
    }}

    .three-dots-menu {{
      position: relative;
    }}

    .dropdown-menu {{
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      min-width: 180px;
      overflow: hidden;
      display: none;
      z-index: 20;
    }}

    .dropdown-menu.show {{
      display: block;
      animation: slideDown 0.3s ease-out;
    }}

    @keyframes slideDown {{
      from {{
        opacity: 0;
        transform: translateY(-10px);
      }}
      to {{
        opacity: 1;
        transform: translateY(0);
      }}
    }}

    .dropdown-item {{
      padding: 12px 16px;
      color: white;
      cursor: pointer;
      transition: background 0.2s ease;
      font-size: 14px;
    }}

    .dropdown-item:hover {{
      background: rgba(255, 255, 255, 0.1);
    }}

    .love-button {{
      background: rgba(236, 72, 153, 0.3) !important;
      border: 1px solid rgba(236, 72, 153, 0.5);
    }}

    .love-button:hover {{
      background: rgba(236, 72, 153, 0.5) !important;
    }}

    .share-button {{
      background: rgba(34, 197, 94, 0.3) !important;
      border: 1px solid rgba(34, 197, 94, 0.5);
    }}

    .share-button:hover {{
      background: rgba(34, 197, 94, 0.5) !important;
    }}

    .feedback-button {{
      background: rgba(234, 179, 8, 0.3) !important;
      border: 1px solid rgba(234, 179, 8, 0.5);
    }}

    .feedback-button:hover {{
      background: rgba(234, 179, 8, 0.5) !important;
    }}

    .rose-explosion {{
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      font-size: 30px;
      animation: explodeRose 1.5s ease-out forwards;
    }}

    @keyframes explodeRose {{
      0% {{
        transform: scale(1) translate(0, 0);
        opacity: 1;
      }}
      50% {{
        opacity: 0.8;
      }}
      100% {{
        transform: scale(3) translate(var(--tx), var(--ty));
        opacity: 0;
      }}
    }}

    .comment-section {{
      display: none;
      margin-top: 16px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }}

    .comment-section.show {{
      display: block;
      animation: fadeIn 0.3s ease-out;
    }}

    @keyframes fadeIn {{
      from {{
        opacity: 0;
        transform: translateY(-10px);
      }}
      to {{
        opacity: 1;
        transform: translateY(0);
      }}
    }}

    .comment-input {{
      width: 100%;
      padding: 12px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: white;
      font-size: 14px;
      resize: vertical;
      min-height: 80px;
    }}

    .comment-input::placeholder {{
      color: rgba(255, 255, 255, 0.5);
    }}

    .submit-comment {{
      margin-top: 8px;
      padding: 8px 16px;
      background: linear-gradient(to right, #3b82f6, #8b5cf6);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: transform 0.2s ease;
    }}

    .submit-comment:hover {{
      transform: scale(1.05);
    }}

    .connect-button {{
      background: linear-gradient(to right, #3b82f6, #8b5cf6) !important;
      border: none !important;
    }}

    .connect-button:hover {{
      background: linear-gradient(to right, #2563eb, #7c3aed) !important;
    }}

    .connect-button.connected {{
      background: linear-gradient(to right, #10b981, #059669) !important;
      cursor: pointer;
      opacity: 1;
    }}

    .connect-button.connected:hover {{
      transform: scale(1.05);
    }}
  </style>
</head>
<body>
  <!-- Header -->
  <header class="text-center py-6 px-4">
    <h1 class="text-3xl md:text-4xl font-bold glow-text mb-2" style="font-family: 'Orbitron', sans-serif;">
      {config['icon']} Vvel Universe
    </h1>
    <div class="text-sm md:text-base text-gray-300 space-y-1">
      <p>Connect • Compete • Celebrate</p>
      <p class="text-xs text-gray-400">{config['community']}</p>
    </div>
  </header>

  <!-- Feed Container -->
  <main class="max-w-2xl mx-auto px-4 space-y-6 pb-6">
    {posts_html}
  </main>

  <!-- Bottom Navigation -->
  <nav class="bottom-nav fixed bottom-0 left-0 right-0 border-t border-white/20">
    <div class="max-w-2xl mx-auto flex justify-around items-center py-4 px-4">  
      <button onclick="window.location.href='sports-home.html'" class="nav-icon flex flex-col items-center gap-1">
        <i data-lucide="home" class="w-6 h-6"></i>
        <span class="text-xs">Home</span>
      </button>
      <button onclick="window.location.href='sports-community.html'" class="nav-icon flex flex-col items-center gap-1">
        <i data-lucide="users" class="w-6 h-6"></i>
        <span class="text-xs">Community</span>
      </button>
      <button onclick="window.location.href='sports-search.html'" class="nav-icon flex flex-col items-center gap-1">
        <i data-lucide="search" class="w-6 h-6"></i>
        <span class="text-xs">Search</span>
      </button>
      <button onclick="window.location.href='sports-wallet.html'" class="nav-icon flex flex-col items-center gap-1">
        <i data-lucide="wallet" class="w-6 h-6"></i>
        <span class="text-xs">Wallet</span>
      </button>
      <button onclick="window.location.href='sports-alerts.html'" class="nav-icon flex flex-col items-center gap-1">
        <i data-lucide="bell" class="w-6 h-6"></i>
        <span class="text-xs">Alerts</span>
      </button>
      <button onclick="window.location.href='sports-celebrations.html'" class="nav-icon flex flex-col items-center gap-1">
        <i data-lucide="party-popper" class="w-6 h-6"></i>
        <span class="text-xs">Celebrations</span>
      </button>
    </div>
  </nav>

  <script src="sports-common.js"></script>
  <script>
    lucide.createIcons();

    const observerOptions = {{
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }};

    const observer = new IntersectionObserver((entries) => {{
      entries.forEach(entry => {{
        if (entry.isIntersecting) {{
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }}
      }});
    }}, observerOptions);

    document.addEventListener('DOMContentLoaded', () => {{
      const posts = document.querySelectorAll('.post-card');
      posts.forEach((post, index) => {{
        post.style.opacity = '0';
        post.style.transform = 'translateY(20px)';
        post.style.transition = `opacity 0.6s ease ${{index * 0.1}}s, transform 0.6s ease ${{index * 0.1}}s`;
        observer.observe(post);
      }});
    }});
  </script>
</body>
</html>'''
    
    return html

if __name__ == '__main__':
    # Generate all sports category pages
    for category_key, config in SPORTS_CATEGORIES.items():
        filename = f'sports-{category_key}.html'
        html_content = generate_sports_category_page(category_key, config)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f'Generated {filename}')




