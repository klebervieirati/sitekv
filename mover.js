// Registra o plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger, Draggable);

// Restaura a posição salva ou usa posição padrão
const savedPosition = JSON.parse(localStorage.getItem('imagePosition')) || { x: 0, y: 0, rotation: 0 };

// Aplica a posição salva
gsap.set("#home img", { 
    x: savedPosition.x,
    y: savedPosition.y,
    rotation: savedPosition.rotation,
    cursor: "grab"
});

// Configuração do Draggable para a imagem
Draggable.create("#home img", {
    type: "x,y",
    bounds: window,
    inertia: true,
    onDragStart: function() {
        gsap.to(this.target, { scale: 1.1, duration: 0.3 });
    },
    onDragEnd: function() {
        gsap.to(this.target, { scale: 1, duration: 0.3 });
        // Salva a posição atual
        localStorage.setItem('imagePosition', JSON.stringify({
            x: this.x,
            y: this.y,
            rotation: this.target.style.transform.match(/rotate\(([-\d.]+)deg\)/) ? 
                     parseFloat(this.target.style.transform.match(/rotate\(([-\d.]+)deg\)/)[1]) : 0
        }));
    },
    onDrag: function() {
        gsap.to(this.target, { rotation: this.getDirection("velocity").angle });
    }
});

// Animação inicial da imagem apenas se não houver posição salva
if (!localStorage.getItem('imagePosition')) {
    gsap.from("#home img", {
        scale: 0,
        rotation: 360,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)"
    });
}