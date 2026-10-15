const revealSelectors = [
  '#about .section-label',
  '#about .about-grid',
  '#skills .section-label',
  '#skills .section-title',
  '#skills .skill-cat',
  '#projects .section-label',
  '#projects .section-title',
  '#projects .filter-tabs',
  '#projects .project-card',
  '#timeline .section-label',
  '#timeline .section-title',
  '#timeline .t-item',
  '#contact .section-label',
  '#contact .section-title',
  '#contact .contact-grid'
];

const revealItems = document.querySelectorAll(revealSelectors.join(','));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.body.classList.add('js-enabled');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('reveal', 'is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => {
    item.classList.add('reveal');
    revealObserver.observe(item);
  });
}

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const contactNext = document.createElement('input');
contactNext.type = 'hidden';
contactNext.name = '_next';
contactForm.append(contactNext);
const contactUrl = new URL(window.location.href);

if (contactUrl.searchParams.get('contact') === 'sent') {
  formStatus.textContent = 'Message sent successfully. A confirmation email has been sent to you.';
  contactUrl.searchParams.delete('contact');
  window.history.replaceState({}, '', `${contactUrl.pathname}${contactUrl.search}${contactUrl.hash}`);
}

contactForm.addEventListener('submit', () => {
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set('contact', 'sent');
  nextUrl.hash = 'contact';
  contactNext.value = nextUrl.toString();

  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
  formStatus.textContent = 'Sending your message...';
});
