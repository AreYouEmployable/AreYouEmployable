class Navigation extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.template = document.createElement('template');
        this.template.innerHTML = `
            <style>
                nav {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .nav-link {
                    color: var(--text-color);
                    text-decoration: none;
                    padding: 0.5rem 1rem;
                    border-radius: .4rem;
                    transition: all 0.3s ease;
                }

                .nav-link:hover {
                    background-color: var(--background-secondary);
                }

                .nav-link.active {
                    background-color: var(--primary-color);
                    color: white;
                }

                @media (max-width: 600px) {
                    nav {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .nav-link {
                        width: 100%;
                        text-align: left;
                    }
                }
            </style>
            <nav>
                <a href="/" class="nav-link" data-route="home">Home</a>
                </nav>
                `;
            }
            // <a href="/profile" class="nav-link" data-route="profile">Profile</a>

    connectedCallback() {
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
        this.setupEventListeners();
        this.updateActiveLink();
    }

    setupEventListeners() {
        this.shadowRoot.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const route = event.target.getAttribute('data-route');
                this.navigate(route);
            });
        });

        window.addEventListener('popstate', () => {
            this.updateActiveLink();
        });
    }

    navigate(route) {
        const path = route === 'home' ? '/' : `/${route}`;
        window.history.pushState({}, '', path);
        this.updateActiveLink();
        
        window.dispatchEvent(new CustomEvent('routeChange', {
            detail: { route }
        }));
    }

    updateActiveLink() {
        const currentPath = window.location.pathname;
        this.shadowRoot.querySelectorAll('.nav-link').forEach(link => {
            const route = link.getAttribute('data-route');
            const path = route === 'home' ? '/' : `/${route}`;
            link.classList.toggle('active', currentPath === path);
        });
    }
}

customElements.define('app-navigation', Navigation); 