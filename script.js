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