/**
 * Mobile Menu Controller
 * Handles mobile navigation menu with WCAG 2.1 AA compliance
 * - Open/close functionality
 * - Keyboard navigation (Escape to close)
 * - Focus trapping within menu
 * - ARIA attribute management
 */

export function initMobileMenu(): void {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');

  if (!mobileMenuButton || !mobileMenu) return;

  function openMobileMenu(): void {
    mobileMenu?.classList.remove('translate-x-full');
    mobileMenuBackdrop?.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';

    // Update ARIA attributes
    mobileMenuButton?.setAttribute('aria-expanded', 'true');
    mobileMenuButton?.setAttribute('aria-label', 'Close navigation menu');

    // Focus the close button for keyboard users
    setTimeout(() => mobileMenuClose?.focus(), 100);
  }

  function closeMobileMenu(): void {
    mobileMenu?.classList.add('translate-x-full');
    mobileMenuBackdrop?.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';

    // Update ARIA attributes
    mobileMenuButton?.setAttribute('aria-expanded', 'false');
    mobileMenuButton?.setAttribute('aria-label', 'Open navigation menu');

    // Return focus to the menu button
    mobileMenuButton?.focus();
  }

  // Click handlers
  mobileMenuButton.addEventListener('click', openMobileMenu);
  mobileMenuClose?.addEventListener('click', closeMobileMenu);
  mobileMenuBackdrop?.addEventListener('click', closeMobileMenu);

  // Keyboard support - Close menu on Escape key
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && !mobileMenu?.classList.contains('translate-x-full')) {
      closeMobileMenu();
    }
  });

  // Close menu on link click
  const mobileMenuLinks = mobileMenu.querySelectorAll('a');
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Trap focus within mobile menu when open
  mobileMenu.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = mobileMenu.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  });
}

/**
 * Header Scroll Effect
 * Adds subtle shadow to header on scroll for depth
 */
export function initHeaderScroll(): void {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
    } else {
      header.style.boxShadow = '0 1px 8px rgba(0,0,0,0.08)';
    }
  });
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeaderScroll();
  });
}
