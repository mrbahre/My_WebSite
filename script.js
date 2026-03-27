const input = document.getElementById('terminal-input');
const history = document.getElementById('command-history');
const terminalContainer = document.getElementById('terminal-content');

// 1. جعل الـ Input نشطاً دائماً بمجرد تحميل الصفحة
window.onload = () => input.focus();

// 2. إذا ضغط المستخدم في أي مكان داخل الـ Terminal، يتم تفعيل الـ Input
document.addEventListener('click', () => {
    input.focus();
});

const commands = {
    'help': 'Available: whoami, status, skills, projects, clear, logs',
    'whoami': 'Mr.bãhRé | Frontend UI Architect | Gaming Enthusiast',
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
        } else if (fullCommand === 'projects') {
            window.location.href = 'projects.html';
        } else if (fullCommand === 'logs') {
            window.location.href = 'changelog.html';
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