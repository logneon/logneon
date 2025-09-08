// LOGNEON DYNAMIC LOADER - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 Starting LOGNEON dynamic loader...');
    loadYouTubeData();
});

async function loadYouTubeData() {
    console.log('📡 Loading YouTube data files...');
    
    try {
        // Load all data files
        const [statsResponse, videosResponse, shortsResponse] = await Promise.allSettled([
            fetch('./data/youtube-stats.json'),
            fetch('./data/youtube-videos.json'),
            fetch('./data/youtube-shorts.json')
        ]);

        let stats = {};
        let videos = [];
        let shorts = [];

        // Process stats
        if (statsResponse.status === 'fulfilled' && statsResponse.value.ok) {
            stats = await statsResponse.value.json();
            console.log('✅ Stats loaded:', stats);
            updateStats(stats);
        } else {
            console.log('⚠️ Stats failed, using defaults');
            useDefaultStats();
        }

        // Process videos
        if (videosResponse.status === 'fulfilled' && videosResponse.value.ok) {
            const videosData = await videosResponse.value.json();
            videos = Array.isArray(videosData) ? videosData : (videosData.videos || []);
            console.log('✅ Videos loaded:', videos.length);
            renderVideos(videos);
        } else {
            console.log('⚠️ Videos failed, showing message');
            showNoVideos();
        }

        // Process shorts
        if (shortsResponse.status === 'fulfilled' && shortsResponse.value.ok) {
            const shortsData = await shortsResponse.value.json();
            shorts = Array.isArray(shortsData) ? shortsData : (shortsData.shorts || []);
            console.log('✅ Shorts loaded:', shorts.length);
            renderShorts(shorts);
        }

        // Hide loader after everything loads
        hideLoader();
        showSuccessNotification();

    } catch (error) {
        console.error('❌ Loading error:', error);
        showError();
        hideLoader();
    }
}

function updateStats(stats) {
    console.log('📊 Updating stats with:', stats);
    
    const subscriberCount = stats.subscriberCount || 168;
    const videoCount = stats.videoCount || 39;
    const viewCount = stats.viewCount || 78609;
    
    // Update ALL subscriber count elements
    const subscriberElements = [
        '#subscriber-count',
        '#nav-subscriber-count', 
        '#hero-subscriber-count',
        '#subscribe-rebel-count',
        '.subscriber-chaos'
    ];
    
    subscriberElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element) {
                if (selector.includes('rebel') || selector.includes('chaos')) {
                    element.textContent = `${subscriberCount} REBELS`;
                } else {
                    element.textContent = subscriberCount;
                }
                console.log(`Updated ${selector} to ${subscriberCount}`);
            }
        });
    });
    
    // Update ALL video count elements
    const videoElements = [
        '#video-count',
        '#hero-video-count',
        '#showcase-videos',
        '.stat-number-chaos'
    ];
    
    videoElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element && !element.textContent.includes('K')) {
                element.textContent = videoCount;
                console.log(`Updated ${selector} to ${videoCount}`);
            }
        });
    });
    
    // Update ALL view count elements
    const viewElements = [
        '#total-views',
        '#hero-total-views', 
        '#showcase-views',
        '[data-stat="views"]'
    ];
    
    viewElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element) {
                element.textContent = formatViews(viewCount);
                console.log(`Updated ${selector} to ${formatViews(viewCount)}`);
            }
        });
    });
    
    // Update last updated time
    if (stats.lastUpdated) {
        const updateTime = new Date(stats.lastUpdated).toLocaleString();
        const updateElements = document.querySelectorAll('#last-update-time, .last-updated');
        updateElements.forEach(element => {
            if (element) {
                element.textContent = updateTime;
            }
        });
    }
}

function useDefaultStats() {
    console.log('📊 Using default stats');
    updateStats({
        subscriberCount: 168,
        videoCount: 39,
        viewCount: 78609
    });
}

