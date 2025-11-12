/**
 * Free Social Media Verification Service
 * Uses free APIs and web scraping for follower count verification
 */

let axios, puppeteer;
try {
  axios = require('axios');
  puppeteer = require('puppeteer');
} catch (error) {
  console.warn('⚠️  Axios or Puppeteer not installed. Install with: npm install axios puppeteer');
}

class FreeSocialVerification {
  constructor() {
    this.youtubeApiKey = process.env.YOUTUBE_API_KEY;
    this.varianceThreshold = 0.1; // 10% variance acceptable
  }

  /**
   * Verify YouTube channel
   */
  async verifyYouTube(channelUrl, userProvidedCount) {
    try {
      if (!axios) {
        return {
          verified: false,
          error: 'Axios not installed. Run: npm install axios'
        };
      }
      
      if (!this.youtubeApiKey) {
        return {
          verified: false,
          error: 'YouTube API key not configured. Add YOUTUBE_API_KEY to .env'
        };
      }
      
      // Extract channel ID or username from URL
      const channelIdentifier = this.extractYouTubeIdentifier(channelUrl);
      
      if (!channelIdentifier) {
        return {
          verified: false,
          error: 'Invalid YouTube URL'
        };
      }

      // Try to get channel ID if username was provided
      let channelId = channelIdentifier;
      if (!channelIdentifier.startsWith('UC')) {
        // It's a username, need to get channel ID first
        channelId = await this.getChannelIdFromUsername(channelIdentifier);
        if (!channelId) {
          return {
            verified: false,
            error: 'Could not find YouTube channel'
          };
        }
      }

      // Call YouTube Data API v3 (Free tier: 10,000 units/day)
      const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${this.youtubeApiKey}`;
      const response = await axios.get(url);

      if (!response.data.items || response.data.items.length === 0) {
        return {
          verified: false,
          error: 'Channel not found'
        };
      }

      const apiCount = parseInt(response.data.items[0].statistics.subscriberCount);
      const variance = Math.abs(apiCount - userProvidedCount) / Math.max(userProvidedCount, 1);
      const verified = variance <= this.varianceThreshold;

      return {
        verified,
        apiSubscriberCount: apiCount,
        userProvidedCount,
        variance: variance * 100, // Convert to percentage
        verifiedAt: new Date()
      };
    } catch (error) {
      console.error('YouTube verification error:', error);
      return {
        verified: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  /**
   * Get channel ID from username
   */
  async getChannelIdFromUsername(username) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${username}&type=channel&key=${this.youtubeApiKey}&maxResults=1`;
      const response = await axios.get(url);
      
      if (response.data.items && response.data.items.length > 0) {
        return response.data.items[0].id.channelId;
      }
      return null;
    } catch (error) {
      console.error('Error getting channel ID:', error);
      return null;
    }
  }

  /**
   * Verify Instagram profile (using web scraping - use with caution)
   */
  async verifyInstagram(profileUrl, userProvidedCount) {
    try {
      if (!puppeteer) {
        return {
          verified: false,
          error: 'Puppeteer not installed. Run: npm install puppeteer'
        };
      }
      
      const username = this.extractUsername(profileUrl, 'instagram');
      
      if (!username) {
        return {
          verified: false,
          error: 'Invalid Instagram URL'
        };
      }

      // Launch headless browser
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      try {
        const page = await browser.newPage();
        
        // Set user agent to avoid detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        
        await page.goto(`https://www.instagram.com/${username}/`, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });

        // Wait for follower count to load
        await page.waitForSelector('span[class*="followers"], a[href*="/followers/"]', {
          timeout: 10000
        });

        // Extract follower count
        const followerText = await page.evaluate(() => {
          // Try multiple selectors
          const selectors = [
            'a[href*="/followers/"] span',
            'span[class*="followers"]',
            'div[class*="followers"]'
          ];
          
          for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
              return element.textContent;
            }
          }
          return null;
        });

        await browser.close();

        if (!followerText) {
          return {
            verified: false,
            error: 'Could not extract follower count'
          };
        }

        const apiCount = this.parseFollowerCount(followerText);
        const variance = Math.abs(apiCount - userProvidedCount) / Math.max(userProvidedCount, 1);
        const verified = variance <= this.varianceThreshold;

