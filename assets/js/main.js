import aboutHTML from '../../sections/about.html?raw';
import resumeHTML from '../../sections/resume.html?raw';
import publicationHTML from '../../sections/publication.html?raw';

import { initSidebar } from './modules/sidebar.js';
import { initModal } from './modules/modal.js';
import { initNavigation } from './modules/navigation.js';
import { initProjects } from './modules/projects.js';
document.addEventListener('DOMContentLoaded', () => {
  // Inject section HTML fragments
  document.querySelector('[data-section="about"]').innerHTML = aboutHTML;
  document.querySelector('[data-section="resume"]').innerHTML = resumeHTML;
  document.querySelector('[data-section="publication"]').innerHTML = publicationHTML;

  // initProjects injects the projects section content
  initProjects();

  // Init features after all sections are in the DOM
  initSidebar();
  initModal();
  initNavigation();
});
