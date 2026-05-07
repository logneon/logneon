const DATA_ENDPOINTS = {
    stats: "./data/youtube-stats.json",
    videos: "./data/youtube-videos.json",
    shorts: "./data/youtube-shorts.json",
};

const CHANNEL_URL = "https://www.youtube.com/@logneon";
const SUBSCRIBE_URL = "https://www.youtube.com/@logneon?sub_confirmation=1";

const FILTERS = [
    { id: "all", label: "All uploads" },
    { id: "fresh", label: "Fresh drops" },
    { id: "popular", label: "Top views" },
    { id: "guides", label: "Guides" },
    { id: "quick", label: "Quick watch" },
];

const TOPIC_DEFINITIONS = [
    {
        id: "ai",
        name: "AI & creator tools",
        accent: "cyan",
        description: "Workflow setup, models, creator tooling, and modern software experiments.",
        matchers: ["comfyui", "linux", "cloud", "stable diffusion", "flux", "ai", "wan", "gcp"],
    },
    {
        id: "science",
        name: "Science & space",
        accent: "gold",
        description: "Big ideas, explainers, and curiosity-led science content.",
        matchers: ["voyager", "space", "science", "electricity", "nasa", "planet", "earthquake"],
    },
    {
        id: "practical",
        name: "Practical life tech",
        accent: "mint",
        description: "Useful day-to-day fixes, kitchen hacks, home devices, and safety.",
        matchers: ["lpg", "gas", "induction", "ethernet", "cable", "kitchen", "safety", "bulb"],
    },
    {
        id: "travel",
        name: "Travel & daily moments",
        accent: "coral",
        description: "Trips, routes, local moments, and slice-of-life uploads.",
        matchers: ["trip", "dehradun", "haldwani", "nainital", "village", "college", "day"],
    },
    {
        id: "story",
        name: "Stories & cinematic drops",
        accent: "violet",
        description: "Serialized story content, emotional beats, and character-driven uploads.",
        matchers: ["part", "love", "story", "cinematic", "genius", "future", "riya", "aarva"],
    },
];

const state = {
    stats: null,
    videos: [],
    shorts: [],
    allContent: [],
    selectedVideo: null,
    activeFilter: "all",
};

class SoundEngine {
    constructor(toggleElement) {
        this.toggleElement = toggleElement;
        this.labelElement = document.getElementById("sound-toggle-label");
        this.enabled = true;
        this.audioContext = null;
        this.pointerLock = false;
        this.syncUi();
        this.bootstrapOnFirstGesture();
    }

    syncUi() {
        this.toggleElement.dataset.enabled = String(this.enabled);
        this.toggleElement.setAttribute("aria-pressed", String(this.enabled));
        this.labelElement.textContent = this.enabled ? "Sound On" : "Sound Off";
    }

    ensureAudioContext() {
        if (!this.audioContext) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                return null;
            }
            this.audioContext = new AudioContextClass();
        }

        return this.audioContext;
    }

    bootstrapOnFirstGesture() {
        const warmAudio = async () => {
            if (!this.enabled) {
                return;
            }

            const context = this.ensureAudioContext();
            if (!context) {
                return;
            }

            if (context.state === "suspended") {
                try {
                    await context.resume();
                } catch (error) {
                    return;
                }
            }

            document.removeEventListener("pointerdown", warmAudio, true);
            document.removeEventListener("keydown", warmAudio, true);
        };

        document.addEventListener("pointerdown", warmAudio, true);
        document.addEventListener("keydown", warmAudio, true);
    }

    async toggle() {
        const context = this.ensureAudioContext();
        if (!context) {
            return;
        }

        if (context.state === "suspended") {
            await context.resume();
        }

        const nextEnabled = !this.enabled;
        if (!nextEnabled && context.state === "suspended") {
            await context.resume();
        }

        this.enabled = nextEnabled;
        this.syncUi();
        if (this.enabled) {
            this.play("enable");
        } else {
            this.playOnce("disable");
        }
    }

    bindHoverAndClick() {
        document.addEventListener(
            "pointerenter",
            (event) => {
                const target = event.target.closest("[data-sound]");
                if (!target || !this.enabled) {
                    return;
                }

                if (this.pointerLock) {
                    return;
                }

                this.pointerLock = true;
                this.play(target.dataset.sound === "click" ? "hover-strong" : "hover");
                window.setTimeout(() => {
                    this.pointerLock = false;
                }, 80);
            },
            true,
        );

        document.addEventListener("pointerdown", (event) => {
            const target = event.target.closest("[data-sound]");
            if (!target || !this.enabled) {
                return;
            }

            this.play(target.dataset.sound === "hover" ? "tap-soft" : "tap");
        });
    }

    play(kind) {
        if (!this.enabled || !this.audioContext) {
            return;
        }

        this.playOnce(kind);
    }

    playOnce(kind) {
        if (!this.audioContext) {
            return;
        }

        const now = this.audioContext.currentTime;
        const presets = {
            enable: [
                { time: now, frequency: 420, duration: 0.08, gain: 0.03, type: "triangle" },
                { time: now + 0.06, frequency: 650, duration: 0.12, gain: 0.04, type: "sine" },
            ],
            disable: [
                { time: now, frequency: 340, duration: 0.08, gain: 0.025, type: "sine" },
            ],
            hover: [
                { time: now, frequency: 510, duration: 0.03, gain: 0.012, type: "sine" },
            ],
            "hover-strong": [
                { time: now, frequency: 590, duration: 0.04, gain: 0.016, type: "triangle" },
            ],
            tap: [
                { time: now, frequency: 300, duration: 0.03, gain: 0.03, type: "square" },
                { time: now + 0.04, frequency: 510, duration: 0.05, gain: 0.02, type: "triangle" },
            ],
            "tap-soft": [
                { time: now, frequency: 280, duration: 0.025, gain: 0.018, type: "triangle" },
            ],
            player: [
                { time: now, frequency: 240, duration: 0.04, gain: 0.022, type: "sawtooth" },
                { time: now + 0.05, frequency: 480, duration: 0.07, gain: 0.026, type: "triangle" },
                { time: now + 0.12, frequency: 720, duration: 0.08, gain: 0.018, type: "sine" },
            ],
        };

        const notes = presets[kind] || [];
        notes.forEach((note) => this.playNote(note));
    }

    playNote({ time, frequency, duration, gain, type }) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, time);

        gainNode.gain.setValueAtTime(0.0001, time);
        gainNode.gain.exponentialRampToValueAtTime(gain, time + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start(time);
        oscillator.stop(time + duration + 0.02);
    }
}

const soundEngine = new SoundEngine(document.getElementById("sound-toggle"));

document.getElementById("sound-toggle").addEventListener("click", () => {
    soundEngine.toggle();
});
soundEngine.bindHoverAndClick();

async function loadData() {
    const responses = await Promise.all(Object.values(DATA_ENDPOINTS).map((endpoint) => fetch(endpoint, { cache: "no-store" })));

    responses.forEach((response) => {
        if (!response.ok) {
            throw new Error(`Failed to load site data: ${response.status}`);
        }
    });

    const [stats, videosPayload, shortsPayload] = await Promise.all(responses.map((response) => response.json()));

    state.stats = stats;
    state.videos = normalizeContent(videosPayload.videos || []);
    state.shorts = normalizeContent(shortsPayload.shorts || []);
    state.allContent = [...state.videos, ...state.shorts]
        .sort((left, right) => new Date(right.publishedAt) - new Date(left.publishedAt));
    state.selectedVideo = state.videos[0] || state.shorts[0] || null;
}

function normalizeContent(items) {
    return items.map((item) => {
        const kind = item.isShort ? "Short" : "Video";
        const topic = inferTopic(item);
        const durationSeconds = parseDurationToSeconds(item.duration);
        return {
            ...item,
            kind,
            topic,
            durationSeconds,
            durationLabel: formatDuration(durationSeconds),
            publishedLabel: formatAbsoluteDate(item.publishedAt),
            compactViews: formatCompactNumber(item.viewCount || 0),
            compactLikes: formatCompactNumber(item.likeCount || 0),
            summary: buildSummary(item.description),
        };
    });
}

function inferTopic(item) {
    const haystack = `${item.title || ""} ${item.description || ""}`.toLowerCase();
    const match = TOPIC_DEFINITIONS.find((topic) => topic.matchers.some((matcher) => haystack.includes(matcher)));
    return match || {
        id: "general",
        name: "General uploads",
        accent: "cyan",
        description: "Mixed uploads from across the channel's current content mix.",
        matchers: [],
    };
}

