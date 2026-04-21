export function initNavigation() {
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const pages = document.querySelectorAll('[data-page]');

  function activatePage(index) {
    navLinks.forEach((navLink, i) => {
      const isActive = i === index;
      pages[i].classList.toggle('active', isActive);
      navLink.classList.toggle('active', isActive);
    });
    window.scrollTo(0, 0);
  }

  // Replace current state with the initial active tab index
  const initialIndex = Array.from(navLinks).findIndex(link =>
    link.classList.contains('active')
  );
  history.replaceState({ tabIndex: initialIndex }, '');

  navLinks.forEach((link, index) => {
    link.addEventListener('click', () => {
      activatePage(index);
      history.pushState({ tabIndex: index }, '');
    });
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', (event) => {
    if (event.state && typeof event.state.tabIndex === 'number') {
      activatePage(event.state.tabIndex);
    }
    // Restore project detail or overview
    if (window.__projectNav) {
      if (event.state?.project) {
        window.__projectNav.showProject(event.state.project);
      } else {
        window.__projectNav.showOverview();
      }
    }
  });
}
