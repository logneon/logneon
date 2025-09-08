// SIMPLE DYNAMIC LOADER FOR LOGNEON
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 Starting dynamic loader...');
    loadYouTubeData();
});

async function loadYouTubeData() {
    try {
        // Hide loading screen after 3 seconds regardless
        setTimeout(hideLoader, 3000);
        
        // Try to load stats
        const statsResponse = await fetch('./data/youtube-stats.json');
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            updateStats(stats);
            console.log('✅ Stats loaded:', stats);
        } else {
            console.log('⚠️ No stats file found, using defaults');
            useDefaultStats();
        }
        
        // Try to load videos  
        const videosResponse = await fetch('./data/youtube-videos.json');
        if (videosResponse.ok) {
            const videosData = await videosResponse.json();
            const videos = videosData.videos || videosData || [];
            renderVideos(videos);
            console.log('✅ Videos loaded:', videos.length);
        } else {
            console.log('⚠️ No videos file found, showing message');
            showNoVideos();
        }
        
        hideLoader();
        
    } catch (error) {
        console.error('❌ Loading error:', error);
        hideLoader();
        showError();
    }
}

function updateStats(stats) {
    // Update subscriber counts
    const subElements = document.querySelectorAll('[id*="subscriber"], .subscriber-chaos');
    subElements.forEach(el => {
        if (el.textContent.includes('REBELS')) {
            el.textContent = `${stats.subscriberCount || 168} REBELS`;
        } else {
            el.textContent = stats.subscriberCount || 168;
        }
    });
    
    // Update video counts
    const videoElements = document.querySelectorAll('[id*="video-count"], [id*="hero-video"]');
    videoElements.forEach(el => {
        el.textContent = stats.videoCount || 39;
    });
    
    // Update view counts
    const viewElements = document.querySelectorAll('[id*="total-views"], [id*="hero-total"]');
    viewElements.forEach(el => {
        el.textContent = formatViews(stats.viewCount || 75000);
    });
}

function useDefaultStats() {
    updateStats({
        subscriberCount: 168,
        videoCount: 39,
        viewCount: 75000
    });
}

function renderVideos(videos) {
    const grid = document.getElementById('videos-grid');
    if (!grid) return;
    
    if (videos.length === 0) {
        showNoVideos();
        return;
    }
    
    grid.innerHTML = '';
    videos.slice(0, 6).forEach(video => {
        const card = document.createElement('div');
        card.className = 'video-card-brutal';
        card.innerHTML = `
            <div class="video-thumbnail-chaos">
                <img src="${video.thumbnail || 'https://i.ytimg.com/vi/' + video.id + '/maxresdefault.jpg'}" 
                     alt="${video.title}" class="thumbnail-img">
                <div class="play-button-destruction">▶</div>
                <div class="chaos-level-indicator">${getChaosLevel(video.viewCount)}</div>
            </div>
            <div class="video-info-brutal">
                <h3 class="video-title-chaos">${truncateTitle(video.title)}</h3>
                <div class="video-stats-destruction">
                    <span class="views-chaos">${formatViews(video.viewCount)} views</span>
                    <span class="date-chaos">${formatDate(video.publishedAt)}</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            window.open(video.youtubeUrl || `https://www.youtube.com/watch?v=${video.id}`, '_blank');
        });
        
        grid.appendChild(card);
    });
}

function showNoVideos() {
    const grid = document.getElementById('videos-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="no-videos-message">
                <h3>🔄 WAITING FOR GITHUB ACTIONS</h3>
                <p>Dynamic content will load once the workflow creates data files</p>
                <a href="https://www.youtube.com/@logneon" target="_blank">📺 Visit YouTube Channel</a>
            </div>
        `;
    }
}

function showError() {
    const grid = document.getElementById('videos-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="error-message">
                <h3>⚠️ LOADING FAILED</h3>
                <p>Unable to load dynamic content</p>
                <a href="https://www.youtube.com/@logneon" target="_blank">📺 Visit YouTube Channel</a>
            </div>
        `;
    }
}

function hideLoader() {
    const loader = document.getElementById('dynamic-loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Utility functions
function formatViews(count) {
    if (count >= 1000000) return Math.floor(count / 100000) / 10 + 'M';
    if (count >= 1000) return Math.floor(count / 100) / 10 + 'K';
    return count?.toString() || '0';
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
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

console.log('📺 LOGNEON Dynamic Loader Ready!');
