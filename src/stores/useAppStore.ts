import {create} from 'zustand';

interface AppState {
  // Define your state and actions here
}

const useAppStore = create<AppState>(() => ({
  // Add your initial state and actions
}));

export default useAppStore;
