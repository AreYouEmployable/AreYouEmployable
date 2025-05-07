class Store {
    constructor(reducer, initialState) {
      this.state = initialState;
      this.reducer = reducer;
      this.subscribers = [];
    }
  
    getState() {
      return this.state;
    }
  
    dispatch(action) {
      this.state = this.reducer(this.state, action);
      this.notifySubscribers();
    }
  
    subscribe(callback) {
      this.subscribers.push(callback);
      return () => {
        this.subscribers = this.subscribers.filter(sub => sub !== callback);
      };
    }
  
    notifySubscribers() {
      this.subscribers.forEach(callback => callback(this.state));
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
        token: null
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
                isAuthenticated: !!action.payload.user,
                user: action.payload.user,
                token: action.payload.token
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
    setAuth: (payload) => ({ type: 'SET_AUTH', payload })
  };
  
  export const store = new Store(appReducer, initialState);