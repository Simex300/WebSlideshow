const headerControl = document.querySelector(".header-control");
const img = document.querySelector(".img-frame > img");
const body = document.querySelector("body");
const maxZoom = 2;
const minZoom = 1;
const scaleRate = .25;

// Variables
var transforms = [];
var currScale = 1;
var isMoving = false;
var movementEventExecution = 0;
var mouseMovement = {"initialX": 0, "initialY": 0, "x": 0, "y": 0};
var rotationTime = 0;

// Settings option 
const options = {
    "darkmode": false,
    "imageDuration": 3,
    "allowGif": false,
    "gifDuration": 3,
    "videoRepeat": false,
    "repeatTimes": 1
}

// Img Changes
const imgList = [
    "https://i.redd.it/1uugn0orwvn71.png",
    "https://preview.redd.it/t05f1pwxnqn71.jpg?width=2250&format=pjpg&auto=webp&s=16580db26b3b6f83a4c6bb82f9e348da8fdf81c0",
    "https://preview.redd.it/xb0p0r26oqn71.jpg?width=2250&format=pjpg&auto=webp&s=0857950f466c777818a2d59638ecd2d75cf5d8ba",
    "https://preview.redd.it/9j3t5xl6oqn71.jpg?width=2250&format=pjpg&auto=webp&s=b3e7d262d20ce79c2c38ab986c6608a038a7c9bb",
    "https://preview.redd.it/t40ac2wt0xn71.jpg?width=2250&format=pjpg&auto=webp&s=8b8f3637b011d3c4884ee5be8e1e1f3132ba571a",
    "https://preview.redd.it/cdea44wt0xn71.jpg?width=2250&format=pjpg&auto=webp&s=d4220e0b40f1e3dc5b5a18afbce3c8aaa02bd479",
    "https://preview.redd.it/13smf5wt0xn71.jpg?width=2250&format=pjpg&auto=webp&s=e95e6e6b31696a17d9ab72ba002b9c33275c6302",
    "https://preview.redd.it/bg56p7wt0xn71.jpg?width=2250&format=pjpg&auto=webp&s=30a55ac96147d8a53adcd8466127218ca0e250ae",
    "https://i.redd.it/ofer0dtqion71.jpg"
];
var currImg = 0;

// Slideshow
var isSlideshow = false;
var slideshowInterval;

// Functions
function checkScale() {
    if(currScale > maxZoom)
        currScale = maxZoom
    if(currScale < minZoom)
        currScale = minZoom
}

function resetImageMovement(fullReset = false) {
    mouseMovement.initialX = 0;
    mouseMovement.initialY = 0;
    movementEventExecution = 0;
    if (fullReset) {
        mouseMovement.x = 0;
        mouseMovement.y = 0;
        resetTranslate();
    }
}

function toggleHeader(e) {
    if(e.y <= headerControl.clientHeight + 10)
        headerControl.classList.add("active");
    else 
        headerControl.classList.remove("active");
}

function zoomImage() {
    let existingTransform = transforms.find(el => el.includes("scale"));
    let transform = `scale(${currScale},${currScale})`
    if(existingTransform){
        let index = transforms.indexOf(existingTransform);
        transforms[index] = transform
    }
    else {
        transforms.push(transform)
    }
    img.style.transform = transforms.join(" ");
}

function translateImage(e) {
    const isHorizontal = rotationTime % 2 != 0;
    if(isHorizontal) {
        if(img.offsetWidth * currScale > window.innerHeight)
            mouseMovement.y = e.offsetY - mouseMovement.initialY;
        if(img.offsetHeight * currScale > window.innerWidth)
            mouseMovement.x = e.offsetX - mouseMovement.initialX;    
    }
    else {
        if(img.offsetWidth * currScale > window.innerWidth)
            mouseMovement.x = e.offsetX - mouseMovement.initialX;
        if(img.offsetHeight * currScale > window.innerHeight)
            mouseMovement.y = e.offsetY - mouseMovement.initialY;
    }
    movementEventExecution++;

    if (movementEventExecution > 40 && (mouseMovement.x != 0 || mouseMovement.y != 0)) {
        let existingTransform = transforms.find(el => el.includes("translate"));
        let newTransform = `translate(${mouseMovement.x}px,${mouseMovement.y}px)`;
        movementEventExecution = 0;
        if(existingTransform) {
            let index = transforms.indexOf(existingTransform);
            transforms[index] = newTransform;
        }
        else {
            transforms.push(newTransform);
        }

        img.style.transform = transforms.join(" ");
    }
}

