/**
 * Parallax Effect for Hero Section
 * Creates a subtle depth effect by moving the hero image at 0.5x scroll speed
 * Disabled on mobile/tablet for performance
 * Respects prefers-reduced-motion
 */

export function initParallax(): void {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Check if we're on desktop (>1024px)
  const isDesktop = window.matchMedia('(min-width: 1025px)').matches;

  // Exit if reduced motion or not desktop
  if (prefersReducedMotion || !isDesktop) {
    return;
  }

  const heroImage = document.querySelector('.hero-image') as HTMLElement;
  if (!heroImage) return;

  // Add will-change hint for GPU acceleration
  heroImage.style.willChange = 'transform';

  let ticking = false;
  let lastScrollY = 0;

  function updateParallax(): void {
    const scrollY = window.scrollY;
    const heroHeight = heroImage.offsetHeight;

    // Only apply parallax while hero is in view
    if (scrollY <= heroHeight) {
      // Move at 0.5x scroll speed (parallax factor)
      const translateY = scrollY * 0.5;
      heroImage.style.transform = `translateY(${translateY}px)`;
    }

    ticking = false;
  }

  function onScroll(): void {
    lastScrollY = window.scrollY;

    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallax();
      });
      ticking = true;
    }
  }

  // Listen to scroll events
  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial update
  updateParallax();

  // Handle resize - disable parallax if window becomes mobile
  let resizeTimeout: ReturnType<typeof setTimeout>;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const stillDesktop = window.matchMedia('(min-width: 1025px)').matches;
      if (!stillDesktop) {
        // Reset transform and remove listener
        heroImage.style.transform = '';
        heroImage.style.willChange = '';
        window.removeEventListener('scroll', onScroll);
      }
    }, 150);
  });
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
  } else {
    initParallax();
  }

  // Re-initialize on Astro view transitions
  document.addEventListener('astro:page-load', initParallax);
}
