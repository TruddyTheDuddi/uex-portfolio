document.addEventListener('DOMContentLoaded', function() {
    const images = document.getElementsByTagName('img');
    const totalImages = images.length;
    let loadedImages = 0;

    const updateLoadedCount = () => {
        document.querySelector('.loaded').textContent = `(Loaded Images: ${loadedImages} / ${totalImages})`;
    };

    Array.from(images).forEach(img => {
        img.addEventListener('load', () => {
            loadedImages++;
            updateLoadedCount();
        });

        // Check if the image is already loaded (cached images)
        if (img.complete) {
            loadedImages++;
            updateLoadedCount();
        }
    });

    // Initial update
    updateLoadedCount();
});


const mainContent = document.getElementById('main');
const projectElements = document.querySelectorAll('.project');
const circleElements = document.querySelectorAll('.circle');

let timeout;
circleElements.forEach(circle => {
    circle.addEventListener('click', function() {
        // Start by scrolling to the top of the page smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Start by fading out current content
        mainContent.classList.add('transition');

        // Reset all circles to inactive and set the clicked one as active
        circleElements.forEach(c => c.classList.remove('active'));
        this.classList.add('active');

        // Clear any existing timeouts
        if (timeout) {
            clearTimeout(timeout);
        }

        // Wait for the fade-out transition to complete
        timeout = setTimeout(() => {
            // Hide all projects
            projectElements.forEach(p => p.style.display = 'none');

            // Display the selected project
            const selectedProject = document.querySelector(this.getAttribute('data-project'));
            selectedProject.style.display = 'grid';

            // Fade in the new content
            mainContent.classList.remove('transition');
        }, 1000); // This duration should match the CSS transition time
    });
});

// Function to handle mouse movement and adjust the position of the selector bar
function handleMouseMove(event) {
    const { clientX } = event;
    const width = window.innerWidth;
    const midPoint = width / 2;
    const fractionFromCenter = (clientX - midPoint) / midPoint;

    // Calculate the amount of translation
    const maxTranslation = 10; // Maximum translation in pixels
    const translation = -maxTranslation * fractionFromCenter;

    // Apply the translation to the selector bar
    const selectorBar = document.querySelector('.circle-holder');
    selectorBar.style.transform = `translateX(${translation}px)`;
}

// Attach the event listener to the window for mouse movement
// window.addEventListener('mousemove', handleMouseMove);

// On load, get the height of the footer element and set the bottom attribute of the selector-bar to that negative value
mainContent.classList.remove('transition');
window.onload = () => {
    // Get intro element and remove loading
    const intro = document.getElementById('intro');
    intro.classList.remove('loading');
    
    // Fade in the main content
    const footerHeight = document.querySelector('footer').offsetHeight + 2;
    const selectorBar = document.querySelector('.selector-bar');
    // Don't trigger animation of bottom attribute
    selectorBar.style.bottom = `-${footerHeight}px`;

    // Show selector bar after a short delay
    setTimeout(() => {
        selectorBar.classList.add('show');

        // Set select project to loading id
        const loadingProject = document.getElementById('loading');
        loadingProject.innerHTML = 'SELECT A PROJECT,';
    }, 10);

    // When clicking #show-footer-btn, toogle show-footer class to selectorBar
    const showFooterBtn = document.getElementById('show-footer-btn');
    showFooterBtn.addEventListener('click', () => {
        selectorBar.classList.toggle('show-footer');
    });
};

// Parallax scroll effect on all header
function parallax() {
    const headlines = document.querySelectorAll('.scrollable');
    
    headlines.forEach(headline => {
        const speed = 0.5
        const yPos = -(window.scrollY * speed);
        headline.style.backgroundPosition = `center ${yPos}px`;
    });
}

// Listen for scroll event
window.addEventListener('scroll', parallax);


// Prompt weights interaction
let data = [
    [2.0, 0.3, 1.5, 2.0, 0.1],
    [2.0, 0.1, 2.0, 1.1, 0.1],
    [2.0, 2.0, 0.1, 0.9, 0.1],
    [2.0, 1.1, 1.1, 0.1, 2.0],
    [2.0, 0.7, 0.3, 0.5, 0.7],
    [2.0, 1.5, 2.0, 1.5, 2.0]
];



let animationFrames = {}; // To store ongoing animation frame IDs

function animateWeightChange(element, start, end, index) {
    let current = start;
    let animationFrameId = animationFrames[index];

    // Cancel previous animation if it's still running
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min(1, (timestamp - startTimestamp) / 1000); // Normalized progress (0 to 1)
        current = start + (end - start) * (1 - Math.pow(1 - progress, 2)); // Quadratic ease-out formula

        if (progress < 1) {
            element.textContent = (current / 2).toFixed(1); // Normalize value to range 0-1
            animationFrames[index] = requestAnimationFrame(step);
        } else {
            element.textContent = (end / 2).toFixed(1); // Ensure final value is set and normalized
        }
    }

    let startTimestamp = null;
    animationFrames[index] = requestAnimationFrame(step);
}