function renderVideos(videos) {
    const grid = document.getElementById('videos-grid');
    if (!grid) {
        console.log('❌ Videos grid not found');
        return;
    }

    if (videos.length === 0) {
        showNoVideos();
        return;
    }

    console.log(`🎬 Rendering ${videos.length} videos`);
    
    // Sort by publish date (newest first)
    const sortedVideos = [...videos].sort((a, b) => 
        new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    grid.innerHTML = '';
    
    // Render first 12 videos
    sortedVideos.slice(0, 12).forEach((video, index) => {
        const card = createVideoCard(video, index);
        grid.appendChild(card);
        
        // Animate in with delay
        setTimeout(() => {
            card.classList.add('loaded');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 150);
    });
}

function renderShorts(shorts) {
    const shortsGrid = document.getElementById('shorts-grid');
    if (!shortsGrid) return;
    
    if (shorts.length === 0) {
        shortsGrid.innerHTML = '<div class="no-content">No shorts available</div>';
        return;
    }
    
    console.log(`⚡ Rendering ${shorts.length} shorts`);
    
    shortsGrid.innerHTML = '';
    shorts.forEach(short => {
        const card = createShortCard(short);
        shortsGrid.appendChild(card);
    });
}

function createVideoCard(video, index) {
    const card = document.createElement('div');
    card.className = 'video-card-brutal';
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.9)';
    card.style.transition = 'all 0.6s ease';
    
    const viewCount = video.viewCount || 0;
    const chaosLevel = getChaosLevel(viewCount);
    const isViral = viewCount > 1000;
    
    card.innerHTML = `
        <div class="video-thumbnail-chaos">
            <img src="${video.thumbnail}" alt="${video.title}" class="thumbnail-img" loading="lazy">
            <div class="play-button-destruction">▶</div>
            <div class="chaos-level-indicator ${chaosLevel.toLowerCase()}">${chaosLevel}</div>
            ${isViral ? '<div class="viral-badge">💥</div>' : ''}
            <div class="video-duration">${formatDuration(video.duration)}</div>
        </div>
        <div class="video-info-brutal">
            <div class="video-emoji">🎬</div>
            <h3 class="video-title-chaos">${truncateTitle(video.title)}</h3>
            <div class="video-stats-destruction">
                <span class="views-chaos">${formatViews(viewCount)} views</span>
                <span class="date-chaos">${formatDate(video.publishedAt)}</span>
            </div>
            <div class="video-category-tag ${video.category || 'general'}">${(video.category || 'CREATIVE').toUpperCase()}</div>
        </div>
    `;
    
    // Add click handler for embedded player
    card.addEventListener('click', () => {
        openVideoModal(video);
    });
    
    return card;
}

function createShortCard(short) {
    const card = document.createElement('div');
    card.className = 'short-card-brutal';
    
    card.innerHTML = `
        <div class="short-thumbnail-chaos">
            <img src="${short.thumbnail}" alt="${short.title}" class="thumbnail-img" loading="lazy">
            <div class="play-button-destruction">▶</div>
            <div class="short-badge">SHORT</div>
        </div>
        <div class="short-info">
            <h4>${truncateTitle(short.title, 30)}</h4>
            <span class="short-views">${formatViews(short.viewCount || 0)} views</span>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.open(short.youtubeUrl || `https://www.youtube.com/watch?v=${short.id}`, '_blank');
    });
    
    return card;
}

function openVideoModal(video) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-iframe');
    const title = document.getElementById('modal-title');
    const views = document.getElementById('modal-views');
    const description = document.getElementById('modal-description');
    
    if (!modal) {
        console.log('⚠️ Video modal not found, opening in new tab');
        window.open(video.youtubeUrl || `https://www.youtube.com/watch?v=${video.id}`, '_blank');
        return;
    }
    
    title.textContent = video.title;
    views.textContent = `${formatViews(video.viewCount)} views • ${formatDate(video.publishedAt)}`;
    description.textContent = video.description || 'No description available';
    
    // Set YouTube embed URL
    iframe.src = video.embedUrl || `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    console.log(`🎬 Opened video: ${video.title}`);
}

function showNoVideos() {
    const grid = document.getElementById('videos-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="no-videos-message">
                <h3>⚡ DYNAMIC CONTENT LOADING...</h3>
                <p>Your latest videos will appear here when GitHub Actions completes</p>
                <div class="loading-animation">🔄</div>
                <a href="https://www.youtube.com/@logneon" target="_blank" class="youtube-link-brutal">
                    📺 VISIT YOUTUBE CHANNEL
                </a>
            </div>
        `;
    }
}

