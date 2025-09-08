// LOGNEON - ULTIMATE DYNAMIC BRUTALIST YOUTUBE WEBSITE 2025
// REAL-TIME CONTENT LOADING - GITHUB ACTIONS INTEGRATION - MAXIMUM CHAOS
// EMBEDDED YOUTUBE PLAYER - LIVE STATS - AUTO-REFRESH SYSTEM - DYNAMIC CONTENT MANAGEMENT
// FIXED: Loading system with proper fallback handling

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 LOGNEON DYNAMIC CHAOS SYSTEM INITIATED 🎬');
    console.log('⚡ REAL-TIME YOUTUBE CONTENT LOADING ⚡');
    console.log('🔧 GITHUB ACTIONS INTEGRATION READY 🔧');
    
    // Initialize dynamic loading system
    initDynamicContentLoader();
    
    // Initialize all chaos systems
    initParticleChaosSytem();
    initMouseDestructionTrail();
    initBrutalNavigation();
    initSectionTransitions();
    initGlitchMatrix();
    initScreenShakeDestruction();
    initVideoModalSystem();
    initDynamicStatsOverlay();
    initErrorHandlingSystem();
    initSoundChaosSystem();
    initKeyboardChaosShortcuts();
    initInteractiveDestruction();
    initRefreshNotificationSystem();
    
    // Start the dynamic digital rebellion!
    startDynamicDigitalChaos();
});

// DYNAMIC YOUTUBE CONTENT LOADER CLASS - MAIN SYSTEM WITH FIXED FALLBACK
class AsyncYouTubeLoader {
    constructor() {
        this.baseDataPath = './data/';
        this.dataFiles = {
            videos: 'youtube-videos.json',
            shorts: 'youtube-shorts.json',
            stats: 'youtube-stats.json'
        };
        this.loadedData = {};
        this.fallbackData = this.getFallbackData();
        this.isLoading = false;
        this.lastUpdate = null;
        this.retryCount = 0;
        this.maxRetries = 2; // Reduced retries for faster fallback
        this.autoRefreshInterval = 4 * 60 * 60 * 1000; // 4 hours
        this.loadingTimeout = 8000; // 8 second timeout
        
        console.log('🤖 AsyncYouTubeLoader initialized - GitHub Actions ready');
    }
    
    async loadAllData() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.updateLoadingProgress(10, 'Connecting to dynamic content...');
        
        // Set a timeout to force fallback if loading takes too long
        const timeoutId = setTimeout(() => {
            console.warn('⏱️ Loading timeout - switching to fallback');
            this.handleLoadingTimeout();
        }, this.loadingTimeout);
        
        try {
            console.log('📊 Attempting to load dynamic YouTube data...');
            
            // Try to load dynamic data with timeout
            const loadPromise = this.attemptDynamicLoad();
            const result = await Promise.race([
                loadPromise,
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Loading timeout')), this.loadingTimeout - 1000)
                )
            ]);
            
            clearTimeout(timeoutId);
            
