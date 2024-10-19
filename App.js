import { createStep, renderSummary } from './components.js';
import { moveButton } from './utils.js';

class ConfessionApp {
    constructor() {
        this.currentStep = 1;
        this.answers = {};
        this.init();
        this.initThemeSwitcher();
    }

    initThemeSwitcher() {
        const themeSwitcher = document.getElementById('themeSwitcher');
        const html = document.documentElement;
        
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        themeSwitcher.innerHTML = savedTheme === 'dark' ? '🌙' : '☀️';

        themeSwitcher.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeSwitcher.innerHTML = newTheme === 'dark' ? '🌙' : '☀️';

            // Add animation class
            themeSwitcher.classList.add('rotate');
            setTimeout(() => themeSwitcher.classList.remove('rotate'), 500);
        });
    }

    init() {
        const app = document.getElementById('app');
        this.renderAllSteps(app);
        this.showCurrentStep();
    }

    renderAllSteps(container) {
        // Step 1: Initial Question
        container.appendChild(createStep('step1', `
            <h1>❤️ Will you go out with me? ❤️</h1>
            <button id="yesButton">Yes</button>
            <button id="noButton">No</button>
        `));

        // Step 2: Date and Time
        container.appendChild(createStep('step2', `
            <h1>When would you like to go?</h1>
            <input type="datetime-local" id="dateTime">
            <button class="next-button">Next</button>
        `));

        // Step 3: Place
        container.appendChild(createStep('step3', `
            <h1>Where should we meet?</h1>
            <div class="cards-grid">
                <div class="card" data-value="Coffee Shop">
                    <img src="assets/coffee_shop.jfif" alt="Coffee Shop">
                    <div class="card-title">Coffee Shop</div>
                </div>
                <div class="card" data-value="Park">
                    <img src="assets/park.jpg" alt="Park">
                    <div class="card-title">Park</div>
                </div>
                <div class="card" data-value="Restaurant">
                    <img src="assets/restaurant.jpg" alt="Restaurant">
                    <div class="card-title">Restaurant</div>
                </div>
                <div class="card" data-value="Mall">
                    <img src="assets/mall.jpg" alt="Mall">
                    <div class="card-title">Mall</div>
                </div>
            </div>
            <button class="next-button" disabled>Next</button>
        `));

        // Step 4: Movie
        container.appendChild(createStep('step4', `
            <h1>Which movie would you like to watch?</h1>
            <div class="cards-grid">
                <div class="card" data-value="Romantic Comedy">
                    <img src="assets/anyone_but_you.jpg" alt="Romantic Comedy">
                    <div class="card-title">Romantic Comedy</div>
                </div>
                <div class="card" data-value="Action">
                    <img src="assets/action_movie.jpg" alt="Action">
                    <div class="card-title">Action</div>
                </div>
                <div class="card" data-value="Horror">
                    <img src="assets/horror.jpg" alt="Horror">
                    <div class="card-title">Horror</div>
                </div>
                <div class="card" data-value="Animation">
                    <img src="assets/anime.png" alt="Animation">
                    <div class="card-title">Animation</div>
                </div>
            </div>
            <button class="next-button" disabled>Next</button>
        `));

        // Step 5: Food
        container.appendChild(createStep('step5', `
            <h1>What would you like to eat?</h1>
            <div class="cards-grid">
                <div class="card" data-value="Pizza">
                    <img src="assets/pizza.jpg" alt="Pizza">
                    <div class="card-title">Pizza</div>
                </div>
                <div class="card" data-value="Sushi">
                    <img src="assets/sushi.jpg" alt="Sushi">
                    <div class="card-title">Sushi</div>
                </div>
                <div class="card" data-value="Burgers">
                    <img src="assets/burger.jpg" alt="Burgers">
                    <div class="card-title">Burgers</div>
                </div>
                <div class="card" data-value="Pasta">
                    <img src="assets/pasta.webp" alt="Pasta">
                    <div class="card-title">Pasta</div>
                </div>
            </div>
            <button class="next-button" disabled>Finish</button>
        `));

        // Final Step
        container.appendChild(createStep('finalStep', `
            <h1>Perfect! Here's our date plan:</h1>
            <div class="final-message" id="summary"></div>
            <div class="hearts">💖 💖 💖</div>
            <div class="hearts">Programmed by your honeybunch, Carlo💖</div>
        `));

        this.addEventListeners();
    }

    addEventListeners() {
        const noButton = document.getElementById('noButton');
        noButton.addEventListener('mouseover', moveButton);

        const yesButton = document.getElementById('yesButton');
        yesButton.addEventListener('click', () => this.nextStep());

        // Add date-time input validation
        const dateTimeInput = document.getElementById('dateTime');
        if (dateTimeInput) {
            dateTimeInput.addEventListener('change', (e) => {
                const selectedDate = new Date(e.target.value);
                const now = new Date();
                const nextButton = e.target.parentElement.querySelector('.next-button');
                
                if (selectedDate <= now) {
                    alert('Please select a future date and time you dumdum!');
                    e.target.value = '';
                    nextButton.disabled = true;
                } else {
                    nextButton.disabled = false;
                }
            });
        }

        // Add card selection listeners
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => {
                const gridCards = card.closest('.cards-grid').querySelectorAll('.card');
                gridCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                const nextButton = card.closest('.step').querySelector('.next-button');
                nextButton.disabled = false;
            });
        });

        const nextButtons = document.querySelectorAll('.next-button');
        nextButtons.forEach(button => {
            button.addEventListener('click', () => this.nextStep());
        });
    }

    showCurrentStep() {
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById(`step${this.currentStep}`).classList.add('active');
    }

    nextStep() {
        this.collectCurrentStepData();
        
        if (this.currentStep === 5) {
            renderSummary(this.answers);
            this.currentStep++;
            document.getElementById('finalStep').classList.add('active');
            document.getElementById(`step${this.currentStep - 1}`).classList.remove('active');
            return;
        }

        this.currentStep++;
        this.showCurrentStep();
    }

    collectCurrentStepData() {
        switch(this.currentStep) {
            case 1:
                this.answers.response = "Yes";
                break;
            case 2:
                this.answers.dateTime = document.getElementById('dateTime').value;
                break;
            case 3:
            case 4:
            case 5:
                const selectedCard = document.querySelector(`#step${this.currentStep} .card.selected`);
                if (selectedCard) {
                    const key = this.currentStep === 3 ? 'place' : 
                              this.currentStep === 4 ? 'movie' : 'food';
                    this.answers[key] = selectedCard.dataset.value;
                }
                break;
        }
    }
}

// Initialize the app
new ConfessionApp();
