/**
 * ARCHAI SYSTEMS TEMPORAL & TELEMETRY ENGINE
 * Handles background clock rotation, content fade animations, and live logs.
 */

// --- SECTION 1: SCROLL POSITION CONTROLLERS (ROTATION + FADING) ---
window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    
    const scrollPercent = window.scrollY / maxScroll;
    
    // 1. Map fluid rotations to decoupled orbital tracks
    const track1 = document.querySelector('.track-1');
    const track2 = document.querySelector('.track-2');
    const track3 = document.querySelector('.track-3');
    const coreAnchor = document.querySelector('.core-anchor');
    
    if (track1 && track2 && track3) {
        track1.style.transform = `translate(-50%, -50%) rotate(${scrollPercent * 360}deg)`;
        track2.style.transform = `translate(-50%, -50%) rotate(${scrollPercent * -180}deg)`;
        track3.style.transform = `translate(-50%, -50%) rotate(${scrollPercent * 90}deg)`;
    }
    
    if (coreAnchor) {
        const scaleFactor = 1 + (scrollPercent * 0.2);
        coreAnchor.style.transform = `translate(-50%, -50%) scale(${scaleFactor})`;
    }

    // 2. Smooth Element Fading Layer
    // Gradually drops opacity of content elements as you scroll away from them
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const elementCenter = rect.top + (rect.height / 2);
        const viewportCenter = window.innerHeight / 2;
        
        // Calculate distance from center of screen (0 means perfectly centered)
        const distanceFromCenter = Math.abs(viewportCenter - elementCenter);
        const fadeThreshold = window.innerHeight * 0.6;
        
        // Compute fluid opacity based on screen position
        let opacity = 1 - (distanceFromCenter / fadeThreshold);
        if (opacity < 0) opacity = 0;
        if (opacity > 1) opacity = 1;
        
        // Apply opacity change smoothly to child containers
        const child = section.querySelector('.terminal-box, .content-panel');
        if (child) {
            child.style.opacity = opacity;
            child.style.transform = `translateY(${(1 - opacity) * 15}px)`;
        }
    });
});

// --- SECTION 2: LIVE SIMULATED TERMINAL DATA FEED ---
document.addEventListener('DOMContentLoaded', () => {
    const terminalContent = document.querySelector('.terminal-content');
    if (!terminalContent) return;

    // Log tracking vocabulary data matrix
    const events = [
        "Realigning manifold projection dimension grids...",
        "Executing identity-preserving manifold maps...",
        "Deconstructing payload coefficients...",
        "Running GCD factorizations across matrix tree...",
        "Validating structural zero-drift parameters...",
        "Recalibrating Q-basis vector tracking indices...",
        "Synchronizing clock synchronization array lattices..."
    ];

    const outcomes = [
        "128_Dimensional",
        "0.0000000000 drift",
        "BigInt_Register",
        "Euclidean_Done",
        "Hysteresis_Stable",
        "SIMD_Profile_OK",
        "Temporal_Locked"
    ];

    // Helper function to format system clock timestamps
    function getSystemTimestamp() {
        const now = new Date();
        let hours = now.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight/noon edge case
        
        const pad = (num, size = 2) => String(num).padStart(size, '0');
        
        return `[${hours}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${ampm}.${pad(now.getMilliseconds(), 3)}]`;
    }

    // Interval loops to feed mock diagnostic data streams into the card container
    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * events.length);
        
        // Generate clean semantic HTML blocks dynamically
        const logGroup = document.createElement('div');
        logGroup.className = 'log-entry-block';
        logGroup.innerHTML = `
            <p class="timestamp">${getSystemTimestamp()}</p>
            <p class="log-text">${events[randomIndex]}</p>
            <p class="log-highlight">${outcomes[randomIndex]}</p>
        `;
        
        // Append log to container substrate
        terminalContent.appendChild(logGroup);
        
        // Automatically prune excess structural logs to maintain system browser memory
        const entries = terminalContent.querySelectorAll('.log-entry-block, p');
        if (entries.length > 25) {
            // Clears early items out smoothly to allow system to run infinitely
            for(let i = 0; i < 3; i++) {
                if(terminalContent.firstChild) terminalContent.removeChild(terminalContent.firstChild);
            }
        }
    }, 2800); // appends new telemetry update every 2.8 seconds
});
