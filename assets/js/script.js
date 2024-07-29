'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}


// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    const itemCategories = filterItems[i].dataset.category.split(' ');

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (itemCategories.includes(selectedValue)) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}


// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}


document.addEventListener("DOMContentLoaded", function() {
  const projectItems = document.querySelectorAll(".project-item");
  const projectContents = document.querySelectorAll(".project-content");
  const backButton = document.querySelectorAll(".back-button");
  const projectList = document.querySelector(".project-overview");
  const navbarLinks = document.querySelectorAll("[data-nav-link]");
  const filterBtns = document.querySelectorAll("[data-filter-btn]");

  // Show the project list and hide all project contents
  function showProjectList() {
    projectList.style.display = "block";
    projectContents.forEach(content => {
      content.style.display = "none";
    });
  }

   // Clear active state from all filter buttons
   function clearActiveFilters() {
    filterBtns.forEach(btn => btn.classList.remove("active"));
  }

  // Set initial active filter button and filter items
  const initialFilter = 'main';
  clearActiveFilters(); // Clear any active states
  const initialFilterBtn = Array.from(filterBtns).find(btn => btn.innerText.toLowerCase() === initialFilter);
  if (initialFilterBtn) {
    initialFilterBtn.classList.add("active");
    filterFunc(initialFilter);
  }

  // Event listener for project items
  projectItems.forEach(item => {
    item.addEventListener("click", function(e) {
      e.preventDefault();
      projectList.style.display = "none";
      const projectContentId = this.getAttribute("project-content");
      const projectContent = document.querySelector(`.${projectContentId}`);
      projectContents.forEach(content => {
        content.style.display = "none";
      });
      projectContent.style.display = "block";
      window.scrollTo({top: 0});
    });
  });

  // Event listener for back buttons
  backButton.forEach(button => {
    button.addEventListener("click", function() {
      showProjectList();
      window.scrollTo({top: 0});
    });
  });

  // Event listener for navbar links
  navbarLinks.forEach(link => {
    link.addEventListener("click", function() {
      showProjectList();
    });
  });

  // Event listener for filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      showProjectList();
    });
  });
});


// For ToggleButton
// document.getElementById("toggleButton").addEventListener("click", function() {
//   var content = document.getElementById("foldingContent");

//   if (content.classList.contains("show")) {
//     content.classList.remove("show");
//     this.textContent = "알고 있는";
//   } else {
//     content.classList.add("show");
//     this.textContent = "접기";
//   }
// });


// Add language switching functionality
const langSwitcher = document.getElementById('lang-switcher');
const langElements = document.querySelectorAll('[data-lang-key]');

