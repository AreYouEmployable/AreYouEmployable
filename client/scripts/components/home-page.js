// home-page.js

import { createElementAndAppend } from '../utils.js';
import { store } from '../state.js';
import { AuthService } from '../services/auth.js';

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: '/styles/components/home-page.css' }
});

const homePageContainer = createElementAndAppend(template.content, 'section', {
  props: { className: 'home-page__container' }
});

const homePageHeader = createElementAndAppend(homePageContainer, 'header', {
  props: { className: 'home-page__header' }
});

const h1Title = createElementAndAppend(homePageHeader, 'h1', {
  props: { className: 'home-page__title' }
});
h1Title.appendChild(document.createTextNode('ARE '));
createElementAndAppend(h1Title, 'span', {
  props: { className: 'home-page__title-highlight', textContent: 'You' }
});
h1Title.appendChild(document.createTextNode(' Employable?'));

createElementAndAppend(homePageHeader, 'p', {
  props: {
    className: 'home-page__subtitle',
    textContent: 'An interactive, scenario-based assessment tool that evaluates whether you have what it takes to succeed as a software engineer.'
  }
});

const featureCardArticle = createElementAndAppend(homePageContainer, 'article', {
  props: { className: 'home-page__feature-card' }
});

const featureGridSection = createElementAndAppend(featureCardArticle, 'section', {
  props: { className: 'home-page__feature-grid' }
});

const featureColumnHighlight = createElementAndAppend(featureGridSection, 'section', {
  props: { className: 'home-page__feature-column home-page__feature-column--highlight' }
});

const highlightHeader = createElementAndAppend(featureColumnHighlight, 'header');
createElementAndAppend(highlightHeader, 'h2', {
  props: { className: 'home-page__feature-column-title', textContent: 'Evaluate Your Readiness' }
});

const featureListUl = createElementAndAppend(featureColumnHighlight, 'ul', {
  props: { className: 'home-page__feature-list' }
});
const featureItemsText = [
  'Real-world coding scenarios',
  'Problem-solving challenges',
  'Team collaboration assessment',
  'Communication skills evaluation'
];
featureItemsText.forEach(text => {
  const li = createElementAndAppend(featureListUl, 'li', { props: { className: 'home-page__feature-item' } });
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'home-page__feature-item-icon');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('d', 'M5 13l4 4L19 7');
  svg.appendChild(path);
  li.appendChild(svg);
  createElementAndAppend(li, 'span', { props: { textContent: text } });
});

createElementAndAppend(featureColumnHighlight, 'button', {
  props: {
    id: 'startAssessmentBtn',
    className: 'home-page__button home-page__button--primary-on-dark',
    textContent: 'Start Assessment'
  }
});

const featureColumnDetails = createElementAndAppend(featureGridSection, 'section', {
  props: { className: 'home-page__feature-column home-page__feature-column--details' }
});

const detailsHeader = createElementAndAppend(featureColumnDetails, 'header');
createElementAndAppend(detailsHeader, 'h2', {
  props: { className: 'home-page__feature-column-title', textContent: 'What You\'ll Discover' }
});

const discoveryListUl = createElementAndAppend(featureColumnDetails, 'ul', {
  props: { className: 'home-page__discovery-list' }
});
const discoveryItems = [
  {
    iconClass: 'home-page__discovery-item-icon-wrapper--technical',
    svgPath: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    title: 'Technical Proficiency',
    description: 'Assess your coding and debugging skills against industry standards'
  },
  {
    iconClass: 'home-page__discovery-item-icon-wrapper--problem',
    svgPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    title: 'Problem-Solving',
    description: 'Test your ability to tackle complex engineering challenges'
  },
  {
    iconClass: 'home-page__discovery-item-icon-wrapper--strengths',
    svgPath: 'M5 13l4 4L19 7',
    title: 'Strengths',
    description: 'Discover your strongest engineering competencies'
  },
  {
    iconClass: 'home-page__discovery-item-icon-wrapper--growth',
    svgPath: 'M6 18L18 6M6 6l12 12',
    title: 'Growth Areas',
    description: 'Identify specific skills to improve for better employability'
  }
];

discoveryItems.forEach(item => {
  const li = createElementAndAppend(discoveryListUl, 'li', { props: { className: 'home-page__discovery-item' } });
  const iconWrapper = createElementAndAppend(li, 'section', {
    props: { className: `home-page__discovery-item-icon-wrapper ${item.iconClass}` }
  });
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', `home-page__discovery-item-icon ${item.iconClass.replace('-wrapper', '')}`);
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('d', item.svgPath);
  svg.appendChild(path);
  iconWrapper.appendChild(svg);

  const contentSection = createElementAndAppend(li, 'section', {
    props: { className: 'home-page__discovery-item-content' }
  });
  createElementAndAppend(contentSection, 'h3', { props: { textContent: item.title } });
  createElementAndAppend(contentSection, 'p', { props: { textContent: item.description } });
});

const howItWorksSection = createElementAndAppend(homePageContainer, 'section', {
  props: { className: 'home-page__how-it-works' }
});
const howItWorksHeader = createElementAndAppend(howItWorksSection, 'header');
createElementAndAppend(howItWorksHeader, 'h2', {
  props: { className: 'home-page__how-it-works-title', textContent: 'How It Works' }
});

const stepsGridSection = createElementAndAppend(howItWorksSection, 'section', {
  props: { className: 'home-page__steps-grid' }
});
const steps = [
  { number: '1', title: 'Take the Assessment', description: 'Complete our carefully designed scenarios that mirror real-world engineering challenges.' },
  { number: '2', title: 'Get Analyzed', description: 'Our algorithm evaluates your responses across technical and soft skill dimensions.' },
  { number: '3', title: 'Review Results', description: 'Receive detailed feedback on your employability with specific strengths and improvement areas.' }
];
steps.forEach(step => {
  const article = createElementAndAppend(stepsGridSection, 'article', {
    props: { className: 'home-page__step-card' }
  });
  const numberWrapper = createElementAndAppend(article, 'section', {
    props: { className: 'home-page__step-number-wrapper' }
  });
  createElementAndAppend(numberWrapper, 'span', {
    props: { className: 'home-page__step-number', textContent: step.number }
  });
  createElementAndAppend(article, 'h3', {
    props: { className: 'home-page__step-card-title', textContent: step.title }
  });
  createElementAndAppend(article, 'p', {
    props: { className: 'home-page__step-card-description', textContent: step.description }
  });
});

const footerCta = createElementAndAppend(homePageContainer, 'footer', {
  props: { className: 'home-page__footer-cta' }
});
createElementAndAppend(footerCta, 'button', {
  props: {
    id: 'mainAssessmentBtn',
    className: 'home-page__button home-page__button--main-cta',
    textContent: 'Assess Your Employability Now'
  }
});
createElementAndAppend(footerCta, 'p', {
  props: {
    className: 'home-page__footer-cta-caption',
    textContent: 'Free assessment • Takes ~10 minutes • Get immediate results'
  }
});

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

    if (startBtn) {
        startBtn.addEventListener('click', handleClick);
    }
    if (mainBtn) {
        mainBtn.addEventListener('click', handleClick);
    }
  }
}

customElements.define('home-page', HomePage);
