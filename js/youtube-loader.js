// LOGNEON YouTube Dynamic Loader
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 LOGNEON Dynamic Loader Started');
    loadYouTubeData();
});

async function loadYouTubeData() {
    showLoading();
    
    try {
        console.log('📡 Fetching YouTube data...');
        
        // Load JSON data files
        const [videosResponse, shortsResponse, statsResponse] = await Promise.all([
            fetch('./data/youtube-videos.json').catch(() => ({ ok: false })),
            fetch('./data/youtube-shorts.json').catch(() => ({ ok: false })),
            fetch('./data/youtube-stats.json').catch(() => ({ ok: false }))
        ]);

        let videos = [];
        let shorts = [];
        let stats = {};

        // Parse video data
        if (videosResponse.ok) {
            const videosData = await videosResponse.json();
            videos = videosData.videos || videosData || [];
            console.log(`✅ Loaded ${videos.length} videos`);
        }

        // Parse shorts data  
        if (shortsResponse.ok) {
            const shortsData = await shortsResponse.json();
            shorts = shortsData.shorts || shortsData || [];
            console.log(`✅ Loaded ${shorts.length} shorts`);
        }

        // Parse stats data
        if (statsResponse.ok) {
            stats = await statsResponse.json();
            console.log('✅ Loaded channel stats');
        }

        // Update the page
        updateChannelStats(stats);
        renderVideos(videos);
        renderShorts(shorts);
        hideLoading();

    } catch (error) {
        console.error('❌ Error loading data:', error);
        showErrorMessage();
        hideLoading();
    }
}

function updateChannelStats(stats) {
    if (stats.subscriberCount) {
        const subElement = document.getElementById('subscriber-count');
        const subStat = document.getElementById('subscriber-stat');
        if (subElement) subElement.textContent = `${stats.subscriberCount} REBELS`;
        if (subStat) subStat.textContent = stats.subscriberCount;
    }
    
    if (stats.videoCount) {
        const videoStat = document.getElementById('total-videos');
        if (videoStat) videoStat.textContent = stats.videoCount;
    }
}

function renderVideos(videos) {
    const videosGrid = document.getElementById('videos-grid');
    if (!videosGrid) return;

    if (videos.length === 0) {
        videosGrid.innerHTML = '<div class="no-content">No videos available</div>';
        return;
    }

    // Sort by date (newest first)
    const sortedVideos = videos.sort((a, b) => 
        new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    videosGrid.innerHTML = '';
    
    sortedVideos.forEach((video, index) => {
        const videoCard = createVideoCard(video);
        videosGrid.appendChild(videoCard);
        
        // Animate in
        setTimeout(() => {
            videoCard.style.opacity = '1';
            videoCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function renderShorts(shorts) {
    const shortsGrid = document.getElementById('shorts-grid');
    if (!shortsGrid) return;

    if (shorts.length === 0) {
        shortsGrid.innerHTML = '<div class="no-content">No shorts available</div>';
        return;
    }

    shortsGrid.innerHTML = '';
    
    shorts.forEach((short, index) => {
        const shortCard = createShortCard(short);
        shortsGrid.appendChild(shortCard);
    });
}

function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card-brutal';
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    
    const viewCount = video.viewCount || 0;
    const chaosLevel = getChaosLevel(viewCount);
    
    card.innerHTML = `
        <div class="video-thumbnail-chaos">
            <img src="${video.thumbnail || `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}" 
                 alt="${video.title}" class="thumbnail-img" loading="lazy">
            <div class="play-button-destruction">▶</div>
            <div class="chaos-level-indicator ${chaosLevel.class}">${chaosLevel.text}</div>
            ${viewCount > 1000 ? '<div class="viral-badge">VIRAL!</div>' : ''}
        </div>
        <div class="video-info-brutal">
            <h3 class="video-title-chaos">${truncateTitle(video.title)}</h3>
            <div class="video-stats-destruction">
                <span class="views-chaos">${formatViews(viewCount)} views</span>
                <span class="date-chaos">${formatDate(video.publishedAt)}</span>
            </div>
        </div>
    `;
    
    // Add click handler
    card.addEventListener('click', () => openVideoModal(video));
    
    return card;
}

function createShortCard(short) {
    const card = document.createElement('div');
    card.className = 'short-card-brutal';
    
    card.innerHTML = `
        <div class="short-thumbnail-chaos">
            <img src="${short.thumbnail || `https://i.ytimg.com/vi/${short.id}/maxresdefault.jpg`}" 
                 alt="${short.title}" class="thumbnail-img" loading="lazy">
            <div class="play-button-destruction">▶</div>
            <div class="short-badge">SHORT</div>
        </div>
        <div class="short-info">
            <h4>${truncateTitle(short.title, 30)}</h4>
            <span class="short-views">${formatViews(short.viewCount || 0)} views</span>
        </div>
    `;
    
    card.addEventListener('click', () => openVideoModal(short));
    
    return card;
}

function openVideoModal(video) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-iframe');
    const title = document.getElementById('modal-title');
    
    title.textContent = video.title;
    iframe.src = video.embedUrl || `https://www.youtube.com/embed/${video.id}?autoplay=1`;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-iframe');
    
    iframe.src = '';
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// Utility functions
function showLoading() {
    const loading = document.getElementById('loading-state');
    if (loading) loading.style.display = 'flex';
}

function hideLoading() {
    const loading = document.getElementById('loading-state');
    if (loading) loading.style.display = 'none';
}

function showErrorMessage() {
    const videosGrid = document.getElementById('videos-grid');
    if (videosGrid) {
        videosGrid.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Failed to load videos</h3>
                <p>Please check back later or visit our YouTube channel</p>
                <a href="https://www.youtube.com/@logneon" target="_blank" class="youtube-link">
                    🔴 Visit YouTube Channel
                </a>
            </div>
        `;
    }
}

function formatViews(count) {
    if (count >= 1000000) return Math.floor(count / 100000) / 10 + 'M';
    if (count >= 1000) return Math.floor(count / 100) / 10 + 'K';
    return count.toString();
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

function truncateTitle(title, maxLength = 60) {
    if (!title) return 'Unknown Title';
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
}

function getChaosLevel(viewCount) {
    if (viewCount >= 15000) return { class: 'legendary', text: 'LEGENDARY' };
    if (viewCount >= 10000) return { class: 'viral', text: 'VIRAL' };
    if (viewCount >= 5000) return { class: 'advanced', text: 'ADVANCED' };
    if (viewCount >= 1000) return { class: 'technical', text: 'TECHNICAL' };
    return { class: 'experimental', text: 'EXPERIMENTAL' };
}
