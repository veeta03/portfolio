/**
 * Portfolio Interactive Scripts
 * Podduturu Veeta Reddy
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initTypingEffect();
  initScrollEffects();
  initStatsCounter();
  initCardGlowEffect();
  initProjectCardToggle();
  initContactForm();
  initMobileMenu();
  initResumeDownload();
});

/**
 * 1. Preloader Screen
 */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('preloader-bar');
  const text = document.getElementById('preloader-text');
  
  if (!preloader) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Delay fadeout slightly for visual polish
      setTimeout(() => {
        preloader.classList.add('fade-out');
        // Enable scroll reveal after preloader finishes
        triggerScrollReveal();
      }, 500);
    }
    bar.style.width = `${progress}%`;
    text.textContent = `${progress}%`;
  }, 80);
}

/**
 * 2. Custom Cursor Follower
 */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  
  if (!dot || !outline) return;

  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;
  
  let isMoving = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;

    // Instantly position the center dot
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Smooth lerp (linear interpolation) animation loop for the outer circle
  function updateOutline() {
    const dx = mouseX - outlineX;
    const dy = mouseY - outlineY;
    
    // Slow follow factor (0.15 = 15% of distance per frame)
    outlineX += dx * 0.15;
    outlineY += dy * 0.15;
    
    outline.style.left = `${outlineX}px`;
    outline.style.top = `${outlineY}px`;
    
    requestAnimationFrame(updateOutline);
  }
  
  updateOutline();

  // Highlight cursor on interactive elements
  const selectInteractive = 'a, button, input, textarea, .glass-card, .interest-item, .skill-badge, .social-btn';
  const interactives = document.querySelectorAll(selectInteractive);
  
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('hovered-clickable');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('hovered-clickable');
    });
  });

  // Hide cursor when mouse leaves window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    outline.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    outline.style.opacity = '1';
  });
}

/**
 * 3. HTML5 Canvas Particles Background
 */
function initParticlesBackground() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const maxParticles = 60;
  
  const mouse = {
    x: null,
    y: null,
    radius: 150
  };

  // Adjust size to viewport
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Track mouse coordinates for connectivity
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Blueprint
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      // Tailored palette of purple/cyan/blue particles
      const colors = ['rgba(138, 43, 226, 0.4)', 'rgba(0, 242, 254, 0.4)', 'rgba(255, 0, 128, 0.25)'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow for lines
    }

    update() {
      // Bounce boundaries
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      
      this.x += this.vx;
      this.y += this.vy;
    }
  }

  // Generate particles
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  // Draw lines connecting neighboring particles
  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          const alpha = (1 - (distance / 110)) * 0.15;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      // Connect to mouse pointer
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const alpha = (1 - (distance / mouse.radius)) * 0.25;
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  // Main Loop
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    connectParticles();
    requestAnimationFrame(loop);
  }

  loop();
}

/**
 * 4. Typing Text Effect
 */
function initTypingEffect() {
  const target = document.getElementById('typed-text');
  if (!target) return;

  const words = [
    'Computer Science Engineering Student',
    'Software Developer',
    'AI Enthusiast'
  ];
  
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Remove characters
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deletes faster
    } else {
      // Add characters
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Natural typing speed
    }

    // Complete typing word
    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000; // Pause at end of word
      isDeleting = true;
    } 
    // Complete deleting word
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length; // Rotate index
      typingSpeed = 500; // Brief pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  // Start the typing loop
  setTimeout(type, 1000);
}

/**
 * 5. Scroll Progress Bar & Sticky Header Styling
 */
function initScrollEffects() {
  const header = document.getElementById('header');
  const scrollBar = document.getElementById('scroll-bar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // 1. Scroll Progress Bar
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolledVal = (scrollTop / docHeight) * 100;
    
    if (scrollBar) {
      scrollBar.style.width = `${scrolledVal}%`;
    }

    // 2. Sticky Header styling
    if (header) {
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // 3. Sync Active Navigation link with current visible section
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 160;
      const height = sec.offsetHeight;
      if (scrollTop >= top && scrollTop < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === currentId) {
        link.classList.add('active');
      }
    });
  });

  // Smooth scroll offsets to account for floating header
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offset = 100; // Account for navigation height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if active
        const hamburger = document.getElementById('hamburger-menu');
        const navMenu = document.getElementById('nav-links');
        if (hamburger && hamburger.classList.contains('active')) {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
}

/**
 * 6. Scroll Reveal Observer & Timeline Animate & Stats Activation
 */
function triggerScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Trigger specific sub-animations
        if (entry.target.classList.contains('skills-card')) {
          animateSkillBars(entry.target);
        }
        if (entry.target.id === 'education-experience') {
          animateTimelines();
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));
}

// Separate fallback in case DOM loads elements immediately
function animateSkillBars(card) {
  const bars = card.querySelectorAll('.skill-progress-bar');
  bars.forEach(bar => {
    const w = bar.getAttribute('data-width');
    bar.style.width = w;
  });
}

// Animate timeline visual height
function animateTimelines() {
  const eduGlow = document.getElementById('edu-timeline-glow');
  const expGlow = document.getElementById('exp-timeline-glow');
  if (eduGlow) eduGlow.style.height = '100%';
  if (expGlow) expGlow.style.height = '100%';
}

