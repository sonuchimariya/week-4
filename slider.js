
const slider = document.querySelector(".slider");
const track = slider.querySelector(".slider-track");
const prevButton = slider.querySelector(".prev");
const nextButton = slider.querySelector(".next");
const dotsContainer = slider.querySelector(".slider-dots");

const originalSlides = Array.from(track.children);
const totalSlides = originalSlides.length;

let currentIndex = 1;
let isAnimating = false;

// Create copies of the first and last slides.
const firstClone = originalSlides[0].cloneNode(true);
const lastClone = originalSlides[totalSlides - 1].cloneNode(true);

firstClone.setAttribute("aria-hidden", "true");
lastClone.setAttribute("aria-hidden", "true");

track.prepend(lastClone);
track.append(firstClone);

// Start at the first real slide.
function updatePosition(animate = true) {
    track.style.transition = animate
        ? "transform 0.5s ease-in-out"
        : "none";

    track.style.transform =
        `translateX(-${currentIndex * 100}%)`;
}

// Create one dot for each original slide.
originalSlides.forEach((slide, index) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.setAttribute("aria-label", `Go to image ${index + 1}`);

    dot.addEventListener("click", () => {
        if (isAnimating) return;

        currentIndex = index + 1;
        isAnimating = true;

        updatePosition();
        updateDots();
    });

    dotsContainer.appendChild(dot);
});

// Highlight the currently selected dot.
function updateDots() {
    const dots = dotsContainer.querySelectorAll("button");
    const activeIndex = (currentIndex - 1 + totalSlides)
        % totalSlides;

    dots.forEach((dot, index) => {
        const isActive = index === activeIndex;

        dot.classList.toggle("active", isActive);

        if (isActive) {
            dot.setAttribute("aria-current", "true");
        } else {
            dot.removeAttribute("aria-current");
        }
    });
}

// Move to the next image.
nextButton.addEventListener("click", () => {
    if (isAnimating) return;

    currentIndex++;
    isAnimating = true;

    updatePosition();
    updateDots();
});

// Move to the previous image.
prevButton.addEventListener("click", () => {
    if (isAnimating) return;

    currentIndex--;
    isAnimating = true;

    updatePosition();
    updateDots();
});

// Handle the infinite-loop boundaries.
track.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "transform") return;

    if (currentIndex === totalSlides + 1) {
        currentIndex = 1;
        updatePosition(false);
    }

    if (currentIndex === 0) {
        currentIndex = totalSlides;
        updatePosition(false);
    }

    updateDots();
    isAnimating = false;
});

// Recalculate the position if the window size changes.
window.addEventListener("resize", () => {
    updatePosition(false);
});

// Initialize the slider.
updatePosition(false);
updateDots();
