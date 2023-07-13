var numSlide = 1;

mostrarSlide(numSlide);

function mudarSlide(num_slide) {
  mostrarSlide((numSlide += num_slide));
}
function slideAtual(num_slide) {
  mostrarSlide((numSlide = num_slide));
}

function mostrarSlide(num_slide) {
  var slides = document.querySelectorAll(".slidekv"); //PEGA TODOS OS SLIDES
  var indicadores = document.querySelectorAll(".indicador"); //PEGA TODOS OS INDICADORES

  if (num_slide > slides.length) {
    //VAI PARA O PRIMEIRO SLIDE
    numSlide = 1;
  }

  if (num_slide < 1) {
    numSlide = slides.length; //VAI PARA O ULTIMO SLIDE
  }

  for (var i = 0; i < slides.length; i++) {
    slides[i].style.display = "none"; //OCULTA TODOS OS SLIDE
  }

  for (var i = 0; i < indicadores.length; i++) {
    indicadores[i].classList.remove("ativo"); //REMOVE A class="ativo" DE TODOS OS INDICADORES
  }
  // for(var i=0; i < indicadores.length;i++){
  //     indicadores[i].className = indicadores[i].className.replace(" ativo","");
  // }

  //######### OBS--> O -1 É PORQUE A PRIMEIRA POSIÇÃO DO ARREY É ZERO EX:[0,1,2,3]

  slides[numSlide - 1].style.display = "block"; //EXIBE SLIDE DE ACORDO COM A POSIÇÃO(INDICE)

  indicadores[numSlide - 1].classList.add("ativo"); //ADICIONA A class="ativo"
  //indicadores[numSlide-1].className += " ativo"
}


// setInterval(function(){
//     mudarSlide(1)
// },7000)
