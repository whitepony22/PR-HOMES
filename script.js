'use strict';

// MODAL
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnCloseModal = document.querySelector('.btn--close-modal');

const openModal = e => {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
const closeModal = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

// NAV STICKY ON SCROLL
const nav = document.querySelector('.nav');
const home = document.querySelector('.home');
const scrollTrigger = document.querySelector('.scroll-sentinel');

// Delay observing until the browser has painted at least once
requestAnimationFrame(() => {
  observer.observe(scrollTrigger);
});

// Show nav + animate logo when 80% of home is scrolled past
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.intersectionRatio < 0.2) {
      nav.classList.add('scrolled');
      home.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
      home.classList.remove('scrolled');
    }
  },
  {
    root: null,
    threshold: [0, 0.2, 1], // Observe when <20% of home is visible
  }
);
observer.observe(home);


// SCROLL TO SECTIONS
document.querySelector('.nav__links').addEventListener('click', function (e) {
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    const section = document.querySelector(id);
    section?.scrollIntoView({ behavior: 'smooth' });
  }
});

// ACTIVE LINK INDICATOR
const sections = document.querySelectorAll('section, header, footer');
const navLinks = document.querySelectorAll('.nav__link');

const updateActive = () => {
  const y = window.scrollY + 200;
  const pageHeight = document.documentElement.scrollHeight;
  const scrollBottom = window.scrollY + window.innerHeight;

  sections.forEach((sec, i) => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;

    const isLastSection = i === sections.length - 1;

    if (
      (y >= top && y < top + height) || 
      (isLastSection && scrollBottom >= pageHeight - 5)
    ) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav__link[href="#${sec.id}"]`);
      active?.classList.add('active');
    }
  });
};
window.addEventListener('scroll', updateActive);

// REVEAL SECTIONS
const revealSection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

document.querySelectorAll('.section').forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// ROOM TABS
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.rooms__content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabNum = tab.dataset.tab;

    tabs.forEach(t => t.classList.remove('tab--active'));
    tab.classList.add('tab--active');

    tabContents.forEach(content => {
      content.classList.remove('content--active');
    });
    document.querySelector(`.rooms__content--${tabNum}`).classList.add('content--active');
  });
});

//FACILITIES SCROLLING
const facilitiesStrip = document.querySelector('.facilities__strip');

facilitiesStrip.addEventListener('wheel', e => {
  const scrollLeft = facilitiesStrip.scrollLeft;
  const maxScrollLeft = facilitiesStrip.scrollWidth - facilitiesStrip.clientWidth;

  const atStart = scrollLeft <= 0;
  const atEnd = scrollLeft >= maxScrollLeft - 1;

  const scrollingDown = e.deltaY > 0;
  const scrollingUp = e.deltaY < 0;

  const shouldScrollHorizontally =
    (!atEnd && scrollingDown) || (!atStart && scrollingUp);

  if (shouldScrollHorizontally) {
    console.log('Scrolling horizontally');
    e.preventDefault();
    facilitiesStrip.scrollBy({
      left: e.deltaY,
      behavior: 'smooth',
    });
  }
  else {
  // Otherwise, allow vertical scroll
  console.log('Scrolling vertically');
  }
}, { passive: false });


// TESTIMONIAL SLIDER
// Dummy review data (e.g., fetched from an API)
const reviews = [
  {
    rating: 5,
    header: "Absolutely wonderful stay!",
    text: "Loved the calm ambiance…",
    name: "Neha Rajan",
    location: "Kochi, India",
    img: "img/user-1.jpg"
  },
  {
    rating: 4,
    header: "Great experience!",
    text: "The facilities were top-notch…",
    name: "Ammu Menon",
    location: "Ernakulam",
    img: "img/user-2.jpg"
  }
];

// 1. Sort by rating descending
const topReviews = reviews
  .filter(r => r.rating >= 4)
  .sort((a, b) => b.rating - a.rating);

// 2. Inject into DOM
const track = document.querySelector('.slider_track');
track.innerHTML = topReviews.map(r => `
  <div class="slide">
    <div class="testimonial">
      <h5 class="testimonial__header">${r.header}</h5>
      <blockquote class="testimonial__text">${r.text}</blockquote>
      <address class="testimonial__author">
        <img src="${r.img}" alt="${r.name}" class="testimonial__photo" />
        <div>
          <h6 class="testimonial__name">${r.name}</h6>
          <p class="testimonial__location">${r.location}</p>
        </div>
      </address>
    </div>
  </div>
`).join('');

// 3. Slider controls
let current = 0;
const dotsContainer = document.querySelector('.dots');
const slides = document.querySelectorAll('.slide');

// Build dots
dotsContainer.innerHTML = topReviews.map((_, i) =>
  `<span class="${i === 0 ? 'active' : ''}"></span>`
).join('');

const dots = dotsContainer.querySelectorAll('span');

// Show slide
function updateSlider() {
  const offset = current * -100;
  track.style.transform = `translateX(${offset}%)`;

  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[current]) dots[current].classList.add('active');
}

// Dot click
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    current = i;
    updateSlider();
  });
});

// Button click
document.querySelector('.slider__btn--left').addEventListener('click', () => {
  current = (current - 1 + slides.length) % slides.length;
  updateSlider();
});

document.querySelector('.slider__btn--right').addEventListener('click', () => {
  current = (current + 1) % slides.length;
  updateSlider();
});

// Init
updateSlider();

// Footer
document.querySelector('.btn--contact').addEventListener('click', () => {
  document.querySelector('.modal--contact').classList.remove('hidden');
  document.querySelector('.overlay').classList.remove('hidden');
});

document.querySelector('.btn--close-modal').addEventListener('click', () => {
  document.querySelector('.modal--contact').classList.add('hidden');
  document.querySelector('.overlay').classList.add('hidden');
});
