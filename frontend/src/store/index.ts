import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";

import canvasReducer from "./CanvasSlice";

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

const loadCanvasFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("canvas");
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
    canvas: canvasReducer,
  },
  preloadedState: {
    user: preloadedState,
    canvas: loadCanvasFromLocalStorage() || {
      canvas: null,
      undo: [],
      redo: [],
    },
  },
});

export default store;
