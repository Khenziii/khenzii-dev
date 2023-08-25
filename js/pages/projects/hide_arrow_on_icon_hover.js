const icons = document.getElementsByClassName('icons');
const down_arrow = document.getElementById('down_arrow');

for (let i = 0; i < icons.length; i++) {
    icons[i].addEventListener('mouseover', () => {
        down_arrow.style.opacity = 0;
    });

    icons[i].addEventListener('mouseout', () => {
        down_arrow.style.opacity = 1;
    });
}
