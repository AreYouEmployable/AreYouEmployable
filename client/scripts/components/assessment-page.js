const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/assessment-page.css">
  <div class="assessment-container">
    <h1>Skills Assessment</h1>
    <form id="assessment-form">
      <div class="question">
        <h3>1. How many years of experience do you have in your field?</h3>
        <input type="number" name="experience" min="0" required>
      </div>
      
      <div class="question">
        <h3>2. What is your highest level of education?</h3>
        <select name="education" required>
          <option value="">Select an option</option>
          <option value="high-school">High School</option>
          <option value="bachelors">Bachelor's Degree</option>
          <option value="masters">Master's Degree</option>
          <option value="phd">PhD</option>
        </select>
      </div>

      <div class="question">
        <h3>3. Rate your communication skills (1-5)</h3>
        <input type="range" name="communication" min="1" max="5" value="3" required>
        <div class="range-labels">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>

      <button type="submit" class="submit-btn">Submit Assessment</button>
    </form>
  </div>
`;

class AssessmentPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const form = this.shadowRoot.querySelector('#assessment-form');
    form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const assessmentData = {
      experience: formData.get('experience'),
      education: formData.get('education'),
      communication: formData.get('communication')
    };
    
    console.log('Assessment submitted:', assessmentData);
    // TODO: Send data to backend
    alert('Assessment submitted successfully!');
  }
}

customElements.define('assessment-page', AssessmentPage); 