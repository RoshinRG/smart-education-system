/**
 * Lightweight DOM element creator - replaces React JSX
 * Usage: h('div', { className: 'card', id: 'main' }, [
 *   h('h1', {}, 'Title'),
 *   h('p', {}, 'Content')
 * ])
 */

export function createElement(tag, props = {}, children = []) {
  // If it's a component function, call it
  if (typeof tag === 'function') {
    return tag(props, children);
  }

  const element = document.createElement(tag);

  // Set properties
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'string') {
      element.setAttribute('style', value);
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key === 'onClick' || key === 'onChange' || key === 'onInput') {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (key.startsWith('on')) {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (!['key', 'ref'].includes(key)) {
      element.setAttribute(key, value);
    }
  });

  // Add children
  const childArray = Array.isArray(children) ? children : [children];
  childArray.forEach((child) => {
    if (child) {
      if (typeof child === 'string' || typeof child === 'number') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement || child instanceof DocumentFragment) {
        element.appendChild(child);
      }
    }
  });

  return element;
}

/**
 * Mount app to DOM
 */
export function render(component, rootSelector) {
  const root = document.querySelector(rootSelector);
  if (!root) throw new Error(`Root element not found: ${rootSelector}`);
  root.innerHTML = '';
  const element = createElement(component);
  root.appendChild(element);
}

/**
 * Component hooks - state management without React
 */
let componentState = {};
let currentComponentId = null;

export function setCurrentComponent(id) {
  currentComponentId = id;
}

export function useState(initialValue) {
  const componentId = currentComponentId;
  if (!componentState[componentId]) {
    componentState[componentId] = {};
  }

  const stateKey = Object.keys(componentState[componentId]).length;
  
  if (!(stateKey in componentState[componentId])) {
    componentState[componentId][stateKey] = typeof initialValue === 'function' ? initialValue() : initialValue;
  }

  const setState = (newValue) => {
    const actualValue = typeof newValue === 'function' 
      ? newValue(componentState[componentId][stateKey]) 
      : newValue;
    componentState[componentId][stateKey] = actualValue;
    // Trigger re-render (handled by component)
  };

  return [componentState[componentId][stateKey], setState];
}

export function useEffect(callback, dependencies) {
  // Simple effect tracking
  const componentId = currentComponentId;
  if (!componentState[componentId]) {
    componentState[componentId] = {};
  }

  const effectKey = `effect_${Object.keys(componentState[componentId]).length}`;
  const previousDeps = componentState[componentId][effectKey];

  const depsChanged = !previousDeps || !dependencies || 
    dependencies.some((dep, i) => dep !== previousDeps[i]);

  if (depsChanged) {
    callback();
    componentState[componentId][effectKey] = dependencies;
  }
}

export function useCallback(callback, dependencies) {
  return callback;
}

export function useMemo(callback, dependencies) {
  const componentId = currentComponentId;
  if (!componentState[componentId]) {
    componentState[componentId] = {};
  }

  const memoKey = `memo_${Object.keys(componentState[componentId]).length}`;
  const cached = componentState[componentId][memoKey];

  const depsChanged = !cached || !dependencies || 
    dependencies.some((dep, i) => dep !== cached.deps[i]);

  if (depsChanged) {
    const value = callback();
    componentState[componentId][memoKey] = { value, deps: dependencies };
    return value;
  }

  return cached.value;
}
