// LOGNEON SOUND CHAOS SYSTEM - HEADER ICON HOVER SOUNDS
// BRUTAL AUDIO FEEDBACK FOR MAXIMUM IMMERSION

class LogneonSoundSystem {
    constructor() {
        this.sounds = {};
        this.isEnabled = true;
        this.volume = 0.3;
        
        console.log('🔊 LOGNEON Sound System initialized');
        this.initializeSounds();
        this.setupSoundEvents();
    }
    
    initializeSounds() {
        // Create audio context for better browser support
        this.audioContext = null;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('⚠️ Web Audio API not supported, using HTML5 audio');
        }
        
        // Generate synthetic sounds since we can't load external audio files
        this.createSyntheticSounds();
        
        console.log('✅ Sound system ready');
    }
    
    createSyntheticSounds() {
        // Create different hover sounds for different nav elements
        this.sounds = {
            navHover: this.createTone(800, 0.1, 'square'),
            navClick: this.createTone(1200, 0.15, 'sawtooth'),
            logoHover: this.createTone(600, 0.2, 'sine'),
            buttonHover: this.createTone(900, 0.12, 'triangle'),
            cardHover: this.createTone(700, 0.08, 'square'),
            modalOpen: this.createTone(1000, 0.3, 'sine'),
            modalClose: this.createTone(400, 0.2, 'triangle'),
            error: this.createTone(300, 0.4, 'sawtooth'),
            success: this.createTone(1500, 0.25, 'sine')
        };
    }
    
    createTone(frequency, duration, waveType = 'sine') {
        return () => {
            if (!this.isEnabled || !this.audioContext) return;
            
            try {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
                oscillator.type = waveType;
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + duration);
            } catch (error) {
                console.warn('🔇 Sound playback failed:', error);
            }
        };
    }
    
    setupSoundEvents() {
        // Header navigation icons
        this.setupNavSounds();
        
        // Logo hover sounds
        this.setupLogoSounds();
        
        // Button hover sounds
        this.setupButtonSounds();
        
        // Card hover sounds
        this.setupCardSounds();
        
        // Modal sounds
        this.setupModalSounds();
        
        // Global click sounds
        this.setupGlobalSounds();
        
        console.log('✅ All sound events configured');
    }
    
    setupNavSounds() {
        // Navigation brutal objects (header icons)
        const navObjects = document.querySelectorAll('.nav-brutal-object');
        
        navObjects.forEach((navObj, index) => {
            // Different pitch for each nav item
            const frequency = 800 + (index * 100);
            const customHoverSound = this.createTone(frequency, 0.1, 'square');
            const customClickSound = this.createTone(frequency + 200, 0.15, 'triangle');
            
            navObj.addEventListener('mouseenter', () => {
                customHoverSound();
                this.addVisualFeedback(navObj, 'hover');
            });
            
            navObj.addEventListener('mouseleave', () => {
                this.removeVisualFeedback(navObj, 'hover');
            });
            
            navObj.addEventListener('click', () => {
                customClickSound();
                this.addVisualFeedback(navObj, 'click');
            });
        });
        
        console.log(`🎵 Configured sounds for ${navObjects.length} nav objects`);
    }
    
    setupLogoSounds() {
        const logo = document.querySelector('.logo-text');
        const logoContainer = document.querySelector('.logo-chaos-container');
        
        if (logo) {
            logo.addEventListener('mouseenter', () => {
                this.sounds.logoHover();
                this.addGlitchEffect(logo);
            });
            
            logo.addEventListener('mouseleave', () => {
                this.removeGlitchEffect(logo);
            });
        }
        
        if (logoContainer) {
            logoContainer.addEventListener('click', () => {
                this.sounds.navClick();
            });
        }
        
        console.log('🎵 Logo sounds configured');
    }
    
    setupButtonSounds() {
        // Subscribe button
        const subscribeBtn = document.querySelector('.subscribe-brutal-btn');
        if (subscribeBtn) {
            subscribeBtn.addEventListener('mouseenter', () => {
                this.createTone(1200, 0.15, 'sine')();
            });
            
            subscribeBtn.addEventListener('click', () => {
                this.createTone(1500, 0.3, 'triangle')();
            });
        }
        
        // All other buttons
        const buttons = document.querySelectorAll('button, .btn, .filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.sounds.buttonHover();
            });
            
            btn.addEventListener('click', () => {
                this.sounds.navClick();
            });
        });
        
        console.log('🎵 Button sounds configured');
    }
    
    setupCardSounds() {
        // Video cards
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.video-brutal-card') || e.target.closest('.short-brutal-card')) {
                this.sounds.cardHover();
            }
        });
        
        // Category objects
        const categoryObjects = document.querySelectorAll('.category-brutal-object');
        categoryObjects.forEach(obj => {
            obj.addEventListener('mouseenter', () => {
                this.createTone(900, 0.1, 'triangle')();
            });
        });
        
        console.log('🎵 Card sounds configured');
    }
    
    setupModalSounds() {
        // Modal open/close
        const modal = document.getElementById('video-modal');
        if (modal) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (modal.classList.contains('hidden')) {
                            this.sounds.modalClose();
                        } else {
                            this.sounds.modalOpen();
                        }
                    }
                });
            });
            
            observer.observe(modal, { attributes: true });
        }
        
        // Close button
        const closeBtn = document.getElementById('modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('mouseenter', () => {
                this.createTone(600, 0.1, 'sawtooth')();
            });
            
            closeBtn.addEventListener('click', () => {
                this.sounds.modalClose();
            });
        }
        
        console.log('🎵 Modal sounds configured');
    }
    
    setupGlobalSounds() {
        // Error notifications
        window.addEventListener('error', () => {
            this.sounds.error();
        });
        
        // Success notifications  
        document.addEventListener('logneon-success', () => {
            this.sounds.success();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.createTone(500, 0.1, 'triangle')();
            }
        });
        
        console.log('🎵 Global sounds configured');
    }
    
    addVisualFeedback(element, type) {
        if (type === 'hover') {
            element.style.filter = 'brightness(120%) saturate(150%)';
            element.style.transform = element.style.transform + ' scale(1.05)';
        } else if (type === 'click') {
            element.style.filter = 'brightness(80%) saturate(200%)';
            setTimeout(() => {
                element.style.filter = '';
            }, 150);
        }
    }
    
    removeVisualFeedback(element, type) {
        if (type === 'hover') {
            element.style.filter = '';
            element.style.transform = element.style.transform.replace(' scale(1.05)', '');
        }
    }
    
    addGlitchEffect(element) {
        element.style.animation = 'logoGlitchDestruction 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
    
    removeGlitchEffect(element) {
        element.style.animation = '';
    }
    
    // PUBLIC METHODS
    enableSounds() {
        this.isEnabled = true;
        console.log('🔊 Sounds enabled');
    }
    
    disableSounds() {
        this.isEnabled = false;
        console.log('🔇 Sounds disabled');
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        console.log(`🔊 Volume set to ${this.volume * 100}%`);
    }
    
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }
    
    // Resume audio context (required for some browsers)
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('🔊 Audio context resumed');
            });
        }
    }
}

