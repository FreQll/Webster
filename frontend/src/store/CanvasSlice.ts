import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";

export interface CanvasState {
  canvas: any;
  undo: any[];
  redo: any[];
}

const initialState: CanvasState = {
  canvas: null,
  undo: [],
  redo: [],
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState: initialState,
  reducers: {
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
      state.redo = [];
      state.undo.push(state.canvas);
      state.canvas = action.payload;
      localStorage.setItem("canvas", JSON.stringify(state));
    },
    undoF: (state) => {
      console.log("UNDO ", state.undo.length, " ", state.redo.length);
      if (state.undo.length === 0) {
        return;
      }
      state.redo.push(state.canvas);
      state.canvas = state.undo.pop();
      localStorage.setItem("canvas", JSON.stringify(state));
    },
    redoF: (state) => {
      console.log("REDO ", state.undo.length, " ", state.redo.length);
      if (state.redo.length === 0) {
        return;
      }
      state.undo.push(state.canvas);
      state.canvas = state.redo.pop();
      localStorage.setItem("canvas", JSON.stringify(state));
    }
  },
});

export const { setCanvas, setUndo, setRedo, clearAll, updateCanvas, undoF, redoF, } = canvasSlice.actions;

export const selectCanvas = (state: any) => state.canvas.canvas;

export default canvasSlice.reducer;