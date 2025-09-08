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
