import {
  userLoginFail,
  userLoginStart,
  userLoginSuccess,
  clearUserState,
  addStudentsFail,
  addStudentsStart,
  addStudentsSuccess,
  getStudentsStart,
  getStudentsSuccess,
  addLecturesFail,
  addLecturesStart,
  addLecturesSuccess,
  actionStart,
  actionFail,
  getLecturesSuccess,
  deleteUserSuccess,
  getLecturerInfoSuccess,
  updateUserSuccess,
  getStatsSuccess,
  getResultsSuccess,
  getStudentStatsSuccess,
} from "../slices/userSlices";
import axios from "redaxios";
import { BASE_URL } from "../../URL";

export const login = (userData) => async (dispatch) => {
  try {
    dispatch(userLoginStart());

    const { data } = await axios.post(`${BASE_URL}/users/login/`, userData);

    console.log(data);
    dispatch(userLoginSuccess(data));
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (err) {
    const errMsg = err?.data ? err.data.message : err.statusText;
    dispatch(userLoginFail(errMsg));
  }
};

export const logout = () => (dispatch) => {
  dispatch(clearUserState());
  localStorage.removeItem("userInfo");
};

// ADD STUDENTS
export const importStudents = (studentsList) => async (dispatch, getState) => {
  try {
    dispatch(addStudentsStart());

    const {
      user: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.token?.access}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${BASE_URL}/users/add/students/`,
      studentsList,
      config
    );

    dispatch(addStudentsSuccess(data));
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
      dispatch(addStudentsFail(errMsg));
    }
  }
};

// Import lecturer data
export const importLecturers =
  (lecturersList) => async (dispatch, getState) => {
    try {
      dispatch(addLecturesStart());

      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token?.access}`,
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${BASE_URL}/users/add/lecturers/`,
        lecturersList,
        config
      );

      console.log(data);

      dispatch(addLecturesSuccess(data));
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
        dispatch(addLecturesFail(errMsg));
      }
    }
  };

// LIST STUDENTS
export const listStudents = (searchReg='') => async (dispatch, getState) => {
  try {
    dispatch(getStudentsStart());

    const {
      user: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.token?.access}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.get(`${BASE_URL}/users/students/?searchReg=${searchReg}`, config);
    dispatch(getStudentsSuccess(data));
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

// List lecturers
export const listLecturers = (staffId='') => async (dispatch, getState) => {
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

    const { data } = await axios.get(`${BASE_URL}/users/lecturers/?staffId=${staffId}`, config);
    dispatch(getLecturesSuccess(data));
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
      dispatch(actionFail("Your session has expired"));
    } else {
      dispatch(actionFail(errMsg));
    }
  }
};

// Delete user
export const deleteUser = (userId) => async (dispatch, getState) => {
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

    await axios.delete(`${BASE_URL}/users/${userId}/delete/`, config);
    dispatch(deleteUserSuccess());
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
      dispatch(actionFail("Your session has expired"));
    } else {
      dispatch(actionFail(errMsg));
    }
  }
};

// Update user
export const updateUser = (userData) => async (dispatch, getState) => {
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

    const { data } = await axios.patch(
      `${BASE_URL}/users/update/`,
      userData,
      config
    );
    dispatch(updateUserSuccess(data));
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
      dispatch(actionFail("Your session has expired"));
    } else {
      dispatch(actionFail(errMsg));
    }
  }
};

// Admin get lecturer details
export const getLecturerDetails =
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
        `${BASE_URL}/users/lecturers/${lecturerId}/`,
        config
      );

      dispatch(getLecturerInfoSuccess(data));
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
        dispatch(actionFail("Your session has expired"));
      } else {
        dispatch(actionFail(errMsg));
      }
    }
  };

// Admin Stats
export const getAdminStats = () => async (dispatch, getState) => {
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

    const { data } = await axios.get(`${BASE_URL}/stats/`, config);

    dispatch(getStatsSuccess(data));
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
      dispatch(actionFail("Your session has expired"));
    } else {
      dispatch(actionFail(errMsg));
    }
  }
};

// Get user results
export const getStudentResults = () => async (dispatch, getState) => {
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

    const { data } = await axios.get(
      `${BASE_URL}/courses/enrolled/results/`,
      config
    );
    dispatch(getResultsSuccess(data));
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
    dispatch(actionFail(errMsg));
  }
};


// Get students perfomance stats
export const getStudentPerfomanceStats = () => async (dispatch, getState) => {
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

    const { data } = await axios.get(
      `${BASE_URL}/courses/results/stats/`,
      config
    );
    dispatch(getStudentStatsSuccess(data));
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
    dispatch(actionFail(errMsg));
  }
};