// INITIALIZE SOUND SYSTEM
let logneonSounds;

document.addEventListener('DOMContentLoaded', function() {
    // Wait for user interaction before initializing sounds (browser requirement)
    let soundsInitialized = false;
    
    function initializeSounds() {
        if (!soundsInitialized) {
            logneonSounds = new LogneonSoundSystem();
            soundsInitialized = true;
            console.log('🔊 LOGNEON Sound System activated');
        }
    }
    
    // Initialize on first user interaction
    document.addEventListener('click', initializeSounds, { once: true });
    document.addEventListener('keydown', initializeSounds, { once: true });
    document.addEventListener('mouseover', initializeSounds, { once: true });
});

// GLOBAL SOUND CONTROLS
window.logneonSoundToggle = function() {
    if (logneonSounds) {
        if (logneonSounds.isEnabled) {
            logneonSounds.disableSounds();
        } else {
            logneonSounds.enableSounds();
        }
    }
};

window.logneonSetVolume = function(volume) {
    if (logneonSounds) {
        logneonSounds.setVolume(volume);
    }
};

// EMERGENCY SOUND DISABLE (ESC key twice)
let escPressCount = 0;
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        escPressCount++;
        if (escPressCount >= 2) {
            if (logneonSounds) {
                logneonSounds.disableSounds();
                console.log('🔇 Emergency sound disable activated');
            }
            escPressCount = 0;
        }
        setTimeout(() => { escPressCount = 0; }, 1000);
    }
});

console.log('🔊 LOGNEON Sound System loaded and ready!');