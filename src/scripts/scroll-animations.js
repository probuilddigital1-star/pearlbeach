/**
 * Scroll-Triggered Animations
 * Uses Intersection Observer for performant scroll-based animations
 * Respects prefers-reduced-motion for accessibility
 */

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Observer configuration
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15 // Trigger when 15% visible
};

// Initialize observer for fade-in animations
const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Add stagger delay for grid items
      const staggerDelay = entry.target.dataset.staggerIndex
        ? parseInt(entry.target.dataset.staggerIndex) * 100
        : 0;

      if (!prefersReducedMotion) {
        entry.target.style.transitionDelay = `${staggerDelay}ms`;
      }

      entry.target.classList.add('is-visible');

      // Unobserve after animation to improve performance
      fadeInObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Initialize animations
function initScrollAnimations() {
  // If user prefers reduced motion, show everything immediately
  if (prefersReducedMotion) {
    document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  // Observe all elements with fade-in class
  document.querySelectorAll('.fade-in-on-scroll').forEach((el, index) => {
    fadeInObserver.observe(el);
  });

  // Add stagger indices to grid children
  document.querySelectorAll('.stagger-children').forEach(parent => {
    const children = parent.querySelectorAll('.fade-in-on-scroll');
    children.forEach((child, index) => {
      child.dataset.staggerIndex = index;
    });
  });
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}

// Re-initialize on Astro view transitions
document.addEventListener('astro:page-load', initScrollAnimations);
