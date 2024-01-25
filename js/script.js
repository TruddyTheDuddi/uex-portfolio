let currentImageIndex = 0;
let interval;
const images = ['1.webp', '2.webp', '4.webp', '5.webp', '6.webp', '7.webp'];

function setupCarousel() {
    const dotContainer = document.getElementById('dot-container');
    images.forEach((image, index) => {
        const img = new Image();
        img.src = `img/home/${image}`;

        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.addEventListener('click', () => changeImage(index, true));
        dotContainer.appendChild(dot);
    });
    changeImage(0, false);
}

function changeImage(index, resetInterval = false) {
    if (resetInterval) {
        clearInterval(interval);
        interval = setInterval(() => changeImage((currentImageIndex + 1) % images.length, false), 10000);
    }

    // Update the active dot
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    const imageContainer = document.getElementById('image-container');
    imageContainer.classList.remove('zoomed'); // Reset zoom
    // Fade out
    imageContainer.style.opacity = 0;
    // Change image after fade out
    setTimeout(() => {
        imageContainer.style.backgroundImage = `url('img/home/${images[index]}')`;
        // Fade in and apply zoom
        imageContainer.style.opacity = 1;
        setTimeout(() => imageContainer.classList.add('zoomed'), 100); // Slight delay before starting zoom
        currentImageIndex = index;
    }, 800);
}

setupCarousel();
interval = setInterval(() => changeImage((currentImageIndex + 1) % images.length, false), 5000);

document.getElementById('view-summary').addEventListener('click', function() {
    document.getElementById('introduction').classList.add('hidden');
    document.getElementById('desc').classList.add('hidden');
    document.getElementById('summary').classList.remove('hidden');
});