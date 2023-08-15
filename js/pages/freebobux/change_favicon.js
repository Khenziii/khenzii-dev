// stole this code from badapple.mov (sorry!)
// go check them out :)

const video = document.querySelector("video");
const unmuteButton = document.getElementById("unmutebutton")

favicon = document.querySelector("link[rel='icon']"),
canvas = document.createElement("canvas"),
ctx = canvas.getContext('2d');

function screenshotToFavicon() {
    const size = video.videoHeight,
    widthCrop = (video.videoWidth - video.videoHeight) / 2;
    canvas.width = 64;
    canvas.height = 64;
    ctx.drawImage(video, widthCrop, 0, size, size, 0, 0, canvas.width, canvas.height);
    favicon.href = canvas.toDataURL();
}

setInterval(() => { if (!video.paused) screenshotToFavicon(); }, 100);

video.onclick = () => (video.muted = false);

unmuteButton.addEventListener("click", () => {
    video.muted = false;
    unmuteButton.remove();
}, { once: true });