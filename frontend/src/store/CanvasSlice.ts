import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";

export interface CanvasState {
  id: string,
  canvas: any;
  undo: any[];
  redo: any[];
}

const initialState: CanvasState = {
  id: '',
  canvas: null,
  undo: [],
  redo: [],
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState: initialState,
  reducers: {
    setCanvasId: (state, action: PayloadAction<any>) => {
      state.id = action.payload;
    },
    setCanvas: (state, action: PayloadAction<any>) => {
      state.canvas = action.payload;
      localStorage.setItem("canvas", JSON.stringify(state));
    },
    setUndo: (state, action: PayloadAction<any>) => {
      state.undo = action.payload;
      localStorage.setItem("canvas", JSON.stringify(state));
    },
    setRedo: (state, action: PayloadAction<any>) => {
      state.redo = action.payload;
      localStorage.setItem("canvas", JSON.stringify(state));
    },
    clearAll: (state) => {
      console.log("CLEAR ALL");
      state.id = '',
      state.canvas = null;
      state.undo = [];
      state.redo = [];
      localStorage.setItem("canvas", JSON.stringify(state));
    },
    // addUndo: (state, action: PayloadAction<any>) => {
    //   state.undo.push(action.payload);
    // },
    // addRedo: (state, action: PayloadAction<any>) => {
    //   state.redo.push(action.payload);
    // },
    // clearUndo: (state) => {
    //   state.undo = [];
    // },
    // clearRedo: (state) => {
    //   state.redo = [];
    // },
    updateCanvas: (state, action: PayloadAction<any>) => {
      if (JSON.stringify(state.canvas) === JSON.stringify(action.payload)) {
        return;
      }
      try {
        state.redo = [];
        state.undo.push(state.canvas);
        if (state.undo.length === 4) {
          state.undo.shift();
        }
        state.canvas = action.payload;
        localStorage.setItem("canvas", JSON.stringify(state));
      } catch (error) {
        state.undo = [];
        state.redo = [];
      }
    },
    undoF: (state) => {
      console.log("UNDO ", state.undo.length, " ", state.redo.length);
      if (state.undo.length === 0) {
        return;
      }
      try {
        state.redo.push(state.canvas);
        if (state.redo.length === 4) {
          state.redo.shift();
        }
        state.canvas = state.undo.pop();
      } catch (e) {
        state.undo = [];
        state.redo = [];
      }
      localStorage.setItem("canvas", JSON.stringify(state));
    },
    redoF: (state) => {
      console.log("REDO ", state.undo.length, " ", state.redo.length);
      if (state.redo.length === 0) {
        return;
      }
      try {
        state.undo.push(state.canvas);
        if (state.undo.length === 4) {
          state.undo.shift();
        }
        state.canvas = state.redo.pop();
      } catch (e) {
        state.undo = [];
        state.redo = [];
      }
      localStorage.setItem("canvas", JSON.stringify(state));
    },
  },
});

export const {
  setCanvasId,
  setCanvas,
  setUndo,
  setRedo,
  clearAll,
  updateCanvas,
  undoF,
  redoF,
} = canvasSlice.actions;

export const selectCanvas = (state: any) => state.canvas.canvas;

export default canvasSlice.reducer;