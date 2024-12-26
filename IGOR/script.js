document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme);
        themeIcon.src = currentTheme === 'dark-theme' ? 'dark-bulb.png' : 'light-bulb.png';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');

        if (body.classList.contains('dark-theme')) {
            themeIcon.src = 'dark-bulb.png';
            localStorage.setItem('theme', 'dark-theme');
        } else {
            themeIcon.src = 'light-bulb.png';
            localStorage.setItem('theme', '');
        }
    });
});