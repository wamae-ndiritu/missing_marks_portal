import { BASE_URL } from "../../URL";
import {
  actionFail,
  actionStart,
  assignLecturerCourseSuccess,
  createCourseFail,
  createCourseStart,
  createCourseSuccess,
  deleteCourseFail,
  deleteCourseStart,
  deleteCourseSuccess,
  getClassListSuccess,
  getCoursesFail,
  getCoursesStart,
  getCoursesSuccess,
  getLecturerCoursesSuccess,
  publishResultSuccess,
  savingFail,
  savingStart,
  savingSuccess,
} from "../slices/courseSlice";
import axios from "redaxios";
import {
  enrollCoursesFail,
  enrollCoursesStart,
  enrollCoursesSuccess,
  getMyCoursesFail,
  getMyCoursesStart,
  getMyCoursesSuccess,
} from "../slices/userSlices";
import { logout } from "./userActions";

export const createCourse = (courseData) => async (dispatch, getState) => {
  try {
    dispatch(createCourseStart());

    const {
      user: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.token?.access}`,
        "Content-Type": "application/json",
      },
    };

    await axios.post(`${BASE_URL}/courses/create/`, courseData, config);
    dispatch(createCourseSuccess());
  } catch (err) {
    const errMsg =
      err?.data && err?.data?.length
        ? err.data[0]?.message
        : err?.data
        ? err.data?.message || err.data?.detail
        : err.statusText;
    if (
      errMsg === "Authentication credentials were not provided." ||
      errMsg === "Given token not valid for any token type"
    ) {
      dispatch(logout());
    } else {
      dispatch(createCourseFail(errMsg));
    }
  }
};

export const getCourses = () => async (dispatch, getState) => {
  try {
    dispatch(getCoursesStart());

    const {
      user: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.token?.access}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.get(`${BASE_URL}/courses/`, config);
    dispatch(getCoursesSuccess(data));
  } catch (err) {
    const errMsg =
      err?.data && err?.data?.length
        ? err.data[0]?.message
        : err?.data
        ? err.data?.message || err.data?.detail
        : err.statusText;
    if (
      errMsg === "Authentication credentials were not provided." ||
      errMsg === "Given token not valid for any token type"
    ) {
      dispatch(logout());
    } else {
      dispatch(getCoursesFail(errMsg));
    }
  }
};

// Get user Courses
export const getMyCourses =
  (type = "student") =>
  async (dispatch, getState) => {
    try {
      dispatch(getMyCoursesStart());

      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token?.access}`,
        },
      };

      let courses;

      if (type === "student") {
        const { data } = await axios.get(
          `${BASE_URL}/courses/enrolled/`,
          config
        );
        // users/lecturer/courses/
        courses = data;
      } else if (type === "lecturer") {
        const { data } = await axios.get(
          `${BASE_URL}/users/lecturer/courses/`,
          config
        );
        // users/lecturer/courses/
        courses = data;
      }
      dispatch(getMyCoursesSuccess(courses));
    } catch (err) {
      const errMsg = err?.data
        ? err.data?.message || err.data?.detail
        : err.statusText;
      if (
        errMsg === "Authentication credentials were not provided." ||
        errMsg === "Given token not valid for any token type"
      ) {
        dispatch(logout());
      }
      dispatch(getMyCoursesFail(errMsg));
    }
  };

// Current user enroll courses
export const enrollCourses = (courseData) => async (dispatch, getState) => {
  try {
    dispatch(enrollCoursesStart());

    const {
      user: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.token?.access}`,
      },
    };
    await axios.post(`${BASE_URL}/courses/enroll/`, courseData, config);
    dispatch(enrollCoursesSuccess());
  } catch (err) {
    console.log(err)
    const errMsg =
      err?.data && err?.data?.length
        ? err.data[0]?.message
        : err?.data
        ? err.data?.message || err.data?.detail
        : err.statusText;
    if (
      errMsg === "Authentication credentials were not provided." ||
      errMsg === "Given token not valid for any token type"
    ) {
      dispatch(logout());
    }
    dispatch(enrollCoursesFail(errMsg));
  }
};

export const deleteCourse = (course_id) => async (dispatch, getState) => {
  const course_code = course_id.replace(" ", "-");
  try {
    dispatch(deleteCourseStart());

    const {
      user: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.token?.access}`,
      },
    };

    await axios.delete(`${BASE_URL}/courses/${course_code}/delete/`, config);
    dispatch(deleteCourseSuccess());
  } catch (err) {
    const errMsg =
      err?.data && err?.data?.length
        ? err.data[0]?.message
        : err?.data
        ? err.data?.message || err.data?.detail
        : err.statusText;
    if (
      errMsg === "Authentication credentials were not provided." ||
      errMsg === "Given token not valid for any token type"
    ) {
      dispatch(logout());
    } else {
      dispatch(deleteCourseFail(errMsg));
    }
  }
};