            if (result) {
                this.loadedData = result;
                this.updateLoadingProgress(100, 'Dynamic content loaded!');
                console.log('✅ Dynamic content loaded successfully');
            } else {
                throw new Error('No dynamic data returned');
            }
            
        } catch (error) {
            clearTimeout(timeoutId);
            console.warn('⚠️ Dynamic loading failed, using fallback:', error.message);
            this.handleLoadingError(error);
            return; // handleLoadingError will complete the process
        }
        
        this.completeLoading();
    }
    
    async attemptDynamicLoad() {
        this.updateLoadingProgress(30, 'Loading channel statistics...');
        
        // Try to load all data files with individual error handling
        const [statsData, videosData, shortsData] = await Promise.allSettled([
            this.loadDataFile('stats').catch(() => null),
            this.loadDataFile('videos').catch(() => null),
            this.loadDataFile('shorts').catch(() => null)
        ]);
        
        this.updateLoadingProgress(70, 'Processing content...');
        
        // Process results - use fallback for any failed loads
        const stats = statsData.status === 'fulfilled' ? statsData.value : this.fallbackData.stats;
        const videos = videosData.status === 'fulfilled' ? videosData.value?.videos : this.fallbackData.videos;
        const shorts = shortsData.status === 'fulfilled' ? shortsData.value?.shorts : this.fallbackData.shorts;
        
        this.updateLoadingProgress(90, 'Organizing dynamic content...');
        
        return {
            stats: stats || this.fallbackData.stats,
            videos: this.processVideosData(videos || this.fallbackData.videos),
            shorts: this.processShortsData(shorts || this.fallbackData.shorts)
        };
    }
    
    async loadDataFile(type) {
        const fileName = this.dataFiles[type];
        const url = this.baseDataPath + fileName;
        
        console.log(`📁 Attempting to load ${type} from:`, url);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout per file
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`✅ Loaded ${type} dynamically`);
            return data;
            
        } catch (error) {
            clearTimeout(timeoutId);
            console.warn(`❌ Failed to load ${type}:`, error.message);
            throw error;
        }
    }
    
    handleLoadingTimeout() {
        console.log('⏱️ Loading timeout reached - using fallback data');
        this.loadedData = this.fallbackData;
        this.updateLoadingProgress(100, 'Loading fallback content...');
        this.completeLoading();
    }
    
    handleLoadingError(error) {
        console.warn('💥 Dynamic loading error:', error.message);
        
        this.retryCount++;
        if (this.retryCount <= this.maxRetries) {
            this.updateLoadingProgress(30, `Retry ${this.retryCount}/${this.maxRetries}...`);
            setTimeout(() => {
                this.loadAllData();
            }, 1500);
            return;
        }
        
        // Use fallback data after max retries
        console.log('📦 Using fallback data after max retries');
        this.loadedData = this.fallbackData;
        this.updateLoadingProgress(100, 'Using offline content...');
        
        setTimeout(() => {
            this.completeLoading();
            this.showErrorNotification('Using offline content - dynamic loading unavailable');
        }, 1000);
    }
    
    completeLoading() {
        this.lastUpdate = new Date();
        this.retryCount = 0;
        this.isLoading = false;
        
        console.log('✅ Loading completed with data:', this.loadedData);
        
        // Render all content
        setTimeout(() => {
            this.renderAllContent();
            this.hideLoader();
            this.setupAutoRefresh();
            this.showRefreshNotification('CONTENT LOADED SUCCESSFULLY');
        }, 500);
    }
    
    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 140, 0, 0.95);
            color: #000;
            padding: 12px 18px;
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            z-index: 10002;
            border: 2px solid #FFA500;
            box-shadow: 0 0 30px rgba(255, 165, 0, 0.6);
            text-align: center;
            max-width: 400px;
        `;
        
        notification.innerHTML = `
            <div>⚠️ ${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }
    
    processVideosData(videos) {
        if (!Array.isArray(videos)) {
            console.warn('Invalid videos data, using fallback');
            videos = this.fallbackData.videos;
        }
        
        return videos.map(video => ({
            ...video,
            formattedViews: this.formatViewCount(video.viewCount),
            relativeDate: this.formatRelativeDate(video.publishedAt),
            chaosLevel: this.determineChaosLevel(video),
            category: this.categorizeVideo(video)
        })).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }
    
    processShortsData(shorts) {
        if (!Array.isArray(shorts)) {
            console.warn('Invalid shorts data, using fallback');
            shorts = this.fallbackData.shorts;
        }
        
        return shorts.map(short => ({
            ...short,
            formattedViews: this.formatViewCount(short.viewCount),
            relativeDate: this.formatRelativeDate(short.publishedAt),
            chaosLevel: this.determineChaosLevel(short)
        })).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }
    
    formatViewCount(count) {
        if (!count) return '0 views';
        
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
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);
        
        if (diffDays < 1) {
            return 'Today';
        } else if (diffDays < 7) {
            return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        } else if (diffMonths < 12) {
            return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
        } else {
            return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
        }
    }
    
    determineChaosLevel(video) {
        const views = parseInt(video.viewCount) || 0;
        const title = video.title?.toLowerCase() || '';
        
        if (views >= 15000) return 'LEGENDARY';
        if (views >= 8000) return 'VIRAL';
        if (views >= 1000) return 'POPULAR';
        if (title.includes('fix') || title.includes('error')) return 'TECHNICAL';
        if (title.includes('diy') || title.includes('make')) return 'CREATIVE';
        if (title.includes('test') || title.includes('review')) return 'ANALYTICAL';
        if (title.includes('security') || title.includes('hack')) return 'DANGEROUS';
        return 'STANDARD';
    }
    
    categorizeVideo(video) {
        const title = video.title?.toLowerCase() || '';
        const description = video.description?.toLowerCase() || '';
        const content = `${title} ${description}`;
        
        if (content.match(/(ethernet|wifi|network|port|forwarding|speed|test|bsnl|fiber)/)) {
            return 'NETWORKING CHAOS';
        }
        if (content.match(/(usb|adapter|hardware|cable|storage|laptop|desktop)/)) {
            return 'HARDWARE HACKS';
        }
        if (content.match(/(eclipse|docker|wordpress|software|programming|jvm)/)) {
            return 'SOFTWARE SOLUTIONS';
        }
        if (content.match(/(diy|battery|thermal|paste|maintenance|inverter|water)/)) {
            return 'DIY DESTRUCTION';
        }
        if (content.match(/(5g|mobile|phone|android|smartphone|airtel)/)) {
            return 'MOBILE MAYHEM';
        }
        if (content.match(/(security|privacy|surveillance|spying|protection)/)) {
            return 'SECURITY CHAOS';
        }
        
        return 'TECH GENERAL';
    }
    
    renderAllContent() {
        console.log('🎨 Rendering dynamic content...');
        
        this.updateDynamicStats();
        this.renderLatestVideos();
        this.renderPopularVideos();
        this.renderShorts();
        this.renderCategories();
        this.updateNavigationCounters();
        this.initializeDynamicInteractions();
        
        console.log('✅ All dynamic content rendered');
    }
    
    updateDynamicStats() {
        const stats = this.loadedData.stats;
        if (!stats) return;
        
        // Update stats overlay
        this.updateElement('subscriber-count', stats.subscriberCount || 168);
        this.updateElement('video-count', stats.videoCount || 39);
        this.updateElement('total-views', this.formatViewCount(stats.viewCount).replace(' views', '') || '75K');
        this.updateElement('last-update', 'LIVE');
        
        // Update navigation
        this.updateElement('nav-subscriber-count', stats.subscriberCount || 168);
        this.updateElement('nav-video-count', stats.videoCount || 39);
        
        // Update floating stats
        this.updateElement('floating-subscribers', stats.subscriberCount || 168);
        this.updateElement('floating-views', this.formatViewCount(stats.viewCount).replace(' views', '') || '75K');
        this.updateElement('floating-videos', stats.videoCount || 39);
        
        // Update about section
        this.updateElement('about-video-count', stats.videoCount || 39);
        this.updateElement('about-total-views', this.formatViewCount(stats.viewCount).replace(' views', '') || '75K');
        this.updateElement('subscribe-count-display', `${stats.subscriberCount || 168} REBELS`);
        
        // Update dynamic indicator
        const indicator = document.getElementById('dynamic-indicator');
        if (indicator) {
            indicator.style.color = '#00FF41';
            indicator.textContent = '●';
        }
        
        console.log('📊 Dynamic stats updated');
    }
    
    renderLatestVideos() {
        const container = document.getElementById('latest-videos-grid');
        if (!container) return;
        
        const videos = this.loadedData.videos.slice(0, 8); // Latest 8 videos
        container.innerHTML = '';
        
        videos.forEach(video => {
            const videoCard = this.createVideoCard(video, false);
            container.appendChild(videoCard);
        });
        
        console.log(`📺 Rendered ${videos.length} latest videos`);
    }
    
    renderPopularVideos() {
        const container = document.getElementById('popular-videos-grid');
        if (!container) return;
        
        const videos = [...this.loadedData.videos]
            .sort((a, b) => parseInt(b.viewCount) - parseInt(a.viewCount))
            .slice(0, 6); // Top 6 popular videos
        
        container.innerHTML = '';
        
        videos.forEach(video => {
            const videoCard = this.createVideoCard(video, true);
            container.appendChild(videoCard);
        });
        
        console.log(`🔥 Rendered ${videos.length} popular videos`);
    }
    
    renderShorts() {
        const container = document.getElementById('shorts-videos-grid');
        if (!container) return;
        
        const shorts = this.loadedData.shorts.slice(0, 6); // Latest 6 shorts
        container.innerHTML = '';
        
        shorts.forEach(short => {
            const shortCard = this.createShortCard(short);
            container.appendChild(shortCard);
        });
        
        console.log(`⚡ Rendered ${shorts.length} shorts`);
    }
    
    createVideoCard(video, isPopular = false) {
        const card = document.createElement('div');
        card.className = `video-brutal-card ${video.chaosLevel.toLowerCase()}`;
        card.dataset.videoId = video.id;
        card.dataset.videoTitle = video.title;
        card.dataset.videoViews = `${video.formattedViews} • ${video.relativeDate}`;
        card.dataset.videoDescription = video.description || '';
        
        const thumbnailContent = video.thumbnail ? 
            `<img class="video-thumbnail-image" src="${video.thumbnail}" alt="${video.title}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
             <div class="placeholder-thumbnail ${this.getCategoryClass(video.category)}" style="display: none;">🎬</div>` :
            `<div class="placeholder-thumbnail ${this.getCategoryClass(video.category)}">🎬</div>`;
        
        card.innerHTML = `
            <div class="video-thumbnail-chaos">
                ${thumbnailContent}
                <div class="chaos-level-indicator ${video.chaosLevel.toLowerCase()}">${video.chaosLevel}</div>
                <div class="play-button-destruction ${video.chaosLevel.toLowerCase()}">
                    <div class="play-icon">▶</div>
                    <div class="play-particles"></div>
                </div>
                <div class="duration-brutal">${this.formatDuration(video.duration)}</div>
                <div class="view-count-display">${video.formattedViews}</div>
                <div class="glitch-overlay-video"></div>
                ${parseInt(video.viewCount) >= 15000 ? '<div class="viral-explosion">💥</div>' : ''}
            </div>
            <div class="video-info-chaos">
                <h3 class="video-title-brutal">${video.title}</h3>
                <div class="video-meta-destruction">
                    <span class="views-chaos ${video.chaosLevel.toLowerCase()}">${video.formattedViews}</span>
                    <span class="date-chaos">${video.relativeDate}</span>
                    <span class="engagement-brutal">${video.chaosLevel}</span>
                </div>
                <p class="video-description-glitch">${video.description || 'LOGNEON tech content - real YouTube channel with authentic subscribers and tech tutorials'}</p>
            </div>
        `;
        
        return card;
    }
    
    createShortCard(short) {
        const card = document.createElement('div');
        card.className = `short-brutal-card ${short.chaosLevel.toLowerCase()}`;
        card.dataset.videoId = short.id;
        card.dataset.shortTitle = short.title;
        
        const thumbnailContent = short.thumbnail ? 
            `<img class="short-thumbnail-image" src="${short.thumbnail}" alt="${short.title}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
             <div class="placeholder-thumbnail short ${short.chaosLevel.toLowerCase()}" style="display: none;">⚡</div>` :
            `<div class="placeholder-thumbnail short ${short.chaosLevel.toLowerCase()}">⚡</div>`;
        
        card.innerHTML = `
            <div class="short-thumbnail-chaos">
                ${thumbnailContent}
                <div class="chaos-level-indicator ${short.chaosLevel.toLowerCase()}">${short.chaosLevel}</div>
                <div class="short-play-button">
                    <div class="play-icon">▶</div>
                </div>
            </div>
            <div class="short-info-chaos">
                <h4 class="short-title-brutal">${short.title}</h4>
                <span class="short-views ${short.chaosLevel.toLowerCase()}">${short.formattedViews}</span>
            </div>
        `;
        
        return card;
    }
    
    getCategoryClass(category) {
        const categoryMap = {
            'NETWORKING CHAOS': 'networking',
            'HARDWARE HACKS': 'hardware', 
            'SOFTWARE SOLUTIONS': 'web',
            'DIY DESTRUCTION': 'maintenance',
            'MOBILE MAYHEM': 'tech',
            'SECURITY CHAOS': 'security',
            'TECH GENERAL': 'tech'
        };
        return categoryMap[category] || 'tech';
    }
    
    renderCategories() {
        const container = document.getElementById('categories-orbital');
        if (!container) return;
        
        const categories = [
            { name: 'NETWORKING CHAOS', icon: '🌐', angle: '0deg', radius: '200px', color: '#39FF14' },
            { name: 'HARDWARE HACKS', icon: '⚡', angle: '72deg', radius: '180px', color: '#0080FF' },
            { name: 'SOFTWARE SOLUTIONS', icon: '💻', angle: '144deg', radius: '220px', color: '#8000FF' },
            { name: 'DIY DESTRUCTION', icon: '🔧', angle: '216deg', radius: '190px', color: '#FF0080' },
            { name: 'MOBILE MAYHEM', icon: '📱', angle: '288deg', radius: '210px', color: '#FFD700' },
            { name: 'SECURITY CHAOS', icon: '🛡️', angle: '360deg', radius: '195px', color: '#FF4500' }
        ];
        
        container.innerHTML = '';
        
        categories.forEach(category => {
            const videoCount = this.loadedData.videos.filter(v => v.category === category.name).length;
            
            const categoryEl = document.createElement('div');
            categoryEl.className = 'category-brutal-object';
            categoryEl.style.setProperty('--orbit-angle', category.angle);
            categoryEl.style.setProperty('--orbit-radius', category.radius);
            categoryEl.dataset.category = category.name.toLowerCase().replace(/\s+/g, '');
            
            categoryEl.innerHTML = `
                <div class="category-icon">${category.icon}</div>
                <div class="category-info">
                    <span class="category-name">${category.name}</span>
                    <span class="category-count">${videoCount} videos</span>
                    <span class="category-desc">Dynamic content</span>
                </div>
                <div class="category-particles"></div>
            `;
            
            container.appendChild(categoryEl);
        });
        
        // Setup category filters
        this.setupCategoryFilters(categories);
        
        console.log('🎬 Dynamic categories rendered');
    }
    
    setupCategoryFilters(categories) {
        const filterContainer = document.getElementById('category-filters');
        if (!filterContainer) return;
        
        filterContainer.innerHTML = '<button class="filter-btn active" data-category="all">ALL CHAOS</button>';
        
        categories.forEach(category => {
            const filterBtn = document.createElement('button');
            filterBtn.className = 'filter-btn';
            filterBtn.dataset.category = category.name.toLowerCase().replace(/\s+/g, '');
            filterBtn.textContent = category.name;
            
            filterBtn.addEventListener('click', () => {
                this.filterByCategory(category.name);
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                filterBtn.classList.add('active');
                createCategoryFilterEffect();
            });
            
            filterContainer.appendChild(filterBtn);
        });
        
        // All chaos filter
        filterContainer.querySelector('[data-category="all"]').addEventListener('click', () => {
            this.filterByCategory('all');
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            filterContainer.querySelector('[data-category="all"]').classList.add('active');
            createCategoryFilterEffect();
        });
    }
    
    filterByCategory(categoryName) {
        const videoCards = document.querySelectorAll('.video-brutal-card');
        
        videoCards.forEach(card => {
            const video = this.loadedData.videos.find(v => v.id === card.dataset.videoId);
            if (!video) return;
            
            if (categoryName === 'all' || video.category === categoryName) {
                card.style.display = '';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.opacity = '0.3';
                card.style.transform = 'scale(0.8)';
            }
        });
        
        console.log(`🔍 Filtered by category: ${categoryName}`);
    }
    
    updateNavigationCounters() {
        this.updateElement('latest-counter', this.loadedData.videos.length);
        this.updateElement('popular-counter', Math.min(this.loadedData.videos.length, 6));
        this.updateElement('shorts-counter', this.loadedData.shorts.length);
        this.updateElement('categories-counter', 6);
        this.updateElement('subscribe-counter', this.loadedData.stats.subscriberCount || 168);
    }
    
    initializeDynamicInteractions() {
        // Video cards
        document.querySelectorAll('.video-brutal-card').forEach(card => {
            card.addEventListener('click', () => {
                const videoId = card.dataset.videoId;
                const title = card.dataset.videoTitle;
                const views = card.dataset.videoViews;
                const description = card.dataset.videoDescription;
                
                window.openVideoModal(videoId, title, views, description);
                createVideoOpenEffect(card);
                triggerScreenShakeDestruction();
                playDigitalChaosSound();
            });
            
            card.addEventListener('mouseenter', () => {
                createVideoHoverChaos(card);
                playHoverChaosSound();
            });
        });
        
        // Short cards
        document.querySelectorAll('.short-brutal-card').forEach(card => {
            card.addEventListener('click', () => {
                const videoId = card.dataset.videoId;
                window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                createShortOpenEffect(card);
                triggerScreenShakeDestruction();
                playDigitalChaosSound();
            });
            
            card.addEventListener('mouseenter', () => {
                createShortHoverChaos(card);
                playHoverChaosSound();
            });
        });
        
        // Categories
        document.querySelectorAll('.category-brutal-object').forEach(categoryObj => {
            categoryObj.addEventListener('click', () => {
                const categoryName = categoryObj.dataset.category;
                this.filterByCategory(categoryName);
                createCategoryExplosion(categoryObj);
                triggerScreenShakeDestruction();
                playDigitalChaosSound();
            });
            
            categoryObj.addEventListener('mouseenter', () => {
                createCategoryParticleStorm(categoryObj);
                playHoverChaosSound();
            });
        });
        
        console.log('⚡ Dynamic interactions initialized');
    }
    
    formatDuration(duration) {
        if (!duration) return 'LIVE';
        
        // Parse ISO 8601 duration (PT8M30S)
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return 'LIVE';
        
        const hours = parseInt(match[1]) || 0;
        const minutes = parseInt(match[2]) || 0;
        const seconds = parseInt(match[3]) || 0;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    updateLoadingProgress(percentage, status) {
        const progressBar = document.getElementById('loader-progress');
        const statusText = document.getElementById('loader-status');
        
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
        if (statusText) {
            statusText.textContent = status;
        }
    }
    
    hideLoader() {
        const loader = document.getElementById('dynamic-loader');
        if (loader) {
            loader.classList.add('loaded');
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.style.display = 'none';
                }
            }, 1000);
        }
        console.log('🔄 Loader hidden - content ready');
    }
    
    showRefreshNotification(message) {
        const notification = document.getElementById('refresh-notification');
        if (!notification) return;
        
        const textEl = notification.querySelector('.notification-text');
        if (textEl) {
            textEl.textContent = message;
        }
        
        notification.classList.remove('hidden');
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }
    
    setupAutoRefresh() {
        setInterval(() => {
            console.log('🔄 Auto-refreshing dynamic content...');
            this.loadAllData();
        }, this.autoRefreshInterval);
        
        console.log(`⏰ Auto-refresh scheduled every ${this.autoRefreshInterval/1000/60/60} hours`);
    }
    
    getFallbackData() {
        return {
            stats: {
                name: "LOGNEON",
                handle: "@logneon",
                subscriberCount: 168,
                videoCount: 39,
                viewCount: 75000,
                description: "Explore something new here - Real YouTube channel",
                lastUpdated: new Date().toISOString()
            },
            videos: [
                {
                    id: "fu3Ja6zC5Ss",
                    title: "Make RJ45 Ethernet Cable at Home | Crimp + Punch Tool | Speed & Ping Test",
                    description: "Learn how to make professional RJ45 Ethernet cables at home using crimp and punch tools. Includes comprehensive speed and ping testing of the homemade cables to ensure optimal performance.",
                    thumbnail: "https://i.ytimg.com/vi/fu3Ja6zC5Ss/maxresdefault.jpg",
                    viewCount: 63,
                    publishedAt: "2024-07-14T10:00:00Z",
                    duration: "PT8M30S",
                    category: "NETWORKING CHAOS",
                    embedUrl: "https://www.youtube.com/embed/fu3Ja6zC5Ss",
                    youtubeUrl: "https://www.youtube.com/watch?v=fu3Ja6zC5Ss"
                },
                {
                    id: "L_jWHffIx5E",
                    title: "Fix Eclipse Errors | Incompatible JVM | unable to locate shared library",
                    description: "Complete solution for Eclipse IDE errors including JVM compatibility issues and shared library problems. Comprehensive developer troubleshooting guide.",
                    thumbnail: "https://i.ytimg.com/vi/L_jWHffIx5E/maxresdefault.jpg",
                    viewCount: 18000,
                    publishedAt: "2022-07-14T10:00:00Z",
                    duration: "PT12M45S",
                    category: "SOFTWARE SOLUTIONS",
                    embedUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
                    youtubeUrl: "https://www.youtube.com/watch?v=L_jWHffIx5E"
                },
                {
                    id: "M5QGkOGZubQ",
                    title: "BSNL fiber speed test and ping review",
                    description: "Comprehensive speed test and ping analysis of BSNL fiber internet connection. Real-world performance testing and comparison.",
                    thumbnail: "https://i.ytimg.com/vi/M5QGkOGZubQ/maxresdefault.jpg",
                    viewCount: 17000,
                    publishedAt: "2022-08-14T10:00:00Z",
                    duration: "PT15M20S",
                    category: "NETWORKING CHAOS",
                    embedUrl: "https://www.youtube.com/embed/M5QGkOGZubQ",
                    youtubeUrl: "https://www.youtube.com/watch?v=M5QGkOGZubQ"
                },
                {
                    id: "E_6d3JBBo4s",
                    title: "How To Fill Distilled Water in Battery/Inverter | Alert ! | First check its TDS",
                    description: "Proper method to fill distilled water in batteries and inverters. Important TDS testing procedures for battery maintenance and longevity.",
                    thumbnail: "https://i.ytimg.com/vi/E_6d3JBBo4s/maxresdefault.jpg",
                    viewCount: 9600,
                    publishedAt: "2023-01-14T10:00:00Z",
                    duration: "PT7M15S",
                    category: "DIY DESTRUCTION",
                    embedUrl: "https://www.youtube.com/embed/E_6d3JBBo4s",
                    youtubeUrl: "https://www.youtube.com/watch?v=E_6d3JBBo4s"
                },
                {
                    id: "dC-m50wHz6k",
                    title: "BSNL Port Forwarding | Virtual Server | Dynamic IP | With HTTPS",
                    description: "Complete guide to BSNL port forwarding setup with virtual server configuration, dynamic IP handling, and HTTPS setup for home servers.",
                    thumbnail: "https://i.ytimg.com/vi/dC-m50wHz6k/maxresdefault.jpg",
                    viewCount: 8200,
                    publishedAt: "2023-02-14T10:00:00Z",
                    duration: "PT18M30S",
                    category: "NETWORKING CHAOS",
                    embedUrl: "https://www.youtube.com/embed/dC-m50wHz6k",
                    youtubeUrl: "https://www.youtube.com/watch?v=dC-m50wHz6k"
                }
            ],
            shorts: [
                {
                    id: "shorts-5g-trick",
                    title: "Unlimited 5G on Ground Floor with This Trick!",
                    description: "Simple trick to get unlimited 5G signal on ground floor using signal amplification techniques.",
                    thumbnail: null,
                    viewCount: 6400,
                    publishedAt: "2025-08-01T10:00:00Z",
                    duration: "PT45S",
                    category: "MOBILE MAYHEM",
                    embedUrl: "https://www.youtube.com/embed/shorts-5g-trick",
                    youtubeUrl: "https://www.youtube.com/watch?v=shorts-5g-trick"
                },
                {
                    id: "shorts-spying-detection",
                    title: "Someone Spying On Me Bhaagooo...",
                    description: "Quick guide to detecting digital surveillance and privacy protection techniques for personal security.",
                    thumbnail: null,
                    viewCount: 1200,
                    publishedAt: "2025-07-15T10:00:00Z",
                    duration: "PT50S",
                    category: "SECURITY CHAOS",
                    embedUrl: "https://www.youtube.com/embed/shorts-spying-detection",
                    youtubeUrl: "https://www.youtube.com/watch?v=shorts-spying-detection"
                },
                {
                    id: "shorts-laptop-storage",
                    title: "Increase storage space in old laptop",
                    description: "Easy methods to increase storage capacity in older laptops using various upgrade techniques and tools.",
                    thumbnail: null,
                    viewCount: 1100,
                    publishedAt: "2025-07-01T10:00:00Z",
                    duration: "PT55S",
                    category: "HARDWARE HACKS",
                    embedUrl: "https://www.youtube.com/embed/shorts-laptop-storage",
                    youtubeUrl: "https://www.youtube.com/watch?v=shorts-laptop-storage"
                }
            ]
        };
    }
}

