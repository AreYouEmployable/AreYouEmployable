class Store {
    constructor(reducer, initialState) {
      this.reducer = reducer;
      this.state = initialState;
      this.listeners = [];
    }
  
    getState() {
      return this.state;
    }
  
    dispatch(action) {
      this.state = this.reducer(this.state, action);
      this.listeners.forEach(listener => listener(this.state));
    }
  
    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }
  }
  
  // Initial state
  const initialState = {
    user: null,
    posts: [],
    theme: 'light',
    isLoading: false,
    error: null,
    auth: {
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
    }
  };
  
  function appReducer(state = initialState, action) {
    switch (action.type) {
      case 'SET_USER':
        return { ...state, user: action.payload };
      case 'SET_POSTS':
        return { ...state, posts: action.payload };
      case 'SET_THEME':
        return { ...state, theme: action.payload };
      case 'SET_LOADING':
        return { ...state, isLoading: action.payload };
      case 'SET_ERROR':
        return { ...state, error: action.payload };
      case 'ADD_POST':
        return { ...state, posts: [action.payload, ...state.posts] };
      case 'SET_AUTH':
        return {
            ...state,
            auth: {
                ...state.auth,
                ...action.payload
            }
        };
      case 'SET_AUTH_ERROR':
        return {
            ...state,
            auth: {
                ...state.auth,
                error: action.payload
            }
        };
      case 'CLEAR_AUTH':
        return {
            ...state,
            auth: {
                ...state.auth,
                isAuthenticated: false,
                user: null,
                token: null,
                error: null
            }
        };
      default:
        return state;
    }
  }
  
  export const actions = {
    setUser: (user) => ({ type: 'SET_USER', payload: user }),
    setPosts: (posts) => ({ type: 'SET_POSTS', payload: posts }),
    setTheme: (theme) => ({ type: 'SET_THEME', payload: theme }),
    setLoading: (isLoading) => ({ type: 'SET_LOADING', payload: isLoading }),
    setError: (error) => ({ type: 'SET_ERROR', payload: error }),
    addPost: (post) => ({ type: 'ADD_POST', payload: post }),
    setAuth: (payload) => ({ type: 'SET_AUTH', payload }),
    setAuthError: (error) => ({ type: 'SET_AUTH_ERROR', payload: error }),
    clearAuth: () => ({ type: 'CLEAR_AUTH' })
  };
  
  export const store = new Store(appReducer, initialState);