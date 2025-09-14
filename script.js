class BasketballRefereeTraining {
    constructor() {
        this.violations = [
            "Travelling",
            "Double Dribbling", 
            "Carrying the Ball",
            "3 Seconds",
            "5 Seconds",
            "8 Seconds", 
            "24 Seconds",
            "Backcourt Violation",
            "Kick Ball"
        ];

        this.foulsAndConsequences = [
            ["Holding", ["sideline", "endline"], ["2-shots"]],
            ["Blocking", ["sideline", "endline"], ["2-shots", "and-one"]],
            ["Illegal Screen Offense", ["sideline", "endline"], []],
            ["Pushing", ["sideline", "endline"], ["2-shots", "and-one"]],
            ["Handchecking", ["sideline", "endline"], ["2-shots"]],
            ["Illegal Use of Hands", ["sideline", "endline"], ["2-shots"]],
            ["Charging With Ball Offence", ["sideline", "endline"],[]],
            ["Illegal Contact to Hand", [], ["2-shots", "3-shots", "and-one"]],
            ["Excessive Swinging of Elbow", ["sideline", "endline"], ["2-shots"]],
            ["Hit to the Head", [], ["2-shots", "and-one"]]
        ];

        this.outOfBounds = ["offense", "defense"];
        
        this.colors = ["red", "blue", "green", "yellow", "white", "black"];
        
        this.currentTeamColors = this.generateRandomTeamColors();
        this.currentDirection = null;
        this.currentSection = 'numbers';
        this.timerInterval = null;
        this.timerRunning = false;
        
        this.initializeEventListeners();
        this.setupTeamColors();
    }

    generateRandomTeamColors() {
        const shuffled = [...this.colors].sort(() => 0.5 - Math.random());
        return {
            teamA: shuffled[0],
            teamB: shuffled[1]
        };
    }

    setupTeamColors() {
        const teamAElement = document.getElementById('teamA');
        const teamBElement = document.getElementById('teamB');
        
        teamAElement.style.backgroundColor = this.currentTeamColors.teamA;
        teamBElement.style.backgroundColor = this.currentTeamColors.teamB;
        teamAElement.style.color = this.getContrastColor(this.currentTeamColors.teamA);
        teamBElement.style.color = this.getContrastColor(this.currentTeamColors.teamB);
    }

    getContrastColor(color) {
        const darkColors = ['red', 'blue', 'green', 'purple'];
        return darkColors.includes(color) ? 'white' : 'black';
    }

    initializeEventListeners() {
        // Mode selection
        document.getElementById('numbersBtn').addEventListener('click', () => this.showSection('numbers'));
        document.getElementById('violationsBtn').addEventListener('click', () => this.showSection('violations'));
        document.getElementById('foulsBtn').addEventListener('click', () => this.showSection('fouls'));
        document.getElementById('outOfBoundsBtn').addEventListener('click', () => this.showSection('outOfBounds'));

        // Generation buttons
        document.getElementById('generateNumber').addEventListener('click', () => this.generateNumber());
        document.getElementById('generateViolation').addEventListener('click', () => this.generateViolation());
        document.getElementById('generateFoul').addEventListener('click', () => this.generateFoul());
        document.getElementById('generateOutOfBounds').addEventListener('click', () => this.generateOutOfBounds());

        // Direction arrows for fouls
        document.getElementById('leftArrow').addEventListener('click', () => this.setDirection('left', 'foul'));
        document.getElementById('rightArrow').addEventListener('click', () => this.setDirection('right', 'foul'));
        
        // Direction arrows for violations
        document.getElementById('violationLeftArrow').addEventListener('click', () => this.setDirection('left', 'violation'));
        document.getElementById('violationRightArrow').addEventListener('click', () => this.setDirection('right', 'violation'));
        
        // Direction arrows for out of bounds
        document.getElementById('oobLeftArrow').addEventListener('click', () => this.setDirection('left', 'oob'));
        document.getElementById('oobRightArrow').addEventListener('click', () => this.setDirection('right', 'oob'));
        
        // Timer controls
        document.getElementById('startTimer').addEventListener('click', () => this.startTimer());
        document.getElementById('stopTimer').addEventListener('click', () => this.stopTimer());

        // Initialize with numbers section
        this.showSection('numbers');
    }

    showSection(section) {
        // Hide all sections
        document.querySelectorAll('.training-section').forEach(s => s.classList.add('hidden'));
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));

        // Show selected section
        document.getElementById(`${section}Training`).classList.remove('hidden');
        document.getElementById(`${section}Btn`).classList.add('active');
        
        // Update current section
        this.currentSection = section;

        // Clear displays
        this.clearDisplays();
    }

    clearDisplays() {
        document.getElementById('numberDisplay').textContent = '';
        document.getElementById('violationDisplay').textContent = '';
        document.getElementById('foulDisplay').innerHTML = '';
        document.getElementById('outOfBoundsDisplay').innerHTML = '';
        
        // Clear all arrows
        document.querySelectorAll('.arrow').forEach(arrow => arrow.classList.remove('active'));
    }

    generateNumber() {
        let number;
        const random = Math.random();
        
        if (random < 0.01) { // 1% chance for "00"
            number = "00";
        } else {
            number = Math.floor(Math.random() * 100).toString();
        }
        
        document.getElementById('numberDisplay').textContent = number;
    }

    generateViolation() {
        const randomIndex = Math.floor(Math.random() * this.violations.length);
        const violation = this.violations[randomIndex];
        
        // Generate random direction
        this.setDirection(Math.random() < 0.5 ? 'left' : 'right', 'violation');
        
        document.getElementById('violationDisplay').textContent = violation;
    }

    generateFoul() {
        // Generate new team colors
        this.currentTeamColors = this.generateRandomTeamColors();
        
        // Generate random player number (1-99 or 00)
        let playerNumber;
        const random = Math.random();
        if (random < 0.01) {
            playerNumber = "00";
        } else {
            playerNumber = Math.floor(Math.random() * 99) + 1;
        }
        
        // Select random team
        const team = Math.random() < 0.5 ? 'A' : 'B';
        const teamColor = team === 'A' ? this.currentTeamColors.teamA : this.currentTeamColors.teamB;
        
        // Select random foul
        const randomIndex = Math.floor(Math.random() * this.foulsAndConsequences.length);
        const foul = this.foulsAndConsequences[randomIndex];
        const foulName = foul[0];
        const sidelineEndlineOptions = foul[1];
        const shotOptions = foul[2];
        
        // Build consequence string - select only ONE consequence
        let selectedConsequence = '';
        const allConsequences = [...sidelineEndlineOptions, ...shotOptions];
        
        if (allConsequences.length > 0) {
            const randomIndex = Math.floor(Math.random() * allConsequences.length);
            selectedConsequence = allConsequences[randomIndex];
        }
        
        // Generate random direction
        this.setDirection(Math.random() < 0.5 ? 'left' : 'right', 'foul');
        
        // Display foul information
        const foulDisplay = document.getElementById('foulDisplay');
        foulDisplay.innerHTML = `
            <div class="player-info">${teamColor.toUpperCase()} ${playerNumber}</div>
            <div class="foul-info">
                <div class="foul-name">${foulName}</div>
                <div class="foul-details">${selectedConsequence}</div>
            </div>
        `;
    }

    generateOutOfBounds() {
        // Generate random last touch (offense or defense)
        const lastTouch = Math.random() < 0.5 ? 'offense' : 'defense';
        
        // Generate random direction
        this.setDirection(Math.random() < 0.5 ? 'left' : 'right', 'oob');
        
        const outOfBoundsDisplay = document.getElementById('outOfBoundsDisplay');
        outOfBoundsDisplay.innerHTML = `
            <div class="oob-info">
                <div class="oob-last-touch">Last Touch: <span class="last-touch-team">${lastTouch.toUpperCase()}</span></div>
            </div>
        `;
    }

    setDirection(direction, section) {
        // Clear previous active arrows for the specific section
        if (section === 'foul') {
            document.getElementById('leftArrow').classList.remove('active');
            document.getElementById('rightArrow').classList.remove('active');
            
            if (direction === 'left') {
                document.getElementById('leftArrow').classList.add('active');
            } else {
                document.getElementById('rightArrow').classList.add('active');
            }
        } else if (section === 'violation') {
            document.getElementById('violationLeftArrow').classList.remove('active');
            document.getElementById('violationRightArrow').classList.remove('active');
            
            if (direction === 'left') {
                document.getElementById('violationLeftArrow').classList.add('active');
            } else {
                document.getElementById('violationRightArrow').classList.add('active');
            }
        } else if (section === 'oob') {
            document.getElementById('oobLeftArrow').classList.remove('active');
            document.getElementById('oobRightArrow').classList.remove('active');
            
            if (direction === 'left') {
                document.getElementById('oobLeftArrow').classList.add('active');
            } else {
                document.getElementById('oobRightArrow').classList.add('active');
            }
        }
        
        this.currentDirection = direction;
    }
    
    startTimer() {
        if (this.timerRunning) return;
        
        const interval = parseInt(document.getElementById('timerInterval').value) * 1000;
        if (interval < 1000 || interval > 60000) {
            alert('Please enter a valid interval between 1 and 60 seconds.');
            return;
        }
        
        this.timerRunning = true;
        document.getElementById('startTimer').disabled = true;
        document.getElementById('stopTimer').disabled = false;
        document.getElementById('timerStatus').textContent = 'ON';
        
        // Generate first item immediately
        this.generateCurrentSection();
        
        // Set interval for subsequent generations
        this.timerInterval = setInterval(() => {
            this.generateCurrentSection();
        }, interval);
    }
    
    stopTimer() {
        if (!this.timerRunning) return;
        
        this.timerRunning = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        document.getElementById('startTimer').disabled = false;
        document.getElementById('stopTimer').disabled = true;
        document.getElementById('timerStatus').textContent = 'OFF';
    }
    
    generateCurrentSection() {
        switch(this.currentSection) {
            case 'numbers':
                this.generateNumber();
                break;
            case 'violations':
                this.generateViolation();
                break;
            case 'fouls':
                this.generateFoul();
                break;
            case 'outOfBounds':
                this.generateOutOfBounds();
                break;
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BasketballRefereeTraining();
});