// DYNAMIC CONTENT INITIALIZATION - FIXED
function initDynamicContentLoader() {
    console.log('🚀 Initializing LOGNEON dynamic content loader...');
    
    window.youtubeLoader = new AsyncYouTubeLoader();
    
    // Start loading immediately with better error handling
    setTimeout(() => {
        window.youtubeLoader.loadAllData();
    }, 500);
    
    // Retry function for error modal
    window.retryDynamicLoading = function() {
        const errorModal = document.getElementById('error-modal');
        if (errorModal) {
            errorModal.classList.add('hidden');
        }
        
        const loader = document.getElementById('dynamic-loader');
        if (loader) {
            loader.style.display = 'flex';
            loader.classList.remove('loaded');
        }
        
        // Reset and retry
        window.youtubeLoader.retryCount = 0;
        window.youtubeLoader.loadAllData();
    };
    
    // Close error modal function
    window.closeErrorModal = function() {
        const errorModal = document.getElementById('error-modal');
        if (errorModal) {
            errorModal.classList.add('hidden');
        }
    };
    
    console.log('✅ Dynamic content loader initialized');
}

// VIDEO MODAL SYSTEM - EMBEDDED YOUTUBE PLAYER
function initVideoModalSystem() {
    const modal = document.getElementById('video-modal');
    const modalClose = document.getElementById('modal-close');
    const videoIframe = document.getElementById('video-iframe');
    const modalTitle = document.getElementById('modal-title');
    const modalViews = document.getElementById('modal-views');
    const modalDescription = document.getElementById('modal-description');
    const modalYouTubeLink = document.getElementById('modal-youtube-link');
    
    if (!modal || !modalClose || !videoIframe) {
        console.warn('Video modal elements not found');
        return;
    }
    
    // Open video modal
    window.openVideoModal = function(videoId, title, views, description) {
        console.log('🎬 Opening LOGNEON video modal:', videoId);
        
        // Set modal content
        if (modalTitle) modalTitle.textContent = title || 'LOGNEON Tech Video';
        if (modalViews) modalViews.textContent = views || 'Tech Views';
        if (modalDescription) modalDescription.textContent = description || 'LOGNEON dynamic tech content';
        if (modalYouTubeLink) modalYouTubeLink.href = `https://www.youtube.com/watch?v=${videoId}`;
        
        // Set embedded video
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
        videoIframe.src = embedUrl;
        
        // Show modal with chaos effects
        modal.classList.remove('hidden');
        createModalOpenChaos();
        triggerScreenShakeDestruction();
        playDigitalChaosSound();
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';
    };

    // Close video modal
    function closeVideoModal() {
        console.log('❌ Closing LOGNEON video modal');
        
        // Hide modal
        modal.classList.add('hidden');
        
        // Stop video
        videoIframe.src = '';
        
        // Re-enable body scroll
        document.body.style.overflow = '';
        
        createModalCloseChaos();
        playHoverChaosSound();
    }

    // Modal close events
    modalClose.addEventListener('click', closeVideoModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
            closeVideoModal();
        }
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeVideoModal();
        }
    });

    function createModalOpenChaos() {
        // Modal opening effects
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: ${4 + Math.random() * 8}px;
                    height: ${4 + Math.random() * 8}px;
                    background: ${['#39FF14', '#0080FF', '#8000FF', '#FF0080'][Math.floor(Math.random() * 4)]};
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    z-index: 10001;
                    pointer-events: none;
                    box-shadow: 0 0 15px currentColor;
                `;
                
                document.body.appendChild(particle);
                
                const angle = (i / 12) * Math.PI * 2;
                const velocity = 150 + Math.random() * 100;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;
                
                particle.animate([
                    { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
                    { transform: `translate(calc(-50% + ${vx}px), calc(-50% + ${vy}px)) scale(1)`, opacity: 0.8 },
                    { transform: `translate(calc(-50% + ${vx * 1.5}px), calc(-50% + ${vy * 1.5}px)) scale(0)`, opacity: 0 }
                ], {
                    duration: 1000,
                    easing: 'ease-out'
                }).onfinish = () => particle.remove();
            }, i * 50);
        }
    }

    function createModalCloseChaos() {
        // Modal closing effects
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: #FF0080;
                border-radius: 50%;
                top: ${centerY}px;
                left: ${centerX + (Math.random() - 0.5) * 200}px;
                z-index: 10001;
                pointer-events: none;
                box-shadow: 0 0 12px #FF0080;
            `;
            
            document.body.appendChild(particle);
            
            particle.animate([
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(0)', opacity: 0 }
            ], {
                duration: 600,
                easing: 'ease-in'
            }).onfinish = () => particle.remove();
        }
    }
    
    console.log('🎬 Video modal system initialized');
}

