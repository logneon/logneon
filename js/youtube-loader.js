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