/**
 * 7. Statistics Counters Animation
 */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-num');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = entry.target;
        const targetVal = parseFloat(numEl.getAttribute('data-val'));
        let currentVal = 0;
        
        // Settings based on decimals or whole values
        const isDecimal = targetVal % 1 !== 0;
        const duration = 1500; // ms
        const steps = 60;
        const stepTime = duration / steps;
        const increment = targetVal / steps;

        const count = setInterval(() => {
          currentVal += increment;
          if (currentVal >= targetVal) {
            currentVal = targetVal;
            clearInterval(count);
          }
          
          numEl.textContent = isDecimal 
            ? currentVal.toFixed(1) 
            : Math.floor(currentVal);
            
          // Add standard suffix
          if (currentVal === targetVal) {
            if (numEl.getAttribute('data-val') === '2') {
              numEl.textContent += '+';
            } else if (numEl.getAttribute('data-val') === '4') {
              numEl.textContent += '+';
            }
          }
        }, stepTime);
        
        counterObserver.unobserve(numEl); // Only animate once
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => counterObserver.observe(num));
}

/**
 * 8. Glass Card dynamic mouse glow tracker
 */
function initCardGlowEffect() {
  const cards = document.querySelectorAll('.glass-card, .interest-item');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

function initProjectCardToggle() {
  const projectCards = Array.from(document.querySelectorAll('.projects-grid .project-card'));
  if (projectCards.length < 2) return;

  let visibleCount = 1;
  projectCards.slice(1).forEach(card => card.classList.add('hidden-card'));

  const instruction = document.querySelector('.project-instruction');
  if (instruction) {
    instruction.classList.add('highlight');
    instruction.innerHTML = '<span class="project-instruction-action">Click on project</span> to view more.';
  }

  projectCards[0].classList.add('revealed-card');

  projectCards[0].addEventListener('click', () => {
    if (visibleCount >= projectCards.length) return;

    const nextCard = projectCards[visibleCount];
    nextCard.classList.remove('hidden-card');
    nextCard.classList.add('revealed-card');
    visibleCount += 1;

    if (instruction) {
      if (visibleCount === projectCards.length) {
        instruction.textContent = 'All featured projects are now visible.';
        instruction.classList.remove('highlight');
      } else {
        instruction.textContent = 'Nice! Click again to view the next project.';
      }
    }
  });
}

/**
 * 9. Mobile Menu Hamburg Toggle
 */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-links');
  
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', !isExpanded);
  });
}

/**
 * 10. Contact Form validation and submission
 */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const statusMsg = document.getElementById('form-status');
  
  if (!form) return;

  const inputs = form.querySelectorAll('.form-input');
  
  // Real-time error hiding
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        input.classList.remove('invalid');
        const errorEl = document.getElementById(`${input.id.replace('form-', '')}-error`);
        if (errorEl) errorEl.style.display = 'none';
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    statusMsg.style.display = 'none';
    statusMsg.className = 'form-status-msg';

    inputs.forEach(input => {
      const errorEl = document.getElementById(`${input.id.replace('form-', '')}-error`);
      
      if (input.required && input.value.trim() === '') {
        input.classList.add('invalid');
        if (errorEl) {
          errorEl.textContent = `Please enter your ${input.id.replace('form-', '')}`;
          errorEl.style.display = 'block';
        }
        isValid = false;
      }
      
      // Email validation regex check
      if (input.id === 'form-email' && input.value.trim() !== '') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value)) {
          input.classList.add('invalid');
          if (errorEl) {
            errorEl.textContent = 'Please enter a valid email address';
            errorEl.style.display = 'block';
          }
          isValid = false;
        }
      }
    });

    if (isValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      const company = document.getElementById('form-company').value.trim();
      const position = document.getElementById('form-position').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const address = document.getElementById('form-address').value.trim();
      const message = document.getElementById('form-message').value.trim();
      const subject = `Portfolio Contact from ${company || 'a contact'}`;

      const body = encodeURIComponent(
        `Company name: ${company}\nPosition: ${position}\nEmail: ${email}\nAddress: ${address}\nPhone: ${phone}\n\nMessage:\n${message}`
      );
      const mailtoLink = `mailto:podduturuveetareddy@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Opening email... <span class="badge-dot"></span>';
      statusMsg.textContent = 'Preparing your email.';
      statusMsg.className = 'form-status-msg success';

      window.location.href = mailtoLink;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }, 1000);
    } else {
      statusMsg.textContent = 'Please fill out all fields correctly.';
      statusMsg.classList.add('error');
    }
  });
}

/**
 * 11. Resume Download Action
 */
function initResumeDownload() {
  const btn = document.getElementById('resume-download');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    // Fetch the actual PDF as a binary blob and trigger download
    fetch('assets/Veeta_Reddy_Resume.pdf')
      .then(response => {
        if (!response.ok) throw new Error('Resume file not found');
        return response.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'podduturu_veeta_reddy-resume.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // Small delay before revoking to ensure download starts
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      })
      .catch(err => {
        console.error('Resume download failed:', err);
        // Fallback: open in new tab
        window.open('assets/Veeta_Reddy_Resume.pdf', '_blank');
      });
  });
}
