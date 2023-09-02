function redirectTo(url, event) {
    if (event.ctrlKey || event.metaKey) {
        window.open(url, '_blank'); // Open in a new tab or window
    } else {
        window.location.href = url; // Open in the same tab
    }
}