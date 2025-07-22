// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Universal Navigation Active Link Logic
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // FORMULARIO LOGIC
    const playerForm = document.getElementById('player-form');
    const clearFormButton = document.getElementById('clear-form-button');
    const quizQuestions = document.querySelectorAll('#playstyle-quiz input[type="radio"]');
    const quizResultDiv = document.getElementById('quiz-result');
    const playstyleText = document.getElementById('playstyle-text');

    if (playerForm) { 
        if (clearFormButton) {
            clearFormButton.addEventListener('click', function() {
                playerForm.reset();
                quizResultDiv.classList.add('hidden');
            });
        }

        if (quizQuestions.length > 0) { 
            quizQuestions.forEach(radio => {
                radio.addEventListener('change', evaluatePlaystyle);
            });

            function evaluatePlaystyle() {
                const q1 = document.querySelector('input[name="q1"]:checked')?.value;
                const q2 = document.querySelector('input[name="q2"]:checked')?.value;
                const q3 = document.querySelector('input[name="q3"]:checked')?.value;

                if (q1 && q2 && q3) { 
                    quizResultDiv.classList.remove('hidden');
                    let style = '';

                    // Lógica simples para determinar o estilo
                    if (q1 === 'agressao' && q2 === 'rifle' && q3 === 'confronto') {
                        style = 'Entry Fragger: Você adora ser o primeiro a entrar no bombsite e abrir espaço para o seu time! Sua agressividade é sua maior arma.';
                    } else if (q1 === 'utilidade' && q2 === 'rifle' && q3 === 'posicionamento') {
                        style = 'Suporte Estratégico: Você é o cérebro do time, usando suas granadas e posicionamento para criar oportunidades e garantir a vitória!';
                    } else if (q1 === 'informacao' && q2 === 'smg' && q3 === 'calma') {
                        style = 'Lurker/Rotacionador: Você prefere coletar informações, surpreender inimigos e fazer rotações inteligentes. A paciência é sua virtude!';
                    } else if (q1 === 'agressao' && q2 === 'sniper' && q3 === 'confronto') {
                        style = 'AWPer Agressivo: Você não tem medo de arriscar com a AWP, buscando abates rápidos e impactantes para desequilibrar o round!';
                    } else if (q1 === 'utilidade' && q2 === 'smg' && q3 === 'calma') {
                        style = 'Defensor Tático: Você é um mestre em segurar posições, usando utilitários e sua SMG para punir rushes inimigos e garantir o controle.';
                    } else {
                        style = 'Jogador Versátil: Seu estilo é adaptável e você consegue se sair bem em diversas situações. Continue explorando suas habilidades!';
                    }
                    playstyleText.textContent = style;
                } else {
                    quizResultDiv.classList.add('hidden'); // Esconde o resultado se nem todas as perguntas foram respondidas
                }
            }
        }
    }

    // LÓGICA DO CARROSSEL (para versoes.html)
    
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const slidesContainer = document.querySelector('.carousel-slides');
        const slides = document.querySelectorAll('.carousel-slide');
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');
        let currentIndex = 0;

        function updateCarousel() {
            const offset = -currentIndex * 100;
            slidesContainer.style.transform = `translateX(${offset}%)`;
        }

        nextButton.addEventListener('click', () => {
            // Se estiver no último slide, volta para o primeiro. Senão, avança.
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            // Se estiver no primeiro slide, vai para o último. Senão, volta.
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        // Inicializa o carrossel na posição correta
        updateCarousel();
    }





    //  LÓGICA PARA O "MONTE SEU KIT"

    const kitStartButton = document.getElementById('kit-start-button');
    if (kitStartButton) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupKitBuilder);
        } else {
            setupKitBuilder();
        }
    }

    function setupKitBuilder() {
        const startButton = document.getElementById('kit-start-button');
        if (!startButton) return; // Exit if the start button is not found

        // SELEÇÃO DE ELEMENTOS DO DOM 
        const body = document.body;
        const mainContent = document.querySelector('main');
        const kitStartArea = document.getElementById('kit-start-area');
        const kitUI = document.getElementById('kit-builder-ui');
        const instructions = document.getElementById('kit-instructions');
        const nextButton = document.getElementById('kit-next-button');
        const resultModal = document.getElementById('kit-result-modal');
        
        const allCategories = Array.from(mainContent.querySelectorAll('.content-section > h3'));
        
        //  ESTADO DA APLICAÇÃO 
        const state = {
            step: 'inactive', // inactive, equipment, pistol, primary, done
            selections: {
                equipment: [],
                pistol: null,
                primary: null,
            }
        };

        //  FUNÇÕES DE LÓGICA 

        // Atualiza toda a interface com base no passo atual
        function updateUI() {
            // Controla a visibilidade dos elementos principais
            body.classList.toggle('kit-mode-active', state.step !== 'inactive');
            kitStartArea.classList.toggle('hidden', state.step !== 'inactive');
            kitUI.classList.toggle('hidden', state.step === 'inactive' || state.step === 'done');
            resultModal.classList.toggle('hidden', state.step !== 'done');

            if (state.step === 'inactive' || state.step === 'done') {
                allCategories.forEach(el => el.parentElement.classList.remove('kit-category-disabled'));
                document.querySelectorAll('.card').forEach(c => c.classList.remove('kit-card-selectable', 'kit-card-selected'));
                return;
            }

            let instructionText = '';
            let nextButtonText = 'Próximo';
            let nextButtonEnabled = false;

            // Desativa todas as categorias e reativa conforme o passo
            allCategories.forEach(el => el.parentElement.classList.add('kit-category-disabled'));
            document.querySelectorAll('.card').forEach(c => c.classList.remove('kit-card-selectable'));

            switch (state.step) {
                case 'equipment':
                    instructionText = 'Passo 1: Escolha até 2 equipamentos';
                    activateCategory('Equipamento');
                    nextButtonEnabled = state.selections.equipment.length > 0;
                    break;
                case 'pistol':
                    instructionText = 'Passo 2: Escolha sua Pistola';
                    activateCategory('Pistolas');
                    nextButtonEnabled = !!state.selections.pistol;
                    break;
                case 'primary':
                    instructionText = 'Passo 3: Escolha sua Arma Primária (Rifle, SMG, etc)';
                    activateCategory('Rifles');
                    activateCategory('Submetralhadoras');
                    activateCategory('Escopetas');
                    nextButtonEnabled = !!state.selections.primary;
                    nextButtonText = 'Finalizar Kit';
                    break;
            }

            instructions.textContent = instructionText;
            nextButton.textContent = nextButtonText;
            nextButton.disabled = !nextButtonEnabled;
        }

        // Ativa uma categoria para seleção
        function activateCategory(categoryName) {
            const categoryTitle = allCategories.find(h3 => h3.textContent.trim() === categoryName);
            if (categoryTitle) {
                const categorySection = categoryTitle.parentElement;
                categorySection.classList.remove('kit-category-disabled');
                categorySection.querySelectorAll('.card').forEach(c => c.classList.add('kit-card-selectable'));
            }
        }

        // Lida com o clique em um card de arma/equipamento
        function handleCardClick(card) {
            const isSelectable = card.classList.contains('kit-card-selectable');
            if (!isSelectable) return;

            const name = card.querySelector('h3').textContent;
            const imgSrc = card.querySelector('img').src;
            const data = { name, imgSrc };

            switch (state.step) {
                case 'equipment':
                    const selectedIndex = state.selections.equipment.findIndex(item => item.name === name);
                    if (selectedIndex > -1) {
                        state.selections.equipment.splice(selectedIndex, 1);
                        card.classList.remove('kit-card-selected');
                    } else if (state.selections.equipment.length < 2) {
                        state.selections.equipment.push(data);
                        card.classList.add('kit-card-selected');
                    }
                    break;
                case 'pistol':
                    document.querySelectorAll('.kit-card-selected').forEach(c => c.classList.remove('kit-card-selected'));
                    state.selections.pistol = data;
                    card.classList.add('kit-card-selected');
                    break;
                case 'primary':
                    document.querySelectorAll('.kit-card-selected').forEach(c => c.classList.remove('kit-card-selected'));
                    state.selections.primary = data;
                    card.classList.add('kit-card-selected');
                    break;
            }
            updateSlotsUI();
            updateUI();
        }
        
        // Atualiza os slots na barra inferior
        function updateSlotsUI() {
            const slots = {
                equip1: state.selections.equipment[0],
                equip2: state.selections.equipment[1],
                pistol: state.selections.pistol,
                primary: state.selections.primary,
            };
            document.querySelectorAll('.kit-slot').forEach(slotEl => {
                const slotName = slotEl.dataset.slot;
                const item = slots[slotName];
                if(item) {
                    slotEl.innerHTML = `<img src="${item.imgSrc}" alt="${item.name}" title="${item.name}">`;
                } else {
                    const defaultText = {equip1: 'Equip. 1', equip2: 'Equip. 2', pistol: 'Pistola', primary: 'Arma Primária'}[slotName];
                    slotEl.innerHTML = defaultText;
                }
            });
        }
        
        // Preenche o modal final com os resultados
        function populateFinalDisplay() {
            const display = document.getElementById('kit-final-display');
            display.innerHTML = '';
            
            const createItemHTML = (item) => `<div class="kit-final-item">
                <img src="${item.imgSrc}" alt="${item.name}">
                <h3>${item.name}</h3>
            </div>`;

            state.selections.equipment.forEach(item => display.innerHTML += createItemHTML(item));
            if(state.selections.pistol) display.innerHTML += createItemHTML(state.selections.pistol);
            if(state.selections.primary) display.innerHTML += createItemHTML(state.selections.primary);
        }

        // Reseta todo o processo
        function resetKit() {
            state.step = 'inactive';
            state.selections = { equipment: [], pistol: null, primary: null };
            updateSlotsUI();
            updateUI();
        }

        // EVENT LISTENERS 
        startButton.addEventListener('click', () => {
            state.step = 'equipment';
            updateUI();
            window.scrollTo({ top: mainContent.offsetTop, behavior: 'smooth' });
        });

        nextButton.addEventListener('click', () => {
            if (nextButton.disabled) return;
            switch (state.step) {
                case 'equipment': state.step = 'pistol'; break;
                case 'pistol': state.step = 'primary'; break;
                case 'primary': 
                    state.step = 'done';
                    populateFinalDisplay();
                    break;
            }
            updateUI();
        });

        // Event delegation for card clicks within main content
        mainContent.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (card) handleCardClick(card);
        });

        document.getElementById('kit-close-modal').addEventListener('click', resetKit);
        document.getElementById('kit-reset-button').addEventListener('click', resetKit);
    }
});