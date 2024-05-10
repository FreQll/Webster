import axios, { POST_CONFIG } from "@/api/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@reduxjs/toolkit/query";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (data: { email: string; password: string }) => {
    const request = await axios.post("/auth/login", data, POST_CONFIG);
    console.log(request);
    const response = await request.data;
    console.log(response + "response");
    localStorage.setItem("user", JSON.stringify(response));
    return response;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: null,
    email: null,
    name: null,
    token: null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null; // Очистка данных пользователя при выходе
      state.id = null;
      state.email = null;
      state.name = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.token = null;
        state.id = null;
        state.email = null;
        state.name = null;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action);
        state.token = action.payload.token;
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.name = action.payload.name;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.token = null;
        state.id = null;
        state.email = null;
        state.name = null;
        if (action.error.message === "Request failed with status code 401") {
          state.error = "Invalid credentials. Access denied";
        } else {
          state.error = action.error.message;
        }
      });
  },
});

export const { logout } = userSlice.actions;
export const selectUser = (state: any) => state.user;
export default userSlice.reducer;
