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

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get('name').toString().trim();
  const email = formData.get('email').toString().trim();
  const message = formData.get('message').toString().trim();
  const status = document.querySelector('#form-status');
  const submitButton = contactForm.querySelector('button[type="submit"]');

  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
  status.textContent = 'Sending your message...';

  try {
    const response = await fetch('https://formsubmit.co/ajax/usmankhanaps@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _replyto: email,
        _subject: `Portfolio message from ${name}`
      })
    });

    let result;
    try {
      result = await response.json();
    } catch (error) {
      console.error('FormSubmit returned an unreadable response.', error);
      status.textContent = 'The email service returned an unexpected response. Please try again.';
      return;
    }

    if (!response.ok || (result.success !== true && result.success !== 'true')) {
      status.textContent = result.message || 'Your message could not be sent. Please try again.';
      return;
    }

    contactForm.reset();
    status.textContent = 'Message sent successfully. Thank you for reaching out!';
  } catch (error) {
    console.error('Could not send the contact form.', error);
    status.textContent = 'Could not connect to the email service. Check your connection and try again.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Send Message →';
  }
});