        return {
          verified,
          apiFollowerCount: apiCount,
          userProvidedCount,
          variance: variance * 100,
          verifiedAt: new Date()
        };
      } finally {
        await browser.close();
      }
    } catch (error) {
      console.error('Instagram verification error:', error);
      return {
        verified: false,
        error: error.message
      };
    }
  }

  /**
   * Verify Twitter/X profile (using web scraping - use with caution)
   */
  async verifyTwitter(profileUrl, userProvidedCount) {
    try {
      if (!puppeteer) {
        return {
          verified: false,
          error: 'Puppeteer not installed. Run: npm install puppeteer'
        };
      }
      
      const username = this.extractUsername(profileUrl, 'twitter');
      
      if (!username) {
        return {
          verified: false,
          error: 'Invalid Twitter URL'
        };
      }

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        
        await page.goto(`https://twitter.com/${username}`, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });

        await page.waitForSelector('[data-testid="UserFollowersCount"]', {
          timeout: 10000
        });

        const followerText = await page.evaluate(() => {
          const element = document.querySelector('[data-testid="UserFollowersCount"]');
          return element ? element.textContent : null;
        });

        await browser.close();

        if (!followerText) {
          return {
            verified: false,
            error: 'Could not extract follower count'
          };
        }

        const apiCount = this.parseFollowerCount(followerText);
        const variance = Math.abs(apiCount - userProvidedCount) / Math.max(userProvidedCount, 1);
        const verified = variance <= this.varianceThreshold;

        return {
          verified,
          apiFollowerCount: apiCount,
          userProvidedCount,
          variance: variance * 100,
          verifiedAt: new Date()
        };
      } finally {
        await browser.close();
      }
    } catch (error) {
      console.error('Twitter verification error:', error);
      return {
        verified: false,
        error: error.message
      };
    }
  }

  /**
   * Verify TikTok profile (using web scraping - use with caution)
   */
  async verifyTikTok(profileUrl, userProvidedCount) {
    try {
      if (!puppeteer) {
        return {
          verified: false,
          error: 'Puppeteer not installed. Run: npm install puppeteer'
        };
      }
      
      const username = this.extractUsername(profileUrl, 'tiktok');
      
      if (!username) {
        return {
          verified: false,
          error: 'Invalid TikTok URL'
        };
      }

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        
        await page.goto(`https://www.tiktok.com/@${username}`, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });

        await page.waitForSelector('[data-e2e="followers-count"]', {
          timeout: 10000
        });

        const followerText = await page.evaluate(() => {
          const element = document.querySelector('[data-e2e="followers-count"]');
          return element ? element.textContent : null;
        });

        await browser.close();

        if (!followerText) {
          return {
            verified: false,
            error: 'Could not extract follower count'
          };
        }

        const apiCount = this.parseFollowerCount(followerText);
        const variance = Math.abs(apiCount - userProvidedCount) / Math.max(userProvidedCount, 1);
        const verified = variance <= this.varianceThreshold;

        return {
          verified,
          apiFollowerCount: apiCount,
          userProvidedCount,
          variance: variance * 100,
          verifiedAt: new Date()
        };
      } finally {
        await browser.close();
      }
    } catch (error) {
      console.error('TikTok verification error:', error);
      return {
        verified: false,
        error: error.message
      };
    }
  }

  /**
   * Verify Facebook page (using web scraping - use with caution)
   */
  async verifyFacebook(profileUrl, userProvidedCount) {
    try {
      // Facebook verification is complex due to login requirements
      // This is a placeholder - may need to use Graph API with OAuth
      return {
        verified: false,
        error: 'Facebook verification requires OAuth. Please use Instagram Graph API instead.'
      };
    } catch (error) {
      return {
        verified: false,
        error: error.message
      };
    }
  }

  /**
   * Helper: Extract YouTube identifier from URL
   */
  extractYouTubeIdentifier(url) {
    const patterns = [
      /youtube\.com\/channel\/([^\/\?]+)/,
      /youtube\.com\/c\/([^\/\?]+)/,
      /youtube\.com\/user\/([^\/\?]+)/,
      /youtube\.com\/@([^\/\?]+)/,
      /youtu\.be\/([^\/\?]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  /**
   * Helper: Extract username from URL
   */
  extractUsername(url, platform) {
    const patterns = {
      instagram: /instagram\.com\/([^\/\?]+)/,
      twitter: /(?:twitter\.com|x\.com)\/([^\/\?]+)/,
      tiktok: /tiktok\.com\/@([^\/\?]+)/,
      facebook: /facebook\.com\/([^\/\?]+)/
    };

    const pattern = patterns[platform];
    if (!pattern) return null;

    const match = url.match(pattern);
    return match ? match[1] : null;
  }

  /**
   * Helper: Parse follower count text to number
   * Handles formats like "1.2M followers", "123K followers", "1,234 followers"
   */
  parseFollowerCount(text) {
    if (!text) return 0;

    // Remove "followers", "subscribers", etc.
    const cleaned = text.toLowerCase()
      .replace(/followers?/g, '')
      .replace(/subscribers?/g, '')
      .replace(/likes?/g, '')
      .trim();

    // Match number with optional K/M suffix
    const match = cleaned.match(/([\d.,]+)\s*([km])?/);
    if (!match) return 0;

    let number = parseFloat(match[1].replace(/,/g, ''));
    const suffix = match[2]?.toLowerCase();

    if (suffix === 'm') {
      number *= 1000000;
    } else if (suffix === 'k') {
      number *= 1000;
    }

    return Math.floor(number);
  }
}

module.exports = new FreeSocialVerification();

