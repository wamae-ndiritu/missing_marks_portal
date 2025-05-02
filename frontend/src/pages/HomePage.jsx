import { useEffect } from "react";
import SchoolIcon from "@mui/icons-material/School";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import {useDispatch, useSelector} from "react-redux";
import { getSemesters } from "../redux/actions/semesterActions";
import { getAdminStats, getStudentPerfomanceStats } from "../redux/actions/userActions";
import { Link } from "react-router-dom";

const HomePage = () => {
  const dispatch = useDispatch();

  const {userInfo, stats } = useSelector((state) => state.user);
  const current_year = new Date().getFullYear()

  useEffect(() => {
    dispatch(getSemesters());
    dispatch(getAdminStats());
  }, [dispatch])

  useEffect(() => {
    if (userInfo?.user?.user_type === 'student'){
      dispatch(getStudentPerfomanceStats())
    }
  }, [dispatch, userInfo])
  return (
    <>
      {userInfo?.user?.user_type === "student" && (
        <>
          <section className='shadow-sm p-4'>
            <h3 className='mb-2 text-xl font-semibold'>Student Portal</h3>
            <section className='grid grid-cols-1 md:grid-cols-3'>
              <div className='col-span-1 md:col-span-1 mx-1 bg-white p-2 flex flex-col items-center justify-center'>
                <img
                  src='/assets/avatar.jpg'
                  alt='profile'
                  className='w-14 h-14 rounded-full object-cover border'
                />
                <h5 className='text-lg text-gray-600 uppercase'>
                  {userInfo?.user?.full_name}
                </h5>
                <h6 className='text-gray-600'>
                  Reg No: {userInfo?.user?.reg_no}
                </h6>
                <p className='text-md uppercase text-gray-600'>
                  Year {current_year - userInfo?.user?.year_joined}
                </p>
              </div>
            </section>
          </section>
        </>
      )}
      {userInfo?.user?.user_type === "admin" && (
        <div className='bg-white shadow-sm p-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            <Link
              to='/students'
              className='col-span-1 p-4 bg-white text-gray-600 flex flex-col justify-center items-center rounded border border-gray-300'>
              <div className='h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-gray-900 my-3'>
                <SchoolIcon style={{ fontSize: "34px" }} />
              </div>
              <h2 className='text-2xl'>No of Students</h2>
              <h4 className='text-xl'>{stats?.students_count}</h4>
            </Link>
            <Link
              to='/lecturers'
              className='ol-span-1 p-4 bg-white text-gray-600 flex flex-col justify-center items-center rounded border border-gray-300'>
              <div className='h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-gray-900 my-3'>
                <PsychologyIcon style={{ fontSize: "34px" }} />
              </div>
              <h2 className='text-2xl'>No of Lecturers</h2>
              <h4 className='text-xl'>{stats?.lecturers_count}</h4>
            </Link>
            <Link
              to='/courses'
              className='col-span-1 p-4 bg-white text-gray-600 flex flex-col justify-center items-center rounded border border-gray-300'>
              <div className='h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-gray-900 my-3'>
                <CastForEducationIcon style={{ fontSize: "34px" }} />
              </div>
              <h2 className='text-2xl'>No of Courses</h2>
              <h4 className='text-xl'>{stats?.courses_count}</h4>
            </Link>
          </div>
          <div className='mt-10 p-4 h-[250px] bg-blue-300 text-white flex flex-col justify-center items-center rounded'>
            <h2 className='text-2xl'>Current Semester</h2>
            <h4 className='bg-white my-3 px-4 py-2 rounded text-blue-400'>
              2024/2025 - SEM 2
            </h4>
          </div>
        </div>
      )}
      {userInfo?.user?.user_type === "lecturer" && (
        <div className='shadow-sm p-4'>
          <div className='p-4 bg-white text-gray-600 flex flex-col justify-center items-center rounded border border-gray-300'>
            <div className='h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-gray-900 my-3'>
              <CastForEducationIcon style={{ fontSize: "34px" }} />
            </div>
            <h2 className='text-2xl'>My Courses</h2>
            <h4 className='text-xl'>3</h4>
          </div>
          <div className='mt-10 p-4 h-[250px] bg-blue-300 text-white flex flex-col justify-center items-center rounded'>
            <h2 className='text-2xl'>Current Semester</h2>
            <h4 className='bg-white my-3 px-4 py-2 rounded text-blue-400'>
              2024/2025 - SEM 2
            </h4>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage