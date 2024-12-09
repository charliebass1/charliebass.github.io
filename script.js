class SaunaTracker {
    constructor() {
        this.form = document.getElementById('saunaForm');
        this.sessions = JSON.parse(localStorage.getItem('saunaSessions')) || [];
        
        this.initializeEventListeners();
        this.displaySessions();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const session = {
            id: Date.now(),
            date: document.getElementById('date').value,
            duration: document.getElementById('duration').value,
            temperature: document.getElementById('temperature').value,
            timestamp: new Date().toISOString()
        };

        this.sessions.push(session);
        localStorage.setItem('saunaSessions', JSON.stringify(this.sessions));
        
        this.displaySessions();
        this.form.reset();
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
                    <button onclick="saunaTracker.deleteSession(${session.id})" class="delete-btn">
                        Delete
                    </button>
                </div>
            `).join('');
    }

    deleteSession(id) {
        this.sessions = this.sessions.filter(session => session.id !== id);
        localStorage.setItem('saunaSessions', JSON.stringify(this.sessions));
        this.displaySessions();
    }
}

// Initialize the tracker when the page loads
let saunaTracker;
document.addEventListener('DOMContentLoaded', () => {
    saunaTracker = new SaunaTracker();
}); 