function showError() {
    const grid = document.getElementById('videos-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="error-message-brutal">
                <h3>⚠️ LOADING FAILED</h3>
                <p>Unable to load dynamic content from GitHub Actions</p>
                <button onclick="loadYouTubeData()" class="retry-button-brutal">🔄 RETRY</button>
                <a href="https://www.youtube.com/@logneon" target="_blank" class="youtube-link-brutal">
                    📺 VISIT YOUTUBE CHANNEL
                </a>
            </div>
        `;
    }
}

function hideLoader() {
    const loader = document.getElementById('dynamic-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
        console.log('✅ Loader hidden');
    }
}

function showSuccessNotification() {
    const notification = document.getElementById('success-notification');
    if (notification) {
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

// Utility functions
function formatViews(count) {
    if (!count || count === 0) return '0';
    if (count >= 1000000) return Math.floor(count / 100000) / 10 + 'M';
    if (count >= 1000) return Math.floor(count / 100) / 10 + 'K';
    return count.toString();
}

function formatDate(dateString) {
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

function formatDuration(duration) {
    if (!duration) return '';
    
    // Convert PT5M41S to 5:41
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

function truncateTitle(title, maxLength = 60) {
    if (!title) return 'Unknown Title';
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
}

function getChaosLevel(viewCount) {
    if (viewCount >= 15000) return 'LEGENDARY';
    if (viewCount >= 8000) return 'VIRAL';
    if (viewCount >= 1000) return 'CREATIVE';
    return 'EXPERIMENTAL';
}

// Global functions
window.closeVideoModal = function() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-iframe');
    
    if (iframe) iframe.src = '';
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
};

window.refreshContent = function() {
    console.log('🔄 Manual refresh triggered');
    loadYouTubeData();
};

console.log('📺 LOGNEON Dynamic Loader Ready!');

// HEADER NAVIGATION FUNCTIONALITY
function initializeHeaderButtons() {
    console.log('🔘 Initializing header buttons...');
    
    const navButtons = document.querySelectorAll('.nav-brutal-object');
    
    navButtons.forEach(button => {
        const section = button.dataset.section;
        const label = button.dataset.label;
        
        console.log(`Setting up button: ${label} -> ${section}`);
        
        button.addEventListener('click', function() {
            console.log(`🔘 Button clicked: ${label}`);
            
            // Special handling for different sections
            if (section === 'subscribe' || label?.includes('SUBSCRIBE')) {
                window.open('https://www.youtube.com/@logneon', '_blank');
                return;
            }
            
            // Scroll to sections
            let targetElement;
            
            switch(section) {
                case 'latest':
                    targetElement = document.querySelector('.latest-videos-section, #latest, .videos-grid-chaos');
                    break;
                case 'popular':
                    targetElement = document.querySelector('.viral-videos-section, #popular');
                    break;
                case 'shorts':
                    targetElement = document.querySelector('.shorts-section, #shorts');
                    break;
                default:
                    targetElement = document.getElementById(section);
            }
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                console.log(`✅ Scrolled to: ${section}`);
            } else {
                console.log(`⚠️ Section not found: ${section}`);
            }
            
            // Visual feedback
            this.style.transform = 'scale(1.2) rotate(5deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
        
        // Hover effects
        button.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(57, 255, 20, 0.3)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(57, 255, 20, 0.1)';
        });
    });
}

// Call this function after DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure elements are loaded
    setTimeout(initializeHeaderButtons, 1000);
});

// Also initialize after content loads
function initializeEverything() {
    initializeHeaderButtons();
    
    // Ensure stats overlay is visible
    const statsOverlay = document.getElementById('stats-overlay');
    if (statsOverlay) {
        statsOverlay.style.display = 'flex';
    }
}

// Update the main loading function
const originalLoadYouTubeData = loadYouTubeData;
loadYouTubeData = async function() {
    await originalLoadYouTubeData();
    setTimeout(initializeEverything, 500);
};