const translations = {
  en: {
    title: "Unity Developer",
    "show-contacts": "Show Contacts",
    "email": "E-mail",
    "phone": "Phone",
    "name": "Kisub Lee",
    "birth": "Birthday",
    "birth_content": "June 7, 1998",
    "location": "Location",
    "location_content": "Seoul, South Korea",
    "about": "About",
    "resume": "Resume",
    "portfolio": "Project",
    "blog": "Blog",
    "publication" : "Publication",
    "about_title": "About me",
    "about_content1": "I'm Creative Director and UI/UX Designer from Sydney, Australia, working in web development and print media. I enjoy turning complex problems into simple, beautiful and intuitive designs.",
    "about_content2": "My job is to build your website so that it is functional and user-friendly but at the same time attractive. Moreover, I add personal touch to your product and make sure that is eye-catching and easy to use. My aim is to bring across your message and identity in the most creative way. I created web design for many famous brand companies.",
    
    // Resume
    "education": "Education",
    "education1-title": "Hanyang University, Seoul, South Korea",
    "education1-date": "Sep, 2022 – present",
    "education1-desc": "Master of Science in Computer Science, GPA: 4.06/4.5",

    "education2-title": "Kyungpook National University, Daegu, South Korea",
    "education2-date": "Mar, 2018 – Aug, 2022",
    "education2-desc": "Bachelor of Science in Computer Science, GPA: 3.56/4.5",

    "education3-title": "Oxstand International School, ShenZhen, China",
    "education3-date": "Aug, 2014 – Jun, 2017",
    "education3-desc": "High school student",

    "experience": "Experience",
    "experience1-title": "Mixed Reality Laboratory - Hanyang University",
    "experience1-date": "Jul, 2022 – present",
    "experience1-desc": "Graduate student",
    // OREH
    "act_oreh" : "Lettre de Paris - OREH",
    "act_oreh_date" : "Feb, 2023 - Jun, 2023",
    "act_oreh_text" : "App developer",
    // IPA Lab
    "experience2-title": "Image Processing and Analysis Laboratory - Kyungpook National University",
    "experience2-date": "Jul, 2020 – Feb, 2022",
    "experience2-desc": "Undergraduate Researcher",
    // Rovice
    "experience3-title": "Automation System Company - Rovice",
    "experience3-date": "Mar – May, 2021",
    "experience3-desc": "Developer",

    "international-experience": "International Experience",
    "intl-experience1-title": "Canada - University of Calgary",
    "intl-experience1-date": "Sep, 2023 - Feb, 2024",
    "intl-experience1-desc": "Visiting scholar",

    "intl-experience2-title": "India - LG Soft India",
    "intl-experience2-date": "Jan, 2021 - Feb, 2021",
    "intl-experience2-desc": "Winter internship (online)",

    "intl-experience3-title": "Estonia - Tallinn University",
    "intl-experience3-date": "Jul, 2018 - Aug, 2018",
    "intl-experience3-desc": "Summer exchange student",

    "intl-experience4-title": "China - Oxstand International School, ShenZhen",
    "intl-experience4-date": "Aug, 2014 – Jun, 2017",
    "intl-experience4-desc": "High school student",
   
    "activity" : "Activity",
    "act-lion-title": "Like Lion - Intercollegiate IT Club",
    "act-lion-date": "2020 - 2021",
    "act-lion-desc1": "New Member (2020)",
    "act-lion-desc2": "Executive Member (Education Team, 2021)",

    "act-kutc-title": "Kyungpook National University Tennis Club (KUTC)",
    "act-kutc-date": "2018 - 2022",
    "act-kutc-desc": "Executive Member (Head of Guidance, 2019)",
    

    // publication
    "publication" : "Publication/Award"
  },

  ko: {
    title: "유니티 개발자",
    "show-contacts": "연락처 보기",
    "email": "이메일",
    "phone": "핸드폰",
    "name": "이기섭",
    "birth": "생년월일",
    "birth_content": "1998년 6월 7일",
    "location": "주소",
    "location_content": "서울 성동구",
    "about": "소개",
    "resume": "이력서",
    "portfolio": "프로젝트",
    "blog": "블로그",
    "publication" : "논문",
    "about_title": "소개",
    "about_content1": "저는 호주 시드니 출신의 크리에이티브 디렉터이자 UI/UX 디자이너로 웹 개발과 인쇄 매체 분야에서 일하고 있습니다. 복잡한 문제를 단순하고 아름답고 직관적인 디자인으로 바꾸는 것을 즐깁니다.",
    "about_content2": "제가 하는 일은 기능적이고 사용자 친화적이면서 동시에 매력적인 웹사이트를 구축하는 것입니다. 또한 제품에 나만의 개성을 더해 눈길을 사로잡고 사용하기 쉽도록 만듭니다. 제 목표는 가장 창의적인 방식으로 여러분의 메시지와 정체성을 전달하는 것입니다. 저는 많은 유명 브랜드 회사의 웹 디자인을 만들었습니다.",

    // Resume
    "education": "교육",
    "education1-title": "한양대학교, 서울",
    "education1-date": "2022년 9월 – 현재",
    "education1-desc": "컴퓨터 공학 석사, GPA: 4.06/4.5",
    "education2-title": "경북대학교, 대구",
    "education2-date": "2018년 3월 – 2022년 8월",
    "education2-desc": "컴퓨터 공학 학사, GPA: 3.56/4.5",
    "education3-title": "옥스탠드 국제학교, 선전, 중국",
    "education3-date": "2014년 8월 – 2017년 6월",
    "education3-desc": "고등학생",

    "experience": "경험",
    "experience1-title": "혼합현실 연구실 - 한양대학교",
    "experience1-date": "2022년 7월 – 현재",
    "experience1-desc": "대학원생(석사과정)",
    // OREH
    "act_oreh" : "'황기환, 그의 귀환' 야외방탈출 게임 - OREH",
    "act_oreh_date" : "2023년 2월 - 2023년 6월",
    "act_oreh_text" : "앱 개발자",
    // IPA
    "experience2-title": "이미지 처리 및 분석 연구실 - 경북대학교",
    "experience2-date": "2020년 7월 – 2022년 2월",
    "experience2-desc": "학부 연구생",
    // Rovice
    "experience3-title": "무인화 시스템 전문회사 - 로비스",
    "experience3-date": "2021년 3월 – 2021년 5월",
    "experience3-desc": "개발자",

    "international-experience": "해외 경험",
    "intl-experience1-title": "캐나다 - 캘거리 대학교",
    "intl-experience1-date": "2023년 9월 - 2024년 2월",
    "intl-experience1-desc": "방문 연구원",

    "intl-experience2-title": "인도 - LG 소프트 인도",
    "intl-experience2-date": "2021년 1월 - 2021년 2월",
    "intl-experience2-desc": "겨울 인턴십(온라인)",

    "intl-experience3-title": "에스토니아 - 탈린 대학교",
    "intl-experience3-date": "2018년 7월 - 2018년 8월",
    "intl-experience3-desc": "여름 교환 학생",

    "intl-experience4-title": "중국 - 옥스탠드 국제학교, 선전",
    "intl-experience4-date": "2014년 8월 – 2017년 6월",
    "intl-experience4-desc": "고등학생",
    
    "activity" : "활동",
    "act-lion-title" : "멋쟁이 사자처럼 - 대학연합 IT동아리",
    "act-lion-date" : "2020 - 2021",
    "act-lion-desc1" : "2020년 8기 아기사자(신입부원)",
    "act-lion-desc2" : "2021년 9기 운영진(교육팀)",

    "act-kutc-title" : "경북대학교 테니스 동아리(KUTC)",
    "act-kutc-date" : "2018 - 2022",
    "act-kutc-desc" : "2019년 운영진(지도부장)",

    // publication
    "publication" : "논문/수상"
  }
};


let currentLang = 'en';

const switchLanguage = () => {
  currentLang = currentLang === 'en' ? 'ko' : 'en';
  langSwitcher.textContent = currentLang === 'en' ? '한국어' : 'English';
  langElements.forEach((elem) => {
    const key = elem.getAttribute('data-lang-key');
    if (key && translations[currentLang][key]) {
      elem.textContent = translations[currentLang][key];
    }
  });
  // Reapply event listeners for navigation links
  setNavEventListeners();
};

const setNavEventListeners = () => {
  navigationLinks.forEach((link, index) => {
    link.addEventListener('click', function () {
      navigationLinks.forEach((navLink, navIndex) => {
        if (index === navIndex) {
          pages[navIndex].classList.add("active");
          navLink.classList.add("active");
          window.scrollTo(0, 0);
        } else {
          pages[navIndex].classList.remove("active");
          navLink.classList.remove("active");
        }
      });
    });
  });
};

langSwitcher.addEventListener('click', switchLanguage);

// Initial setup
switchLanguage();
setNavEventListeners();