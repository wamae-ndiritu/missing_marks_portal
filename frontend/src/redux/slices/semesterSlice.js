import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  success: false,
  semesters: [],
};

export const semesterSlice = createSlice({
  name: "semester",
  initialState,
  reducers: {
    getSemestersStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    getSemestersSuccesss: (state, action) => {
      state.loading = false;
      state.semesters = action.payload;
    },
    getSemestersFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { getSemestersStart, getSemestersSuccesss, getSemestersFail } =
  semesterSlice.actions;

export default semesterSlice.reducer;