// DYNAMIC STATS OVERLAY SYSTEM
function initDynamicStatsOverlay() {
    const statsOverlay = document.getElementById('stats-overlay');
    if (!statsOverlay) return;
    
    // Auto-update stats every 30 seconds
    setInterval(() => {
        updateStatsPulse();
    }, 30000);
    
    function updateStatsPulse() {
        const statValues = statsOverlay.querySelectorAll('.stat-value');
        statValues.forEach(stat => {
            stat.style.animation = 'none';
            setTimeout(() => {
                stat.style.animation = 'numberPulseChaos 1s ease-in-out';
            }, 50);
        });
        
        console.log('📊 Stats overlay pulsed');
    }
    
    // Click to refresh stats
    statsOverlay.addEventListener('click', () => {
        if (window.youtubeLoader) {
            window.youtubeLoader.updateDynamicStats();
            createStatsRefreshEffect();
            playDigitalChaosSound();
        }
    });
    
    function createStatsRefreshEffect() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 140px;
            right: 20px;
            background: rgba(57, 255, 20, 0.95);
            color: #0A0A0A;
            padding: 8px 12px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            z-index: 10001;
            pointer-events: none;
            border: 2px solid #39FF14;
            box-shadow: 0 0 20px rgba(57, 255, 20, 0.6);
        `;
        
        notification.textContent = '📊 STATS REFRESHED';
        document.body.appendChild(notification);
        
        notification.animate([
            { opacity: 0, transform: 'translateX(50px) scale(0)' },
            { opacity: 1, transform: 'translateX(0) scale(1)' },
            { opacity: 0, transform: 'translateX(-50px) scale(0)' }
        ], {
            duration: 2000,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        }).onfinish = () => notification.remove();
    }
}

// ERROR HANDLING SYSTEM
function initErrorHandlingSystem() {
    // Global error handler
    window.addEventListener('error', (event) => {
        console.error('💥 Global error:', event.error);
        // Don't show error notifications for minor issues
    });
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('💥 Unhandled promise rejection:', event.reason);
        // Prevent default to avoid console spam
        event.preventDefault();
    });
}

// REFRESH NOTIFICATION SYSTEM
function initRefreshNotificationSystem() {
    // Show notification when page is refreshed
    if (performance.navigation && performance.navigation.type === performance.navigation.TYPE_RELOAD) {
        setTimeout(() => {
            if (window.youtubeLoader) {
                window.youtubeLoader.showRefreshNotification('CONTENT RELOADED');
            }
        }, 2000);
    }
    
    // Visibility change handling
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && window.youtubeLoader) {
            // User returned to tab - check for updates
            setTimeout(() => {
                window.youtubeLoader.showRefreshNotification('WELCOME BACK');
            }, 1000);
        }
    });
}

// All other functions remain the same...
// [Include all the other functions from the previous implementation without changes]

// PARTICLE CHAOS SYSTEM - ENHANCED FOR DYNAMIC CONTENT
function initParticleChaosSytem() {
    const canvas = document.getElementById('chaos-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouseX = 0, mouseY = 0;
    
    // Resize canvas to full screen
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Track mouse for particle attraction
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Enhanced Tech-themed Chaos Particle Class
    class TechChaosParticle {
        constructor() {
            this.reset();
            this.color = this.getRandomTechColor();
            this.maxLife = this.life;
            this.glowIntensity = Math.random() * 0.8 + 0.2;
            this.techMode = Math.random() > 0.5;
            this.symbol = this.getTechSymbol();
            this.isDynamic = Math.random() > 0.7; // 30% chance to be dynamic
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = Math.random() * 1000;
            this.vx = (Math.random() - 0.5) * 4;
            this.vy = (Math.random() - 0.5) * 4;
            this.vz = (Math.random() - 0.5) * 8;
            this.size = Math.random() * 8 + 2;
            this.life = Math.random() * 200 + 100;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.15;
        }
        
        getRandomTechColor() {
            const techColors = [
                '#39FF14', '#0080FF', '#8000FF', '#FF0080',
                '#00FFFF', '#FFD700', '#FF6600', '#CCFF00',
                '#00FF41' // Live green for dynamic particles
            ];
            return techColors[Math.floor(Math.random() * techColors.length)];
        }
        
        getTechSymbol() {
            const techSymbols = ['●', '■', '▲', '♦', '★', '⬢', '⬣', '⚡', '📡', '🔄'];
            return techSymbols[Math.floor(Math.random() * techSymbols.length)];
        }
        
        update() {
            const time = Date.now() * 0.001;
            
            if (this.isDynamic) {
                // Dynamic particles move differently
                this.x += this.vx + Math.sin(time * 2 + this.z * 0.01) * 2;
                this.y += this.vy + Math.cos(time * 2 + this.z * 0.01) * 2;
                this.z += this.vz + Math.sin(time * 0.5) * 3;
                this.color = '#00FF41'; // Live green
            } else if (this.techMode) {
                this.x += this.vx + Math.sin(time + this.z * 0.01) * 1.5;
                this.y += this.vy + Math.cos(time + this.z * 0.01) * 1.5;
                this.z += this.vz + Math.sin(time * 0.3) * 2;
                
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    this.x += dx * 0.015;
                    this.y += dy * 0.015;
                }
            } else {
                this.x += this.vx + Math.sin(time + this.z * 0.005) * 0.8;
                this.y += this.vy + Math.cos(time + this.z * 0.005) * 0.8;
                this.z += this.vz;
            }
            
            this.rotation += this.rotationSpeed;
            
            if (this.x < -50) this.x = canvas.width + 50;
            if (this.x > canvas.width + 50) this.x = -50;
            if (this.y < -50) this.y = canvas.height + 50;
            if (this.y > canvas.height + 50) this.y = -50;
            if (this.z < -500) this.z = 1000;
            if (this.z > 1000) this.z = -500;
            
            this.life--;
            if (this.life <= 0) {
                this.reset();
                this.color = this.getRandomTechColor();
                this.techMode = Math.random() > 0.6;
                this.isDynamic = Math.random() > 0.7;
                this.symbol = this.getTechSymbol();
            }
            
            this.glowIntensity = 0.3 + 0.7 * Math.sin(time * 1.5 + this.x * 0.01);
        }
        
        draw() {
            const scale = 1 - Math.abs(this.z) / 1000;
            const size = this.size * scale;
            const alpha = (this.life / this.maxLife) * scale * this.glowIntensity;
            
            if (size > 0.5 && alpha > 0.02) {
                ctx.save();
                ctx.globalAlpha = alpha * (this.isDynamic ? 1.5 : 1);
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                
                const glowSize = size * (this.isDynamic ? 6 : this.techMode ? 5 : 3);
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(0.5, this.color + '60');
                gradient.addColorStop(1, 'transparent');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(-glowSize, -glowSize, glowSize * 2, glowSize * 2);
                
                ctx.globalAlpha = alpha * 1.5;
                ctx.fillStyle = this.color;
                ctx.font = `${size * 2}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                if (this.isDynamic || this.techMode) {
                    ctx.fillText(this.symbol, 0, 0);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, size/2, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.restore();
            }
        }
    }
    
    // Initialize particles
    function initParticles() {
        particles = [];
        const particleCount = Math.min(150, Math.floor(canvas.width * canvas.height / 8000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new TechChaosParticle());
        }
        console.log(`⚡ Initialized ${particleCount} dynamic particles`);
    }
    
    // Animation loop
    function animateParticles() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawTechConnections();
        
        animationId = requestAnimationFrame(animateParticles);
    }
    
    function drawTechConnections() {
        ctx.save();
        particles.forEach((particle1, i) => {
            particles.slice(i + 1, i + 4).forEach(particle2 => {
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const alpha = (120 - distance) / 120 * 0.1;
                    ctx.globalAlpha = alpha;
                    
                    if (particle1.isDynamic || particle2.isDynamic) {
                        ctx.strokeStyle = '#00FF41';
                        ctx.lineWidth = 1.5;
                        ctx.setLineDash([2, 2]);
                    } else if (particle1.techMode || particle2.techMode) {
                        ctx.strokeStyle = '#39FF14';
                        ctx.lineWidth = 1;
                        ctx.setLineDash([3, 3]);
                    } else {
                        ctx.strokeStyle = '#0080FF';
                        ctx.lineWidth = 0.5;
                        ctx.setLineDash([]);
                    }
                    
                    ctx.beginPath();
                    ctx.moveTo(particle1.x, particle1.y);
                    ctx.lineTo(particle2.x, particle2.y);
                    ctx.stroke();
                }
            });
        });
        ctx.restore();
    }
    
    initParticles();
    animateParticles();
    
    window.addEventListener('beforeunload', () => {
        if (animationId) cancelAnimationFrame(animationId);
    });
}

