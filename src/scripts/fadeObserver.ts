/**
 * Scroll Animation Observer
 * Handles scroll-triggered fade-in animations using Intersection Observer
 * Supports stagger effects and respects prefers-reduced-motion
 */

// Check for reduced motion preference
const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

export function initFadeObserver(): void {
  // If user prefers reduced motion, show everything immediately
  if (prefersReducedMotion) {
    document.querySelectorAll('.fade-in, .fade-in-on-scroll').forEach(el => {
      el.classList.add('active', 'is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;

          // Add stagger delay for grid items
          const staggerIndex = el.dataset.staggerIndex;
          if (staggerIndex) {
            el.style.transitionDelay = `${parseInt(staggerIndex) * 100}ms`;
          }

          // Add both classes for compatibility with existing and new animations
          el.classList.add('active', 'is-visible');

          // Unobserve after animation to improve performance
          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is in view
    }
  );

  // Observe all fade-in elements (both old and new class names)
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-on-scroll');
  fadeElements.forEach(el => observer.observe(el));

  // Add stagger indices to grid children
  document.querySelectorAll('.stagger-children').forEach(parent => {
    const children = parent.querySelectorAll('.fade-in, .fade-in-on-scroll');
    children.forEach((child, index) => {
      (child as HTMLElement).dataset.staggerIndex = String(index);
    });
  });
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFadeObserver);
  } else {
    initFadeObserver();
  }

  // Re-initialize on Astro view transitions
  document.addEventListener('astro:page-load', initFadeObserver);
}
