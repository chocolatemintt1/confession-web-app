// Calendar utility function
export function createCalendarEvent(eventDetails) {
    const startDate = new Date(eventDetails.dateTime);
    const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // 2 hours duration

    // Create calendar event details
    const eventTitle = `Date at ${eventDetails.place}`;
    const eventDescription = `Movie: ${eventDetails.movie}\nFood: ${eventDetails.food}`;
    const eventLocation = eventDetails.place;

    // Google Calendar URL (fallback)
    function getGoogleCalendarURL() {
        const formatDate = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');
        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}&dates=${formatDate(startDate)}/${formatDate(endDate)}`;
    }

    // Try different calendar integration methods
    async function addToCalendar() {
        // Check if the modern Calendar API is supported
        if ('showSaveFilePicker' in window && 'calendars' in navigator) {
            try {
                const event = {
                    title: eventTitle,
                    description: eventDescription,
                    location: eventLocation,
                    start: startDate,
                    end: endDate
                };
                
                await navigator.calendars.createEvent(event);
                return { success: true, message: "Event added to your calendar!" };
            } catch (error) {
                console.log("Calendar API failed, trying alternative methods...");
            }
        }

        // Try using the deprecated addEvent API (still works in some browsers)
        if ('CalendarEvent' in window) {
            try {
                const calendarEvent = new CalendarEvent(eventTitle, {
                    description: eventDescription,
                    location: eventLocation,
                    start: startDate,
                    end: endDate
                });
                await calendarEvent.show();
                return { success: true, message: "Please confirm adding the event to your calendar." };
            } catch (error) {
                console.log("Calendar Event API failed, trying alternative methods...");
            }
        }

        // Fallback: Try common calendar URL schemes
        const userAgent = navigator.userAgent.toLowerCase();
        
        // iOS devices
        if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
            const icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'BEGIN:VEVENT',
                `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
                `DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
                `SUMMARY:${eventTitle}`,
                `DESCRIPTION:${eventDescription}`,
                `LOCATION:${eventLocation}`,
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\n');

            const dataUri = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsContent);
            window.open(dataUri);
            return { success: true, message: "Opening calendar app..." };
        }
        
        // Android devices
        if (userAgent.includes('android')) {
            window.open(getGoogleCalendarURL());
            return { success: true, message: "Opening Google Calendar..." };
        }

        // Desktop fallback to Google Calendar
        window.open(getGoogleCalendarURL(), '_blank');
        return { success: true, message: "Opening Google Calendar in a new tab..." };
    }

    return addToCalendar;
}

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
                <button id="addToCalendar" class="calendar-button">
                    📅 Add to your Calendar <br> My Sugarplums😉
                </button>
                <p id="calendarMessage" class="calendar-message"></p>
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

    // Add calendar button event listener with feedback
    document.getElementById('addToCalendar').addEventListener('click', async () => {
        const addToCalendar = createCalendarEvent(answers);
        const button = document.getElementById('addToCalendar');
        const messageElement = document.getElementById('calendarMessage');
        
        button.disabled = true;
        try {
            const result = await addToCalendar();
            messageElement.textContent = result.message;
            messageElement.className = 'calendar-message success';
        } catch (error) {
            messageElement.textContent = "Couldn't add to calendar. Please try again.";
            messageElement.className = 'calendar-message error';
            button.disabled = false;
        }
    });
}
