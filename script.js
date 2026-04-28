/* ==========================================================================
   Mr.bãhRé | script.js
   TABLE OF CONTENTS
   1.  Safe Query Helpers
   2.  Page Transition Fade-in
   3.  Navbar — Scroll Shrink + Active Link
   4.  Custom Cursor (desktop only) — *Removed for better mobile compatibility*
   5.  Scroll-reveal Animations
   6.  Reading Progress Bar  (post pages)
   7.  TOC Active Highlight  (post pages)
   8.  Terminal — About Page
   9.  Lab Filter + Card Entrance
  10.  Home — Typed Subtitle
  11.  Contact Cards — Ripple Effect
  12.  Blog / Lab — Card Tilt on Hover
  13.  Back-to-Top Button
  14.  Keyboard Shortcut Easter Egg
   ========================================================================== */


/* ─────────────────────────────────────────────
   1. SAFE QUERY HELPERS
   Prevents errors when an element doesn't exist
   on the current page.
───────────────────────────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ─────────────────────────────────────────────
   2. PAGE TRANSITION — FADE IN
   Every page fades in smoothly on load.
───────────────────────────────────────────── */
document.documentElement.style.opacity = '0';
document.documentElement.style.transition = 'opacity 0.4s ease';

window.addEventListener('load', () => {
    document.documentElement.style.opacity = '1';
});

// Fade out before navigating away
qsa('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') ||
        href.startsWith('http') || href.startsWith('tel')) return;

    link.addEventListener('click', e => {
        e.preventDefault();
        document.documentElement.style.opacity = '0';
        setTimeout(() => { window.location.href = href; }, 380);
    });
});


/* ─────────────────────────────────────────────
   3. NAVBAR — SCROLL SHRINK + ACTIVE LINK
   Header shrinks on scroll. Current page link
   stays highlighted.
───────────────────────────────────────────── */
const header = qs('header');

if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.style.padding    = '12px 6%';
            header.style.boxShadow  = '0 4px 24px rgba(0,0,0,0.4)';
        } else {
            header.style.padding    = '18px 6%';
            header.style.boxShadow  = 'none';
        }
    }, { passive: true });

    // Mark active nav link by URL
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    qsa('.nav-links a').forEach(a => {
        if (a.getAttribute('href') === currentPage) {
            a.classList.add('active');
        }
    });
}

/* ─────────────────────────────────────────────
   5. SCROLL-REVEAL ANIMATIONS
   Elements slide up and fade in when they
   enter the viewport.
───────────────────────────────────────────── */
const revealTargets = qsa(
    '.project-card, .hcard, .contact-card, .post-card, ' +
    '.featured-post, .blog-cta, .sidebar-section, ' +
    '.home-center, .terminal-container'
);