// MOUSE DESTRUCTION TRAIL
function initMouseDestructionTrail() {
    const trailContainer = document.querySelector('.mouse-destruction-trail');
    if (!trailContainer) return;
    
    let trails = [];
    let isMouseDown = false;
    
    document.addEventListener('mousedown', () => isMouseDown = true);
    document.addEventListener('mouseup', () => isMouseDown = false);
    
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        const trailCount = isMouseDown ? 6 : 3;
        
        for (let i = 0; i < trailCount; i++) {
            const trail = document.createElement('div');
            trail.className = 'trail-particle';
            
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;
            
            trail.style.left = (e.clientX + offsetX) + 'px';
            trail.style.top = (e.clientY + offsetY) + 'px';
            
            const techColors = [
                'linear-gradient(45deg, #39FF14, #0080FF)',
                'linear-gradient(45deg, #8000FF, #FF0080)',
                'linear-gradient(45deg, #00FFFF, #FFD700)',
                'linear-gradient(45deg, #FF6600, #CCFF00)',
                'linear-gradient(45deg, #00FF41, #39FF14)'
            ];
            trail.style.background = techColors[Math.floor(Math.random() * techColors.length)];
            
            const size = 3 + Math.random() * 6;
            trail.style.width = size + 'px';
            trail.style.height = size + 'px';
            
            trailContainer.appendChild(trail);
            trails.push({ element: trail, time: now });
            
            setTimeout(() => {
                if (trail.parentNode) {
                    trail.remove();
                }
            }, 600);
        }
        
        trails = trails.filter(trail => {
            if (now - trail.time > 600) {
                if (trail.element.parentNode) {
                    trail.element.remove();
                }
                return false;
            }
            return true;
        });
    });
    
    document.addEventListener('click', (e) => {
        createTechClickExplosion(e.clientX, e.clientY);
        triggerScreenShakeDestruction();
        playDigitalChaosSound();
    });
    
    function createTechClickExplosion(x, y) {
        for (let i = 0; i < 12; i++) {
            const explosion = document.createElement('div');
            explosion.style.cssText = `
                position: fixed;
                width: ${3 + Math.random() * 8}px;
                height: ${3 + Math.random() * 8}px;
                background: ${['#39FF14', '#0080FF', '#8000FF', '#FF0080', '#00FF41'][Math.floor(Math.random() * 5)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                left: ${x}px;
                top: ${y}px;
                box-shadow: 0 0 15px currentColor;
            `;
            
            const angle = (i / 12) * Math.PI * 2;
            const velocity = 100 + Math.random() * 150;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            document.body.appendChild(explosion);
            
            let time = 0;
            const animate = () => {
                time += 16;
                const progress = time / 1000;
                
                if (progress < 1) {
                    explosion.style.left = (x + vx * progress) + 'px';
                    explosion.style.top = (y + vy * progress + 0.5 * 300 * progress * progress) + 'px';
                    explosion.style.opacity = 1 - progress;
                    explosion.style.transform = `scale(${1 - progress * 0.8}) rotate(${progress * 360}deg)`;
                    requestAnimationFrame(animate);
                } else {
                    explosion.remove();
                }
            };
            animate();
        }
    }
}

