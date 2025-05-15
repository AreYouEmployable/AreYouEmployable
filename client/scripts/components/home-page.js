import { store } from '../state.js';
import { AuthService } from '../services/auth.js';

const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/home-page.css');
template.content.appendChild(stylesheetLink);

const homePageContainer = document.createElement('section');
homePageContainer.className = 'home-page__container';

const homePageHeader = document.createElement('header');
homePageHeader.className = 'home-page__header';

const h1Title = document.createElement('h1');
h1Title.className = 'home-page__title';
// Constructing the H1 title with DOM methods
h1Title.appendChild(document.createTextNode('ARE '));
const spanHighlight = document.createElement('span');
spanHighlight.className = 'home-page__title-highlight';
spanHighlight.textContent = 'You';
h1Title.appendChild(spanHighlight);
h1Title.appendChild(document.createTextNode(' Employable?'));
homePageHeader.appendChild(h1Title);

const pSubtitle = document.createElement('p');
pSubtitle.className = 'home-page__subtitle';
pSubtitle.textContent = 'An interactive, scenario-based assessment tool that evaluates whether you have what it takes to succeed as a software engineer.';
homePageHeader.appendChild(pSubtitle);
homePageContainer.appendChild(homePageHeader);

const featureCardArticle = document.createElement('article');
featureCardArticle.className = 'home-page__feature-card';

const featureGridSection = document.createElement('section');
featureGridSection.className = 'home-page__feature-grid';

const featureColumnHighlight = document.createElement('section');
featureColumnHighlight.className = 'home-page__feature-column home-page__feature-column--highlight';

const highlightHeader = document.createElement('header');
const h2EvaluateTitle = document.createElement('h2');
h2EvaluateTitle.className = 'home-page__feature-column-title';
h2EvaluateTitle.textContent = 'Evaluate Your Readiness';
highlightHeader.appendChild(h2EvaluateTitle);
featureColumnHighlight.appendChild(highlightHeader);

const featureListUl = document.createElement('ul');
featureListUl.className = 'home-page__feature-list';
const featureItemsText = [
  'Real-world coding scenarios',
  'Problem-solving challenges',
  'Team collaboration assessment',
  'Communication skills evaluation'
];
featureItemsText.forEach(text => {
  const li = document.createElement('li');
  li.className = 'home-page__feature-item';
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
  const span = document.createElement('span');
  span.textContent = text;
  li.appendChild(span);
  featureListUl.appendChild(li);
});
featureColumnHighlight.appendChild(featureListUl);

const startAssessmentBtn = document.createElement('button');
startAssessmentBtn.id = 'startAssessmentBtn';
startAssessmentBtn.className = 'home-page__button home-page__button--primary-on-dark';
startAssessmentBtn.textContent = 'Start Assessment';
featureColumnHighlight.appendChild(startAssessmentBtn);
featureGridSection.appendChild(featureColumnHighlight);

const featureColumnDetails = document.createElement('section');
featureColumnDetails.className = 'home-page__feature-column home-page__feature-column--details';

const detailsHeader = document.createElement('header');
const h2DiscoverTitle = document.createElement('h2');
h2DiscoverTitle.className = 'home-page__feature-column-title';
h2DiscoverTitle.textContent = 'What You\'ll Discover';
detailsHeader.appendChild(h2DiscoverTitle);
featureColumnDetails.appendChild(detailsHeader);

const discoveryListUl = document.createElement('ul');
discoveryListUl.className = 'home-page__discovery-list';
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
  const li = document.createElement('li');
  li.className = 'home-page__discovery-item';

  const iconWrapper = document.createElement('section');
  iconWrapper.className = `home-page__discovery-item-icon-wrapper ${item.iconClass}`;
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
  li.appendChild(iconWrapper);

  const contentSection = document.createElement('section');
  contentSection.className = 'home-page__discovery-item-content';
  const h3 = document.createElement('h3');
  h3.textContent = item.title;
  const p = document.createElement('p');
  p.textContent = item.description;
  contentSection.appendChild(h3);
  contentSection.appendChild(p);
  li.appendChild(contentSection);

  discoveryListUl.appendChild(li);
});
featureColumnDetails.appendChild(discoveryListUl);
featureGridSection.appendChild(featureColumnDetails);
featureCardArticle.appendChild(featureGridSection);
homePageContainer.appendChild(featureCardArticle);

const howItWorksSection = document.createElement('section');
howItWorksSection.className = 'home-page__how-it-works';
const howItWorksHeader = document.createElement('header');
const h2HowTitle = document.createElement('h2');
h2HowTitle.className = 'home-page__how-it-works-title';
h2HowTitle.textContent = 'How It Works';
howItWorksHeader.appendChild(h2HowTitle);
howItWorksSection.appendChild(howItWorksHeader);

const stepsGridSection = document.createElement('section');
stepsGridSection.className = 'home-page__steps-grid';
const steps = [
  { number: '1', title: 'Take the Assessment', description: 'Complete our carefully designed scenarios that mirror real-world engineering challenges.' },
  { number: '2', title: 'Get Analyzed', description: 'Our algorithm evaluates your responses across technical and soft skill dimensions.' },
  { number: '3', title: 'Review Results', description: 'Receive detailed feedback on your employability with specific strengths and improvement areas.' }
];
steps.forEach(step => {
  const article = document.createElement('article');
  article.className = 'home-page__step-card';
  const numberWrapper = document.createElement('section');
  numberWrapper.className = 'home-page__step-number-wrapper';
  const spanNumber = document.createElement('span');
  spanNumber.className = 'home-page__step-number';
  spanNumber.textContent = step.number;
  numberWrapper.appendChild(spanNumber);
  article.appendChild(numberWrapper);
  const h3 = document.createElement('h3');
  h3.className = 'home-page__step-card-title';
  h3.textContent = step.title;
  article.appendChild(h3);
  const p = document.createElement('p');
  p.className = 'home-page__step-card-description';
  p.textContent = step.description;
  article.appendChild(p);
  stepsGridSection.appendChild(article);
});
howItWorksSection.appendChild(stepsGridSection);
homePageContainer.appendChild(howItWorksSection);

const footerCta = document.createElement('footer');
footerCta.className = 'home-page__footer-cta';
const mainAssessmentBtn = document.createElement('button');
mainAssessmentBtn.id = 'mainAssessmentBtn';
mainAssessmentBtn.className = 'home-page__button home-page__button--main-cta';
mainAssessmentBtn.textContent = 'Assess Your Employability Now';
footerCta.appendChild(mainAssessmentBtn);
const pCaption = document.createElement('p');
pCaption.className = 'home-page__footer-cta-caption';
pCaption.textContent = 'Free assessment • Takes ~10 minutes • Get immediate results';
footerCta.appendChild(pCaption);
homePageContainer.appendChild(footerCta);

template.content.appendChild(homePageContainer);


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
