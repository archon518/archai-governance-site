window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    
    const scrollPercent = window.scrollY / maxScroll;
    
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
});