function parseDurationToSeconds(duration) {
    if (!duration) {
        return 0;
    }

    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) {
        return 0;
    }

    const hours = Number(match[1] || 0);
    const minutes = Number(match[2] || 0);
    const seconds = Number(match[3] || 0);
    return (hours * 3600) + (minutes * 60) + seconds;
}

function formatDuration(totalSeconds) {
    if (!totalSeconds) {
        return "0:00";
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatCompactNumber(value) {
    return new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}

function formatAbsoluteDate(value) {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(value));
}

function buildSummary(description) {
    if (!description) {
        return "Watch this upload on-site or jump directly to YouTube.";
    }

    const collapsed = description.replace(/\s+/g, " ").trim();
    return collapsed.length > 180 ? `${collapsed.slice(0, 177)}...` : collapsed;
}

function renderPage() {
    renderHero();
    renderHighlights();
    renderFilters();
    renderVideos();
    renderShorts();
    renderTopics();
    renderQueue();
    if (state.selectedVideo) {
        updatePlayer(state.selectedVideo, false);
    }
    bindStaticActions();
    initReveal();
}

function renderHero() {
    const stats = state.stats;
    const channelUrl = stats?.customUrl
        ? `https://www.youtube.com/${stats.customUrl.replace(/^\/+/, "")}`
        : CHANNEL_URL;
    const newestVideo = state.videos[0] || state.shorts[0];

    document.getElementById("hero-sync-label").textContent = `Updated ${formatAbsoluteDate(stats.lastUpdated)}`;
    document.getElementById("hero-description").textContent =
        buildHeroDescription(stats);
    document.getElementById("metric-subscribers").textContent = formatCompactNumber(stats.subscriberCount || 0);
    document.getElementById("metric-videos").textContent = formatCompactNumber(stats.videoCount || state.allContent.length);
    document.getElementById("metric-views").textContent = formatCompactNumber(stats.viewCount || 0);
    document.getElementById("metric-updated").textContent = formatAbsoluteDate(stats.lastUpdated);
    document.getElementById("hero-spotlight").textContent = newestVideo
        ? `${newestVideo.title} is the current lead pick, published ${newestVideo.publishedLabel}, with ${newestVideo.compactViews} views and a ${newestVideo.durationLabel} runtime.`
        : "Your latest channel data will surface here as soon as a video is available.";

    document.getElementById("about-description").textContent =
        `${buildChannelDescription(stats)} Every card below is driven from your JSON files, with in-site playback, official channel branding, and direct paths to YouTube when viewers want the native platform.`;
    document.getElementById("footer-handle").textContent = stats.handle || "@logneon";
    document.getElementById("footer-note").textContent = `Data source: local JSON snapshots, last synced ${formatAbsoluteDate(stats.lastUpdated)}.`;
    document.getElementById("hero-youtube-link").href = channelUrl;
    document.getElementById("header-subscribe").href = SUBSCRIBE_URL;
    document.getElementById("footer-subscribe").href = SUBSCRIBE_URL;

    const signalStrip = document.getElementById("signal-strip");
    const signalItems = buildSignalItems();
    signalStrip.innerHTML = signalItems
        .map((label) => `<span class="signal-pill">${label}</span>`)
        .join("");
}

function buildChannelDescription(stats) {
    const topics = topTopicNames(3);
    const topicText = topics.length > 0 ? topics.join(", ") : "tech explainers, experiments, and shorts";
    return `Official website of the ${stats.name || "LOGNEON"} YouTube channel for ${topicText}. Watch videos on the website, explore the catalog faster, and jump to YouTube when you want the original platform experience.`;
}

function buildHeroDescription(stats) {
    const topics = topTopicNames(3);
    const topicText = topics.length > 0 ? topics.join(", ") : "tech tutorials, shorts, and stories";
    return `Official LOGNEON YouTube channel website for faster watching, cleaner browsing, and instant jump-outs to YouTube. Current content mix: ${topicText}.`;
}

function buildSignalItems() {
    const longVideos = state.videos.filter((item) => item.durationSeconds >= 480).length;
    const shorts = state.shorts.length;
    const newest = state.allContent[0];

    return [
        `${longVideos} deep-dive uploads`,
        `${shorts} shorts ready`,
        newest ? `Newest drop: ${newest.publishedLabel}` : "Catalog ready",
        `${topTopicNames(1)[0] || "Tech"} is trending on the channel`,
    ];
}

function renderHighlights() {
    const newestVideo = state.videos[0];
    const topVideo = [...state.videos].sort((left, right) => (right.viewCount || 0) - (left.viewCount || 0))[0];
    const hottestShort = [...state.shorts].sort((left, right) => (right.viewCount || 0) - (left.viewCount || 0))[0];

    document.getElementById("highlight-fresh").textContent = newestVideo ? newestVideo.durationLabel : "--";
    document.getElementById("highlight-fresh-copy").textContent = newestVideo
        ? `${newestVideo.title} landed on ${newestVideo.publishedLabel}.`
        : "No long-form video available.";

    document.getElementById("highlight-top").textContent = topVideo ? `${topVideo.compactViews} views` : "--";
    document.getElementById("highlight-top-copy").textContent = topVideo
        ? `${topVideo.title} is currently the strongest performer in the video catalog.`
        : "No top-performing video available.";

    document.getElementById("highlight-shorts").textContent = hottestShort ? `${hottestShort.compactViews} views` : "--";
    document.getElementById("highlight-shorts-copy").textContent = hottestShort
        ? `${hottestShort.title} leads the current short-form set.`
        : "No short-form content available.";
}

function renderFilters() {
    const filterRow = document.getElementById("video-filters");
    filterRow.innerHTML = FILTERS.map((filter) => `
        <button
            class="filter-chip"
            type="button"
            role="tab"
            aria-selected="${String(filter.id === state.activeFilter)}"
            data-filter-id="${filter.id}"
            data-sound="click"
        >
            ${filter.label}
        </button>
    `).join("");

    filterRow.querySelectorAll("[data-filter-id]").forEach((button) => {
        button.addEventListener("click", () => {
            state.activeFilter = button.dataset.filterId;
            renderFilters();
            renderVideos();
        });
    });
}

function renderVideos() {
    const latestGrid = document.getElementById("latest-grid");
    const items = filterVideos(state.activeFilter);

    if (items.length === 0) {
        latestGrid.innerHTML = `<div class="empty-state">No videos found for this filter.</div>`;
        return;
    }

    latestGrid.innerHTML = items.slice(0, 12).map((video, index) => videoCardTemplate(video, index)).join("");
    bindCardActions(latestGrid);
}

function filterVideos(filterId) {
    const videos = [...state.videos];
    switch (filterId) {
        case "fresh":
            return videos.sort((left, right) => new Date(right.publishedAt) - new Date(left.publishedAt));
        case "popular":
            return videos.sort((left, right) => (right.viewCount || 0) - (left.viewCount || 0));
        case "guides":
            return videos.filter((video) => {
                const title = video.title.toLowerCase();
                return title.includes("guide") || title.includes("install") || title.includes("setup") || video.durationSeconds >= 480;
            });
        case "quick":
            return videos.filter((video) => video.durationSeconds > 0 && video.durationSeconds <= 240);
        case "all":
        default:
            return videos;
    }
}

function renderShorts() {
    const shortsGrid = document.getElementById("shorts-grid");
    const items = [...state.shorts]
        .sort((left, right) => (right.viewCount || 0) - (left.viewCount || 0))
        .slice(0, 8);

    if (items.length === 0) {
        shortsGrid.innerHTML = `<div class="empty-state">No shorts available right now.</div>`;
        return;
    }

    shortsGrid.innerHTML = items.map((video, index) => shortCardTemplate(video, index)).join("");
    bindCardActions(shortsGrid);
}

function renderTopics() {
    const topicGrid = document.getElementById("topic-grid");
    const grouped = new Map();

    state.allContent.forEach((item) => {
        const topicKey = item.topic.id;
        if (!grouped.has(topicKey)) {
            grouped.set(topicKey, {
                ...item.topic,
                items: [],
            });
        }

        grouped.get(topicKey).items.push(item);
    });

    const topics = [...grouped.values()]
        .sort((left, right) => right.items.length - left.items.length)
        .slice(0, 4);

    topicGrid.innerHTML = topics.map((topic, index) => topicCardTemplate(topic, index)).join("");
}

function renderQueue() {
    const queue = document.getElementById("player-queue");
    const items = state.videos.slice(0, 3);
    queue.innerHTML = items.map((video, index) => `
        <button
            class="queue-item"
            type="button"
            data-video-id="${video.id}"
            data-sound="click"
            style="--delay:${160 + (index * 70)}ms"
        >
            <strong>${escapeHtml(video.title)}</strong>
            <p>${video.durationLabel} • ${video.compactViews} views</p>
        </button>
    `).join("");

    queue.querySelectorAll("[data-video-id]").forEach((button) => {
        button.addEventListener("click", () => {
            const video = findVideoById(button.dataset.videoId);
            if (video) {
                updatePlayer(video, true);
                scrollPlayerIntoView();
            }
        });
    });
}

function bindStaticActions() {
    document.getElementById("play-latest").addEventListener("click", () => {
        const latest = state.videos[0] || state.shorts[0];
        if (latest) {
            updatePlayer(latest, true);
            scrollPlayerIntoView();
        }
    });

    document.getElementById("play-selected").addEventListener("click", () => {
        if (state.selectedVideo) {
            updatePlayer(state.selectedVideo, true);
        }
    });

    document.querySelectorAll("[data-random-trigger]").forEach((button) => {
        button.addEventListener("click", () => {
            if (state.allContent.length === 0) {
                return;
            }

            const randomIndex = Math.floor(Math.random() * state.allContent.length);
            updatePlayer(state.allContent[randomIndex], true);
            scrollPlayerIntoView();
        });
    });

    document.getElementById("focus-player").addEventListener("click", () => {
        if (!state.selectedVideo) {
            return;
        }

        const modal = document.getElementById("player-modal");
        const modalFrame = document.getElementById("modal-player");
        const modalLink = document.getElementById("modal-youtube-link");

        modalFrame.src = buildEmbedUrl(state.selectedVideo, true);
        modalLink.href = state.selectedVideo.youtubeUrl;
        modal.hidden = false;
        document.body.style.overflow = "hidden";
    });

    const closeModal = () => {
        const modal = document.getElementById("player-modal");
        const modalFrame = document.getElementById("modal-player");
        modal.hidden = true;
        modalFrame.src = "";
        document.body.style.overflow = "";
    };

    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("modal-close-button").addEventListener("click", closeModal);
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !document.getElementById("player-modal").hidden) {
            closeModal();
        }
    });
}

