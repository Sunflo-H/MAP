const hamberger = document.querySelector('.hamberger-container');
const menubar = document.querySelector('#menu-bar');
const menuWeatherContainer = menubar.querySelector('.menu-weather-container');
const menucontaineres = menubar.querySelectorAll('.menu-container');
const closeBtn = menubar.querySelector('.close i');
const color = {
    blue : "#258fff",
    white : "#ffffff"
}
menuWeatherContainer.addEventListener('mouseenter',e => {
    
});

menucontaineres.forEach(menucontainer => {
     menucontainer.addEventListener('mouseenter', e => {
         const text = e.target.querySelector('span');
        e.target.style.backgroundColor = `${color.white}`;
        text.style.color = `${color.blue}`;
    });
});

menucontaineres.forEach(menucontainer => {
     menucontainer.addEventListener('mouseleave', e => {
        const text = e.target.querySelector('span');
        e.target.style.backgroundColor = `${color.blue}`;
        text.style.color = `${color.white}`;
    });
});

hamberger.addEventListener('click', () => {
    menubar.classList.remove('hide');
});

closeBtn.addEventListener('click', () => {
    menubar.classList.add('hide');
})
