class SaunaTracker {
    constructor() {
        this.form = document.getElementById('saunaForm');
        this.sessions = [];
        this.API_URL = 'https://sauna-tracker.onrender.com/api/sessions';
        
        this.initializeEventListeners();
        this.loadSessions();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async loadSessions() {
        try {
            const response = await fetch(this.API_URL);
            if (!response.ok) throw new Error('Failed to fetch sessions');
            this.sessions = await response.json();
            this.displaySessions();
        } catch (error) {
            console.error('Load error:', error);
            this.showError(['Failed to load sessions']);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const session = {
            date: document.getElementById('date').value,
            duration: parseInt(document.getElementById('duration').value),
            temperature: parseInt(document.getElementById('temperature').value)
        };

        console.log('Submitting session:', session);

        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(session)
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error:', errorData);
                throw new Error('Network response was not ok');
            }
            
            const savedSession = await response.json();
            console.log('Saved session:', savedSession);
            
            this.sessions.push(savedSession);
            this.displaySessions();
            this.form.reset();
            this.showError([]);
        } catch (error) {
            console.error('Error details:', error);
            this.showError(['Failed to save session. Please try again.']);
        }
    }

    async deleteSession(id) {
        try {
            const response = await fetch(`https://sauna-tracker.onrender.com`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete session');
            
            this.sessions = this.sessions.filter(session => session._id !== id);
            this.displaySessions();
        } catch (error) {
            this.showError(['Failed to delete session']);
        }
    }

    validateSession(session) {
        const errors = [];
        
        // Date validation
        if (!session.date) {
            errors.push("Date is required");
        } else if (new Date(session.date) > new Date()) {
            errors.push("Date cannot be in the future");
        }

        // Duration validation
        if (!session.duration) {
            errors.push("Duration is required");
        } else if (session.duration < 1 || session.duration > 60) {
            errors.push("Duration must be between 1 and 60 minutes");
        }

        // Temperature validation
        if (!session.temperature) {
            errors.push("Temperature is required");
        } else if (session.temperature < 120 || session.temperature > 230) {
            errors.push("Temperature must be between 120°F and 230°F");
        }

        return errors;
    }

    showError(errors) {
        const errorDiv = document.getElementById('errorMessages') || this.createErrorDiv();
        errorDiv.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
        errorDiv.style.display = errors.length ? 'block' : 'none';
    }

    createErrorDiv() {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'errorMessages';
        errorDiv.className = 'error-messages';
        this.form.insertBefore(errorDiv, this.form.firstChild);
        return errorDiv;
    }

    displaySessions() {
        const sessionsList = document.getElementById('sessionsList');
        if (!sessionsList) return;

        sessionsList.innerHTML = this.sessions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(session => `
                <div class="session-card">
                    <div class="session-date">${new Date(session.date).toLocaleDateString()}</div>
                    <div class="session-details">
                        <span>${session.duration} minutes</span>
                        <span>${session.temperature}°F</span>
                    </div>
                    <button onclick="saunaTracker.deleteSession('${session._id}')" class="delete-btn">
                        Delete
                    </button>
                </div>
            `).join('');
    }
}

// Initialize the tracker when the page loads
let saunaTracker;
document.addEventListener('DOMContentLoaded', () => {
    saunaTracker = new SaunaTracker();
}); 

// Make sure this matches your Render URL exactly
const API_URL = 'https://sauna-tracker.onrender.com';  // Replace with your actual Render URL 