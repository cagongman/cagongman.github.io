export function initFilter() {
  const select = document.querySelector('[data-select]');
  const selectItems = document.querySelectorAll('[data-select-item]');
  const selectValue = document.querySelector('[data-selecct-value]');
  const filterBtns = document.querySelectorAll('[data-filter-btn]');
  const filterItems = document.querySelectorAll('[data-filter-item]');

  if (!select || !filterItems.length) return;

  const applyFilter = (category) => {
    filterItems.forEach(item => {
      if (item.dataset.hidden === 'true') return;
      const itemCategory = item.getAttribute('data-category').toLowerCase();
      item.style.display = (category === '전체' || itemCategory === category) ? 'block' : 'none';
    });
  };

  const setActiveBtn = (activeBtn) => {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  };

  // Mobile dropdown
  select.addEventListener('click', () => select.classList.toggle('active'));

  selectItems.forEach(item => {
    item.addEventListener('click', function () {
      const selected = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      select.classList.remove('active');
      applyFilter(selected);
      const matchingBtn = Array.from(filterBtns).find(
        btn => btn.innerText.trim().toLowerCase() === selected
      );
      if (matchingBtn) setActiveBtn(matchingBtn);
    });
  });

  // Desktop filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const category = this.innerText.trim().toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      setActiveBtn(this);
      applyFilter(category);
    });
  });

  // Initial state
  const initialBtn = Array.from(filterBtns).find(
    btn => btn.innerText.trim() === '전체'
  );
  if (initialBtn) {
    setActiveBtn(initialBtn);
    applyFilter('전체');
  }
}
