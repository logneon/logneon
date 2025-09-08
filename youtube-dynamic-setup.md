# LOGNEON YouTube Dynamic Content Integration

## Complete Setup Guide for Real-Time YouTube Content on logneon.com

### Method 1: YouTube Data API v3 + GitHub Actions (RECOMMENDED)

#### Step 1: Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing project
3. Enable "YouTube Data API v3"
4. Create credentials (API Key)
5. Restrict API key to YouTube Data API v3

#### Step 2: Find Your Channel ID

Your channel: `@logneon`
- Visit: `https://www.youtube.com/@logneon`
- View page source, search for `"channelId":"` 
- Or use: `https://commentpicker.com/youtube-channel-id.php`

#### Step 3: GitHub Repository Setup

```
logneon.com/
├── .github/workflows/
│   └── youtube-sync.yml
├── data/
│   ├── youtube-videos.json
│   ├── youtube-stats.json
│   └── youtube-shorts.json
├── js/
│   └── youtube-loader.js
└── index.html
```

#### Step 4: GitHub Action Workflow

Create `.github/workflows/youtube-sync.yml`:

```yaml
name: LOGNEON YouTube Content Sync
on:
  schedule:
    - cron: '0 */4 * * *'  # Every 4 hours
  workflow_dispatch:  # Manual trigger
  
jobs:
  sync-youtube-content:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout Repository
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        
    - name: Install Dependencies
      run: |
        npm init -y
        npm install axios
        
    - name: Fetch YouTube Data
      env:
        YOUTUBE_API_KEY: ${{ secrets.YOUTUBE_API_KEY }}
        CHANNEL_ID: ${{ secrets.LOGNEON_CHANNEL_ID }}
      run: node fetch-youtube.js
      
    - name: Commit Updated Data
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add data/
        git diff --staged --quiet || git commit -m "🔥 Update LOGNEON YouTube content [$(date)]"
        
    - name: Push Changes
      uses: ad-m/github-push-action@master
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

#### Step 5: YouTube Data Fetcher Script

Create `fetch-youtube.js`:

```javascript
const axios = require('axios');
const fs = require('fs');

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.CHANNEL_ID;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

async function fetchChannelData() {
    try {
        console.log('🔥 Fetching LOGNEON YouTube data...');
        
        // Get channel statistics
        const channelResponse = await axios.get(`${BASE_URL}/channels`, {
            params: {
                part: 'snippet,statistics,contentDetails',
                id: CHANNEL_ID,
                key: API_KEY
            }
        });
        
        const channel = channelResponse.data.items[0];
        const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
        
        // Get latest videos
        const videosResponse = await axios.get(`${BASE_URL}/playlistItems`, {
            params: {
                part: 'snippet',
                playlistId: uploadsPlaylistId,
                maxResults: 50,
                key: API_KEY
            }
        });
        
        // Get detailed video info
        const videoIds = videosResponse.data.items.map(item => item.snippet.resourceId.videoId).join(',');
        
        const detailsResponse = await axios.get(`${BASE_URL}/videos`, {
            params: {
                part: 'snippet,statistics,contentDetails',
                id: videoIds,
                key: API_KEY
            }
        });
        
        // Process and save data
        const processedVideos = detailsResponse.data.items.map(video => ({
            id: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
            publishedAt: video.snippet.publishedAt,
            viewCount: parseInt(video.statistics.viewCount || 0),
            likeCount: parseInt(video.statistics.likeCount || 0),
            duration: video.contentDetails.duration,
            embedUrl: `https://www.youtube.com/embed/${video.id}`,
            youtubeUrl: `https://www.youtube.com/watch?v=${video.id}`,
            category: categorizeVideo(video.snippet.title),
            isShort: isShortVideo(video.contentDetails.duration)
        }));
        
        // Separate videos and shorts
        const videos = processedVideos.filter(v => !v.isShort);
        const shorts = processedVideos.filter(v => v.isShort);
        
        // Save channel stats
        const channelStats = {
            name: 'LOGNEON',
            handle: '@logneon',
            subscriberCount: parseInt(channel.statistics.subscriberCount),
            videoCount: parseInt(channel.statistics.videoCount),
            viewCount: parseInt(channel.statistics.viewCount),
            description: channel.snippet.description,
            customUrl: channel.snippet.customUrl,
            publishedAt: channel.snippet.publishedAt,
            lastUpdated: new Date().toISOString()
        };
        
        // Write files
        fs.writeFileSync('./data/youtube-videos.json', JSON.stringify(videos, null, 2));
        fs.writeFileSync('./data/youtube-shorts.json', JSON.stringify(shorts, null, 2));
        fs.writeFileSync('./data/youtube-stats.json', JSON.stringify(channelStats, null, 2));
        
        console.log(`✅ Updated ${videos.length} videos and ${shorts.length} shorts`);
        console.log(`📊 Channel stats: ${channelStats.subscriberCount} subscribers, ${channelStats.videoCount} videos`);
        
    } catch (error) {
        console.error('❌ Error fetching YouTube data:', error.message);
        process.exit(1);
    }
}