// BRUTAL NAVIGATION SYSTEM - ENHANCED FOR DYNAMIC CONTENT
function initBrutalNavigation() {
    const navObjects = document.querySelectorAll('.nav-brutal-object');
    const sections = document.querySelectorAll('.brutal-section');
    let currentSection = 'latest';
    
    console.log('🔧 Initializing LOGNEON dynamic navigation');
    
    // Ensure proper initial state
    sections.forEach(section => {
        section.classList.remove('active', 'prev');
        if (section.id === 'latest') {
            section.classList.add('active');
        }
    });
    
    navObjects.forEach(navObject => {
        const targetSection = navObject.dataset.section;
        
        navObject.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (targetSection && targetSection !== currentSection) {
                switchToSection(targetSection);
                triggerScreenShakeDestruction();
                playDigitalChaosSound();
                createNavSwitchEffect(navObject);
            }
        });
        
        navObject.addEventListener('mouseenter', () => {
            playHoverChaosSound();
            createTechHoverStorm(navObject);
        });
    });
    
    function switchToSection(targetSection) {
        console.log('🔄 DYNAMIC SWITCHING from', currentSection, 'to', targetSection);
        
        const targetSectionEl = document.getElementById(targetSection);
        if (!targetSectionEl) {
            console.error('❌ Target section not found:', targetSection);
            return;
        }
        
        // Remove active from all sections first
        sections.forEach(section => {
            section.classList.remove('active', 'prev');
        });
        
        // Add active to target section
        targetSectionEl.classList.add('active');
        
        currentSection = targetSection;
        
        // Trigger section-specific effects
        setTimeout(() => {
            triggerSectionChaosEffects(targetSection);
        }, 100);
        
        // Update URL
        if (history.pushState) {
            history.pushState({ section: targetSection }, '', `#${targetSection}`);
        }
        
        createSectionTransitionChaos();
    }
    
    function createNavSwitchEffect(navObject) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 85px;
            left: 50%;
            transform: translateX(-50%) scale(0);
            background: rgba(57, 255, 20, 0.95);
            color: #0A0A0A;
            padding: 8px 15px;
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            z-index: 10001;
            pointer-events: none;
            border: 2px solid #39FF14;
            box-shadow: 0 0 25px rgba(57, 255, 20, 0.6);
        `;
        
        notification.textContent = `📍 ${navObject.dataset.label}`;
        document.body.appendChild(notification);
        
        notification.animate([
            { transform: 'translateX(-50%) scale(0) rotate(15deg)', opacity: 0 },
            { transform: 'translateX(-50%) scale(1) rotate(0deg)', opacity: 1 },
            { transform: 'translateX(-50%) scale(0) rotate(-15deg)', opacity: 0 }
        ], {
            duration: 2000,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        }).onfinish = () => notification.remove();
    }
    
    function createTechHoverStorm(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'tech-hover-particle';
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: ${['#39FF14', '#0080FF', '#8000FF', '#00FF41'][Math.floor(Math.random() * 4)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 10001;
                left: ${centerX}px;
                top: ${centerY}px;
                box-shadow: 0 0 12px currentColor;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (i / 6) * Math.PI * 2;
            const distance = 40 + Math.random() * 30;
            const targetX = centerX + Math.cos(angle) * distance;
            const targetY = centerY + Math.sin(angle) * distance;
            
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(0) rotate(0deg)', 
                    opacity: 1 
                },
                { 
                    transform: `translate(${targetX - centerX}px, ${targetY - centerY}px) scale(1) rotate(180deg)`, 
                    opacity: 0.8 
                },
                { 
                    transform: `translate(${(targetX - centerX) * 1.3}px, ${(targetY - centerY) * 1.3}px) scale(0) rotate(360deg)`, 
                    opacity: 0 
                }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => particle.remove();
        }
    }
    
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        const section = (e.state && e.state.section) || 'latest';
        if (section !== currentSection) {
            switchToSection(section);
        }
    });
    
    // Initialize with URL hash
    const initialSection = window.location.hash.slice(1) || 'latest';
    if (initialSection !== 'latest' && document.getElementById(initialSection)) {
        setTimeout(() => switchToSection(initialSection), 1500);
    }
    
    // Expose globally for keyboard shortcuts
    window.switchToSection = switchToSection;
    
    console.log('✅ Navigation system initialized');
}

// SECTION TRANSITION CHAOS
function initSectionTransitions() {
    window.createSectionTransitionChaos = function() {
        const glitchOverlay = document.createElement('div');
        glitchOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                #39FF14 0px,
                #39FF14 2px,
                #0080FF 2px,
                #0080FF 4px,
                #8000FF 4px,
                #8000FF 6px,
                #FF0080 6px,
                #FF0080 8px
            );
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            mix-blend-mode: difference;
        `;
        
        document.body.appendChild(glitchOverlay);
        
        glitchOverlay.animate([
            { opacity: 0, transform: 'translateX(0) skew(0deg)' },
            { opacity: 0.8, transform: 'translateX(-15px) skew(-3deg)' },
            { opacity: 0.6, transform: 'translateX(15px) skew(3deg)' },
            { opacity: 0.9, transform: 'translateX(-10px) skew(-2deg)' },
            { opacity: 0.7, transform: 'translateX(10px) skew(2deg)' },
            { opacity: 0, transform: 'translateX(0) skew(0deg)' }
        ], {
            duration: 600,
            easing: 'steps(15, end)'
        }).onfinish = () => glitchOverlay.remove();
    };
}

// GLITCH MATRIX EFFECTS
function initGlitchMatrix() {
    const glitchTexts = document.querySelectorAll('.glitch-text');
    
    glitchTexts.forEach(text => {
        setInterval(() => {
            if (Math.random() < 0.06) {
                triggerTextGlitchChaos(text);
            }
        }, 150);
    });
    
    function triggerTextGlitchChaos(element) {
        const originalText = element.textContent;
        const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?~`';
        
        let glitchText = '';
        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() < 0.3) {
                glitchText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitchText += originalText[i];
            }
        }
        
        element.textContent = glitchText;
        
        setTimeout(() => {
            element.textContent = originalText;
        }, 120);
    }
    
    setInterval(() => {
        if (Math.random() < 0.02) {
            createTechGlitchStorm();
        }
    }, 4000);
    
    function createTechGlitchStorm() {
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                const glitch = document.createElement('div');
                glitch.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * window.innerHeight}px;
                    left: 0;
                    width: 100%;
                    height: ${Math.random() * 60 + 15}px;
                    background: repeating-linear-gradient(
                        90deg,
                        #39FF14 0px,
                        #39FF14 3px,
                        transparent 3px,
                        transparent 6px,
                        #0080FF 6px,
                        #0080FF 9px,
                        transparent 9px,
                        transparent 12px
                    );
                    z-index: 10000;
                    pointer-events: none;
                    mix-blend-mode: difference;
                    opacity: 0.7;
                `;
                
                document.body.appendChild(glitch);
                
                setTimeout(() => {
                    glitch.remove();
                }, 200 + Math.random() * 150);
            }, i * 80);
        }
    }
}

