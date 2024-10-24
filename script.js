document.addEventListener('DOMContentLoaded', function() {
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            const menu = document.getElementById('menu');
            buildMenu(menu, data);
        });

    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });
});

function buildMenu(parent, items) {
    items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.title;
        a.addEventListener('click', function(event) {
            event.preventDefault();
            loadContent(item.url);
        });
        li.appendChild(a);
        if (item.children) {
            const ul = document.createElement('ul');
            buildMenu(ul, item.children);
            li.appendChild(ul);
        }
        parent.appendChild(li);
    });
}

function loadContent(url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const content = document.getElementById('content');
            content.innerHTML = marked.parse(data);
            addCopyButtons();
        });
}

function addCopyButtons() {
    document.querySelectorAll('pre code').forEach((block) => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = '复制';
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent).then(() => {
                button.textContent = '已复制';
                setTimeout(() => {
                    button.textContent = '复制';
                }, 2000);
            });
        });
        block.parentNode.appendChild(button);
    });
}
