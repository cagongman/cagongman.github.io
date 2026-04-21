import overviewHTML from '../../../projects/_overview.html?raw';
import arFitnessDogHTML from '../../../projects/arFitnessDog.html?raw';
import orehHTML from '../../../projects/oreh.html?raw';
import accidentSimulationHTML from '../../../projects/accidentSimulation.html?raw';
import dentureARHTML from '../../../projects/dentureAR.html?raw';
import KUTCHTML from '../../../projects/KUTC.html?raw';
import ecobinHTML from '../../../projects/ecobin.html?raw';

const projectDetails = [
  arFitnessDogHTML,
  orehHTML,
  accidentSimulationHTML,
  dentureARHTML,
  KUTCHTML,
  ecobinHTML,
];

export function initProjects() {
  const mount = document.querySelector('[data-section="projects"]');
  if (!mount) return;

  // Inject full project section (article + header + filters + overview grid)
  mount.innerHTML = overviewHTML;

  // Inject each project-content div before the overview grid
  const overviewDiv = mount.querySelector('.project-overview');
  if (overviewDiv) {
    projectDetails.forEach(html => {
      overviewDiv.insertAdjacentHTML('beforebegin', html);
    });
  }

  // Query all dynamic elements after injection
  const projectItems = mount.querySelectorAll('.project-item');
  const projectContents = mount.querySelectorAll('.project-content');
  const backButtons = mount.querySelectorAll('.back-button');
  const filterBtns = mount.querySelectorAll('[data-filter-btn]');
  const selectItems = mount.querySelectorAll('[data-select-item]');
  const navLinks = document.querySelectorAll('[data-nav-link]');

  const showOverview = () => {
    if (overviewDiv) overviewDiv.style.display = 'block';
    projectContents.forEach(c => { c.style.display = 'none'; });
  };

  // Show a specific project detail by class name
  const showProject = (contentClass) => {
    const target = mount.querySelector(`.${contentClass}`);
    if (!target) return;
    if (overviewDiv) overviewDiv.style.display = 'none';
    projectContents.forEach(c => { c.style.display = 'none'; });
    target.style.display = 'block';
    window.scrollTo({ top: 0 });
  };

  // Project card click → show detail
  projectItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const contentClass = item.getAttribute('project-content');
      showProject(contentClass);
      history.pushState({ tabIndex: history.state?.tabIndex, project: contentClass }, '');
    });
  });

  // Back button → return to overview
  backButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      showOverview();
      window.scrollTo({ top: 0 });
      history.pushState({ tabIndex: history.state?.tabIndex, project: null }, '');
    });
  });

  // Expose helpers for popstate handling
  window.__projectNav = { showProject, showOverview };

  // Filter or nav click → show overview (so filtering is always on the overview)
  filterBtns.forEach(btn => btn.addEventListener('click', showOverview));
  selectItems.forEach(item => item.addEventListener('click', showOverview));
  navLinks.forEach(link => link.addEventListener('click', showOverview));
}