// SCREEN SHAKE DESTRUCTION SYSTEM
function initScreenShakeDestruction() {
    let isShaking = false;
    
    window.triggerScreenShakeDestruction = function(intensity = 1) {
        if (isShaking) return;
        
        isShaking = true;
        document.body.classList.add('screen-shake');
        
        createTechShakeStorm();
        
        setTimeout(() => {
            document.body.classList.remove('screen-shake');
            isShaking = false;
        }, 600);
    };
    
    function createTechShakeStorm() {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: ${2 + Math.random() * 4}px;
                height: ${2 + Math.random() * 4}px;
                background: ${['#39FF14', '#0080FF', '#8000FF', '#FF0080'][Math.floor(Math.random() * 4)]};
                top: ${Math.random() * window.innerHeight}px;
                left: ${Math.random() * window.innerWidth}px;
                z-index: 10000;
                pointer-events: none;
                box-shadow: 0 0 12px currentColor;
                border-radius: 50%;
            `;
            
            document.body.appendChild(particle);
            
            particle.animate([
                { 
                    opacity: 1, 
                    transform: 'scale(1) rotate(0deg)' 
                },
                { 
                    opacity: 0, 
                    transform: 'scale(0) rotate(180deg)' 
                }
            ], {
                duration: 600,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }
}

// SOUND CHAOS SYSTEM
function initSoundChaosSystem() {
    let audioContext;
    
    if (window.AudioContext || window.webkitAudioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio context not available');
        }
    }
    
    window.playHoverChaosSound = function() {
        createVisualSoundFeedback('#39FF14', 'HOVER');
        if (audioContext) {
            playTechBeep(800, 0.08, 0.1);
        }
    };
    
    window.playDigitalChaosSound = function() {
        createVisualSoundFeedback('#0080FF', 'TECH');
        if (audioContext) {
            playTechBeep(1200, 0.15, 0.12);
        }
    };
    
    function playTechBeep(frequency, gain, duration) {
        try {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.6, audioContext.currentTime + duration);
            
            gainNode.gain.setValueAtTime(gain, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            console.log('Audio playback error:', e);
        }
    }
    
    function createVisualSoundFeedback(color, text) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 25px;
            right: 25px;
            background: ${color};
            color: #0A0A0A;
            padding: 6px 12px;
            font-family: 'Orbitron', monospace;
            font-weight: 700;
            font-size: 10px;
            z-index: 10001;
            pointer-events: none;
            border-radius: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 0 25px ${color};
        `;
        
        feedback.textContent = `🔊 ${text}`;
        document.body.appendChild(feedback);
        
        feedback.animate([
            { opacity: 1, transform: 'scale(0) translateX(40px)' },
            { opacity: 1, transform: 'scale(1) translateX(0)' },
            { opacity: 0, transform: 'scale(0) translateX(-40px)' }
        ], {
            duration: 350,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        }).onfinish = () => feedback.remove();
    }
}

// KEYBOARD CHAOS SHORTCUTS
function initKeyboardChaosShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.altKey && window.switchToSection) {
            const sections = ['latest', 'popular', 'shorts', 'categories', 'subscribe'];
            const currentSectionEl = document.querySelector('.brutal-section.active');
            const currentSection = currentSectionEl ? currentSectionEl.id : 'latest';
            const currentIndex = sections.indexOf(currentSection);
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % sections.length;
                window.switchToSection(sections[nextIndex]);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
                window.switchToSection(sections[prevIndex]);
            }
        }
        
        if (e.key === ' ' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            triggerScreenShakeDestruction();
            playDigitalChaosSound();
        }
        
        if (e.key === 's' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            window.switchToSection('subscribe');
            setTimeout(() => {
                window.open('https://www.youtube.com/@logneon', '_blank');
            }, 1000);
        }
    });
}

