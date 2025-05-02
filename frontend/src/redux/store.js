import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlices";
import courseReducer from "./slices/courseSlice";
import semesterReducer from "./slices/semesterSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    course: courseReducer,
    semester: semesterReducer
  },
});
