/* ── MYFUNDZ & KSA PORTFOLIO INTERACTS ── */

document.addEventListener('DOMContentLoaded', () => {

  // ── HAMBURGER MENU ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // Close mobile menu on clicking links
    document.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ── NAVBAR SCROLL SHADOW ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveNav();
  });

  // ── ACTIVE NAVIGATION HIGHLIGHT ──
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('[data-nav]');

  function highlightActiveNav() {
    let currentSection = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  // ── SMOOTH SCROLL FOR ALL ANCHORS ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ── SCROLL REVEAL ANIMATIONS ──
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add a micro cascade delay
        const delay = (index % 4) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── STATS COUNTER BANNER ──
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsSection = document.getElementById('stats');

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 1800; // 1.8 seconds count time
    const stepTime = Math.max(Math.floor(duration / target), 12);
    let current = 0;

    // Fast tracking increment for high values like establish year
    const increment = target > 1000 ? Math.ceil(target / 100) : 1;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toLocaleString('en-IN');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString('en-IN');
      }
    }, stepTime);
  };

  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        statNumbers.forEach(num => countUp(num));
        statsObserver.unobserve(statsSection);
      }
    }, { threshold: 0.1 });

    statsObserver.observe(statsSection);
  }

  // ── REAL-TIME SIP CALCULATOR LOGIC ──
  const sipAmtInput = document.getElementById('sip-amount');
  const sipRateInput = document.getElementById('sip-rate');
  const sipYearsInput = document.getElementById('sip-years');

  const sipAmtVal = document.getElementById('sip-amt-val');
  const sipRateVal = document.getElementById('sip-rate-val');
  const sipYearsVal = document.getElementById('sip-years-val');

  const resInvested = document.getElementById('res-invested');
  const resReturns = document.getElementById('res-returns');
  const resTotal = document.getElementById('res-total');

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const calculateSIP = () => {
    if (!sipAmtInput || !sipRateInput || !sipYearsInput) return;

    const P = parseFloat(sipAmtInput.value);
    const annualRate = parseFloat(sipRateInput.value);
    const years = parseFloat(sipYearsInput.value);

    // Update Text display
    sipAmtVal.textContent = P.toLocaleString('en-IN');
    sipRateVal.textContent = annualRate;
    sipYearsVal.textContent = years;

    // SIP Compound Formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
    const i = (annualRate / 12) / 100; // Monthly interest rate
    const n = years * 12; // Total investment months

    let totalValue = 0;
    if (i === 0) {
      totalValue = P * n;
    } else {
      totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    }

    const investedAmount = P * n;
    const estReturns = Math.max(0, totalValue - investedAmount);

    // Render results
    resInvested.textContent = formatCurrency(investedAmount);
    resReturns.textContent = formatCurrency(estReturns);
    resTotal.textContent = formatCurrency(totalValue);
  };

  // Add event listeners for sliders
  if (sipAmtInput) {
    sipAmtInput.addEventListener('input', calculateSIP);
    sipRateInput.addEventListener('input', calculateSIP);
    sipYearsInput.addEventListener('input', calculateSIP);

    // Initial calculation
    calculateSIP();
  }

  // ── INQUIRY FORM SUBMISSION TOAST ──
  const inquiryForm = document.getElementById('inquiry-form');
  const toast = document.getElementById('toast');

  if (inquiryForm && toast) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show floating premium success alert
      toast.classList.add('show');

      // Clear form
      inquiryForm.reset();
      if (sipAmtInput) calculateSIP(); // recalculate calculator default values

      // Hide toast after 4.5 seconds
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4500);
    });
  }
});
