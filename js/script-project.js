const circleRadius = 200; // Half of the container size
const dotRadius = 80; // Half of the dot size
const center = { x: circleRadius, y: circleRadius };
const numberOfDots = 6;
const angleStep = 360 / numberOfDots;

document.querySelectorAll('.dot').forEach((dot, index) => {
    const angle = angleStep * index;
    const radians = angle * Math.PI / 180;
    dot.style.left = (center.x + circleRadius * Math.cos(radians) - dotRadius) + 'px';
    dot.style.top = (center.y + circleRadius * Math.sin(radians) - dotRadius) + 'px';

    dot.addEventListener('mouseover', function() {
        const tooltip = document.querySelector('.tooltip');
        tooltip.textContent = this.getAttribute('data-title');
        tooltip.style.top = (this.offsetTop - tooltip.offsetHeight - 5) + 'px';
        tooltip.style.left = (this.offsetLeft - tooltip.offsetWidth / 2 + 15) + 'px';
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = 1;
    });

    dot.addEventListener('mouseout', function() {
        const tooltip = document.querySelector('.tooltip');
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = 0;
    });
});
