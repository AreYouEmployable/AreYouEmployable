const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/home-page.css">
  <section class="container">
    <header class="text-center">
      <h1>ARE <span class="text-blue-600">You</span> Employable?</h1>
      <p class="text-xl">An interactive, scenario-based assessment tool that evaluates whether you have what it takes to succeed as a software engineer.</p>
    </header>

    <article class="feature-card">
      <section class="grid-cols-2">
        <section class="p-8 md:p-12 bg-blue-600">
          <header>
            <h2 class="text-2xl font-semibold mb-6">Evaluate Your Readiness</h2>
          </header>
          <ul class="space-y-4">
            <li class="flex items-start">
              <svg class="h-6 w-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Real-world coding scenarios</span>
            </li>
            <li class="flex items-start">
              <svg class="h-6 w-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Problem-solving challenges</span>
            </li>
            <li class="flex items-start">
              <svg class="h-6 w-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Team collaboration assessment</span>
            </li>
            <li class="flex items-start">
              <svg class="h-6 w-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Communication skills evaluation</span>
            </li>
          </ul>
          
          <button id="startAssessmentBtn" class="mt-8 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 transform hover:scale-105">
            Start Assessment
          </button>
        </section>
        
        <section class="p-8 md:p-12">
          <header>
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">What You'll Discover</h2>
          </header>
          <ul class="space-y-4 text-gray-600">
            <li class="flex items-start">
              <section class="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </section>
              <section>
                <h3 class="font-medium text-gray-900">Technical Proficiency</h3>
                <p class="mt-1">Assess your coding and debugging skills against industry standards</p>
              </section>
            </li>
            <li class="flex items-start">
              <section class="bg-purple-100 p-2 rounded-full mr-3 flex-shrink-0">
                <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </section>
              <section>
                <h3 class="font-medium text-gray-900">Problem-Solving</h3>
                <p class="mt-1">Test your ability to tackle complex engineering challenges</p>
              </section>
            </li>
            <li class="flex items-start">
              <section class="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </section>
              <section>
                <h3 class="font-medium text-gray-900">Strengths</h3>
                <p class="mt-1">Discover your strongest engineering competencies</p>
              </section>
            </li>
            <li class="flex items-start">
              <section class="bg-amber-100 p-2 rounded-full mr-3 flex-shrink-0">
                <svg class="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </section>
              <section>
                <h3 class="font-medium text-gray-900">Growth Areas</h3>
                <p class="mt-1">Identify specific skills to improve for better employability</p>
              </section>
            </li>
          </ul>
        </section>
      </section>
    </article>
    
    <section style="max-width: 56rem; margin-left: auto; margin-right: auto;">
      <header>
        <h2 class="text-2xl font-semibold text-center text-gray-900 mb-8">How It Works</h2>
      </header>
      
      <section class="grid md:grid-cols-3 gap-8">
        <article class="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
          <section class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span class="text-blue-600 font-bold text-lg">1</span>
          </section>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Take the Assessment</h3>
          <p class="text-gray-600">Complete our carefully designed scenarios that mirror real-world engineering challenges.</p>
        </article>
        
        <article class="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
          <section class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span class="text-blue-600 font-bold text-lg">2</span>
          </section>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Get Analyzed</h3>
          <p class="text-gray-600">Our algorithm evaluates your responses across technical and soft skill dimensions.</p>
        </article>
        
        <article class="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
          <section class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span class="text-blue-600 font-bold text-lg">3</span>
          </section>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Review Results</h3>
          <p class="text-gray-600">Receive detailed feedback on your employability with specific strengths and improvement areas.</p>
        </article>
      </section>
    </section>
    
    <footer class="text-center mt-16">
      <button id="mainAssessmentBtn" class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105 shadow-lg">
        Assess Your Employability Now
      </button>
      <p class="mt-4 text-gray-500">Free assessment • Takes ~10 minutes • Get immediate results</p>
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
    
    const handleClick = () => {
      this.dispatchEvent(new CustomEvent('start-assessment', {
        bubbles: true,
        composed: true
      }));
    };

    startBtn.addEventListener('click', handleClick);
    mainBtn.addEventListener('click', handleClick);
  }
}

customElements.define('home-page', HomePage);