function bindCardActions(container) {
    container.querySelectorAll("[data-video-id]").forEach((element) => {
        element.addEventListener("click", (event) => {
            const actionButton = event.target.closest("[data-action]");
            if (actionButton) {
                if (actionButton.dataset.action === "youtube") {
                    return;
                }
                event.preventDefault();
            }

            const video = findVideoById(element.dataset.videoId);
            if (!video) {
                return;
            }

            const autoplay = Boolean(actionButton) || element.tagName === "BUTTON";
            updatePlayer(video, autoplay);
            scrollPlayerIntoView();
        });
    });
}

function updatePlayer(video, autoplay) {
    if (!video) {
        return;
    }

    state.selectedVideo = video;

    const frame = document.getElementById("hero-player");
    frame.src = buildEmbedUrl(video, autoplay);
    document.getElementById("player-kind").textContent = `${video.kind} • ${video.topic.name}`;
    document.getElementById("player-duration").textContent = video.durationLabel;
    document.getElementById("player-title").textContent = video.title;
    document.getElementById("player-summary").textContent = video.summary;
    document.getElementById("player-date").textContent = video.publishedLabel;
    document.getElementById("player-views").textContent = `${video.compactViews} views`;
    document.getElementById("player-likes").textContent = `${video.compactLikes} likes`;
    document.getElementById("player-youtube-link").href = video.youtubeUrl;

    soundEngine.play("player");
}

