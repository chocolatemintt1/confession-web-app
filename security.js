// Disable right-click
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Disable F12 key
document.onkeydown = function (e) {
    if (e.keyCode == 123) {
        return false;
    }
};

// Disable Ctrl+Shift+I
document.onkeydown = function (e) {
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
};

// Disable Ctrl+U
document.onkeydown = function (e) {
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
};