let slider = document.querySelector('.slider');

let slides = document.querySelectorAll('.slide');

let index = 0;

function showSlide(){

slider.style.transform =
`translateX(-${index * 100}%)`;

}

function nextSlide(){

index++;

if(index >= slides.length){

index = 0;

}

showSlide();

}

function prevSlide(){

index--;

if(index < 0){

index = slides.length - 1;

}

showSlide();

}