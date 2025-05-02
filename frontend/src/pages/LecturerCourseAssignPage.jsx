import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  assignLecturerCourse,
  getCourses,
} from "../redux/actions/courseActions";
import { resetCourseState } from "../redux/slices/courseSlice";
import { getSemesters } from "../redux/actions/semesterActions";
import { Link } from "react-router-dom";

const LecturerCourseAssignPage = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const { lecturerInfo } = useSelector((state) => state.user);
  const { loading, error, assigned } = useSelector((state) => state.course);

  const lecturerId = params?.id ? Number(params.id) : null;
  const { courses } = useSelector((state) => state.course);
  const { semesters } = useSelector((state) => state.semester);
  const [selectedSem, setSelectedSem] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [successAssigned, setSuccessAssigned] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const course = {
      course_code: selectedCourse,
      semester_id: selectedSem,
    };
    dispatch(assignLecturerCourse(course, lecturerId));
  };

  useEffect(() => {
    if (assigned) {
      setSuccessAssigned("Course allocation successful!");
      setSelectedCourse("");
      setSelectedSem("");
      const timeout = setTimeout(() => {
        dispatch(resetCourseState());
        setSuccessAssigned(null);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [dispatch, assigned]);

  useEffect(() => {
    dispatch(getCourses());
    dispatch(getSemesters());
  }, [dispatch]);

  return (
    <div className='w-max bg-slate-200 p-4 flex flex-col items-start'>
      <form
        className='col-span-1 md:col-span-2 bg-white p-4'
        onSubmit={handleSubmit}
      >
        <h3 className='text-xl font-semibold'>Assign Lecturer Courses</h3>
        <p>Lecturer: {lecturerInfo.full_name}</p>
        {loading && <p>Loading...</p>}
        {error && (
          <p className='bg-red-500 p-4 rounded text-oranger-500'>{error}</p>
        )}
        {successAssigned && (
          <span className='flex items-center justify-between my-1 bg-green-100 w-full py-2 px-4 rounded border border-green-400 text-green-700'>
            <p>{successAssigned}</p>
          </span>
        )}
        <div className='flex flex-col mb-3'>
          <h5 className='text-lg py-1'>Select Course</h5>
          <select
            name=''
            id=''
            className='border px-4 py-2 rounded focus:outline-gray-900'
            onChange={(e) => setSelectedCourse(e.target.value)}
            value={selectedCourse}
          >
            <option value="">--Select Course--</option>
            {courses.map((course) => {
              return (
                <option key={course.course_code} value={course.course_code}>
                  {course.course_code} - {course.course_name}
                </option>
              );
            })}
          </select>
        </div>
        <div className='flex flex-col mb-3'>
          <h5 className='text-lg py-1'>Select Semester</h5>
          <select
            name=''
            id=''
            className='border px-4 py-2 rounded focus:outline-gray-900'
            onChange={(e) => setSelectedSem(e.target.value)}
            value={selectedSem}
          >
            <option value="">--Select Semester--</option>
            {semesters.map((semester) => {
              return (
                <option key={semester.id} value={semester.id}>
                  {semester.id}
                </option>
              );
            })}
          </select>
        </div>
        <div className='flex flex-col mb-3'>
          <button
            type='submit'
            className='bg-blue-300 text-white rounded px-4 py-2'
          >
            Submit
          </button>
        </div>
      </form>
      <div className='flex gap-2 mt-3'>
        <Link
          to='/lecturers'
          className='bg-green-500 text-white border px-4 py-1'
        >
          Back to List
        </Link>
        <Link
          to={`/lecturers/${lecturerId}/courses`}
          className='bg-amber-500 text-white border px-4 py-1'
        >
          View Courses
        </Link>
        <Link
          to={`/lecturers/${lecturerId}`}
          className='bg-indigo-500 text-white border px-4 py-1'
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default LecturerCourseAssignPage;