function categorizeVideo(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('rj45') || titleLower.includes('ethernet') || titleLower.includes('wifi') || titleLower.includes('network')) {
        return 'networking';
    }
    if (titleLower.includes('eclipse') || titleLower.includes('docker') || titleLower.includes('wordpress')) {
        return 'software';
    }
    if (titleLower.includes('usb') || titleLower.includes('adapter') || titleLower.includes('hardware') || titleLower.includes('trimmer')) {
        return 'hardware';
    }
    if (titleLower.includes('speed test') || titleLower.includes('speedtest') || titleLower.includes('airtel') || titleLower.includes('bsnl')) {
        return 'speed-test';
    }
    if (titleLower.includes('diy') || titleLower.includes('thermal paste') || titleLower.includes('battery')) {
        return 'diy';
    }
    if (titleLower.includes('space station') || titleLower.includes('eclipse') || titleLower.includes('astronomy')) {
        return 'astronomy';
    }
    return 'general';
}

function isShortVideo(duration) {
    // YouTube Shorts are typically under 60 seconds
    // Duration format: PT1M30S or PT45S
    const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return false;
    
    const minutes = parseInt(match[1] || 0);
    const seconds = parseInt(match[2] || 0);
    
    return (minutes * 60 + seconds) <= 60;
}

fetchChannelData();
```

#### Step 6: Dynamic Content Loader

Create `js/youtube-loader.js`:

```javascript
// LOGNEON Dynamic YouTube Content Loader
class YouTubeLoader {
    constructor() {
        this.videos = [];
        this.shorts = [];
        this.stats = {};
        
        this.loadAllData();
    }
    
    async loadAllData() {
        try {
            console.log('🔥 Loading LOGNEON YouTube data...');
            
            // Load all data files
            const [videosData, shortsData, statsData] = await Promise.all([
                fetch('./data/youtube-videos.json').then(r => r.json()),
                fetch('./data/youtube-shorts.json').then(r => r.json()),
                fetch('./data/youtube-stats.json').then(r => r.json())
            ]);
            
            this.videos = videosData;
            this.shorts = shortsData;
            this.stats = statsData;
            
            this.renderContent();
            
        } catch (error) {
            console.error('❌ Error loading YouTube data:', error);
            this.loadFallbackData();
        }
    }
    
    renderContent() {
        this.updateChannelStats();
        this.renderVideos();
        this.renderShorts();
        this.updateLastUpdate();
        
        console.log(`✅ Loaded ${this.videos.length} videos, ${this.shorts.length} shorts`);
    }
    
    updateChannelStats() {
        // Update subscriber count
        const subElement = document.querySelector('.subscriber-chaos');
        if (subElement) {
            subElement.textContent = `${this.stats.subscriberCount} REBELS`;
        }
        
        // Update video count
        const videoCountElements = document.querySelectorAll('.video-count-brutal');
        videoCountElements.forEach(el => {
            el.textContent = `${this.stats.videoCount} TECH DESTRUCTION VIDEOS`;
        });
        
        // Update stats counters
        this.animateStatCounters();
    }
    
