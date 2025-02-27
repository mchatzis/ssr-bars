(function () {
    try {
        let theme;
        const savedTheme = sessionStorage.getItem('theme');
        if (savedTheme) {
            theme = savedTheme;
        } else {
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDarkMode ? 'dark' : 'light';
            sessionStorage.setItem('theme', theme);
        }
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    } catch (e) {
        console.error("Theme initialization failed", e);
    }
})();
