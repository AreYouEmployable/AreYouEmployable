const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/assessment-page.css">
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

  <section class="container">
    <!-- Header Section -->
    <header class="text-center mb-8">
      <h2 class="text-2xl font-semibold text-gray-900" id="scenario-title">Loading scenario title...</h2>
      <p class="text-gray-600" id="scenario-description">Loading scenario description...</p>
    </header>

    <!-- Progress Bar Indicator -->
    <section class="progress-bar bg-gray-200 rounded-lg h-4 mb-6 overflow-hidden">
      <div id="progress" class="bg-blue-600 h-4 transition-all duration-300" style="width: 20%;"></div>
    </section>

    <!-- Question Block (Container for each question) -->
    <article class="question-block bg-white shadow-md rounded-lg p-6">
      <!-- Question Header -->
      <header class="mb-4">
        <h3 class="text-lg font-semibold text-gray-900" id="question-title">Loading question...</h3>
        <p class="text-sm text-gray-500 mt-2">Complexity: <span id="complexity-level">-</span></p>
      </header>

      <!-- Option List (Dynamic options added here) -->
      <form id="assessment-form" class="space-y-4">
        <div id="options-list"></div>

        <!-- Navigation Controls -->
        <div class="flex justify-between mt-6">
          <button type="button" id="prev-btn" class="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition hidden">
            Previous
          </button>
          <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Submit Answer
          </button>
          <button type="button" id="next-btn" class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition hidden">
            Next
          </button>
        </div>
      </form>
    </article>
  </section>
`;

class AssessmentPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

  
    this.progressBar = this.shadowRoot.querySelector('#progress');
    this.title = this.shadowRoot.querySelector('#question-title');
    this.complexityText = this.shadowRoot.querySelector('#complexity');
    this.description = this.shadowRoot.querySelector('#scenario-description');
    this.optionsList = this.shadowRoot.querySelector('#options-list');
    this.prevBtn = this.shadowRoot.querySelector('#prev-btn');
    this.nextBtn = this.shadowRoot.querySelector('#next-btn');

    // Mock data (replacing API call)
    this.scenarioData = {
      scenario_id: 1,
      scenario_title: "Debugging Challenge",
      scenario_description: "You've been tasked with fixing a critical bug in production. How do you approach the situation?",
      type: "Technical",
      difficulty: "Medium",  // You can change this to "Easy", "Hard", etc.
      questions: [
        {
          question_id: 2,
          question_text: "You found that a third-party API is down. How do you handle this?",
          options: [
            { option_id: 5, label: "A", value: "Implement a fallback mechanism" },
            { option_id: 6, label: "B", value: "Wait for the API to come back online" },
            { option_id: 7, label: "C", value: "Add error messaging and graceful degradation" },
            { option_id: 8, label: "D", value: "Complain to the API provider" }
          ]
        },
        {
          question_id: 1,
          question_text: "The production website is showing a blank page. What's your first step?",
          options: [
            { option_id: 1, label: "A", value: "Immediately roll back to the previous version" },
            { option_id: 2, label: "B", value: "Check browser console and server logs" },
            { option_id: 3, label: "C", value: "Ask another developer what changed" },
            { option_id: 4, label: "D", value: "Try to reproduce the issue locally" }
          ]
        }
      ]
    };

    this.questionIndex = 0;
    this.currentQuestionId = null;
  }

  connectedCallback() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.prevBtn.addEventListener('click', this.prevQuestion.bind(this));
    this.nextBtn.addEventListener('click', this.nextQuestion.bind(this));
    this.renderQuestion(this.scenarioData.questions[this.questionIndex]);
  }

  renderQuestion(question) {
    this.currentQuestionId = question.question_id;
    this.title.textContent = question.question_text;
    this.complexityText.textContent = `Complexity: ${this.scenarioData.difficulty}`;
    this.description.textContent = this.scenarioData.scenario_description;

    const progressPercent = ((this.questionIndex + 1) / this.scenarioData.questions.length) * 100;
    this.progressBar.style.width = `${progressPercent}%`; 

    this.optionsList.innerHTML = '';  
    question.options.forEach(opt => {
      const label = document.createElement('label');
      label.classList.add('option', 'flex', 'items-start', 'space-x-3');
      label.innerHTML = `
        <input type="checkbox" name="answer" value="${opt.option_id}" class="h-4 w-4 border-gray-300 rounded focus:ring-blue-500"/>
        <span class="ml-2 text-gray-900">${opt.label}. ${opt.value}</span>
      `;
      this.optionsList.appendChild(label);
    });

    
    this.prevBtn.classList.toggle('hidden', this.questionIndex === 0);
    this.nextBtn.classList.toggle('hidden', this.questionIndex === this.scenarioData.questions.length - 1);
  }

  handleSubmit(e) {
    e.preventDefault();
    const selected = Array.from(this.form.querySelectorAll('input[name="answer"]:checked'))
      .map(cb => Number(cb.value));

    if (selected.length === 0) {
      alert('Please select at least one option.');
      return;
    }

    alert('Answer submitted!');
    this.nextQuestion();
  }

  prevQuestion() {
    if (this.questionIndex > 0) {
      this.questionIndex--;
      this.renderQuestion(this.scenarioData.questions[this.questionIndex]);
    }
  }

  nextQuestion() {
    if (this.questionIndex < this.scenarioData.questions.length - 1) {
      this.questionIndex++;
      this.renderQuestion(this.scenarioData.questions[this.questionIndex]);
    } else {
      alert('Assessment complete!');
    }
  }
}

customElements.define('assessment-page', AssessmentPage);
