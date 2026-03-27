const input = document.getElementById('terminal-input');
const history = document.getElementById('command-history');

// مصفوفة الأوامر المتاحة
const commands = {
    'help': 'Available commands: [whoami, status, skills, projects, clear, help]',
    'whoami': 'Mr.bãhRé | Frontend UI Architect | Bot Ops',
    'status': 'Root access enabled. Building slick, performant web experiences.',
    'skills': '[ SUCCESS ] HTML5, CSS Grid/Flexbox, JavaScript ES6+, Discord API.',
    'projects': 'Redirecting to /The_Lab_ ... (or type "ls" to see names)',
    'ls': 'Solar-System, Dynamic-Hovering, AVATR, Dashboard, Mini-game.'
};

input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const fullCommand = input.value.trim().toLowerCase();
        
        // 1. إضافة الأمر المكتوب للتاريخ
        const line = document.createElement('p');
        line.innerHTML = `<span class="prompt">$</span> ${fullCommand}`;
        history.appendChild(line);

        // 2. معالجة الأمر
        if (fullCommand === 'clear') {
            history.innerHTML = '';
        } else if (fullCommand === 'projects') {
            window.location.href = 'projects.html'; // الانتقال لصفحة المختبر
        } else if (commands[fullCommand]) {
            const response = document.createElement('p');
            response.className = 'response';
            response.innerText = commands[fullCommand];
            history.appendChild(response);
        } else if (fullCommand !== "") {
            const error = document.createElement('p');
            error.className = 'response';
            error.innerText = `Command not found: ${fullCommand}. Type 'help' for assistance.`;
            history.appendChild(error);
        }

        // 3. تصفير الإدخال والنزول للأسفل
        input.value = '';
        window.scrollTo(0, document.body.scrollHeight);
    }
});

// إبقاء التركيز على الـ Input دائماً
document.addEventListener('click', () => input.focus());