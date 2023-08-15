function showPage(url) {
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (screenWidth <= 800) {
        window.location.href = url;
    }
}