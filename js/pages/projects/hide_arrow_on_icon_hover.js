var icons = document.getElementsByClassName('icons');
var down_arrow = document.getElementById('down_arrow');
var arrow_text = document.getElementById('arrow_text');
// I used var here instead of const, because we are rerunning the script using swup (the thing that gives us these cool webpage transitions) script plugin
// after coming back to this webpage. This could probably be fixed in a more professional way, but i'm too lazy to do that =)


for (let i = 0; i < icons.length; i++) {
    icons[i].addEventListener('mouseover', () => {
        down_arrow.style.opacity = 0;
        arrow_text.style.opacity = 0;
    });

    icons[i].addEventListener('mouseout', () => {
        down_arrow.style.opacity = 1;
        arrow_text.style.opacity = 1;
    });
}