    renderVideos() {
        const videosGrid = document.getElementById('videos-grid');
        if (!videosGrid) return;
        
        videosGrid.innerHTML = '';
        
        // Sort videos by view count and date
        const sortedVideos = this.videos.sort((a, b) => 
            new Date(b.publishedAt) - new Date(a.publishedAt)
        );
        
        sortedVideos.forEach((video, index) => {
            const videoCard = this.createVideoCard(video, index);
            videosGrid.appendChild(videoCard);
        });
    }
    
    createVideoCard(video, index) {
        const card = document.createElement('div');
        card.className = 'video-card-brutal';
        card.dataset.videoId = video.id;
        card.dataset.title = video.title;
        card.dataset.views = `${this.formatViews(video.viewCount)} views`;
        card.dataset.date = this.formatDate(video.publishedAt);
        card.dataset.description = video.description;
        
        // Determine chaos level based on views
        const chaosLevel = this.getChaosLevel(video.viewCount);
        const isPopular = video.viewCount > 5000;
        
        card.innerHTML = `
            <div class="video-thumbnail-chaos">
                <img src="${video.thumbnail}" alt="${video.title}" class="thumbnail-img">
                <div class="play-button-destruction">▶</div>
                <div class="chaos-level-indicator ${chaosLevel.class}">${chaosLevel.text}</div>
                ${isPopular ? '<div class="viral-badge">VIRAL HIT!</div>' : ''}
            </div>
            <div class="video-info-brutal">
                <h3 class="video-title-chaos">${this.truncateTitle(video.title)}</h3>
                <div class="video-stats-destruction">
                    <span class="views-chaos">${this.formatViews(video.viewCount)} views</span>
                    <span class="date-chaos">${this.formatDate(video.publishedAt)}</span>
                </div>
                <div class="video-category-tag ${video.category}">${video.category.toUpperCase()}</div>
            </div>
        `;
        
        // Add click handler for video modal
        card.addEventListener('click', () => {
            this.openVideoModal(video);
        });
        
        // Staggered animation
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
        
        return card;
    }
    
    renderShorts() {
        const shortsGrid = document.querySelector('.shorts-grid-chaos');
        if (!shortsGrid) return;
        
        shortsGrid.innerHTML = '';
        
        this.shorts.forEach((short, index) => {
            const shortCard = this.createShortCard(short, index);
            shortsGrid.appendChild(shortCard);
        });
    }
    
    createShortCard(short, index) {
        const card = document.createElement('div');
        card.className = 'short-card-brutal';
        card.dataset.videoId = short.id;
        card.dataset.title = short.title;
        card.dataset.views = `${this.formatViews(short.viewCount)} views`;
        card.dataset.description = short.description;
        
        card.innerHTML = `
            <div class="short-thumbnail-chaos">
                <img src="${short.thumbnail}" alt="${short.title}" class="thumbnail-img">
                <div class="play-button-destruction">▶</div>
                <div class="short-badge">SHORT</div>
                ${short.viewCount > 1000 ? '<div class="viral-badge">VIRAL!</div>' : ''}
            </div>
            <div class="short-info">
                <h4>${this.truncateTitle(short.title, 30)}</h4>
                <span class="short-views">${this.formatViews(short.viewCount)} views</span>
            </div>
        `;
        
        card.addEventListener('click', () => {
            this.openVideoModal(short);
        });
        
        return card;
    }
    
    openVideoModal(video) {
        // Reuse existing modal system
        if (typeof window.openVideoModal === 'function') {
            window.openVideoModal(video.id, video.title, 
                `${this.formatViews(video.viewCount)} views`, 
                this.formatDate(video.publishedAt), 
                video.description);
        } else {
            // Fallback: open in new tab
            window.open(video.youtubeUrl, '_blank');
        }
    }
    
    getChaosLevel(viewCount) {
        if (viewCount >= 15000) return { class: 'legendary', text: 'LEGENDARY' };
        if (viewCount >= 10000) return { class: 'viral', text: 'VIRAL' };
        if (viewCount >= 5000) return { class: 'advanced', text: 'ADVANCED' };
        if (viewCount >= 1000) return { class: 'technical', text: 'TECHNICAL' };
        if (viewCount >= 500) return { class: 'professional', text: 'PROFESSIONAL' };
        return { class: 'experimental', text: 'EXPERIMENTAL' };
    }
    
