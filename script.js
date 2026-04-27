const input = document.getElementById('terminal-input');
const history = document.getElementById('command-history');
const terminalContainer = document.getElementById('terminal-content');

window.onload = () => input.focus();
document.addEventListener('click', () => {
    input.focus();
});

const commands = {
    'help': 'Available: whoami, status, skills, projects, clear, logs',
    'whoami': ', Mr.bãhRé | Frontend UI/UX Architect | Body Builder ',
    'status': 'System: Active. Exploring new frontend horizons.',
    'skills': 'HTML5, CSS3 (Grid/Flex), JS, Git, UI/UX Design.',
    'logs': 'Redirecting to System Logs...',
    'projects': 'Redirecting to The Lab...'
};

input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const fullCommand = input.value.trim().toLowerCase();
        
        // إضافة السطر المكتوب للتاريخ
        const line = document.createElement('p');
        line.innerHTML = `<span class="prompt">$</span> <span style="color:white">${fullCommand}</span>`;
        history.appendChild(line);

        // تنفيذ الأوامر
        if (fullCommand === 'clear') {
            history.innerHTML = '';
        } else if (fullCommand === 'home') {
            window.location.href = 'index.html';
        } else if (fullCommand === 'lab') {
            window.location.href = 'lab.html';
        } else if (fullCommand === 'contact'){
            window.location.href = 'contact.html';
        } else if (commands[fullCommand]) {
            const response = document.createElement('p');
            response.className = 'response';
            response.style.color = 'var(--text-secondary)';
            response.innerText = commands[fullCommand];
            history.appendChild(response);
        } else if (fullCommand !== "") {
            const error = document.createElement('p');
            error.style.color = 'red';
            error.innerText = `Unknown command: ${fullCommand}`;
            history.appendChild(error);
        }

        input.value = '';
        // التمرير للأسفل تلقائياً
        window.scrollTo(0, document.body.scrollHeight);
    }
});
/*---------------------the blog and posts functionality---------------------*/

 // Reading progress bar
        window.addEventListener('scroll', () => {
            const doc = document.documentElement;
            const scrollTop = doc.scrollTop || document.body.scrollTop;
            const scrollHeight = doc.scrollHeight - doc.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            document.getElementById('read-progress').style.width = progress + '%';
        });

        // Active TOC highlight
        const sections = document.querySelectorAll('article section');
        const tocLinks = document.querySelectorAll('.toc-list a');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    tocLinks.forEach(a => {
                        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, { rootMargin: '-30% 0px -60% 0px' });

        sections.forEach(s => observer.observe(s));






/*--------------------------------The lab filter functionality----------------------------*/ 

        const filterBtns = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.project-card');
        const countEl = document.getElementById('result-count');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                let visible = 0;

                cards.forEach(card => {
                    const tags = card.dataset.tags || '';
                    const tagArray = tags.toLowerCase().split(/\s+/).filter(tag => tag);
                    if (filter === 'all' || tagArray.includes(filter.toLowerCase())) {
                        card.classList.remove('hidden');
                        visible++;
                    } else {
                        card.classList.add('hidden');
                    }
                });

                countEl.textContent = visible;
            });
        });



 