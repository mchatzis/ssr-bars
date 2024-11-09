(function () {
    try {
        var theme;
        const savedTheme = sessionStorage.getItem('theme');
        if (savedTheme) {
            theme = savedTheme;
        } else {
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDarkMode ? 'dark' : 'light';
            sessionStorage.setItem('theme', theme)
        }
        document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
        console.error("Theme initialization failed", e);
    }
})();