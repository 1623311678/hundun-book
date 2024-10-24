document.addEventListener('DOMContentLoaded', function() {
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            const menu = document.getElementById('menu');
            buildMenu(menu, data);
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
            document.getElementById('content').innerHTML = marked.parse(data);
        });
}