let noticed = false;
document.getElementById('slider').addEventListener('input', function() {
    const sliderValue = parseInt(this.value);
    const promptParts = document.querySelectorAll('.prompt-part');

    if (!noticed && sliderValue !== 0) {
        const noticeImages = document.querySelectorAll('.notice');
        noticeImages.forEach(img => img.classList.remove('notice'));
        noticed = true;
    }

    promptParts.forEach((part, index) => {
        const weightSpan = part.querySelector('.weight');
        const newWeight = (sliderValue > 0) ? data[sliderValue - 1][index] : 2;
        const currentWeight = (parseFloat(weightSpan.textContent) || 1) * 2; // Adjust for normalized range

        animateWeightChange(weightSpan, currentWeight, newWeight, index);

        const opacity = Math.min(newWeight / 2, 1); // Normalize opacity between 0 and 1
        part.style.opacity = opacity;
    });

    // Update image opacities
    document.querySelectorAll('.image').forEach((img, index) => {
        img.style.opacity = (sliderValue === 0 || index === sliderValue - 1) ? 1 : 0.2;
        // Set transition to zero seconds if the image index matches the slider value
        img.style.transition = (index === sliderValue - 1) ? '0s' : '0.2s';
    });
});

// Initialize with the first image selected
document.getElementById('slider').dispatchEvent(new Event('input'));


function updateParallax() {
    const caveboxes = document.querySelectorAll('#cavebox');

    caveboxes.forEach(cavebox => {
        const elementOffsetTop = cavebox.offsetTop; // Position relative to the document
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Calculate the parallax effect
        const parallaxSpeed = -0.5; // Adjust this for a stronger or weaker effect
        const offset = (elementOffsetTop - scrollY) * parallaxSpeed - 100;

        // Apply the parallax background position
        cavebox.style.backgroundPosition = `center ${offset}px`;
    });
}

function updateParallaxElements() {
    const parallaxElements = document.querySelectorAll('.parascroll');

    parallaxElements.forEach(element => {
        // Calculate the vertical center of the viewport
        const viewportCenter = window.innerHeight / 2;

        // Get the element's position relative to the viewport
        const elementRect = element.getBoundingClientRect();

        // Calculate the offset of the element's center from the viewport center
        const elementCenter = elementRect.top + elementRect.height / 2;
        const offsetFromViewportCenter = elementCenter - viewportCenter;

        // Get the parallax factor from the element's data attribute
        const parallaxFactor = parseFloat(element.getAttribute('data-scroll-speed')) || 0;

        // Calculate the translateY value
        let translateY = -offsetFromViewportCenter * parallaxFactor;

        // Apply the transform
        element.style.transform = `translateY(${translateY}px)`;
    });
}

// Attach the function to scroll event
window.addEventListener('scroll', updateParallaxElements);
window.addEventListener('scroll', updateParallax);

// Initialize the parallax effect
updateParallaxElements();
updateParallax();


// Generation of content for slideshow project 6
let proj6 = [
    {
        name: 'An empty stadium at night',
        desc: 'We need to consider the restrictions of a stadium in Gurzelen (at night). We made sure that our base image contained monutains, a forest in the background, and a relatively well mainted but empty stadium field.',
        img: [
            "img/p6/field_night.webp",
        ],
        parentImg: []
    },
    {
        name: 'Colorful and lively marketplaces',
        desc: 'We are taking inspiration from markeplaces with many various colors, and the presence of many people.',
        img: [
            "img/p6/market.webp",
        ],
        parentImg: []
    },
    {
        name: 'Translucent colorful & warm fabrics',
        desc: 'Inspired by Andrew Kudless, we use farbics to create a warm and spectuacular look.',
        img: [
            "img/p6/fabric_close.webp",
            "img/p6/fabric.webp",
        ],
        parentImg: []
    },
    {
        name: 'Graffiti, symbol of urban culture',
        desc: 'Graffitis emobdy the urban culture and art. We use this style to make the place pop, bending shapes and colors.',
        img: [
            "img/p6/graffiti.webp",
        ],
        parentImg: []
    },
    {
        name: 'Scaffoldings as temporal structure',
        desc: 'We use scaffoldings to create a structure that will hold the fabric and the lights. They represent a sense of temporality which fits perfectly in our case.',
        img: [
            "img/p6/scaffolding.webp",
        ],
        parentImg: []
    },
    {
        name: 'Bars and restaurants',
        desc: "Center of the nightlife, bars and restaurants are a great source of inspiration. We use the lights and the colors to create a warm and welcoming atmosphere.",
        img: [
            "img/p6/bar.webp",
            "img/p6/bar2.webp",
        ],
        parentImg: []
    },
    {
        name: 'Graffit scaffoldings',
        desc: 'Combining the scaffoldings and the graffiti\'s style, created a funky and colorful base for our building.',
        img: [
            "img/p6/graffiti_build.webp",
            "img/p6/graffiti_build2.webp",
        ],
        parentImg: [3,4]
    },
    {
        name: 'Farbics on scaffolding',
        desc: 'The combination of fabrics with scaffoldings give a sense of privacy, while keeping the place feeling open and safe.',
        img: [
            "img/p6/fabric_build.webp",
        ],
        parentImg: [2,6,4]
    },
    {
        name: 'Lively lounge bars',
        desc: 'We combine the colorful atmosphere of the hubs with the lounges and bars to keep people entertained and relaxed.',
        img: [
            "img/p6/build1.webp",
            "img/p6/build2.webp",
            "img/p6/build3.webp",
        ],
        parentImg: [5,7]
    },
    {
        name: 'People & festivals',
        desc: 'Combining the lively atmopshere of the marketplace with many people and the our colorful places, we create a place where people can meet and have fun.',
        img: [
            "img/p6/wide_test.webp",
            "img/p6/build4.webp",
        ],
        parentImg: [1,8]
    },
    {
        name: 'Finalizing in the context of the stadium',
        desc: 'We place our building in the context of the stadium, making sure it fits in the environment and its temporary aspect.',
        img: [
            "img/p6/final_narrow.webp",
            "img/p6/final.webp",
        ],
        parentImg: [0,9]
    }
];

