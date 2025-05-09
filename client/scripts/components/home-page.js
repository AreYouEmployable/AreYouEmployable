import { store } from '../state.js';
import { AuthService } from '../services/auth.js';

const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/home-page.css">
<section class="home-page__container">
  <header class="home-page__header">
    <h1 class="home-page__title">ARE <span class="home-page__title-highlight">You</span> Employable?</h1>
    <p class="home-page__subtitle">An interactive, scenario-based assessment tool that evaluates whether you have what it takes to succeed as a software engineer.</p>
  </header>

  <article class="home-page__feature-card">
    <section class="home-page__feature-grid">
      <section class="home-page__feature-column home-page__feature-column--highlight">
        <header>
          <h2 class="home-page__feature-column-title">Evaluate Your Readiness</h2>
        </header>
        <ul class="home-page__feature-list">
          <li class="home-page__feature-item">
            <svg class="home-page__feature-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Real-world coding scenarios</span>
          </li>
          <li class="home-page__feature-item">
            <svg class="home-page__feature-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Problem-solving challenges</span>
          </li>
          <li class="home-page__feature-item">
            <svg class="home-page__feature-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Team collaboration assessment</span>
          </li>
          <li class="home-page__feature-item">
            <svg class="home-page__feature-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Communication skills evaluation</span>
          </li>
        </ul>
        
        <button id="startAssessmentBtn" class="home-page__button home-page__button--primary-on-dark">
          Start Assessment
        </button>
      </section>
      
      <section class="home-page__feature-column home-page__feature-column--details">
        <header>
          <h2 class="home-page__feature-column-title">What You'll Discover</h2>
        </header>
        <ul class="home-page__discovery-list">
          <li class="home-page__discovery-item">
            <section class="home-page__discovery-item-icon-wrapper home-page__discovery-item-icon-wrapper--technical">
              <svg class="home-page__discovery-item-icon home-page__discovery-item-icon--technical" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </section>
            <section class="home-page__discovery-item-content">
              <h3>Technical Proficiency</h3>
              <p>Assess your coding and debugging skills against industry standards</p>
            </section>
          </li>
          <li class="home-page__discovery-item">
            <section class="home-page__discovery-item-icon-wrapper home-page__discovery-item-icon-wrapper--problem">
              <svg class="home-page__discovery-item-icon home-page__discovery-item-icon--problem" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </section>
            <section class="home-page__discovery-item-content">
              <h3>Problem-Solving</h3>
              <p>Test your ability to tackle complex engineering challenges</p>
            </section>
          </li>
          <li class="home-page__discovery-item">
            <section class="home-page__discovery-item-icon-wrapper home-page__discovery-item-icon-wrapper--strengths">
              <svg class="home-page__discovery-item-icon home-page__discovery-item-icon--strengths" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </section>
            <section class="home-page__discovery-item-content">
              <h3>Strengths</h3>
              <p>Discover your strongest engineering competencies</p>
            </section>
          </li>
          <li class="home-page__discovery-item">
            <section class="home-page__discovery-item-icon-wrapper home-page__discovery-item-icon-wrapper--growth">
              <svg class="home-page__discovery-item-icon home-page__discovery-item-icon--growth" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </section>
            <section class="home-page__discovery-item-content">
              <h3>Growth Areas</h3>
              <p>Identify specific skills to improve for better employability</p>
            </section>
          </li>
        </ul>
      </section>
    </section>
  </article>
  
  <section class="home-page__how-it-works">
    <header>
      <h2 class="home-page__how-it-works-title">How It Works</h2>
    </header>
    
    <section class="home-page__steps-grid">
      <article class="home-page__step-card">
        <section class="home-page__step-number-wrapper">
          <span class="home-page__step-number">1</span>
        </section>
        <h3 class="home-page__step-card-title">Take the Assessment</h3>
        <p class="home-page__step-card-description">Complete our carefully designed scenarios that mirror real-world engineering challenges.</p>
      </article>
      
      <article class="home-page__step-card">
        <section class="home-page__step-number-wrapper">
          <span class="home-page__step-number">2</span>
        </section>
        <h3 class="home-page__step-card-title">Get Analyzed</h3>
        <p class="home-page__step-card-description">Our algorithm evaluates your responses across technical and soft skill dimensions.</p>
      </article>
      
      <article class="home-page__step-card">
        <section class="home-page__step-number-wrapper">
          <span class="home-page__step-number">3</span>
        </section>
        <h3 class="home-page__step-card-title">Review Results</h3>
        <p class="home-page__step-card-description">Receive detailed feedback on your employability with specific strengths and improvement areas.</p>
      </article>
    </section>
  </section>
  
  <footer class="home-page__footer-cta">
    <button id="mainAssessmentBtn" class="home-page__button home-page__button--main-cta">
      Assess Your Employability Now
    </button>
    <p class="home-page__footer-cta-caption">Free assessment • Takes ~10 minutes • Get immediate results</p>
  </footer>
</section>
`;

class HomePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const startBtn = this.shadowRoot.getElementById('startAssessmentBtn');
    const mainBtn = this.shadowRoot.getElementById('mainAssessmentBtn');
    
    const handleClick = (e) => {
      const state = store.getState();
      if (!state.auth.isAuthenticated) {
        e.preventDefault();
        AuthService.signInWithGoogle();
      } else {
        this.dispatchEvent(new CustomEvent('start-assessment', {
          bubbles: true,
          composed: true
        }));
      }
    };

    startBtn.addEventListener('click', handleClick);
    mainBtn.addEventListener('click', handleClick);
  }
}

customElements.define('home-page', HomePage);