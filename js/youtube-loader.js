// LOGNEON COMPLETE DYNAMIC LOADER - ALL CONTENT FROM GITHUB ACTIONS
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 LOGNEON COMPLETE DYNAMIC SYSTEM LOADING...');
    initDynamicLoader();
});

class LogNeonDynamicLoader {
    constructor() {
        this.data = {
            videos: [],
            shorts: [],
            stats: {}
        };
        this.isLoading = false;
        this.lastUpdate = null;
        
        // Auto-refresh every 5 minutes to check for new data
        setInterval(() => this.checkForUpdates(), 5 * 60 * 1000);
    }

    async loadAllData() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingIndicator();
        
        try {
            console.log('📡 Loading complete dynamic data...');
            
            // Fetch all JSON files from GitHub Actions
            const responses = await Promise.allSettled([
                fetch('./data/youtube-videos.json'),
                fetch('./data/youtube-shorts.json'),
                fetch('./data/youtube-stats.json')
            ]);

            // Process videos
            if (responses[0].status === 'fulfilled' && responses[0].value.ok) {
                const videosData = await responses[0].value.json();
                this.data.videos = videosData.videos || videosData || [];
                console.log(`✅ Loaded ${this.data.videos.length} videos dynamically`);
            }

            // Process shorts
            if (responses[1].status === 'fulfilled' && responses[1].value.ok) {
                const shortsData = await responses[1].value.json();
                this.data.shorts = shortsData.shorts || shortsData || [];
                console.log(`✅ Loaded ${this.data.shorts.length} shorts dynamically`);
            }

            // Process channel stats
            if (responses[2].status === 'fulfilled' && responses[2].value.ok) {
                this.data.stats = await responses[2].value.json();
                console.log('✅ Loaded channel stats dynamically');
                this.lastUpdate = new Date(this.data.stats.lastUpdated);
            }

            // Render everything dynamically
            this.renderCompleteWebsite();
            this.hideLoadingIndicator();
            
        } catch (error) {
            console.error('❌ Error loading dynamic data:', error);
            this.loadCurrentData(); // Keep existing data if new load fails
        }
        
