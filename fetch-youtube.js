const axios = require('axios');
const fs = require('fs');

// Ensure data directory exists
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data', { recursive: true });
}

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
            thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url,
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
        
        // Write files with proper structure
        fs.writeFileSync('./data/youtube-videos.json', JSON.stringify({ videos }, null, 2));
        fs.writeFileSync('./data/youtube-shorts.json', JSON.stringify({ shorts }, null, 2));
        fs.writeFileSync('./data/youtube-stats.json', JSON.stringify(channelStats, null, 2));
        
        console.log(`✅ Updated ${videos.length} videos and ${shorts.length} shorts`);
        console.log(`📊 Channel stats: ${channelStats.subscriberCount} subscribers, ${channelStats.videoCount} videos`);
        
    } catch (error) {
        console.error('❌ Error fetching YouTube data:', error.message);
        
        // Create fallback data if API fails
        console.log('⚠️ Creating fallback data files...');
        
        const fallbackStats = {
            name: 'LOGNEON',
            handle: '@logneon',
            subscriberCount: 168,
            videoCount: 39,
            viewCount: 78609,
            description: 'LOGNEON tech content - Dynamic tech tutorials with real-time updates',
            lastUpdated: new Date().toISOString()
        };
        
        const fallbackVideos = [
            {
                id: 'fallback1',
                title: 'Make RJ45 Ethernet Cable at Home | Crimp + Punch Tool | Speed & Ping Test',
                description: 'Learn how to make professional RJ45 Ethernet cables at home using crimp and punch tools. Includes comprehensive speed and ping testing of the homemade cables to ensure optimal performance.',
                thumbnail: null,
                publishedAt: '2024-09-01T10:00:00Z',
                viewCount: 12500,
                duration: 'PT8M30S',
                category: 'networking',
                embedUrl: 'https://www.youtube.com/embed/fallback1',
                youtubeUrl: 'https://www.youtube.com/watch?v=fallback1'
            },
            {
                id: 'fallback2', 
                title: 'BSNL Port Forwarding | Virtual Server | Dynamic IP | With HTTPS',
                description: 'Complete guide to BSNL port forwarding setup with virtual server configuration, dynamic IP handling, and HTTPS setup for home servers.',
                thumbnail: null,
                publishedAt: '2024-08-28T14:20:00Z',
                viewCount: 8200,
                duration: 'PT18M45S',
                category: 'networking',
                embedUrl: 'https://www.youtube.com/embed/fallback2',
                youtubeUrl: 'https://www.youtube.com/watch?v=fallback2'
            },
            {
                id: 'fallback3',
                title: 'How to Fill Distilled Water in Battery/Inverter | Alert | Proper Check its TDS',
                description: 'Proper method to fill distilled water in batteries and inverters. Important TDS testing procedures for battery maintenance and longevity.',
                thumbnail: null,
                publishedAt: '2024-08-25T09:15:00Z',
                viewCount: 9800,
                duration: 'PT7M15S',
                category: 'diy',
                embedUrl: 'https://www.youtube.com/embed/fallback3',
                youtubeUrl: 'https://www.youtube.com/watch?v=fallback3'
            }
        ];
        
        const fallbackShorts = [
            {
                id: 'short1',
                title: 'Quick Network Fix #shorts',
                description: 'Quick networking tip for home users',
                thumbnail: null,
                publishedAt: '2024-09-05T08:00:00Z',
                viewCount: 2500,
                duration: 'PT45S',
                category: 'networking',
                embedUrl: 'https://www.youtube.com/embed/short1',
                youtubeUrl: 'https://www.youtube.com/watch?v=short1'
            }
        ];
        
        // Write fallback files
        fs.writeFileSync('./data/youtube-videos.json', JSON.stringify({ videos: fallbackVideos }, null, 2));
        fs.writeFileSync('./data/youtube-shorts.json', JSON.stringify({ shorts: fallbackShorts }, null, 2));
        fs.writeFileSync('./data/youtube-stats.json', JSON.stringify(fallbackStats, null, 2));
        
        console.log('✅ Fallback data created successfully');
        process.exit(1);
    }
}

function categorizeVideo(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('rj45') || titleLower.includes('ethernet') || titleLower.includes('wifi') || titleLower.includes('network') || titleLower.includes('bsnl') || titleLower.includes('port forwarding')) {
        return 'networking';
    }
    if (titleLower.includes('eclipse') || titleLower.includes('docker') || titleLower.includes('wordpress') || titleLower.includes('software')) {
        return 'software';
    }
    if (titleLower.includes('usb') || titleLower.includes('adapter') || titleLower.includes('hardware') || titleLower.includes('trimmer') || titleLower.includes('harddrive') || titleLower.includes('ssd')) {
        return 'hardware';
    }
    if (titleLower.includes('speed test') || titleLower.includes('speedtest') || titleLower.includes('airtel') || titleLower.includes('jio') || titleLower.includes('5g')) {
        return 'mobile';
    }
    if (titleLower.includes('diy') || titleLower.includes('thermal paste') || titleLower.includes('battery') || titleLower.includes('distilled water') || titleLower.includes('inverter')) {
        return 'diy';
    }
    if (titleLower.includes('space station') || titleLower.includes('eclipse') || titleLower.includes('astronomy')) {
        return 'astronomy';
    }
    if (titleLower.includes('security') || titleLower.includes('hacking') || titleLower.includes('privacy')) {
        return 'security';
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