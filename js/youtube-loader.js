// LOGNEON DYNAMIC YOUTUBE LOADER - PRODUCTION READY
// REAL YOUTUBE CHANNEL INTEGRATION WITH PROPER ERROR HANDLING

class LogneonYouTubeLoader {
    constructor() {
        this.baseDataPath = './data/';
        this.loadedData = {
            stats: null,
            videos: [],
            shorts: []
        };
        this.isLoading = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        console.log('🔥 LOGNEON YouTube Loader initialized');
        this.initializeLoader();
    }
    
    async initializeLoader() {
        // Start loading immediately when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadAllYouTubeData());
        } else {
            this.loadAllYouTubeData();
        }
    }
    
    async loadAllYouTubeData() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.updateLoadingStatus('Connecting to LOGNEON YouTube...', 10);
        
        try {
            console.log('📡 Loading YouTube data from GitHub Actions...');
            
            // Try to load all data files with Promise.allSettled for better error handling
            const dataPromises = [
                this.loadDataFile('youtube-stats.json'),
                this.loadDataFile('youtube-videos.json'), 
                this.loadDataFile('youtube-shorts.json')
            ];
            
            this.updateLoadingStatus('Processing channel data...', 40);
            
            const results = await Promise.allSettled(dataPromises);
            
            // Process results with fallback for each
            const [statsResult, videosResult, shortsResult] = results;
            
            // Handle stats
            if (statsResult.status === 'fulfilled') {
                this.loadedData.stats = statsResult.value;
                console.log('✅ Stats loaded:', this.loadedData.stats);
            } else {
                console.warn('⚠️ Stats failed, using fallback');
                this.loadedData.stats = this.getFallbackStats();
            }
            
            // Handle videos
            if (videosResult.status === 'fulfilled') {
                const videoData = videosResult.value;
                this.loadedData.videos = videoData.videos || videoData || [];
                console.log(`✅ Loaded ${this.loadedData.videos.length} videos`);
            } else {
                console.warn('⚠️ Videos failed, using fallback');
                this.loadedData.videos = this.getFallbackVideos();
            }
            
            // Handle shorts
            if (shortsResult.status === 'fulfilled') {
                const shortData = shortsResult.value;
                this.loadedData.shorts = shortData.shorts || shortData || [];
                console.log(`✅ Loaded ${this.loadedData.shorts.length} shorts`);
            } else {
                console.warn('⚠️ Shorts failed, using fallback');
                this.loadedData.shorts = this.getFallbackShorts();
            }
            
            this.updateLoadingStatus('Rendering LOGNEON content...', 80);
            
            // Render all content
            this.renderAllContent();
            
            this.updateLoadingStatus('LOGNEON CHAOS ACTIVATED!', 100);
            
            // Hide loader and show success
            setTimeout(() => {
                this.hideLoader();
                this.showSuccessNotification();
            }, 1500);
            
        } catch (error) {
            console.error('❌ YouTube loading failed:', error);
            this.handleLoadingError(error);
        }
        
        this.isLoading = false;
    }
    
    async loadDataFile(filename) {
        const url = this.baseDataPath + filename;
        console.log(`📁 Loading: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✅ Loaded ${filename}`);
        return data;
    }
    
    renderAllContent() {
        // Update all stats
        this.updateChannelStats();
        
        // Render video sections
        this.renderLatestVideos();
        this.renderPopularVideos(); 
        this.renderShorts();
        
        // Update navigation counters
        this.updateNavigationCounters();
        
        console.log('✅ All LOGNEON content rendered');
    }
    
    updateChannelStats() {
        const stats = this.loadedData.stats;
        const subscriberCount = stats.subscriberCount || 168;
        const videoCount = stats.videoCount || 39;
        const viewCount = stats.viewCount || 78609;
        
        console.log(`📊 Updating stats: ${subscriberCount} subs, ${videoCount} videos`);
        
        // Update ALL subscriber elements
        this.updateElements([
            '#subscriber-count',
            '#nav-subscriber-count',
            '#floating-subscribers',
            '#subscribe-counter'
        ], subscriberCount);
        
        // Update subscriber text with REBELS
        this.updateElements([
            '#subscribe-count-display'
        ], `${subscriberCount} REBELS`);
        
        // Update video counts
        this.updateElements([
            '#video-count',
            '#nav-video-count', 
            '#floating-videos',
            '#about-video-count',
            '#latest-counter'
        ], videoCount);
        
        // Update view counts
        const formattedViews = this.formatViewCount(viewCount);
        this.updateElements([
            '#total-views',
            '#floating-views',
            '#about-total-views'
        ], formattedViews);
        
        // Update last update time
        if (stats.lastUpdated) {
            const updateTime = new Date(stats.lastUpdated).toLocaleString();
            this.updateElements(['#last-update'], `Updated: ${updateTime}`);
        }
    }
    
    updateElements(selectors, value) {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el) el.textContent = value;
            });
        });
    }
    
    renderLatestVideos() {
        const container = document.getElementById('latest-videos-grid');
        if (!container) return;
        
        const sortedVideos = [...this.loadedData.videos]
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, 15);
        
        container.innerHTML = '';
        
        sortedVideos.forEach((video, index) => {
            const card = this.createVideoCard(video, index);
            container.appendChild(card);
            
            // Animate in
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        });
        
        console.log(`📺 Rendered ${sortedVideos.length} latest videos`);
    }
    
    renderPopularVideos() {
        const container = document.getElementById('popular-videos-grid');
        if (!container) return;
        
        const popularVideos = [...this.loadedData.videos]
            .sort((a, b) => parseInt(b.viewCount || 0) - parseInt(a.viewCount || 0))
            .slice(0, 10);
        
        container.innerHTML = '';
        
        popularVideos.forEach((video, index) => {
            const card = this.createVideoCard(video, index, true);
            container.appendChild(card);
            
            // Animate in
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 150);
        });
        
        console.log(`🔥 Rendered ${popularVideos.length} popular videos`);
    }
    
    renderShorts() {
        const container = document.getElementById('shorts-videos-grid');
        if (!container) return;
        
        const latestShorts = [...this.loadedData.shorts]
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, 6);
        
        container.innerHTML = '';
        
        latestShorts.forEach((short, index) => {
            const card = this.createShortCard(short, index);
            container.appendChild(card);
        });
        
        console.log(`⚡ Rendered ${latestShorts.length} shorts`);
    }
    
    createVideoCard(video, index, isPopular = false) {
        const card = document.createElement('div');
        const chaosLevel = this.getChaosLevel(video.viewCount);
        
        card.className = `video-brutal-card ${chaosLevel.toLowerCase()}`;
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.9)';
        card.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        const isViral = parseInt(video.viewCount || 0) >= 5000;
        
        card.innerHTML = `
            <div class="video-thumbnail-chaos">
                ${video.thumbnail ? 
                    `<img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail-image" loading="lazy">` :
                    `<div class="placeholder-thumbnail ${this.getCategoryClass(video.category)}">${this.getCategoryEmoji(video.category)}</div>`
                }
                <div class="play-button-destruction ${chaosLevel.toLowerCase()}">
                    <div class="play-icon">▶</div>
                </div>
                <div class="chaos-level-indicator ${chaosLevel.toLowerCase()}">${chaosLevel}</div>
                ${isViral ? '<div class="viral-badge">💥 VIRAL</div>' : ''}
                <div class="duration-brutal">${this.formatDuration(video.duration)}</div>
                <div class="view-count-display">${this.formatViewCount(video.viewCount)}</div>
                <div class="glitch-overlay-video"></div>
            </div>
            <div class="video-info-chaos">
                <h3 class="video-title-brutal">${this.truncateTitle(video.title, 65)}</h3>
                <div class="video-meta-destruction">
                    <span class="views-chaos ${chaosLevel.toLowerCase()}">${this.formatViewCount(video.viewCount)}</span>
                    <span class="date-chaos">${this.formatRelativeDate(video.publishedAt)}</span>
                    <span class="engagement-brutal">${chaosLevel}</span>
                </div>
                <div class="video-description-glitch">${this.truncateDescription(video.description, 120)}</div>
                <div class="video-category-tag ${this.getCategoryClass(video.category)}">${(video.category || 'TECH').toUpperCase()}</div>
            </div>
        `;
        
        // Add click handler for modal
        card.addEventListener('click', () => {
            this.openVideoModal(video);
        });
        
        return card;
    }
    
    createShortCard(short, index) {
        const card = document.createElement('div');
        const chaosLevel = this.getChaosLevel(short.viewCount);
        
        card.className = `short-brutal-card ${chaosLevel.toLowerCase()}`;
        
        card.innerHTML = `
            <div class="short-thumbnail-chaos">
                ${short.thumbnail ? 
                    `<img src="${short.thumbnail}" alt="${short.title}" class="short-thumbnail-image" loading="lazy">` :
                    `<div class="placeholder-thumbnail short ${chaosLevel.toLowerCase()}">⚡</div>`
                }
                <div class="short-play-button">
                    <div class="play-icon">▶</div>
                </div>
                <div class="chaos-level-indicator ${chaosLevel.toLowerCase()}">${chaosLevel}</div>
                <div class="short-badge">SHORT</div>
            </div>
            <div class="short-info-chaos">
                <h4 class="short-title-brutal">${this.truncateTitle(short.title, 40)}</h4>
                <span class="short-views ${chaosLevel.toLowerCase()}">${this.formatViewCount(short.viewCount)}</span>
            </div>
        `;
        
        // Add click handler
        card.addEventListener('click', () => {
            window.open(`https://www.youtube.com/watch?v=${short.id}`, '_blank');
        });
        
        return card;
    }
    
    openVideoModal(video) {
        const modal = document.getElementById('video-modal');
        const iframe = document.getElementById('video-iframe');
        const title = document.getElementById('modal-title');
        const views = document.getElementById('modal-views');
        const description = document.getElementById('modal-description');
        const youtubeLink = document.getElementById('modal-youtube-link');
        
        if (!modal) {
            window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
            return;
        }
        
        // Update modal content
        title.textContent = video.title || 'LOGNEON Tech Video';
        views.textContent = `${this.formatViewCount(video.viewCount)} • ${this.formatRelativeDate(video.publishedAt)}`;
        description.textContent = video.description || 'LOGNEON tech tutorial - Subscribe for more dynamic content!';
        
        // Set iframe with proper parameters
        const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`;
        iframe.src = embedUrl;
        
        // Update YouTube link
        if (youtubeLink) {
            youtubeLink.href = `https://www.youtube.com/watch?v=${video.id}`;
        }
        
        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        console.log(`🎬 Opened video: ${video.title}`);
    }
    
    updateNavigationCounters() {
        this.updateElements(['#latest-counter'], this.loadedData.videos.length);
        this.updateElements(['#popular-counter'], Math.min(this.loadedData.videos.length, 6));
        this.updateElements(['#shorts-counter'], this.loadedData.shorts.length);
    }
    
    handleLoadingError(error) {
        console.error('💥 Loading error:', error);
        this.retryCount++;
        
        if (this.retryCount <= this.maxRetries) {
            console.log(`🔄 Retry ${this.retryCount}/${this.maxRetries}`);
            setTimeout(() => {
                this.loadAllYouTubeData();
            }, 2000 * this.retryCount);
            return;
        }
        
        // Use fallback data after max retries
        console.log('📦 Using fallback data');
        this.loadedData.stats = this.getFallbackStats();
        this.loadedData.videos = this.getFallbackVideos();
        this.loadedData.shorts = this.getFallbackShorts();
        
        this.renderAllContent();
        this.hideLoader();
        this.showErrorNotification();
    }
    
    updateLoadingStatus(message, progress) {
        const statusEl = document.getElementById('loader-status');
        const progressEl = document.getElementById('loader-progress');
        
        if (statusEl) statusEl.textContent = message;
        if (progressEl) progressEl.style.width = `${progress}%`;
    }
    
    hideLoader() {
        const loader = document.getElementById('dynamic-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
        console.log('✅ Loader hidden');
    }
    
    showSuccessNotification() {
        console.log('🎉 LOGNEON Content Loaded Successfully');
        // Add visual notification if needed
    }
    
    showErrorNotification() {
        console.log('⚠️ Using offline content');
        // Add visual error notification if needed
    }
    
    // UTILITY FUNCTIONS
    formatViewCount(count) {
        if (!count || count === 0) return '0 views';
        const num = parseInt(count);
        
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M views`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K views`;
        } else {
            return `${num} views`;
        }
    }
    
    formatRelativeDate(dateString) {
        if (!dateString) return 'Recently';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 1) return 'Today';
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    }
    
    formatDuration(duration) {
        if (!duration) return '';
        
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return '';
        
        const hours = parseInt(match[1] || 0);
        const minutes = parseInt(match[2] || 0);
        const seconds = parseInt(match[3] || 0);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    truncateTitle(title, maxLength = 60) {
        if (!title) return 'Untitled Video';
        return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
    }
    
    truncateDescription(description, maxLength = 120) {
        if (!description) return 'No description available - Subscribe to LOGNEON for more tech content!';
        return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
    }
    
    getChaosLevel(viewCount) {
        const views = parseInt(viewCount || 0);
        
        if (views >= 15000) return 'LEGENDARY';
        if (views >= 8000) return 'VIRAL';
        if (views >= 3000) return 'POPULAR';
        if (views >= 1000) return 'TRENDING';
        if (views >= 500) return 'RISING';
        return 'EMERGING';
    }
    
    getCategoryClass(category) {
        const categoryMap = {
            'networking': 'networking',
            'hardware': 'hardware',
            'software': 'web',
            'diy': 'maintenance',
            'mobile': 'tech',
            'security': 'security'
        };
        
        if (!category) return 'tech';
        
        const lower = category.toLowerCase();
        for (const [key, value] of Object.entries(categoryMap)) {
            if (lower.includes(key)) return value;
        }
        
        return 'tech';
    }
    
    getCategoryEmoji(category) {
        const emojiMap = {
            'networking': '🌐',
            'hardware': '⚡',
            'software': '💻',
            'diy': '🔧',
            'mobile': '📱',
            'security': '🛡️'
        };
        
        if (!category) return '🎬';
        
        const lower = category.toLowerCase();
        for (const [key, value] of Object.entries(emojiMap)) {
            if (lower.includes(key)) return value;
        }
        
        return '🎬';
    }
    
    // FALLBACK DATA
    getFallbackStats() {
        return {
            subscriberCount: 168,
            videoCount: 39,
            viewCount: 78609,
            name: 'LOGNEON',
            lastUpdated: new Date().toISOString()
        };
    }
    
    getFallbackVideos() {
        return [
            {
                id: 'fallback1',
                title: 'Make RJ45 Ethernet Cable at Home | Crimp + Punch Tool | Speed & Ping Test',
                description: 'Learn how to make professional RJ45 Ethernet cables at home using crimp and punch tools. Includes comprehensive speed and ping testing of the homemade cables to ensure optimal performance.',
                thumbnail: null,
                publishedAt: '2024-09-01T10:00:00Z',
                viewCount: 12500,
                duration: 'PT8M30S',
                category: 'networking'
            },
            {
                id: 'fallback2',
                title: 'BSNL Port Forwarding | Virtual Server | Dynamic IP | With HTTPS',
                description: 'Complete guide to BSNL port forwarding setup with virtual server configuration, dynamic IP handling, and HTTPS setup for home servers.',
                thumbnail: null,
                publishedAt: '2024-08-28T14:20:00Z',
                viewCount: 8200,
                duration: 'PT18M45S',
                category: 'networking'
            },
            {
                id: 'fallback3',
                title: 'How to Fill Distilled Water in Battery/Inverter | Alert | Proper Check its TDS',
                description: 'Proper method to fill distilled water in batteries and inverters. Important TDS testing procedures for battery maintenance and longevity.',
                thumbnail: null,
                publishedAt: '2024-08-25T09:15:00Z',
                viewCount: 9800,
                duration: 'PT7M15S',
                category: 'diy'
            },
            {
                id: 'fallback4',
                title: '5G SpeedTest | Samsung S24 | JIO and Airtel #5G #S24 #JIO5G',
                description: 'Comprehensive 5G speed testing on Samsung Galaxy S24 with JIO and Airtel networks. Real-world performance comparison and network analysis.',
                thumbnail: null,
                publishedAt: '2024-08-20T16:30:00Z',
                viewCount: 6750,
                duration: 'PT6M52S',
                category: 'mobile'
            },
            {
                id: 'fallback5',
                title: 'Desktop HardDrive on Phone, USB to SSD with External PowerSupply, PiBox',
                description: 'How to add Desktop HardDrive on phone, USB to SSD with external power supply using PiBox. Complete tutorial for mobile storage expansion.',
                thumbnail: null,
                publishedAt: '2024-08-15T11:45:00Z',
                viewCount: 4200,
                duration: 'PT11M20S',
                category: 'hardware'
            }
        ];
    }
    
    getFallbackShorts() {
        return [
            {
                id: 'short1',
                title: 'Quick Network Fix #shorts',
                description: 'Quick networking tip for home users',
                thumbnail: null,
                publishedAt: '2024-09-05T08:00:00Z',
                viewCount: 2500,
                duration: 'PT45S'
            },
            {
                id: 'short2',
                title: 'DIY Tech Hack #shorts',
                description: 'Simple tech hack for everyday use',
                thumbnail: null,
                publishedAt: '2024-09-03T12:00:00Z',
                viewCount: 1800,
                duration: 'PT38S'
            }
        ];
    }
    
    // PUBLIC METHODS FOR EXTERNAL ACCESS
    refresh() {
        console.log('🔄 Manual refresh triggered');
        this.retryCount = 0;
        this.loadAllYouTubeData();
    }
    
    getLoadedData() {
        return this.loadedData;
    }
}

// INITIALIZE YOUTUBE LOADER
let logneonYouTubeLoader;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing LOGNEON YouTube Loader...');
    logneonYouTubeLoader = new LogneonYouTubeLoader();
});

// GLOBAL FUNCTIONS FOR MODAL CONTROL
window.closeVideoModal = function() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-iframe');
    
    if (iframe) iframe.src = '';
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
    
    console.log('🎬 Video modal closed');
};

window.refreshYouTubeContent = function() {
    if (logneonYouTubeLoader) {
        logneonYouTubeLoader.refresh();
    }
};

console.log('📺 LOGNEON YouTube Loader Ready!');