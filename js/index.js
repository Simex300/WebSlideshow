const headerControl = document.querySelector(".header-control");

// Events
document.querySelector(".control-frame").addEventListener('mousemove', e => {
    if(e.offsetY <= headerControl.clientHeight + 10)
        headerControl.classList.add("active");
    else 
        headerControl.classList.remove("active");
})