    formatViews(count) {
        if (count >= 1000000) return Math.floor(count / 100000) / 10 + 'M';
        if (count >= 1000) return Math.floor(count / 100) / 10 + 'K';
        return count.toString();
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 30) return `${diffDays} days ago`;
        if (diffDays < 60) return '1 month ago';
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    }
    
    truncateTitle(title, maxLength = 50) {
        return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
    }
    
    animateStatCounters() {
        const statElements = document.querySelectorAll('.stat-number-chaos');
        
        statElements.forEach(element => {
            const target = parseInt(element.dataset.target);
            let newTarget;
            
            // Update targets with real data
            if (element.dataset.target === '39') {
                newTarget = this.stats.videoCount;
            } else if (element.dataset.target === '168') {
                newTarget = this.stats.subscriberCount;
            } else if (element.dataset.target === '18') {
                const maxViews = Math.max(...this.videos.map(v => v.viewCount));
                newTarget = Math.floor(maxViews / 1000);
            }
            
            if (newTarget && newTarget !== target) {
                element.dataset.target = newTarget;
                this.animateCounter(element, newTarget);
            }
        });
    }
    
    animateCounter(element, target) {
        const duration = 2000;
        const increment = target / (duration / 50);
        let current = 0;
        
        const counter = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 50);
    }
    
    updateLastUpdate() {
        if (this.stats.lastUpdated) {
            console.log(`📅 Last updated: ${new Date(this.stats.lastUpdated).toLocaleString()}`);
        }
    }
    
    loadFallbackData() {
        console.log('⚠️ Using fallback data...');
        // Keep existing static content as fallback
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.logneonYouTube = new YouTubeLoader();
});
```

#### Step 7: Repository Secrets Setup

In your GitHub repository settings, add these secrets:

1. `YOUTUBE_API_KEY` - Your YouTube Data API key
2. `LOGNEON_CHANNEL_ID` - Your channel ID (found in step 2)

#### Step 8: HTML Integration

Update your `index.html` to include:

```html
<!-- Add to head -->
<script src="js/youtube-loader.js"></script>

<!-- Update video grid to be empty initially -->
<div class="videos-grid-chaos" id="videos-grid">
    <!-- Dynamic content loads here -->
</div>

<!-- Add loading state -->
<div id="loading-state" class="loading-chaos">
    <div class="loading-spinner"></div>
    <div class="loading-text">LOADING LOGNEON TECH CHAOS...</div>
</div>
```

### Method 2: Simple RSS Feed Approach (ALTERNATIVE)

If you prefer a simpler approach without API keys:

#### RSS Workflow

Create `.github/workflows/rss-sync.yml`:

```yaml
name: LOGNEON RSS Sync
on:
  schedule:
    - cron: '0 */2 * * *'  # Every 2 hours
  workflow_dispatch:

jobs:
  fetch-rss:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Fetch YouTube RSS
      uses: Promptly-Technologies-LLC/rss-fetch-action@v2
      with:
        feed_url: 'https://www.youtube.com/feeds/videos.xml?channel_id=${{ secrets.LOGNEON_CHANNEL_ID }}'
        file_path: './data/rss-feed.json'
        format: 'json'
    - name: Commit Changes
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add ./data/rss-feed.json
        git diff --staged --quiet || git commit -m "🔥 Update RSS feed"
        git push
```

### Benefits of This Setup

✅ **Automatic Updates** - Content syncs every 4 hours
✅ **Real-time Data** - Video counts, views, descriptions
✅ **No Server Required** - Pure static site solution
✅ **GitHub Actions** - Free automation (2000 minutes/month)
✅ **Brutalist Integration** - Maintains your extreme design
✅ **Mobile Optimized** - Works on all devices
✅ **SEO Friendly** - Static content is indexable
✅ **Fast Loading** - JSON files cached by CDN

### Next Steps

1. **Get YouTube API Key** (15 minutes)
2. **Add secrets to repository** (5 minutes)
3. **Copy files to your repo** (10 minutes)
4. **Test workflow** (manual trigger first)
5. **Deploy to logneon.com** 

This gives you a **completely dynamic LOGNEON website** that stays automatically updated with your latest YouTube content! 🔥⚡📺