function buildEmbedUrl(video, autoplay) {
    const params = new URLSearchParams({
        rel: "0",
        modestbranding: "1",
        playsinline: "1",
    });

    if (autoplay) {
        params.set("autoplay", "1");
    }

    return `${video.embedUrl}?${params.toString()}`;
}

function scrollPlayerIntoView() {
    document.querySelector(".player-panel")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}

function findVideoById(id) {
    return state.allContent.find((item) => item.id === id) || null;
}

function topTopicNames(count) {
    const tally = new Map();
    state.allContent.forEach((item) => {
        tally.set(item.topic.name, (tally.get(item.topic.name) || 0) + 1);
    });
    return [...tally.entries()]
        .sort((left, right) => right[1] - left[1])
        .slice(0, count)
        .map(([name]) => name);
}

function videoCardTemplate(video, index) {
    return `
        <article
            class="video-card"
            data-video-id="${video.id}"
            data-sound="hover"
            style="--delay:${80 + (index * 60)}ms"
        >
            <div class="video-card-feature">
                <div class="card-topline">
                    <span class="card-chip">${escapeHtml(video.topic.name)}</span>
                    <span class="card-stat">${video.compactViews} views</span>
                </div>
                <img src="${escapeAttribute(video.thumbnail || "")}" alt="${escapeAttribute(video.title)} thumbnail" loading="lazy">
                <div class="card-overlay">
                    <span class="card-chip">${video.kind}</span>
                    <span class="card-chip">${video.durationLabel}</span>
                </div>
            </div>
            <div class="video-card-body">
                <h3 class="video-card-title">${escapeHtml(video.title)}</h3>
                <div class="video-card-meta">
                    <span>${video.publishedLabel}</span>
                    <span>${video.compactLikes} likes</span>
                </div>
                <p class="video-card-description">${escapeHtml(video.summary)}</p>
                <div class="video-card-actions">
                    <button class="button-inline button-inline-primary" type="button" data-action="play" data-sound="click">
                        Play on site
                    </button>
                    <a
                        class="button-inline"
                        href="${escapeAttribute(video.youtubeUrl)}"
                        target="_blank"
                        rel="noreferrer"
                        data-action="youtube"
                        data-sound="click"
                    >
                        Open YouTube
                    </a>
                </div>
            </div>
        </article>
    `;
}