// Load all images in the cache
// proj6.forEach(project => {
//     project.img.forEach(src => {
//         const img = new Image();
//         img.src = src;
//     });
// });


let currentSlideIndex = 0;
let contentTimeout, imagesTimeout, parentTimeout;

function updateSlide() {
    const project = proj6[currentSlideIndex];

    // Clear existing timeouts
    clearTimeout(contentTimeout);
    clearTimeout(imagesTimeout);
    clearTimeout(parentTimeout);

    // Apply fade-out effect to text
    const textElement = document.getElementById('text');
    textElement.classList.add('fade-out');

    // Update content after fade-out
    contentTimeout = setTimeout(() => {
        // Update Title
        document.getElementById('title').innerHTML = `<small>${currentSlideIndex + 1}.</small> ${project.name}`;

        // Update Description
        document.getElementById('desc').textContent = project.desc;

        // Remove fade-out class
        textElement.classList.remove('fade-out');
    }, 700);

    // Update Images with Fade Effect
    const imagesContainer = document.getElementById('images');
    imagesContainer.classList.add('transition');
    imagesTimeout = setTimeout(() => {
        imagesContainer.innerHTML = ''; // Clear current images
        project.img.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            imagesContainer.appendChild(img);
        });
        imagesContainer.classList.remove('transition');
    }, 500);

    // Update Parent Concepts
    const parentConceptsContainer = document.getElementById('parent-contepts');
    parentConceptsContainer.classList.add('fade-out');

    parentTimeout = setTimeout(() => {
        parentConceptsContainer.innerHTML = ''; // Clear current parent concepts
        parentConceptsContainer.classList.remove('fade-out');

        project.parentImg.forEach((parentIndex, idx) => {
            const parentProject = proj6[parentIndex];
            const conceptDiv = document.createElement('div');
            conceptDiv.classList.add('concept', 'fade-out');
            conceptDiv.innerHTML = `
                <h3>${parentProject.name}</h3>
                <div class="concept-imgs">
                    ${parentProject.img.map(src => `<img src="${src}" alt="">`).join('')}
                </div>`;
            conceptDiv.addEventListener('click', () => { currentSlideIndex = parentIndex; updateSlide(); });

            // Append with a delay for cascade effect
            setTimeout(() => {
                parentConceptsContainer.appendChild(conceptDiv);
                conceptDiv.classList.remove('fade-out');
            }, idx * 200); // Each subsequent element has a longer delay
        });
    }, 1000);

    // Set the active dot in #range to the current slide
    const dots = range.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlideIndex);
    });

}

// Navigation Event Listeners
document.getElementById('prev').addEventListener('click', () => {
    currentSlideIndex = Math.max(0, currentSlideIndex - 1);
    updateSlide();
});

document.getElementById('next').addEventListener('click', () => {
    currentSlideIndex = Math.min(proj6.length - 1, currentSlideIndex + 1);
    updateSlide();
});

// For every project, create a dot in #range
const range = document.getElementById('range');
proj6.forEach((project, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.addEventListener('click', () => {
        currentSlideIndex = index;
        updateSlide();
    });
    range.appendChild(dot);
});

// Initial Update
updateSlide();
