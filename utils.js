export function moveButton() {
    const button = document.getElementById('noButton');
    const maxWidth = window.innerWidth - button.offsetWidth;
    const maxHeight = window.innerHeight - button.offsetHeight;
    
    const x = Math.max(0, Math.min(Math.random() * maxWidth, maxWidth));
    const y = Math.max(0, Math.min(Math.random() * maxHeight, maxHeight));
    
    button.style.position = 'fixed';
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
}