// INTERACTIVE DESTRUCTION ELEMENTS
function initInteractiveDestruction() {
    const titleShards = document.querySelectorAll('.title-shard');
    titleShards.forEach(shard => {
        shard.addEventListener('click', () => {
            createShardExplosion(shard);
            triggerScreenShakeDestruction();
            playDigitalChaosSound();
        });
    });
    
    function createShardExplosion(shard) {
        const rect = shard.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 12; i++) {
            const fragment = document.createElement('div');
            fragment.style.cssText = `
                position: fixed;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${getComputedStyle(shard).color};
                pointer-events: none;
                z-index: 10000;
                left: ${centerX}px;
                top: ${centerY}px;
                box-shadow: 0 0 15px currentColor;
            `;
            
            document.body.appendChild(fragment);
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 100 + Math.random() * 120;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            fragment.animate([
                { 
                    transform: 'translate(0, 0) rotate(0deg) scale(1)', 
                    opacity: 1 
                },
                { 
                    transform: `translate(${vx}px, ${vy + 200}px) rotate(720deg) scale(0)`, 
                    opacity: 0 
                }
            ], {
                duration: 1500,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => fragment.remove();
        }
    }
}

// DYNAMIC INTERACTION EFFECTS
function createVideoHoverChaos(card) {
    const rect = card.getBoundingClientRect();
    
    for (let i = 0; i < 4; i++) {
        const particle = document.createElement('div');
        particle.className = 'video-hover-particle';
        particle.style.cssText = `
            position: fixed;
            width: 3px;
            height: 3px;
            background: #39FF14;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            box-shadow: 0 0 10px #39FF14;
        `;
        
        document.body.appendChild(particle);
        
        particle.animate([
            { 
                opacity: 1, 
                transform: 'scale(0) rotate(0deg)' 
            },
            { 
                opacity: 0.8, 
                transform: 'scale(1) rotate(90deg)' 
            },
            { 
                opacity: 0, 
                transform: 'scale(0) rotate(180deg)' 
            }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

function createShortHoverChaos(card) {
    const rect = card.getBoundingClientRect();
    
    for (let i = 0; i < 3; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #FF0080;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            box-shadow: 0 0 12px #FF0080;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 600);
    }
}

function createCategoryParticleStorm(categoryObj) {
    const rect = categoryObj.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 3px;
            height: 3px;
            background: ${['#39FF14', '#0080FF', '#8000FF'][Math.floor(Math.random() * 3)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            left: ${centerX}px;
            top: ${centerY}px;
            box-shadow: 0 0 8px currentColor;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 60 + Math.random() * 40;
        const targetX = centerX + Math.cos(angle) * distance;
        const targetY = centerY + Math.sin(angle) * distance;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(0)', opacity: 1 },
            { transform: `translate(${targetX - centerX}px, ${targetY - centerY}px) scale(1)`, opacity: 0.6 },
            { transform: `translate(${(targetX - centerX) * 1.2}px, ${(targetY - centerY) * 1.2}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1200,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

function createCategoryExplosion(categoryObj) {
    const rect = categoryObj.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: rgba(10, 10, 10, 0.95);
        border: 3px solid #0080FF;
        color: #0080FF;
        padding: 18px 25px;
        font-family: 'Orbitron', monospace;
        font-weight: 900;
        font-size: 16px;
        text-align: center;
        z-index: 10001;
        text-transform: uppercase;
        letter-spacing: 2px;
        box-shadow: 0 0 35px rgba(0, 128, 255, 0.6);
    `;
    
    const categoryName = categoryObj.querySelector('.category-name').textContent;
    notification.innerHTML = `
        <div style="margin-bottom: 8px;">🔧 TECH CATEGORY</div>
        <div style="font-size: 12px; color: #39FF14;">${categoryName}</div>
    `;
    
    document.body.appendChild(notification);
    
    notification.animate([
        { transform: 'translate(-50%, -50%) scale(0) rotate(30deg)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1.1) rotate(0deg)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(0) rotate(-30deg)', opacity: 0 }
    ], {
        duration: 2000,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }).onfinish = () => notification.remove();
}

function createVideoOpenEffect(card) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(57, 255, 20, 0.95);
        color: #0A0A0A;
        padding: 12px 18px;
        font-family: 'Orbitron', monospace;
        font-weight: 700;
        font-size: 12px;
        z-index: 10001;
        border: 2px solid #39FF14;
        box-shadow: 0 0 25px rgba(57, 255, 20, 0.6);
        text-transform: uppercase;
        letter-spacing: 1px;
    `;
    
    notification.textContent = '🎬 LOADING TECH VIDEO';
    document.body.appendChild(notification);
    
    notification.animate([
        { transform: 'translateX(250px) scale(0)', opacity: 0 },
        { transform: 'translateX(0) scale(1)', opacity: 1 },
        { transform: 'translateX(0) scale(1)', opacity: 1 },
        { transform: 'translateX(250px) scale(0)', opacity: 0 }
    ], {
        duration: 2500,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }).onfinish = () => notification.remove();
}

function createShortOpenEffect(card) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(255, 0, 128, 0.95);
        color: #FFFFFF;
        padding: 12px 18px;
        font-family: 'Orbitron', monospace;
        font-weight: 700;
        font-size: 12px;
        z-index: 10001;
        border: 2px solid #FF0080;
        box-shadow: 0 0 25px rgba(255, 0, 128, 0.6);
        text-transform: uppercase;
        letter-spacing: 1px;
    `;
    
    notification.textContent = '⚡ OPENING LOGNEON SHORTS';
    document.body.appendChild(notification);
    
    notification.animate([
        { transform: 'translateX(-250px) scale(0)', opacity: 0 },
        { transform: 'translateX(0) scale(1)', opacity: 1 },
        { transform: 'translateX(0) scale(1)', opacity: 1 },
        { transform: 'translateX(-250px) scale(0)', opacity: 0 }
    ], {
        duration: 2000,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }).onfinish = () => notification.remove();
}

function createCategoryFilterEffect() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) scale(0);
        background: rgba(128, 0, 255, 0.95);
        color: #FFFFFF;
        padding: 10px 16px;
        font-family: 'Orbitron', monospace;
        font-weight: 700;
        font-size: 11px;
        z-index: 10001;
        border: 2px solid #8000FF;
        box-shadow: 0 0 25px rgba(128, 0, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 1px;
    `;
    
    notification.textContent = '🔍 CATEGORY FILTER APPLIED';
    document.body.appendChild(notification);
    
    notification.animate([
        { transform: 'translateX(-50%) scale(0)', opacity: 0 },
        { transform: 'translateX(-50%) scale(1)', opacity: 1 },
        { transform: 'translateX(-50%) scale(0)', opacity: 0 }
    ], {
        duration: 1500,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }).onfinish = () => notification.remove();
}

// SECTION SPECIFIC CHAOS EFFECTS
function triggerSectionChaosEffects(section) {
    console.log('🎆 Triggering LOGNEON effects for:', section);
    
    switch (section) {
        case 'latest':
            createLatestTechChaos();
            break;
        case 'popular':
            createPopularTechChaos();
            break;
        case 'shorts':
            createShortsChaos();
            break;
        case 'categories':
            createCategoriesChaos();
            break;
        case 'subscribe':
            createSubscribeChaos();
            break;
    }
}

function createLatestTechChaos() {
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const icon = document.createElement('div');
            icon.style.cssText = `
                position: fixed;
                font-size: 20px;
                top: -40px;
                left: ${Math.random() * window.innerWidth}px;
                z-index: 100;
                pointer-events: none;
                animation: float-down 3s ease-out forwards;
            `;
            
            icon.textContent = ['🔧', '⚡', '🌐', '💻', '🔐'][Math.floor(Math.random() * 5)];
            document.body.appendChild(icon);
            
            icon.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 0.8 },
                { transform: `translateY(${window.innerHeight + 80}px) rotate(180deg)`, opacity: 0 }
            ], {
                duration: 3000,
                easing: 'ease-out'
            }).onfinish = () => icon.remove();
        }, i * 200);
    }
}

function createPopularTechChaos() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const viral = document.createElement('div');
            viral.style.cssText = `
                position: fixed;
                font-size: 18px;
                bottom: -40px;
                left: ${Math.random() * window.innerWidth}px;
                z-index: 100;
                pointer-events: none;
                color: #FFD700;
            `;
            
            viral.textContent = ['💥', '⭐', '🔥', '18K', '17K'][Math.floor(Math.random() * 5)];
            document.body.appendChild(viral);
            
            viral.animate([
                { transform: 'translateY(0) scale(1)', opacity: 1 },
                { transform: `translateY(-${window.innerHeight + 80}px) scale(1.5)`, opacity: 0 }
            ], {
                duration: 2500,
                easing: 'ease-out'
            }).onfinish = () => viral.remove();
        }, i * 150);
    }
}

function createShortsChaos() {
    const symbols = ['⚡', '📱', '💾', '❤️', '👁️'];
    symbols.forEach((symbol, index) => {
        setTimeout(() => {
            const short = document.createElement('div');
            short.style.cssText = `
                position: fixed;
                font-size: 24px;
                top: 50%;
                left: -40px;
                z-index: 100;
                pointer-events: none;
                color: #FF0080;
            `;
            
            short.textContent = symbol;
            document.body.appendChild(short);
            
            short.animate([
                { transform: 'translateX(0)', opacity: 1 },
                { transform: `translateX(${window.innerWidth + 80}px)`, opacity: 0 }
            ], {
                duration: 2000 + index * 200,
                easing: 'linear'
            }).onfinish = () => short.remove();
        }, index * 300);
    });
}

function createCategoriesChaos() {
    const symbols = ['🌐', '⚡', '💻', '🔧', '🔋'];
    symbols.forEach((symbol, index) => {
        setTimeout(() => {
            const orbit = document.createElement('div');
            orbit.style.cssText = `
                position: fixed;
                font-size: 28px;
                top: 50%;
                left: 50%;
                z-index: 100;
                pointer-events: none;
                transform: translate(-50%, -50%);
            `;
            
            orbit.textContent = symbol;
            document.body.appendChild(orbit);
            
            const radius = 150 + index * 25;
            const duration = 2500 + index * 300;
            
            orbit.animate([
                { 
                    transform: `translate(-50%, -50%) rotate(0deg) translateX(${radius}px) rotate(0deg)` 
                },
                { 
                    transform: `translate(-50%, -50%) rotate(360deg) translateX(${radius}px) rotate(-360deg)` 
                }
            ], {
                duration: duration,
                iterations: 1.5,
                easing: 'linear'
            }).onfinish = () => orbit.remove();
        }, index * 200);
    });
}

function createSubscribeChaos() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const bell = document.createElement('div');
            bell.style.cssText = `
                position: fixed;
                font-size: ${16 + Math.random() * 10}px;
                top: -40px;
                left: ${Math.random() * window.innerWidth}px;
                z-index: 100;
                pointer-events: none;
                color: #39FF14;
            `;
            
            bell.textContent = ['🔔', '168', '169'][Math.floor(Math.random() * 3)];
            document.body.appendChild(bell);
            
            bell.animate([
                { 
                    transform: 'translateY(0) rotate(0deg)', 
                    opacity: 1 
                },
                { 
                    transform: `translateY(${window.innerHeight + 80}px) rotate(360deg)`, 
                    opacity: 0 
                }
            ], {
                duration: 3000,
                easing: 'ease-out'
            }).onfinish = () => bell.remove();
        }, i * 200);
    }
}

// START DYNAMIC DIGITAL CHAOS - MAIN INITIALIZATION
function startDynamicDigitalChaos() {
    console.log('🎬 LOGNEON DYNAMIC DIGITAL CHAOS SYSTEM OPERATIONAL! 🎬');
    console.log('⚡ REAL-TIME YOUTUBE CONTENT LOADING WITH EMBEDDED PLAYER ⚡');
    console.log('🔧 168 SUBSCRIBERS - AUTHENTIC TECH EXPERIENCE WITH DYNAMIC LOADING 🔧');
    
    setTimeout(() => {
        triggerScreenShakeDestruction();
    }, 1200);
    
    setInterval(() => {
        if (Math.random() < 0.15) {
            const effects = [
                () => createTechGlitchStorm(),
                () => triggerScreenShakeDestruction(0.5),
                () => createVisualSoundFeedback('#8000FF', 'TECH'),
                () => createRandomTechStorm()
            ];
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];
            randomEffect();
        }
    }, 8000);
    
    setTimeout(() => {
        createLogneonWelcomeMessage();
    }, 2000);
    
    function createRandomTechStorm() {
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 3px;
                height: 3px;
                background: ${['#39FF14', '#0080FF', '#8000FF', '#FF0080'][Math.floor(Math.random() * 4)]};
                top: ${Math.random() * window.innerHeight}px;
                left: ${Math.random() * window.innerWidth}px;
                z-index: 10000;
                pointer-events: none;
                border-radius: 50%;
                box-shadow: 0 0 12px currentColor;
            `;
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        }
    }
}

function createLogneonWelcomeMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0) rotate(30deg);
        background: rgba(10, 10, 10, 0.98);
        border: 4px solid #39FF14;
        color: #39FF14;
        padding: 35px 45px;
        font-family: 'Orbitron', monospace;
        font-weight: 900;
        font-size: 24px;
        text-align: center;
        z-index: 10000;
        pointer-events: none;
        text-shadow: 0 0 25px currentColor;
        box-shadow: 
            0 0 50px rgba(57, 255, 20, 0.6),
            inset 0 0 25px rgba(57, 255, 20, 0.1);
        text-transform: uppercase;
        letter-spacing: 3px;
    `;
    
    message.innerHTML = `
        <div style="margin-bottom: 15px;">🎬 LOGNEON TECH CHAOS 🎬</div>
        <div style="font-size: 14px; color: #0080FF;">REAL CHANNEL • 168 REBELS</div>
        <div style="font-size: 12px; color: #8000FF; margin-top: 12px;">DYNAMIC CONTENT LOADED</div>
        <div style="font-size: 10px; color: #FF0080; margin-top: 8px;">NAVIGATION & VIDEOS WORKING!</div>
    `;
    
    document.body.appendChild(message);
    
    message.animate([
        { 
            transform: 'translate(-50%, -50%) scale(0) rotate(30deg)', 
            opacity: 0 
        },
        { 
            transform: 'translate(-50%, -50%) scale(1.1) rotate(0deg)', 
            opacity: 1 
        },
        { 
            transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', 
            opacity: 1 
        }
    ], {
        duration: 1200,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    });
    
    const removeMessage = () => {
        message.animate([
            { 
                transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', 
                opacity: 1 
            },
            { 
                transform: 'translate(-50%, -50%) scale(0) rotate(-30deg)', 
                opacity: 0 
            }
        ], {
            duration: 600,
            easing: 'ease-in'
        }).onfinish = () => message.remove();
        
        document.removeEventListener('click', removeMessage);
        document.removeEventListener('keydown', removeMessage);
    };
    
    setTimeout(() => {
        document.addEventListener('click', removeMessage);
        document.addEventListener('keydown', removeMessage);
    }, 1200);
    
    setTimeout(() => {
        if (message.parentNode) {
            removeMessage();
        }
    }, 7000);
}