// Admin assign lecturer course
export const assignLecturerCourse =
  (course, lecturerId) => async (dispatch, getState) => {
    try {
      dispatch(actionStart());

      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token?.access}`,
          "Content-Type": "application/json",
        },
      };

      await axios.post(
        `${BASE_URL}/users/lecturers/${lecturerId}/courses/enroll/`,
        course,
        config
      );
      dispatch(assignLecturerCourseSuccess());
    } catch (err) {
      const errMsg =
        err?.data && err?.data?.length
          ? err.data[0]?.message
          : err?.data
          ? err.data?.message || err.data?.detail
          : err.statusText;
      if (
        errMsg === "Authentication credentials were not provided." ||
        errMsg === "Given token not valid for any token type"
      ) {
        dispatch(logout());
      } else {
        dispatch(actionFail(errMsg));
      }
    }
  };

//  Admin get lecturer courses
export const getLecturerCourses =
  (lecturerId) => async (dispatch, getState) => {
    try {
      dispatch(actionStart());

      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token?.access}`,
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.get(
        `${BASE_URL}/users/lecturers/${lecturerId}/courses/`,
        config
      );
      dispatch(getLecturerCoursesSuccess(data));
    } catch (err) {
      const errMsg =
        err?.data && err?.data?.length
          ? err.data[0]?.message
          : err?.data
          ? err.data?.message || err.data?.detail
          : err.statusText;
      if (
        errMsg === "Authentication credentials were not provided." ||
        errMsg === "Given token not valid for any token type"
      ) {
        dispatch(logout());
      } else {
        dispatch(actionFail(errMsg));
      }
    }
  };

export const getClassList = (obj, searchId='') =>  async (dispatch, getState) => {
  try {
    dispatch(actionStart());
    const {
      user: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.token?.access}`,
      },
    };
    const { data } = await axios.post(`${BASE_URL}/courses/students/?searchId=${searchId}`, obj, config);
    dispatch(getClassListSuccess(data));
  } catch (err) {
    const errMsg =
      err?.data && err?.data?.length
        ? err.data[0]?.message
        : err?.data
        ? err.data?.message || err.data?.detail
        : err.statusText;
    if (
      errMsg === "Authentication credentials were not provided." ||
      errMsg === "Given token not valid for any token type"
    ) {
      dispatch(logout());
    } else {
      dispatch(actionFail(errMsg));
    }
  }
};

// Save updated marks
export const autoSaveMarks = (marks) => async (dispatch, getState) => {
  try {
    dispatch(savingStart());
    const {
      user: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.token?.access}`,
      },
    };
    await axios.patch(`${BASE_URL}/courses/results/upload/`, marks, config);
    dispatch(savingSuccess());
  } catch (err) {
    const errMsg =
      err?.data && err?.data?.length
        ? err.data[0]?.message
        : err?.data
        ? err.data?.message || err.data?.detail
        : err.statusText;
    if (
      errMsg === "Authentication credentials were not provided." ||
      errMsg === "Given token not valid for any token type"
    ) {
      dispatch(logout());
    } else {
      dispatch(savingFail(errMsg));
    }
  }
};

// Publish results
export const publishResults = (courseData) => async (dispatch, getState) => {
  try {
    dispatch(actionStart());
    const {
      user: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.token?.access}`,
        "Content-Type": "application/json"
      },
    };
    const {data} = await axios.patch(`${BASE_URL}/courses/results/publish/`, courseData, config);
    dispatch(publishResultSuccess(data?.message));
  } catch (err) {
    console.log(err)
    const errMsg =
      err?.data && err?.data?.length
        ? err.data[0]?.message
        : err?.data
        ? err.data?.message || err.data?.detail
        : err.statusText;
    if (
      errMsg === "Authentication credentials were not provided." ||
      errMsg === "Given token not valid for any token type"
    ) {
      dispatch(logout());
    } else {
      dispatch(actionFail(errMsg));
    }
  }
};