function shortCardTemplate(video, index) {
    return `
        <article
            class="short-card"
            data-video-id="${video.id}"
            data-sound="hover"
            style="--delay:${80 + (index * 60)}ms"
        >
            <div class="short-card-thumb">
                <div class="short-card-head">
                    <span class="card-chip">Short</span>
                    <span class="card-stat">${video.compactViews}</span>
                </div>
                <img src="${escapeAttribute(video.thumbnail || "")}" alt="${escapeAttribute(video.title)} short thumbnail" loading="lazy">
            </div>
            <div class="short-card-body">
                <h3 class="short-card-title">${escapeHtml(video.title)}</h3>
                <div class="short-card-meta">
                    <span>${video.durationLabel}</span>
                    <span>${video.publishedLabel}</span>
                </div>
                <p class="short-card-description">${escapeHtml(video.summary)}</p>
                <div class="short-card-actions">
                    <button class="button-inline button-inline-primary" type="button" data-action="play" data-sound="click">
                        Play here
                    </button>
                    <a
                        class="button-inline"
                        href="${escapeAttribute(video.youtubeUrl)}"
                        target="_blank"
                        rel="noreferrer"
                        data-action="youtube"
                        data-sound="click"
                    >
                        YouTube
                    </a>
                </div>
            </div>
        </article>
    `;
}

function topicCardTemplate(topic, index) {
    const sampleItems = topic.items
        .slice(0, 3)
        .map((item) => `<li>${escapeHtml(item.title)}</li>`)
        .join("");

    return `
        <article class="topic-card" style="--delay:${80 + (index * 70)}ms">
            <div class="topic-pill">${topic.items.length} uploads</div>
            <h3>${escapeHtml(topic.name)}</h3>
            <p>${escapeHtml(topic.description)}</p>
            <ul>${sampleItems}</ul>
        </article>
    `;
}

function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.18 });

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
    return escapeHtml(value);
}

function showError(error) {
    const latestGrid = document.getElementById("latest-grid");
    latestGrid.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
    document.getElementById("hero-description").textContent =
        "The site could not load the channel JSON files. Check the data paths and serve the site over localhost.";
}

loadData()
    .then(renderPage)
    .catch(showError);
