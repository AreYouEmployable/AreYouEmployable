/**
 * Creates an element, sets its properties/attributes, and appends it to a parent.
 * @param {HTMLElement} parent The parent element to append the new element to.
 * @param {string} elementName The tag name of the element to create (e.g., 'div', 'span').
 * @param {object} [elementProperties={}] Optional properties for the new element.
 * @param {object} [elementProperties.attrs] Attributes to set (e.g., {'data-id': '123'}).
 * @param {object} [elementProperties.props] Properties to set (e.g., {textContent: 'Hello', className: 'foo'}).
 * @param {object|string} [elementProperties.style] Style object (e.g., {color: 'red'}) or CSS text string.
 * @param {string[]} [elementProperties.classList] Array of classes to add.
 * @param {object} [elementProperties.callbacks] Event listeners (e.g., {click: myFunction}).
 * @returns {HTMLElement} The newly created and appended element.
 */
export function createElementAndAppend(parent, elementName, elementProperties = {}) {
  const newElement = document.createElement(elementName);

  if (elementProperties.attrs) {
    for (const key in elementProperties.attrs) {
      if (elementProperties.attrs[key] !== null && elementProperties.attrs[key] !== undefined) {
        newElement.setAttribute(key, elementProperties.attrs[key]);
      }
    }
  }

  if (elementProperties.props) {
    for (const key in elementProperties.props) {
      newElement[key] = elementProperties.props[key];
    }
  }

  if (elementProperties.style && typeof elementProperties.style === 'object') {
    for (const styleProp in elementProperties.style) {
      newElement.style[styleProp] = elementProperties.style[styleProp];
    }
  } else if (elementProperties.style && typeof elementProperties.style === 'string') {
    newElement.style.cssText = elementProperties.style;
  }

  if (elementProperties.classList && Array.isArray(elementProperties.classList)) {
    newElement.classList.add(...elementProperties.classList);
  }

  if (elementProperties.callbacks) {
    for (const eventName in elementProperties.callbacks) {
      newElement.addEventListener(eventName, elementProperties.callbacks[eventName]);
    }
  }

  parent.appendChild(newElement);
  return newElement;
}
  export function fetchData(url) {
    return fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .catch(error => {
        console.error('Fetch error:', error);
        throw error;
      });
  }
  
  export function showToast(message, type = 'info') {
    const toast = document.createElement('aside');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }