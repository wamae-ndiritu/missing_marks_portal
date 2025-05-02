import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getLecturerCourses } from "../redux/actions/courseActions";
import { getLecturerDetails } from "../redux/actions/userActions";

const LecturerCoursesPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const lecturerId = params?.id ? Number(params.id) : null;

  const { userCourses } = useSelector((state) => state.course);
  const { lecturerInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (lecturerId) {
      dispatch(getLecturerCourses(lecturerId));
      dispatch(getLecturerDetails(lecturerId));
    }
  }, [dispatch, lecturerId]);
  return (
    <div>
      <div className='bg-slate-200 w-max md:col-span-3 p-4'>
        <h6 className='text-xl font-semibold text-gray-900'>
          Lecturer&apos;s Courses
        </h6>
        <p>Lecturer: {lecturerInfo.full_name}</p>
        <div className='bg-white p-2 mt-2'>
          <table className='w-full border'>
            <thead className=''>
              <tr className='text-left'>
                <th className='border border-gray-300 p-2'>#</th>
                <th className='border border-gray-300 p-2'>Course Code</th>
                <th className='border border-gray-300 p-2'>Course Name</th>
                <th className='border border-gray-300 p-2'>Year</th>
                <th className='border border-gray-300 p-2'>Semester</th>
              </tr>
            </thead>
            <tbody className=''>
              {userCourses.map((course, index) => {
                return (
                  <tr
                    className='border border-gray-300 p-2'
                    key={course.teaching_id}
                  >
                    <td className='border border-gray-300 p-2'>{index + 1}</td>
                    <td className='border border-gray-300 p-2'>
                      {course.course_code}
                    </td>
                    <td className='border border-gray-300 p-2'>
                      {course.course_name}
                    </td>
                    <td className='border border-gray-300 p-2'>
                      {course.year}
                    </td>
                    <td className='border border-gray-300 p-2'>
                      {course.semester}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className='flex gap-2 mt-3'>
          <Link
            to='/lecturers'
            className='bg-green-500 text-white border px-4 py-1'
          >
            Back to List
          </Link>
          <Link
            to={`/lecturers/${lecturerId}`}
            className='bg-amber-500 text-white border px-4 py-1'
          >
            View Details
          </Link>
          <Link
            to={`/lecturers/${lecturerId}/assign-course`}
            className='bg-indigo-500 text-white border px-4 py-1'
          >
            Assign Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LecturerCoursesPage;
