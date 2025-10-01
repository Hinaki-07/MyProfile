document.addEventListener('DOMContentLoaded', () => {
  const next = document.getElementById('form-next');
  if (next) {
    const base = `${location.protocol}//${location.host}${location.pathname.replace(/\/[^/]*$/, '/')}`;
    next.value = base + 'thanks.html';
  }
  const email = document.getElementById('email');
  const replyto = document.getElementById('form-replyto');
  if (email && replyto) {
    email.addEventListener('input', () => {
      replyto.value = email.value;
    });
  }

  // Hero portrait tilt + shine
  const portrait = document.querySelector('.portrait-wrap');
  if (portrait) {
    const img = portrait.querySelector('.portrait-img');
    const shine = portrait.querySelector('.portrait-shine');
    const rectMemo = {w:0,h:0,left:0,top:0};
    const updateRect = ()=>{
      const r = portrait.getBoundingClientRect();
      rectMemo.w = r.width; rectMemo.h = r.height; rectMemo.left = r.left + window.scrollX; rectMemo.top = r.top + window.scrollY;
    };
    updateRect();
    window.addEventListener('resize', updateRect);
    portrait.addEventListener('mousemove', (e)=>{
      if (!img) return;
      const x = e.pageX - rectMemo.left;
      const y = e.pageY - rectMemo.top;
      const rx = ((y / rectMemo.h) - 0.5) * -8; // subtle tilt X
      const ry = ((x / rectMemo.w) - 0.5) * 8;  // subtle tilt Y
      img.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.01)`;
      if (shine) {
        shine.style.setProperty('--mx', `${(x/rectMemo.w)*100}%`);
        shine.style.setProperty('--my', `${(y/rectMemo.h)*100}%`);
      }
    });
    portrait.addEventListener('mouseleave', ()=>{
      if (img) img.style.transform = '';
    });
  }

  // Video fallback: pause/hide if cannot play
  const video = document.querySelector('.hero-video');
  if (video) {
    const hideVideo = ()=>{ video.style.display = 'none'; };
    video.addEventListener('error', hideVideo, { once:true });
    const p = video.play();
    if (p && typeof p.catch === 'function') {
      p.catch(()=> hideVideo());
    }
  }

  // モバイルナビ開閉
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
    mobileLinks.forEach(l=>l.addEventListener('click', ()=>{
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }));
    window.addEventListener('resize', ()=>{
      if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // IntersectionObserver リビール
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      })
    }, {root:null, rootMargin:'0px 0px -10% 0px', threshold:0.15});
    document.querySelectorAll('.reveal,.card,.work-card,.qualification-card').forEach(el=>{
      el.classList.add('reveal');
      io.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));
  }
});

// Scroll indicator smooth scroll
document.addEventListener('click', (e) => {
  const link = e.target.closest('a.elegant-scroll-indicator');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.charAt(0) !== '#') return;
  const target = document.querySelector(href);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});


