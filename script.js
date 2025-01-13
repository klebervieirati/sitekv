// Aguarda o DOM ser completamente carregado antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o elemento do menu hamburguer
    const menuHamburguer = document.querySelector('.menu-hamburguer');
    // Seleciona a lista de links de navegação
    const navLinks = document.querySelector('.nav-links');
    // Seleciona todas as barras do menu hamburguer
    const menuSpans = document.querySelectorAll('.menu-hamburguer span');

    // Adiciona evento de clique no menu hamburguer
    menuHamburguer.addEventListener('click', () => {
        // Alterna a classe 'active' para mostrar/esconder o menu
        navLinks.classList.toggle('active');
        
        // Anima as barras do menu hamburguer para formar um X
        menuSpans[0].classList.toggle('span-1');
        menuSpans[1].classList.toggle('span-2');
        menuSpans[2].classList.toggle('span-3');
    });

    // Para cada link no menu de navegação
    document.querySelectorAll('.nav-links a').forEach(link => {
        // Adiciona evento de clique em cada link
        link.addEventListener('click', () => {
            // Remove a classe 'active' ao clicar em um link
            navLinks.classList.remove('active');
            // Retorna as barras do menu hamburguer ao estado original
            menuSpans[0].classList.remove('span-1');
            menuSpans[1].classList.remove('span-2');
            menuSpans[2].classList.remove('span-3');
        });
    });

    // GERENCIAMENTO DE TEMAS
    // Seleciona o elemento select de temas
    const themeSelect = document.getElementById('theme-select');
    
    // Recupera o tema salvo no localStorage ou usa 'light' como padrão
    const savedTheme = localStorage.getItem('theme') || 'light';
    // Aplica o tema salvo ao elemento root
    document.documentElement.setAttribute('data-theme', savedTheme);
    // Define o valor do select para o tema atual
    themeSelect.value = savedTheme;

    // Adiciona evento de mudança no select de temas
    themeSelect.addEventListener('change', (e) => {
        // Obtém o novo tema selecionado
        const theme = e.target.value;
        // Aplica o novo tema ao elemento root
        document.documentElement.setAttribute('data-theme', theme);
        // Salva o tema escolhido no localStorage
        localStorage.setItem('theme', theme);
    });

    // CARROSSEL DE IMAGENS
    // Seleciona os elementos do carrossel
    const carousel = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dots = document.querySelectorAll('.dot');
    // Controle do slide atual
    let currentSlide = 0;
    // Total de slides no carrossel
    const totalSlides = slides.length;

    // Variáveis para controle do arraste
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let currentIndex = 0;

    // Previne o comportamento padrão de arrastar imagens
    slides.forEach(slide => {
        slide.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // Eventos de touch para dispositivos móveis
    carousel.addEventListener('touchstart', touchStart);
    carousel.addEventListener('touchend', touchEnd);
    carousel.addEventListener('touchmove', touchMove);

    // Eventos de mouse para desktop
    carousel.addEventListener('mousedown', touchStart);
    carousel.addEventListener('mouseup', touchEnd);
    carousel.addEventListener('mouseleave', touchEnd);
    carousel.addEventListener('mousemove', touchMove);

    // Função executada quando começa o toque/clique
    function touchStart(event) {
        // Para a reprodução automática
        clearInterval(autoPlayInterval);
        // Indica que começou o arraste
        isDragging = true;
        // Guarda a posição inicial do toque/clique
        startPos = getPositionX(event);
        // Inicia a animação de arraste
        animationID = requestAnimationFrame(animation);
        // Muda o cursor para indicar que está arrastando
        carousel.style.cursor = 'grabbing';
    }

    // Função executada quando termina o toque/clique
    function touchEnd() {
        // Indica que terminou o arraste
        isDragging = false;
        // Cancela a animação de arraste
        cancelAnimationFrame(animationID);
        // Calcula quanto o carrossel foi movido
        const movedBy = currentTranslate - prevTranslate;

        // Se moveu o suficiente para mudar de slide
        if (Math.abs(movedBy) > window.innerWidth * 0.1) {
            if (movedBy < 0) {
                // Avança para o próximo slide
                currentSlide = Math.min(currentSlide + 1, totalSlides - 1);
            } else {
                // Volta para o slide anterior
                currentSlide = Math.max(currentSlide - 1, 0);
            }
        }

        // Atualiza a posição do carrossel
        updateCarousel();
        // Retorna o cursor ao normal
        carousel.style.cursor = 'grab';
        
        // Reinicia a reprodução automática
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    // Função executada durante o movimento de arraste
    function touchMove(event) {
        if (isDragging) {
            // Obtém a posição atual do toque/mouse
            const currentPosition = getPositionX(event);
            // Calcula a nova posição do carrossel
            currentTranslate = prevTranslate + currentPosition - startPos;
            // Calcula o deslocamento em porcentagem
            const offset = -(currentSlide * 100) + (currentTranslate / carousel.offsetWidth * 100);
            // Aplica a transformação ao carrossel
            carousel.style.transform = `translateX(${offset}%)`;
        }
    }

    // Função para obter a posição X do evento (mouse ou touch)
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    // Função de animação do arraste
    function animation() {
        if (isDragging) {
            requestAnimationFrame(animation);
        }
    }

    // Função para atualizar a posição do carrossel
    function updateCarousel() {
        // Calcula a nova posição
        prevTranslate = -(currentSlide * 100);
        currentTranslate = prevTranslate;
        // Aplica a transformação
        carousel.style.transform = `translateX(${prevTranslate}%)`;
        
        // Atualiza os indicadores de slide (dots)
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Função para avançar para o próximo slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    // Função para voltar ao slide anterior
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // Eventos dos botões de navegação
    nextButton.addEventListener('click', () => {
        clearInterval(autoPlayInterval);
        nextSlide();
        autoPlayInterval = setInterval(nextSlide, 5000);
    });

    prevButton.addEventListener('click', () => {
        clearInterval(autoPlayInterval);
        prevSlide();
        autoPlayInterval = setInterval(nextSlide, 5000);
    });

    // Eventos dos indicadores (dots)
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(autoPlayInterval);
            currentSlide = index;
            updateCarousel();
            autoPlayInterval = setInterval(nextSlide, 5000);
        });
    });

    // Inicia a reprodução automática do carrossel
    let autoPlayInterval = setInterval(nextSlide, 5000);

    // Para a reprodução automática quando o mouse está sobre o carrossel
    carousel.parentElement.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });

    // Retoma a reprodução automática quando o mouse sai do carrossel
    carousel.parentElement.addEventListener('mouseleave', () => {
        if (!isDragging) {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }
    });

    // CONTADORES ANIMADOS
    // Seleciona os elementos dos contadores
    const counterItems = document.querySelectorAll('.counter-item');
    const counters = document.querySelectorAll('.counter');
    // Controle se já animou os contadores
    let hasAnimated = false;

    // Função para animar um contador
    function animateCounter(counter) {
        // Obtém o valor final do contador
        const target = parseInt(counter.getAttribute('data-target'));
        // Define a duração da animação
        const duration = 2000; // 2 segundos
        // Calcula o incremento por frame
        const step = target / (duration / 16); // 60fps
        let current = 0;

        // Função para atualizar o contador
        const updateCounter = () => {
            current += step;
            if (current < target) {
                // Atualiza o valor do contador
                counter.textContent = Math.round(current);
                // Continua a animação
                requestAnimationFrame(updateCounter);
            } else {
                // Define o valor final
                counter.textContent = target;
            }
        };

        // Inicia a atualização
        updateCounter();
    }

    // Função para verificar se um elemento está visível na viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Função para verificar e iniciar a animação dos contadores
    function checkCounters() {
        if (!hasAnimated && isElementInViewport(document.querySelector('.counter-container'))) {
            // Adiciona a classe visible aos itens
            counterItems.forEach(item => item.classList.add('visible'));
            // Inicia a animação de cada contador
            counters.forEach(counter => animateCounter(counter));
            // Marca que já animou
            hasAnimated = true;
            // Remove o listener de scroll
            window.removeEventListener('scroll', checkCounters);
        }
    }

    // Adiciona o listener de scroll
    window.addEventListener('scroll', checkCounters);
    // Verifica inicialmente
    checkCounters();

    // EFEITO PARALLAX
    // Seleciona os elementos do parallax
    const parallaxBg = document.querySelector('.parallax-bg');
    const aboutCards = document.querySelectorAll('.about-card');
    let ticking = false;

    // Função para atualizar o efeito parallax
    function updateParallax() {
        if (window.innerWidth > 768) { // Só aplica em telas maiores
            // Obtém a posição do scroll
            const scrolled = window.scrollY;
            const parallaxSection = document.querySelector('.parallax-section');
            const sectionTop = parallaxSection.offsetTop;
            const sectionHeight = parallaxSection.offsetHeight;

            // Verifica se a seção está visível
            if (scrolled >= sectionTop - window.innerHeight && 
                scrolled <= sectionTop + sectionHeight) {
                // Velocidade do parallax
                const speed = 0.5;
                // Calcula o deslocamento
                const yPos = (scrolled - sectionTop) * speed;
                // Aplica o parallax ao fundo
                parallaxBg.style.transform = `translateY(${yPos}px)`;

                // Aplica parallax aos cards
                aboutCards.forEach((card, index) => {
                    const cardSpeed = 0.2 + (index * 0.1);
                    const cardPos = (scrolled - sectionTop) * cardSpeed;
                    card.style.transform = `translateY(${-cardPos}px)`;
                });
            }
        }
        ticking = false;
    }

    // Listener de scroll para o parallax
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
            });
            ticking = true;
        }
    });

    // Inicializa o parallax
    updateParallax();

    // Atualiza o parallax ao redimensionar a janela
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth <= 768) {
                // Remove transformações em telas menores
                parallaxBg.style.transform = '';
                aboutCards.forEach(card => {
                    card.style.transform = '';
                });
            } else {
                updateParallax();
            }
        }, 66); // Debounce de 66ms
    });

    // VISUALIZADOR 3D
    // Seleciona os elementos do visualizador
    const viewer = document.querySelector('.viewer-3d');
    const cube = document.querySelector('.viewer-wrapper');
    const rotationInputs = document.querySelectorAll('.rotation-input');
    const rotationValues = document.querySelectorAll('.rotation-value');
    const resetButton = document.querySelector('.reset-button');
    const autoRotateButton = document.querySelector('.auto-rotate-button');

    // Estado do visualizador 3D
    let rotations = { x: 0, y: 0, z: 0 };
    let is3DDragging = false;
    let startX = 0;
    let startY = 0;
    let autoRotateInterval = null;
    let isAutoRotating = false;

    // Função para atualizar a rotação do cubo
    function updateCubeRotation() {
        // Aplica as rotações ao cubo
        cube.style.transform = `rotateX(${rotations.x}deg) rotateY(${rotations.y}deg) rotateZ(${rotations.z}deg)`;
        
        // Atualiza os valores nos controles
        rotationInputs.forEach((input, index) => {
            const axis = input.dataset.axis;
            input.value = rotations[axis];
            rotationValues[index].textContent = `${Math.round(rotations[axis])}°`;
        });
    }

    // Eventos dos controles de rotação
    rotationInputs.forEach(input => {
        input.addEventListener('input', () => {
            // Atualiza a rotação quando o usuário move os controles
            const axis = input.dataset.axis;
            rotations[axis] = parseFloat(input.value);
            updateCubeRotation();
        });
    });

    // Função para controlar a auto-rotação
    function startAutoRotate() {
        if (isAutoRotating) {
            // Para a auto-rotação
            clearInterval(autoRotateInterval);
            autoRotateButton.innerHTML = '<i class="fas fa-play"></i> Auto-Rotação';
            isAutoRotating = false;
        } else {
            // Inicia a auto-rotação
            autoRotateInterval = setInterval(() => {
                rotations.y = (rotations.y + 1) % 360;
                updateCubeRotation();
            }, 50);
            autoRotateButton.innerHTML = '<i class="fas fa-pause"></i> Pausar';
            isAutoRotating = true;
        }
    }

    // Evento do botão de reset
    resetButton.addEventListener('click', () => {
        // Reseta todas as rotações para 0
        rotations = { x: 0, y: 0, z: 0 };
        updateCubeRotation();
        if (isAutoRotating) {
            startAutoRotate();
        }
    });

    // Evento do botão de auto-rotação
    autoRotateButton.addEventListener('click', startAutoRotate);

    // Eventos de mouse para rotação manual
    viewer.addEventListener('mousedown', (e) => {
        is3DDragging = true;
        startX = e.pageX;
        startY = e.pageY;
        viewer.style.cursor = 'grabbing';
        if (isAutoRotating) startAutoRotate();
    });

    document.addEventListener('mousemove', (e) => {
        if (!is3DDragging) return;

        // Calcula a diferença de posição
        const deltaX = e.pageX - startX;
        const deltaY = e.pageY - startY;
        
        // Aplica as rotações com base no movimento do mouse
        rotations.y = (rotations.y + deltaX * 0.5) % 360;
        rotations.x = Math.max(-180, Math.min(180, rotations.x + deltaY * 0.5));
        
        updateCubeRotation();
        
        // Atualiza as posições iniciais
        startX = e.pageX;
        startY = e.pageY;
    });

    document.addEventListener('mouseup', () => {
        is3DDragging = false;
        viewer.style.cursor = 'grab';
    });

    // Eventos de touch para dispositivos móveis
    viewer.addEventListener('touchstart', (e) => {
        is3DDragging = true;
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY;
        if (isAutoRotating) startAutoRotate();
    });

    viewer.addEventListener('touchmove', (e) => {
        if (!is3DDragging) return;
        e.preventDefault();

        // Calcula a diferença de posição para touch
        const deltaX = e.touches[0].pageX - startX;
        const deltaY = e.touches[0].pageY - startY;
        
        // Aplica as rotações com base no movimento do touch
        rotations.y = (rotations.y + deltaX * 0.5) % 360;
        rotations.x = Math.max(-180, Math.min(180, rotations.x + deltaY * 0.5));
        
        updateCubeRotation();
        
        // Atualiza as posições iniciais
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY;
    });

    viewer.addEventListener('touchend', () => {
        is3DDragging = false;
    });

    // Previne o comportamento padrão de arrastar
    viewer.addEventListener('dragstart', (e) => e.preventDefault());

    // NAVEGAÇÃO RESPONSIVA
    const header = document.querySelector('header');
    let lastScroll = 0;
    let scrollTimeout;

    // Função para controlar a visibilidade do header
    function handleScroll() {
        const currentScroll = window.scrollY;
        console.log(currentScroll); 
        // Se rolou mais de 100px
        if (currentScroll > 100) {
            // Rolando para baixo
            if (currentScroll > lastScroll) {
                header.classList.add('nav-hidden');
            } 
            // Rolando para cima
            else {
                header.classList.remove('nav-hidden');
            }
        }

        lastScroll = currentScroll;

        // Limpa o timeout anterior
        clearTimeout(scrollTimeout); 

        // Define um novo timeout
        scrollTimeout = setTimeout(() => {
            // Mostra o header após parar de rolar
            header.classList.remove('nav-hidden');
        }, 1000);
        console.log(scrollTimeout);
    }

    // Adiciona o listener de scroll com throttling
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    // SUBMENUS MOBILE
    const hasSubmenu = document.querySelectorAll('.has-submenu');

    hasSubmenu.forEach(item => {
        if (window.innerWidth <= 768) {
            const link = item.querySelector('a');
            const submenu = item.querySelector('.submenu');

            link.addEventListener('click', (e) => {
                // Previne a navegação apenas se o submenu estiver fechado
                if (!submenu.style.display || submenu.style.display === 'none') {
                    e.preventDefault();
                }
                
                // Fecha todos os outros submenus
                hasSubmenu.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.querySelector('.submenu').style.display = 'none';
                    }
                });

                // Toggle do submenu atual
                submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            });
        }
    });
}); 