export function createStep(id, content) {
    const step = document.createElement('div');
    step.id = id;
    step.className = 'step';
    step.innerHTML = content;
    return step;
}

export function renderSummary(answers) {
    const date = new Date(answers.dateTime);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Get the selected images
    const placeImage = document.querySelector(`#step3 .card[data-value="${answers.place}"] img`).src;
    const movieImage = document.querySelector(`#step4 .card[data-value="${answers.movie}"] img`).src;
    const foodImage = document.querySelector(`#step5 .card[data-value="${answers.food}"] img`).src;

    const summary = `
        <div class="summary-content">
            <div class="summary-header">
                <h2>Our Perfect Date ❤️</h2>
                <p class="summary-date">🗓️ ${formattedDate}</p>
            </div>
            
            <div class="summary-item">
                <div class="summary-text">
                    <h3>📍 Where we'll meet</h3>
                    <p>${answers.place}</p>
                </div>
                <div class="summary-image">
                    <img src="${placeImage}" alt="${answers.place}">
                </div>
            </div>

            <div class="summary-item">
                <div class="summary-text">
                    <h3>🎬 What we'll watch</h3>
                    <p>${answers.movie}</p>
                </div>
                <div class="summary-image">
                    <img src="${movieImage}" alt="${answers.movie}">
                </div>
            </div>

            <div class="summary-item">
                <div class="summary-text">
                    <h3>🍽️ What we'll eat</h3>
                    <p>${answers.food}</p>
                </div>
                <div class="summary-image">
                    <img src="${foodImage}" alt="${answers.food}">
                </div>
            </div>

            <div class="summary-footer">
                <p>I can't wait to see you! 💕</p>
            </div>
        </div>
    `;

    document.getElementById('summary').innerHTML = summary;
}