function resetTranslate() {
    let existingTransform = transforms.find(el => el.includes("translate"));
    let newTransform = `translate(${0}px,${0}px)`;
    if(existingTransform) {
        let index = transforms.indexOf(existingTransform);
        transforms[index] = newTransform;
    }
    else {
        transforms.push(newTransform);
    }
    img.style.transform = transforms.join(" ");
}

function toggleFullscreen() {
    if (document.fullscreenElement !== null) {
        document.exitFullscreen()
        isSlideshow = false;
        clearInterval(slideshowInterval);
    }
    else {
        body.requestFullscreen().then(() => {
            // Turn on slideshow
            isSlideshow = true;
            slideshowInterval = slideshow();
        })
    }
}

function slideshow() {
    return setInterval(nextImage, 1000 * 3)
}

function togglePrint() {
    const imgFrame = img.parentElement;
    if(!imgFrame.classList.contains("print")) {
        imgFrame.classList.add("print");
    }
    else {
        imgFrame.classList.remove("print");
    }
}

function loadBackground() {
    const src = img.src;
    const backframe = document.querySelector(".backframe");
    backframe.style.backgroundImage = `url('${src}')`;
}

function loadImage() {
    img.src = imgList[currImg];
    loadBackground();
}

function previousImage() {
    currImg--;
    if(currImg < 0) {
        currImg = 0;
    }
    else {
        loadImage();
    }
}

function nextImage() {
    currImg++;
    if(currImg > imgList.length - 1) {
        if(isSlideshow) {
            currImg = 0;
            loadImage();
        }
        else {
            currImg = imgList.length - 1;
        }
    }
    else {
        loadImage();
    }
}

function toggleModal() {
    const modal = document.querySelector(".option-modal");
    if (!modal.classList.contains("active")){
        modal.classList.add("active");
    }
    else {
        modal.classList.remove("active");
    }
}

function changeOption(e) {
    if(e.target.type == "checkbox")
        options[e.target.name] = !options[e.target.name];
    else {
        if (typeof options[e.target.name] == "number")
            options[e.target.name] = parseInt(e.target.value);
        else 
            options[e.target.name] = e.target.value;
    }
}

// Events
window.addEventListener("load", e => {
    loadImage();
});

document.querySelector(".control-frame").addEventListener('mousemove', e => {
    e.stopPropagation();
    toggleHeader(e);
    if(isMoving)
        translateImage(e);
})

document.querySelector(".control-frame").addEventListener("mousedown", e => {
    mouseMovement.initialX = e.offsetX - mouseMovement.x;
    mouseMovement.initialY = e.offsetY - mouseMovement.y;
    isMoving = true;
})

document.querySelector(".control-frame").addEventListener("mouseup", e => {
    resetImageMovement();
    isMoving = false;
})


document.querySelector("#zoom-in").addEventListener("click", e => {
    currScale += scaleRate;
    checkScale();
    resetImageMovement(true);
    zoomImage();
})

document.querySelector("#zoom-out").addEventListener("click", e => {
    currScale -= scaleRate;
    checkScale();
    resetImageMovement(true);
    zoomImage();
})

document.querySelector("#rotate").addEventListener("click", e => {
    rotationTime++;
    let rotation = 90 * rotationTime;

    let existingTransform = transforms.find(el => el.includes("rotate"));
    let newTransform = `rotate(${rotation}deg)`;

    if(existingTransform) {
        let index = transforms.indexOf(existingTransform);
        transforms[index] = newTransform;
    }
    else {
        transforms.push(newTransform);
    }

    img.style.transform = transforms.join(" ");
})

document.querySelector("#slideshow").addEventListener("click", e => {
    toggleFullscreen();
})

document.querySelector("#print").addEventListener("click", e => {
    togglePrint();
    window.print();
})

document.querySelector("#configuration").addEventListener("click", e => {
    toggleModal();
})

document.querySelector(".left-side").addEventListener("click", e => {
    previousImage();
})

document.querySelector(".right-side").addEventListener("click", e => {
    nextImage();
})

document.querySelector(".option-modal").addEventListener("click", e => {
    e.stopPropagation();
    if(e.target.classList.contains("option-modal"))
        toggleModal();
}, useCapture = true)

document.querySelector("#modal-close").addEventListener("click", e => {
    e.stopPropagation();
    toggleModal();
})

document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("change", changeOption);
})

// Window Stuff
window.onafterprint = togglePrint;