        this.isLoading = false;
    }

    renderCompleteWebsite() {
        // Update all dynamic subscriber counts
        this.updateSubscriberCounts();
        
        // Update all dynamic view counts
        this.updateViewCounts();
        
        // Update all dynamic video counts
        this.updateVideoCounts();
        
        // Render dynamic video grid
        this.renderDynamicVideoGrid();
        
        // Update last refresh time
        this.updateLastRefreshTime();
        
        // Update page title with real stats
        this.updatePageTitle();
        
        console.log('🎯 Complete dynamic website rendered!');
    }

    updateSubscriberCounts() {
        const subCount = this.data.stats.subscriberCount || 168;
        
        // Update all subscriber count elements
        const subscriberElements = [
            '.dynamic-stats-overlay .stat-value:nth-child(1)',
            '#subscriber-count',
            '#subscriber-stat', 
            '#sub-count-display',
            '.subscriber-chaos'
        ];
        
        subscriberElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                if (selector.includes('subscriber-chaos')) {
                    element.textContent = `${subCount} REBELS`;
                } else {
                    element.textContent = subCount;
                }
            }
        });
        
        console.log(`📊 Updated subscriber count to ${subCount}`);
    }

    updateViewCounts() {
        // Calculate total views from all videos
        const totalViews = this.data.videos.reduce((sum, video) => sum + (video.viewCount || 0), 0);
        const formattedViews = this.formatNumber(totalViews);
        
        // Update all view count elements
        const viewElements = [
            '#total-views',
            '#view-count-display',
            '.stat-value:contains("78.6K")'
        ];
        
        viewElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = formattedViews;
            }
        });
        
        console.log(`👀 Updated total views to ${formattedViews}`);
    }

    updateVideoCounts() {
        const videoCount = this.data.videos.length;
        
        // Update all video count elements
        const videoElements = [
            '#total-videos',
            '#video-count-display',
            '.stat-value:nth-child(2)'
        ];
        
        videoElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = videoCount;
            }
        });
        
        console.log(`📹 Updated video count to ${videoCount}`);
    }

    renderDynamicVideoGrid() {
        const videoGrid = document.querySelector('.videos-grid-chaos, #videos-grid');
        if (!videoGrid) return;

        // Clear existing content
        videoGrid.innerHTML = '';
        
        if (this.data.videos.length === 0) {
            videoGrid.innerHTML = `
                <div class="no-videos-message">
                    <h3>🔄 Loading Dynamic Content...</h3>
                    <p>Videos will appear here once GitHub Actions completes</p>
                </div>
            `;
            return;
        }

        // Sort videos by date (newest first)
        const sortedVideos = [...this.data.videos].sort((a, b) => 
            new Date(b.publishedAt) - new Date(a.publishedAt)
        );

        // Render each video dynamically
        sortedVideos.forEach((video, index) => {
            const videoCard = this.createDynamicVideoCard(video, index);
            videoGrid.appendChild(videoCard);
            
            // Staggered animation
            setTimeout(() => {
                videoCard.classList.add('loaded');
            }, index * 150);
        });
    }

    createDynamicVideoCard(video, index) {
        const card = document.createElement('div');
        card.className = 'video-card-brutal dynamic-video';
        
        const viewCount = video.viewCount || 0;
        const chaosLevel = this.getChaosLevel(viewCount);
        const isViral = viewCount > 1000;
        
        card.innerHTML = `
            <div class="video-thumbnail-chaos">
                <img src="${video.thumbnail || `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}" 
                     alt="${video.title}" class="thumbnail-img" loading="lazy">
                <div class="play-button-destruction">▶</div>
                <div class="video-duration">${this.formatDuration(video.duration)}</div>
                <div class="chaos-level-indicator ${chaosLevel.class}">${chaosLevel.text}</div>
                ${isViral ? '<div class="viral-badge">💥</div>' : ''}
            </div>
            <div class="video-info-brutal">
                <div class="video-emoji">🎬</div>
                <h3 class="video-title-chaos">${this.truncateTitle(video.title)}</h3>
                <div class="video-stats-destruction">
                    <span class="views-chaos">${this.formatNumber(viewCount)} views</span>
                    <span class="date-chaos">${this.formatRelativeDate(video.publishedAt)}</span>
                </div>
                <div class="video-category-tag ${video.category || 'CREATIVE'}">${(video.category || 'CREATIVE').toUpperCase()}</div>
                <div class="video-description-preview">${this.truncateDescription(video.description)}</div>
            </div>
        `;
        
        // Add click handler for embedded player
        card.addEventListener('click', () => {
            this.openVideoModal(video);
        });
        
        return card;
    }

    openVideoModal(video) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('video-modal');
        if (!modal) {
            modal = this.createVideoModal();
            document.body.appendChild(modal);
        }
        
        // Update modal content
        const iframe = modal.querySelector('#video-iframe');
        const title = modal.querySelector('#modal-title');
        const views = modal.querySelector('#modal-views');
        const description = modal.querySelector('#modal-description');
        
        title.textContent = video.title;
        views.textContent = `${this.formatNumber(video.viewCount)} views • ${this.formatRelativeDate(video.publishedAt)}`;
        description.textContent = video.description || 'No description available';
        
        // Set YouTube embed URL with autoplay
        iframe.src = video.embedUrl || `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;
        
        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        console.log(`🎬 Opening: ${video.title}`);
    }

    createVideoModal() {
        const modal = document.createElement('div');
        modal.id = 'video-modal';
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="closeVideoModal()"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <div class="modal-title" id="modal-title">Video Title</div>
                    <button class="modal-close" onclick="closeVideoModal()">✕</button>
                </div>
                <div class="modal-video-container">
                    <iframe id="video-iframe" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="modal-info">
                    <div class="modal-views" id="modal-views">Views</div>
                    <div class="modal-description" id="modal-description">Description</div>
                </div>
            </div>
        `;
        return modal;
    }

    updateLastRefreshTime() {
        const lastUpdateElements = document.querySelectorAll('.last-update, #last-updated');
        const updateTime = this.lastUpdate ? this.lastUpdate.toLocaleString() : 'Live';
        
        lastUpdateElements.forEach(element => {
            if (element) {
                element.textContent = `Last updated: ${updateTime}`;
            }
        });
        
        // Update the live indicator
        const liveIndicators = document.querySelectorAll('.stat-live, .live-indicator');
        liveIndicators.forEach(indicator => {
            indicator.textContent = '● LIVE';
            indicator.style.color = '#39FF14';
        });
    }

    updatePageTitle() {
        const subCount = this.data.stats.subscriberCount || 168;
        const videoCount = this.data.videos.length;
        document.title = `LOGNEON (${subCount} subs, ${videoCount} videos) - DYNAMIC YOUTUBE CHAOS`;
    }

    // Utility functions
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    formatRelativeDate(dateString) {
        if (!dateString) return 'Unknown';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
        return `${Math.ceil(diffDays / 365)} years ago`;
    }

    formatDuration(duration) {
        if (!duration) return '';
        // Convert PT8M30S to 8:30
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return '';
        
        const hours = match[1] ? parseInt(match[1]) : 0;
        const minutes = match[2] ? parseInt(match[2]) : 0;
        const seconds = match[3] ? parseInt(match[3]) : 0;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    truncateTitle(title, maxLength = 60) {
        if (!title) return 'Unknown Video';
        return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
    }

    truncateDescription(description, maxLength = 120) {
        if (!description) return 'No description available';
        return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
    }

    getChaosLevel(viewCount) {
        if (viewCount >= 15000) return { class: 'legendary', text: 'LEGENDARY' };
        if (viewCount >= 8000) return { class: 'viral', text: 'VIRAL' };
        if (viewCount >= 1000) return { class: 'creative', text: 'CREATIVE' };
        return { class: 'experimental', text: 'EXPERIMENTAL' };
    }

    showLoadingIndicator() {
        const indicator = document.querySelector('.dynamic-loader, #loading-indicator');
        if (indicator) indicator.style.display = 'flex';
    }

    hideLoadingIndicator() {
        const indicator = document.querySelector('.dynamic-loader, #loading-indicator');
        if (indicator) indicator.style.display = 'none';
    }

    loadCurrentData() {
        // Fallback to existing page data if dynamic loading fails
        console.log('⚠️ Using existing page data as fallback');
    }

    async checkForUpdates() {
        // Silently check for updates every 5 minutes
        try {
            const response = await fetch('./data/youtube-stats.json');
            if (response.ok) {
                const stats = await response.json();
                const newUpdateTime = new Date(stats.lastUpdated);
                
                if (!this.lastUpdate || newUpdateTime > this.lastUpdate) {
                    console.log('🔄 New data detected, refreshing...');
                    this.loadAllData();
                }
            }
        } catch (error) {
            console.log('Silent update check failed:', error.message);
        }
    }
}

// Global functions for modal control
function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-iframe');
    
    if (iframe) iframe.src = '';
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
}

// Initialize the dynamic loader
function initDynamicLoader() {
    window.logneonLoader = new LogNeonDynamicLoader();
    window.logneonLoader.loadAllData();
    
    console.log('🚀 LOGNEON Complete Dynamic System Initialized!');
}

// Manual refresh function
function refreshContent() {
    if (window.logneonLoader) {
        window.logneonLoader.loadAllData();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault();
        refreshContent();
    }
    if (e.key === 'Escape') {
        closeVideoModal();
    }
});
