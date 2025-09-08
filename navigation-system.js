// LOGNEON NAVIGATION SYSTEM - HEADER SECTION SWITCHING
// BRUTAL SECTION NAVIGATION WITH SOUND EFFECTS

class LogneonNavigation {
    constructor() {
        this.currentSection = 'latest';
        this.sections = ['latest', 'viral', 'shorts', 'categories', 'subscribe'];
        this.isTransitioning = false;
        
        console.log('🚀 LOGNEON Navigation System initialized');
        this.initializeNavigation();
    }
    
    initializeNavigation() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupNavigation());
        } else {
            this.setupNavigation();
        }
    }
    
    setupNavigation() {
        // Get all navigation brutal objects
        const navObjects = document.querySelectorAll('.nav-brutal-object');
        
        navObjects.forEach((navObj) => {
            const section = navObj.getAttribute('data-section');
            
            if (section) {
                // Add click event listener
                navObj.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateToSection(section);
                });
                
                // Add hover effects
                navObj.addEventListener('mouseenter', () => {
                    this.addHoverEffect(navObj);
                });
                
                navObj.addEventListener('mouseleave', () => {
                    this.removeHoverEffect(navObj);
                });
                
                console.log(`✅ Navigation setup for: ${section}`);
            }
        });
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
        
        // Set initial state
        this.setActiveNavigation(this.currentSection);
        
        console.log('🎯 Navigation system ready');
    }
    
    navigateToSection(targetSection) {
        if (this.isTransitioning || targetSection === this.currentSection) {
            return;
        }
        
        console.log(`🚀 Navigating from ${this.currentSection} to ${targetSection}`);
        
        this.isTransitioning = true;
        
        // Play navigation sound
        if (window.logneonSounds && window.logneonSounds.isEnabled) {
            window.logneonSounds.playSound('navClick');
        }
        
        // Update current section
        const previousSection = this.currentSection;
        this.currentSection = targetSection;
        
        // Update navigation states
        this.setActiveNavigation(targetSection);
        
        // Animate section transition
        this.animateSectionTransition(previousSection, targetSection);
        
        // Update page title
        this.updatePageTitle(targetSection);
    }
    
    setActiveNavigation(activeSection) {
        // Remove active class from all nav objects
        const navObjects = document.querySelectorAll('.nav-brutal-object');
        navObjects.forEach(navObj => {
            navObj.classList.remove('active');
            const core = navObj.querySelector('.object-neon-core');
            if (core) {
                core.style.borderColor = '';
                core.style.boxShadow = '';
            }
        });
        
        // Add active class to target nav object
        const activeNavObj = document.querySelector(`[data-section="${activeSection}"]`);
        if (activeNavObj) {
            activeNavObj.classList.add('active');
            const core = activeNavObj.querySelector('.object-neon-core');
            if (core) {
                core.style.borderColor = '#FF0080';
                core.style.boxShadow = '0 0 30px rgba(255, 0, 128, 0.8)';
            }
        }
        
        console.log(`🎯 Active navigation set to: ${activeSection}`);
    }
    
    animateSectionTransition(fromSection, toSection) {
        const fromSectionEl = document.querySelector(`[data-section="${fromSection}"].brutal-section`);
        const toSectionEl = document.querySelector(`[data-section="${toSection}"].brutal-section`);
        
        if (!fromSectionEl || !toSectionEl) {
            console.error('❌ Section elements not found');
            this.isTransitioning = false;
            return;
        }
        
        // Start transition
        console.log(`🎬 Animating: ${fromSection} → ${toSection}`);
        
        // Hide current section
        fromSectionEl.classList.remove('active');
        fromSectionEl.classList.add('prev');
        
        // Add transition effects
        fromSectionEl.style.transform = 'translateX(-100%) rotateY(-45deg) scale(0.8)';
        fromSectionEl.style.opacity = '0';
        
        // Show target section with delay
        setTimeout(() => {
            toSectionEl.classList.remove('prev');
            toSectionEl.classList.add('active');
            toSectionEl.style.transform = 'translateX(0) rotateY(0deg) scale(1)';
            toSectionEl.style.opacity = '1';
            
            // Clean up previous section after animation
            setTimeout(() => {
                fromSectionEl.classList.remove('prev');
                fromSectionEl.style.transform = '';
                fromSectionEl.style.opacity = '';
                this.isTransitioning = false;
                
                console.log(`✅ Navigation complete: ${toSection}`);
            }, 600);
        }, 200);
    }
    
    addHoverEffect(navObj) {
        const core = navObj.querySelector('.object-neon-core');
        const storm = navObj.querySelector('.object-particle-storm');
        
        if (core) {
            core.style.transform = 'scale(1.1) rotateZ(5deg)';
            core.style.filter = 'brightness(120%) saturate(150%)';
        }
        
        if (storm) {
            storm.style.opacity = '0.8';
            storm.style.animationDuration = '0.3s';
        }
    }
    
    removeHoverEffect(navObj) {
        const core = navObj.querySelector('.object-neon-core');
        const storm = navObj.querySelector('.object-particle-storm');
        
        if (core && !navObj.classList.contains('active')) {
            core.style.transform = '';
            core.style.filter = '';
        }
        
        if (storm) {
            storm.style.opacity = '';
            storm.style.animationDuration = '';
        }
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.isTransitioning) return;
            
            const currentIndex = this.sections.indexOf(this.currentSection);
            
            switch (e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.sections.length - 1;
                    this.navigateToSection(this.sections[prevIndex]);
                    break;
                    
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = currentIndex < this.sections.length - 1 ? currentIndex + 1 : 0;
                    this.navigateToSection(this.sections[nextIndex]);
                    break;
                    
                case '1':
                    e.preventDefault();
                    this.navigateToSection('latest');
                    break;
                case '2':
                    e.preventDefault();
                    this.navigateToSection('viral');
                    break;
                case '3':
                    e.preventDefault();
                    this.navigateToSection('shorts');
                    break;
                case '4':
                    e.preventDefault();
                    this.navigateToSection('categories');
                    break;
                case '5':
                    e.preventDefault();
                    this.navigateToSection('subscribe');
                    break;
            }
        });
        
        console.log('⌨️ Keyboard navigation enabled');
    }
    
    updatePageTitle(section) {
        const titles = {
            latest: 'LOGNEON - Latest Dynamic Chaos',
            viral: 'LOGNEON - Viral Tech Hits',
            shorts: 'LOGNEON - Short Tech Chaos',
            categories: 'LOGNEON - Tech Categories',
            subscribe: 'LOGNEON - Join The Rebellion'
        };
        
        document.title = titles[section] || 'LOGNEON - Dynamic Tech Chaos';
    }
    
    // PUBLIC METHODS
    getCurrentSection() {
        return this.currentSection;
    }
    
    goToSection(section) {
        if (this.sections.includes(section)) {
            this.navigateToSection(section);
        }
    }
    
    nextSection() {
        const currentIndex = this.sections.indexOf(this.currentSection);
        const nextIndex = currentIndex < this.sections.length - 1 ? currentIndex + 1 : 0;
        this.navigateToSection(this.sections[nextIndex]);
    }
    
    previousSection() {
        const currentIndex = this.sections.indexOf(this.currentSection);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.sections.length - 1;
        this.navigateToSection(this.sections[prevIndex]);
    }
}

// INITIALIZE NAVIGATION SYSTEM
let logneonNavigation;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing LOGNEON Navigation...');
    logneonNavigation = new LogneonNavigation();
});

// GLOBAL NAVIGATION FUNCTIONS
window.logneonGoTo = function(section) {
    if (logneonNavigation) {
        logneonNavigation.goToSection(section);
    }
};

window.logneonNext = function() {
    if (logneonNavigation) {
        logneonNavigation.nextSection();
    }
};

window.logneonPrevious = function() {
    if (logneonNavigation) {
        logneonNavigation.previousSection();
    }
};

console.log('🎯 LOGNEON Navigation System loaded!');