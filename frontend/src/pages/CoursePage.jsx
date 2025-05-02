import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCourse,
  enrollCourses,
  getCourses,
  getMyCourses,
} from "../redux/actions/courseActions";
import { Link } from "react-router-dom";
import { validateObject } from "../helpers";
import Message from "../components/Message";
import { resetCourseState } from "../redux/slices/courseSlice";
import { resetState } from "../redux/slices/userSlices";

const CoursePage = () => {
  const dispatch = useDispatch();

  const { loading, error, course_created } = useSelector(
    (state) => state.course
  );
  const { semesters } = useSelector((state) => state.semester);
  const {
    userInfo,
    enrolled,
    error: userError,
    loading: userLoading,
  } = useSelector((state) => state.user);
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");
  const [sem, setSem] = useState("");
  const [year, setYear] = useState("");
  const [createCourseFormErr, setCreateCourseFormErr] = useState(null);

  const [enrollCourseData, setEnrollCourseData] = useState(
    Array.from({ length: 5 }, () => ({
      course_code: "",
      semester_id: semester,
      exam_type: "first attempt",
    }))
  );

  const handleEnrollCourseSubmit = (e) => {
    e.preventDefault();
    const updatedEnrollCourseData = enrollCourseData
      .map((course) => ({
        ...course,
        semester_id: semester,
      }))
      .filter((course) => course.course_code !== "");
    dispatch(enrollCourses(updatedEnrollCourseData));
  };

  const handleCourseEnrollInputChange = (index, key, value) => {
    const newData = enrollCourseData.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [key]: value,
        };
      }
      return item;
    });
    setEnrollCourseData(newData);
  };

  const handleCreateCourse = (e) => {
    e.preventDefault();
    const emptyKey = validateObject({ courseCode, courseName, year, sem });
    if (emptyKey) {
      setCreateCourseFormErr(`${emptyKey} is required!`);
      return;
    }
    dispatch(
      createCourse({
        course_code: courseCode,
        course_name: courseName,
        level: year,
        semester_number: sem,
      })
    );
  };

  useEffect(() => {
    if (course_created || error) {
      setCourseCode("");
      setCourseName("");
      setSem("");
      setYear("");
    }
  }, [course_created, error]);

  useEffect(() => {
    if (enrolled || userError) {
      setSemester("")
      setEnrollCourseData(
        Array.from({ length: 5 }, () => ({
          course_code: "",
          semester_id: "",
          exam_type: "first attempt",
        }))
      );
    }
  }, [enrolled, userError]);

  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getMyCourses());
  }, [dispatch]);

  return (
    <section className={`bg-gray-300 p-4 w-full`}>
      {userInfo?.user?.user_type === "student" && (
        <form className='col-span-1 bg-white p-4 h-max flex flex-col items-center justify-center'>
          {loading || userLoading && <p>Loading...</p>}
          {error && (
            <Message onClose={() => dispatch(resetCourseState())}>
              {error}
            </Message>
          )}
          {
            userError && <Message onClose={() => dispatch(resetState())}>{userError}</Message>
          }
          {
            enrolled && <Message variant="success" onClose={() => dispatch(resetState())}>Course registered successfully!</Message>
          }
          <div className='w-full flex items-center justify-between'>
            <h2 className='text-xl font-bold p-2'> Register Course</h2>
            <div className='flex gap-5 items-center'>
              <h6>Select Semester</h6>
              <select
                className='border border-gray-300 p-2 outline-none my-2'
                onChange={(e) => setSemester(e.target.value)}
                value={semester}
              >
                <option>--Select Semester--</option>
                {semesters.map((semester) => {
                  return (
                    <option key={semester.id} value={semester.id}>
                      {semester.id}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <table className='w-full'>
            <thead>
              <tr>
                <th className='border border-gray-300 p-2'>Course Code</th>
                <th className='border border-gray-300 p-2'>Exam Type</th>
              </tr>
            </thead>
            <tbody>
              {enrollCourseData.map((courseInput, index) => {
                return (
                  <tr key={index}>
                    <td className='outline-none border border-gray-300 p-2'>
                      <input
                        placeholder='Course Code'
                        className='w-full px-2 py-1 border outline-none'
                        value={courseInput.course_code}
                        onChange={(e) =>
                          handleCourseEnrollInputChange(
                            index,
                            "course_code",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className='border border-gray-300 p-2'>
                      <select
                        className='w-full px-2 py-1 border outline-none'
                        onChange={(e) =>
                          handleCourseEnrollInputChange(
                            index,
                            "exam_type",
                            e.target.value
                          )
                        }
                      >
                        <option value='first attempt'>First Attempt</option>
                        <option value='supplementary'>Suplementary</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className='w-full flex gap-5'>
            <button
            type="button"
              className='md:w-1/3 bg-blue-300 text-white hover:cusor-pointer 
           my-3 p-2 rounded '
              onClick={handleEnrollCourseSubmit}
            >
              Regester Courses
            </button>
            <Link
              to='/courses'
              className='md:w-1/3 bg-blue-300 text-white hover:cusor-pointer 
           my-3 p-2 rounded '
            >
              View My Courses
            </Link>
          </div>
        </form>
      )}
      {userInfo?.user?.user_type === "admin" && (
        <div className='bg-white p-3'>
          <h2 className='text-xl font-bold p-2'>Create Course</h2>
          {loading && <p>Loading....</p>}
          {error && (
            <Message onClose={() => dispatch(resetCourseState())}>
              {error}
            </Message>
          )}
          {createCourseFormErr && (
            <Message onClose={() => setCreateCourseFormErr(null)}>
              {createCourseFormErr}
            </Message>
          )}
          {course_created && (
            <Message
              variant='success'
              onClose={() => dispatch(resetCourseState())}
            >
              Course created successfull!
            </Message>
          )}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='col-span-1'>
              <div className='w-full mb-2 flex gap-3 items-center'>
                <label htmlFor='course_code' className='w-1/3 text-gray-600'>
                  Course Code
                </label>
                <input
                  type='text'
                  placeholder='ICS 345'
                  className='w-2/3 border border-gray-300 rounded focus:outline-amber-400 p-2'
                  id='course_code'
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                />
              </div>
              <div className='w-full mb-2 flex gap-3 items-center'>
                <label
                  htmlFor='course_name'
                  className='w-1/3 py-1 text-gray-600'
                >
                  Course Name
                </label>
                <input
                  type='text'
                  placeholder='Introduction to Databases'
                  className='w-2/3 border border-gray-300 rounded focus:outline-amber-400 p-2'
                  id='course_name'
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </div>
              <button
              type="button"
                className='w-full bg-blue-300 text-white hover:cusor-pointer 
           my-3 p-2 rounded '
                onClick={handleCreateCourse}
              >
                Create Course
              </button>
            </div>
            <div className='col-span-1'>
              <div className='w-full mb-2 flex gap-3 items-center'>
                <label htmlFor='year' className='w-1/3 py-1 text-gray-600'>
                  Year
                </label>
                <select
                  className='w-2/3 border border-gray-300 rounded focus:outline-amber-400 p-2'
                  id='year'
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value=''>--Select Year--</option>
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                  <option value='3'>3</option>
                  <option value='4'>4</option>
                </select>
              </div>
              <div className='w-full mb-2 flex gap-3 items-center'>
                <label htmlFor='sem' className='w-1/3 py-1 text-gray-600'>
                  Semester
                </label>
                <select
                  className='w-2/3 border border-gray-300 rounded focus:outline-amber-400 p-2'
                  id='sem'
                  value={sem}
                  onChange={(e) => setSem(e.target.value)}
                >
                  <option value=''>--Select Semester--</option>
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                </select>
              </div>
            </div>
          </div>
          <Link to='/courses' className='text-blue-300 underline'>
            Go to courses
          </Link>
        </div>
      )}
    </section>
  );
};

export default CoursePage;
