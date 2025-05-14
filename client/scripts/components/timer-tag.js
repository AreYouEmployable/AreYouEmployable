import './tag-label.js'; 

const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/timer-tag.css">
  <section class="timer-container">
    <tag-label id="timer-label" type="timed">Loading...</tag-label>
    <time id="timer" class="timer-display" datetime="PT0M0S">00:00</time>
  </section>
`;

class TimerTag extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.timerDisplay = this.shadowRoot.querySelector('#timer');
    this.timerLabel = this.shadowRoot.querySelector('#timer-label');
    this.timerDuration = 0;
    this.interval = null;
  }

  static get observedAttributes() {
    return ['duration', 'label'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'duration' && newValue !== oldValue) {
      this.timerDuration = parseInt(newValue, 10) || 0;
      this.startTimer();
    }

    if (name === 'label' && newValue !== oldValue) {
      this.timerLabel.textContent = newValue;
    }
  }

  startTimer() {
    if (this.interval) {
      clearInterval(this.interval); 
    }

    this.interval = setInterval(() => {
      if (this.timerDuration > 0) {
        this.timerDuration--;
        this.updateTimerDisplay();
      } else {
        clearInterval(this.interval);
        this.timerDisplay.textContent = 'Time’s up!';
        this.handleTimeUp(); 
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timerDuration / 60);
    const seconds = this.timerDuration % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    this.timerDisplay.textContent = formattedTime;
    this.timerDisplay.setAttribute('datetime', `PT${minutes}M${seconds}S`);
  }

  connectedCallback() {
    if (this.hasAttribute('duration')) {
      this.timerDuration = parseInt(this.getAttribute('duration'), 10) || 0;
      this.startTimer();
    }
  }

  disconnectedCallback() {
    if (this.interval) {
      clearInterval(this.interval); 
    }
  }

  handleTimeUp() {
    window.location.href = '/assessment-results';
  }
}

customElements.define('timer-tag', TimerTag);
