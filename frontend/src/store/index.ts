import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";

const loadUserFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("user");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const preloadedState = loadUserFromLocalStorage();

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: {
    user: preloadedState,
  },
});

export default store;
