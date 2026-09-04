/**
 * Simple event-driven state management
 * No Redux, no Context API - just vanilla JS with Observer pattern
 */

class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Map();
    this.history = [];
  }

  // Subscribe to state changes
  subscribe(key, listener) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.get(key).delete(listener);
    };
  }

  // Subscribe to all changes
  subscribeAll(listener) {
    if (!this.listeners.has('*')) {
      this.listeners.set('*', new Set());
    }
    this.listeners.get('*').add(listener);

    return () => {
      this.listeners.get('*').delete(listener);
    };
  }

  // Update state
  setState(key, value) {
    const oldValue = this.state[key];
    this.state[key] = typeof value === 'function' ? value(oldValue) : value;

    // Record history (for debugging)
    this.history.push({
      timestamp: new Date(),
      key,
      oldValue,
      newValue: this.state[key],
    });

    // Notify listeners
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach((listener) => listener(this.state[key], oldValue));
    }

    // Notify all listeners
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach((listener) => listener(this.state, key));
    }
  }

  // Get state
  getState(key) {
    return key ? this.state[key] : this.state;
  }

  // Batch updates
  batchUpdate(updates) {
    Object.entries(updates).forEach(([key, value]) => {
      this.state[key] = typeof value === 'function' ? value(this.state[key]) : value;
    });

    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach((listener) => listener(this.state, 'batch'));
    }
  }

  // Clear history
  clearHistory() {
    this.history = [];
  }

  // Get history
  getHistory() {
    return this.history;
  }
}

// Export singleton store
export const appStore = new Store({
  // Auth state
  user: null,
  isAuthenticated: false,
  authToken: localStorage.getItem('authToken') || null,

  // UI state
  currentPage: 'home',
  sidebarOpen: true,
  showModal: false,
  modalContent: null,
  notifications: [],

  // App state
  chatHistory: [],
  flashcards: [],
  quizzes: [],
  studyPlan: null,
  userProgress: {},

  // Loading states
  isLoading: false,
  error: null,
});

// Helper hooks for components
export function useStore(key) {
  const value = appStore.getState(key);
  
  return {
    value,
    setValue: (newValue) => appStore.setState(key, newValue),
    subscribe: (listener) => appStore.subscribe(key, listener),
  };
}

// Persist auth token
export function persistAuthToken(token) {
  localStorage.setItem('authToken', token);
  appStore.setState('authToken', token);
}

export function clearAuthToken() {
  localStorage.removeItem('authToken');
  appStore.setState('authToken', null);
}

// ─── React hook ───────────────────────────────────────────────────────────────
// Allows React components to read and react to store changes without a full
// React context / Redux setup.
//
//   const user = useAppStore('user');
//
import { useState, useEffect } from 'react';

export function useAppStore(key) {
  const [value, setValue] = useState(() => appStore.getState(key));

  useEffect(() => {
    // Sync immediately in case state changed between render and effect
    setValue(appStore.getState(key));
    const unsubscribe = appStore.subscribe(key, (newVal) => setValue(newVal));
    return unsubscribe;
  }, [key]);

  return value;
}
