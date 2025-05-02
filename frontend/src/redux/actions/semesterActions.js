import { BASE_URL } from "../../URL";
import { getCoursesStart } from "../slices/courseSlice";
import { getSemestersFail, getSemestersSuccesss } from "../slices/semesterSlice";
import { logout } from "./userActions";
import axios from 'redaxios'

export const getSemesters = () => async(dispatch, getState) => {
    try{
        dispatch(getCoursesStart())

    const {
      user: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.token?.access}`,
      },
    };
    const {data} = await axios.get(`${BASE_URL}/semesters/`, config)
    dispatch(getSemestersSuccesss(data));

    }catch(err){
          const errMsg = err?.data
      ? err.data?.message || err.data?.detail
      : err.statusText;
    if (
      errMsg === "Authentication credentials were not provided." ||
      errMsg === "Given token not valid for any token type"
    ) {
      dispatch(logout());
    }
    dispatch(getSemestersFail(errMsg));

  }
}