revealTargets.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.55s ease ${(i % 6) * 0.07}s, transform 0.55s ease ${(i % 6) * 0.07}s`;
});

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealTargets.forEach(el => revealObserver.observe(el));


/* ─────────────────────────────────────────────
   6. READING PROGRESS BAR (post pages)
───────────────────────────────────────────── */
const progressBar = qs('#read-progress');
if (progressBar) {
    window.addEventListener('scroll', () => {
        const doc          = document.documentElement;
        const scrollTop    = doc.scrollTop || document.body.scrollTop;
        const scrollHeight = doc.scrollHeight - doc.clientHeight;
        progressBar.style.width = ((scrollTop / scrollHeight) * 100) + '%';
    }, { passive: true });
}


/* ─────────────────────────────────────────────
   7. TOC ACTIVE HIGHLIGHT (post pages)
───────────────────────────────────────────── */
const sections = qsa('article section');
const tocLinks = qsa('.toc-list a');

if (sections.length && tocLinks.length) {
    const tocObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                tocLinks.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(s => tocObserver.observe(s));
}


/* ─────────────────────────────────────────────
   8. TERMINAL — ABOUT PAGE
   Interactive shell with commands.
───────────────────────────────────────────── */
const terminalInput = qs('#terminal-input');
const cmdHistory    = qs('#command-history');

if (terminalInput && cmdHistory) {

    // Focus on load and on click anywhere
    window.addEventListener('load', () => terminalInput.focus());
    document.addEventListener('click', () => terminalInput.focus());

    const commands = {
        'help':     'Available: whoami, status, skills, projects, contact, clear',
        'whoami':   'Mr.bãhRé | Frontend UI Architect | Gaming Enthusiast',
        'status':   'System: Active ● Exploring new frontend horizons.',
        'skills':   'HTML5, CSS3 (Grid/Flex/Animations), JS, Git, UI/UX Design.',
        'projects': '→ Redirecting to The Lab...',
        'contact':  '→ Redirecting to Contact page...',
        'clear':    '__CLEAR__',
    };

    // Command input history (up/down arrow)
    let inputHistory = [];
    let historyIdx   = -1;

    terminalInput.addEventListener('keydown', e => {
        if (e.key === 'ArrowUp') {
            if (historyIdx < inputHistory.length - 1) historyIdx++;
            terminalInput.value = inputHistory[historyIdx] || '';
            e.preventDefault();
        }
        if (e.key === 'ArrowDown') {
            if (historyIdx > 0) historyIdx--;
            else { historyIdx = -1; terminalInput.value = ''; }
            terminalInput.value = inputHistory[historyIdx] || '';
            e.preventDefault();
        }

        if (e.key !== 'Enter') return;

        const cmd = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';
        historyIdx = -1;
        if (cmd) { inputHistory.unshift(cmd); }

        // Print the typed command
        const line = document.createElement('p');
        line.innerHTML = `<span class="prompt">$</span> <span style="color:#e0e0e6">${cmd}</span>`;
        cmdHistory.appendChild(line);

        // Execute
        if (cmd === 'clear') {
            cmdHistory.innerHTML = '';
        } else if (cmd === 'projects') {
            appendResponse('→ Redirecting to The Lab...');
            setTimeout(() => { window.location.href = 'lab.html'; }, 800);
        } else if (cmd === 'contact') {
            appendResponse('→ Redirecting to Contact...');
            setTimeout(() => { window.location.href = 'contact.html'; }, 800);
        } else if (commands[cmd]) {
            appendResponse(commands[cmd]);
        } else if (cmd !== '') {
            const err = document.createElement('p');
            err.style.cssText = 'color:#f85149;margin-left:20px;font-family:var(--mono);font-size:0.85rem;';
            err.textContent = `bash: ${cmd}: command not found. Type 'help'.`;
            cmdHistory.appendChild(err);
        }

        window.scrollTo(0, document.body.scrollHeight);
    });

    function appendResponse(text) {
        const p = document.createElement('p');
        p.className = 'response';
        p.style.fontFamily = 'var(--mono)';
        p.style.fontSize   = '0.85rem';
        p.textContent      = text;
        cmdHistory.appendChild(p);
    }
}


/* ─────────────────────────────────────────────
   9. LAB FILTER + CARD ENTRANCE ANIMATION
───────────────────────────────────────────── */
const filterBtns = qsa('.filter-btn');
const labCards   = qsa('.project-card');
const countEl    = qs('#result-count');

if (filterBtns.length) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter  = btn.dataset.filter;
            let   visible = 0;

            labCards.forEach((card, i) => {
                const tags = card.dataset.tags || '';
                const show = filter === 'all' || tags.toLowerCase().includes(filter.toLowerCase());

                if (show) {
                    card.classList.remove('hidden');
                    // Staggered re-entrance
                    card.style.opacity   = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.opacity   = '1';
                        card.style.transform = 'translateY(0)';
                    }, visible * 60);
                    visible++;
                } else {
                    card.classList.add('hidden');
                }
            });

            if (countEl) countEl.textContent = visible;
        });
    });
}


/* ─────────────────────────────────────────────
   10. HOME — TYPED SUBTITLE EFFECT
   Cycles through roles under the profile name.
───────────────────────────────────────────── */
const roleEl = qs('.home-role');
if (roleEl) {
    const roles = [
        'Front-end Developer',
        'UI / UX Architect',
        'CSS Experimentalist',
        'Discord Server Builder',
        'Gaming Enthusiast',
    ];
    let rIdx = 0, cIdx = 0, deleting = false;

    function typeLoop() {
        const current = roles[rIdx];
        if (!deleting) {
            roleEl.textContent = current.slice(0, cIdx + 1);
            cIdx++;
            if (cIdx === current.length) {
                deleting = true;
                setTimeout(typeLoop, 1800);
                return;
            }
        } else {
            roleEl.textContent = current.slice(0, cIdx - 1);
            cIdx--;
            if (cIdx === 0) {
                deleting = false;
                rIdx = (rIdx + 1) % roles.length;
            }
        }
        setTimeout(typeLoop, deleting ? 45 : 90);
    }
    typeLoop();
}


/* ─────────────────────────────────────────────
   11. CONTACT CARDS — RIPPLE EFFECT
   A ripple burst from the click point.
───────────────────────────────────────────── */
qsa('.contact-card, .hcard').forEach(card => {
    card.style.position = 'relative';
    card.style.overflow = 'hidden';

    card.addEventListener('click', function(e) {
        const rect   = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size   = Math.max(rect.width, rect.height) * 2;

        Object.assign(ripple.style, {
            position:     'absolute',
            width:        size + 'px',
            height:       size + 'px',
            borderRadius: '50%',
            background:   'rgba(230,126,34,0.18)',
            transform:    'scale(0)',
            animation:    'rippleAnim 0.55s ease-out forwards',
            left:         (e.clientX - rect.left - size / 2) + 'px',
            top:          (e.clientY - rect.top  - size / 2) + 'px',
            pointerEvents:'none',
        });

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 580);
    });
});

// Inject ripple keyframe once
if (!qs('#ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = '@keyframes rippleAnim { to { transform: scale(1); opacity: 0; } }';
    document.head.appendChild(s);
}


/* ─────────────────────────────────────────────
   12. CARD TILT ON HOVER (subtle 3D effect)
   Works on project cards and home social cards.
───────────────────────────────────────────── */
const tiltCards = qsa('.project-card, .hcard, .post-card, .featured-post');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect  = card.getBoundingClientRect();
        const cx    = rect.left + rect.width  / 2;
        const cy    = rect.top  + rect.height / 2;
        const dx    = (e.clientX - cx) / (rect.width  / 2);
        const dy    = (e.clientY - cy) / (rect.height / 2);
        const rotX  = (-dy * 5).toFixed(2);
        const rotY  = ( dx * 5).toFixed(2);
        card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform   = '';
        card.style.transition  = 'transform 0.4s ease';
        setTimeout(() => { card.style.transition = ''; }, 400);
    });
});


/* ─────────────────────────────────────────────
   13. BACK-TO-TOP BUTTON
   Appears after scrolling 400px.
───────────────────────────────────────────── */
const topBtn = document.createElement('button');
topBtn.id = 'back-to-top';
topBtn.innerHTML = '↑';
topBtn.title = 'Back to top';
Object.assign(topBtn.style, {
    position:       'fixed',
    bottom:         '28px',
    right:          '24px',
    width:          '40px',
    height:         '40px',
    borderRadius:   '50%',
    background:     'var(--orange, #E67E22)',
    color:          '#111',
    border:         'none',
    fontSize:       '1.1rem',
    fontWeight:     'bold',
    cursor:         'pointer',
    zIndex:         '9000',
    opacity:        '0',
    transform:      'translateY(12px)',
    transition:     'opacity 0.3s, transform 0.3s',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    boxShadow:      '0 4px 14px rgba(230,126,34,0.4)',
    pointerEvents:  'none',
    fontFamily:     'monospace',
});
document.body.appendChild(topBtn);

window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    topBtn.style.opacity       = show ? '1'    : '0';
    topBtn.style.transform     = show ? 'translateY(0)' : 'translateY(12px)';
    topBtn.style.pointerEvents = show ? 'all'  : 'none';
}, { passive: true });

topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ─────────────────────────────────────────────
   14. KEYBOARD SHORTCUT EASTER EGG
   Type "bahre" anywhere → surprise flash.
───────────────────────────────────────────── */
let eggBuffer = '';
const eggWord  = 'bahre';

document.addEventListener('keydown', e => {
    // Ignore if typing in an input
    if (['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
    eggBuffer += e.key.toLowerCase();
    if (eggBuffer.length > eggWord.length) eggBuffer = eggBuffer.slice(-eggWord.length);
    if (eggBuffer === eggWord) {
        eggBuffer = '';
        const flash = document.createElement('div');
        flash.textContent = '💡 , Mr.bãhRé ❥';
        Object.assign(flash.style, {
            position:      'fixed',
            top:           '50%',
            left:          '50%',
            transform:     'translate(-50%,-50%) scale(0.6)',
            background:    'var(--orange, #E67E22)',
            color:         '#111',
            padding:       '18px 36px',
            borderRadius:  '12px',
            fontFamily:    'monospace',
            fontSize:      '1.4rem',
            fontWeight:    'bold',
            zIndex:        '99999',
            pointerEvents: 'none',
            transition:    'transform 0.3s ease, opacity 0.5s ease 0.5s',
            opacity:       '0',
        });
        document.body.appendChild(flash);
        requestAnimationFrame(() => {
            flash.style.transform = 'translate(-50%,-50%) scale(1)';
            flash.style.opacity   = '1';
        });
        setTimeout(() => {
            flash.style.opacity   = '0';
            flash.style.transform = 'translate(-50%,-50%) scale(0.8)';
            setTimeout(() => flash.remove(), 500);
        }, 1400);
    }
});