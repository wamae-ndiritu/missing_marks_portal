import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  saving: false,
  error: null,
  course_created: false,
  courses: [],
  classList: {},
  userCourses: [],
  assigned: false,
  courseDelete: false,
  published: null,
  saved: false,
};

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    createCourseStart: (state) => {
      state.loading = false;
      state.error = null;
      state.course_created = false;
    },
    createCourseSuccess: (state) => {
      state.loading = false;
      state.course_created = true;
    },
    createCourseFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    getCoursesStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    getCoursesSuccess: (state, action) => {
      state.loading = false;
      state.courses = action.payload;
    },
    getCoursesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteCourseStart: (state) => {
      state.loading = true;
      state.error = false;
      state.courseDelete = false;
    },
    deleteCourseSuccess: (state) => {
      state.loading = false;
      state.courseDelete = true;
    },
    deleteCourseFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    actionStart: (state) => {
      state.loading = true;
      state.error = false;
      state.success = false;
      state.assigned = false;
      state.published = null;
    },
    actionFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getClassListSuccess: (state, action) => {
      state.loading = false;
      state.classList = action.payload;
    },
    assignLecturerCourseSuccess: (state) => {
      state.loading = false;
      state.assigned = true;
    },
    getLecturerCoursesSuccess: (state, action) => {
      state.loading = false;
      state.userCourses = action.payload;
    },
    publishResultSuccess: (state, action) => {
      state.loading = false;
      state.published = action.payload;
    },
    savingStart: (state) => {
      state.saving = true;
    },
    savingSuccess: (state) => {
      state.saving = false;
      state.saved = true;
    },
    savingFail: (state, action) => {
      state.saving = false;
      state.error = action.payload;
    },
    resetCourseState: (state) => {
      state.assigned = false;
      state.course_created = false;
      state.error = null;
      state.courseDelete = false;
      state.enrolled = false;
      state.published = null;
    },
  },
});

export const {
  createCourseStart,
  createCourseSuccess,
  createCourseFail,
  getCoursesStart,
  getCoursesSuccess,
  getCoursesFail,
  deleteCourseStart,
  deleteCourseSuccess,
  deleteCourseFail,
  actionStart,
  actionFail,
  assignLecturerCourseSuccess,
  getLecturerCoursesSuccess,
  resetCourseState,
  getClassListSuccess,
  savingStart,
  savingSuccess,
  savingFail,
  publishResultSuccess
} = courseSlice.actions;

export default courseSlice.reducer;
