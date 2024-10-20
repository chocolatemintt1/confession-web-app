// Calendar utility function
export function createCalendarEvent(eventDetails) {
    const startDate = new Date(eventDetails.dateTime);
    const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // 2 hours duration

    // Create calendar event details
    const eventTitle = `Date at ${eventDetails.place}`;
    const eventDescription = `Movie: ${eventDetails.movie}\nFood: ${eventDetails.food}`;
    const eventLocation = eventDetails.place;

    // Generate ICS file content
    function generateICSContent() {
        // Format date to ICS format (YYYYMMDDTHHMMSSZ)
        const formatICSDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        return [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Your Company//Love Date Calendar//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            `DTSTART:${formatICSDate(startDate)}`,
            `DTEND:${formatICSDate(endDate)}`,
            `SUMMARY:${eventTitle}`,
            `DESCRIPTION:${eventDescription.replace(/\n/g, '\\n')}`,
            `LOCATION:${eventLocation}`,
            'STATUS:CONFIRMED',
            `UID:${new Date().getTime()}@yourdomain.com`,
            'SEQUENCE:0',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');
    }

    // Function to download ICS file
    function downloadICS(filename, content) {
        const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
        
        // For iOS devices, create a direct download link
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            const reader = new FileReader();
            reader.onloadend = function() {
                window.location.href = reader.result;
            };
            reader.readAsDataURL(blob);
            return Promise.resolve({ 
                success: true, 
                message: "Opening in Calendar app..." 
            });
        }

        // For other devices, try using the File System Access API
        if ('showSaveFilePicker' in window) {
            return showSaveFilePicker({
                suggestedName: filename,
                types: [{
                    description: 'Calendar Event',
                    accept: { 'text/calendar': ['.ics'] },
                }],
            }).then(handle => handle.createWritable())
              .then(writable => writable.write(blob).then(() => writable.close()))
              .then(() => ({ 
                  success: true, 
                  message: "Calendar event file saved sweetiepie!" 
              }))
              .catch(() => {
                  // Fallback to traditional download if user cancels File System Access
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = filename;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  return { 
                      success: true, 
                      message: "Calendar event downloaded sweetiepie!" 
                  };
              });
        }

        // Fallback for browsers without File System Access API
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return Promise.resolve({ 
            success: true, 
            message: "Calendar event downloaded!" 
        });
    }

    // Main function to add event to calendar
    async function addToCalendar() {
        try {
            const icsContent = generateICSContent();
            const filename = `date-${startDate.toISOString().split('T')[0]}.ics`;
            return await downloadICS(filename, icsContent);
        } catch (error) {
            console.error("Failed to create calendar event:", error);
            return { 
                success: false, 
                message: "Couldn't create calendar event. Please try again my love." 
            };
        }
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

export function validateDateTime(dateTimeValue) {
    if (!dateTimeValue) {
        return {
            isValid: false,
            message: 'Please select a date and time first dumdum!'
        };
    }

    const selectedDate = new Date(dateTimeValue);
    const now = new Date();

    if (selectedDate <= now) {
        return {
            isValid: false,
            message: 'Please select a future date and time dumdum!'
        };
    }

    return {
        isValid: true,
        message: ''
    };
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
            messageElement.textContent = "Couldn't add to calendar. Please try again sweetiepie!";
            messageElement.className = 'calendar-message error';
            button.disabled = false;
        }
    });
}
