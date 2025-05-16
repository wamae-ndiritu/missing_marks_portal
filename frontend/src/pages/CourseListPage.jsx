import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getCourses,
  getMyCourses,
} from "../redux/actions/courseActions";

const CourseListPage = () => {
  const dispatch = useDispatch();
  const { courses, courseDelete } = useSelector((state) => state.course);
  const { userInfo, myCourses } = useSelector((state) => state.user);

  const [formattedCourses, setFormattedCourses] = useState({});

  console.log("My Courses: ", myCourses);


  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch, courseDelete]);

  useEffect(() => {
    if (userInfo?.user?.user_type === 'lecturer'){
      dispatch(getMyCourses("lecturer"));
    } else if (userInfo?.user?.user_type === 'student'){
      dispatch(getMyCourses("student"));
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    function formatCourses(courses) {
      const formattedCourses = {};

      // Iterate over each course in the array
      courses.forEach((course) => {
        const { level, semester_number } = course;

        // Check if the level key exists in the formattedCourses object
        if (!formattedCourses[`year_${level}`]) {
          // If the level key doesn't exist, create it and set its value as an empty object
          formattedCourses[`year_${level}`] = {};
        }

        // Check if the semester_number key exists in the formattedCourses[level] object
        if (!formattedCourses[`year_${level}`][`sem_${semester_number}`]) {
          // If the semester_number key doesn't exist, create it and set its value as an empty array
          formattedCourses[`year_${level}`][`sem_${semester_number}`] = [];
        }

        // Push the current course to the array at formattedCourses[level][semester_number]
        formattedCourses[`year_${level}`][`sem_${semester_number}`].push(
          course
        );
      });

      return formattedCourses;
    }

    let f_courses = formatCourses(courses);
    setFormattedCourses(f_courses);
  }, [courses]);

  return (
    <section className='overflow-x-auto p-4 border'>
      {userInfo?.user?.user_type !== "admin" ? (
        <section className='my-3 flex justify-between'>
          <h2 className='text-2xl font-semibold '>My Courses</h2>
          {userInfo?.user?.user_type === 'student' && (
            <Link
              to='/courses/new'
              className='bg-blue-300 px-2 py-1 text-white'
            >
              Register Courses
            </Link>
          )}
        </section>
      ) : (
        <div className='flex justify-between items-center my-2'>
          {" "}
          <h2 className='text-2xl font-semibold '>Courses</h2>
          <Link
            to='/courses/new'
            className='bg-blue-300 text-white border px-4 py-1'
          >
            Add Course
          </Link>
        </div>
      )}
      {userInfo?.user?.user_type !== "admin" ? (
        <table className='w-max md:w-full border'>
          <thead className=''>
            <tr className='text-left'>
              <th className='border border-gray-300 p-2'>ID</th>
              <th className='border border-gray-300 p-2'>Course Code</th>
              <th className='border border-gray=300 p-2'>Course Name</th>
              {userInfo?.user?.user_type === "student" && (
                <th className='border border-gray=300 p-2'>Exam Type</th>
              )}
              <th className='border border-gray-300 p-2'>Semester</th>
            </tr>
          </thead>
          <tbody className=''>
            {myCourses.map((course, index) => {
              const { enrollment_id, course_code, course_name, semester } =
                course;
              return (
                <tr key={enrollment_id}>
                  <td className='border border-gray-300 p-2'>{index + 1}</td>
                  <td className='border border-gray-300 p-2'>{course_code}</td>
                  <td className='border border-gray-300 p-2'>{course_name}</td>
                  {userInfo?.user?.user_type === "student" && (
                    <td className='border border-gray-300 p-2 capitalize'>
                      {course?.exam_type}
                    </td>
                  )}
                  <td className='border border-gray-300 p-2 capitalize'>
                    {semester}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <table className='w-full mb-4'>
          <thead className=''>
            <tr className='text-left bg-gray-200'>
              <th className='border border-gray-300 p-2'>#</th>
              <th className='border border-gray-300 p-2'>Course Code</th>
              <th className='border border-gray=300 p-2'>Course Name</th>
            </tr>
          </thead>
          <tbody className=''>
            <tr className='border border bg-gray-300'>
              <td></td>
              <td></td>
              <td className='px-2'>YEAR 1 SEMESTER 1</td>
            </tr>
            {formattedCourses.year_1?.sem_1?.map((course, index) => {
              return (
                <tr key={course.course_code}>
                  <td className='border border-gray-300 p-2'>{index + 1}</td>
                  <td className='border border-gray-300 p-2'>
                    {course.course_code}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    {course.course_name}
                  </td>
                </tr>
              );
            })}
            <tr className='border border bg-gray-300'>
              <td></td>
              <td></td>
              <td className='px-2'>YEAR 1 SEMESTER 2</td>
            </tr>
            {formattedCourses.year_1?.sem_2?.map((course, index) => {
              return (
                <tr key={course.course_code}>
                  <td className='border border-gray-300 p-2'>{index + 1}</td>
                  <td className='border border-gray-300 p-2'>
                    {course.course_code}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    {course.course_name}
                  </td>
                </tr>
              );
            })}
            <tr className='border border bg-gray-300'>
              <td></td>
              <td></td>
              <td className='px-2'>YEAR 2 SEMESTER 1</td>
            </tr>
            {formattedCourses.year_2?.sem_1?.map((course, index) => {
              return (
                <tr key={course.course_code}>
                  <td className='border border-gray-300 p-2'>{index + 1}</td>
                  <td className='border border-gray-300 p-2'>
                    {course.course_code}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    {course.course_name}
                  </td>
                 
                </tr>
              );
            })}
            <tr className='border border bg-gray-300'>
              <td></td>
              <td></td>
              <td className='px-2'>YEAR 2 SEMESTER 2</td>
            </tr>
            {formattedCourses.year_2?.sem_2?.map((course, index) => {
              return (
                <tr key={course.course_code}>
                  <td className='border border-gray-300 p-2'>{index + 1}</td>
                  <td className='border border-gray-300 p-2'>
                    {course.course_code}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    {course.course_name}
                  </td>
                  
                </tr>
              );
            })}
            <tr className='border border bg-gray-300'>
              <td></td>
              <td></td>
              <td className='px-2'>YEAR 3 SEMESTER 1</td>
            </tr>
            {formattedCourses.year_3?.sem_1?.map((course, index) => {
              return (
                <tr key={course.course_code}>
                  <td className='border border-gray-300 p-2'>{index + 1}</td>
                  <td className='border border-gray-300 p-2'>
                    {course.course_code}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    {course.course_name}
                  </td>
                 
                </tr>
              );
            })}
            <tr className='border border bg-gray-300'>
              <td></td>
              <td></td>
              <td className='px-2'>YEAR 3 SEMESTER 2</td>
            </tr>
            {formattedCourses.year_3?.sem_2?.map((course, index) => {
              return (
                <tr key={course.course_code}>
                  <td className='border border-gray-300 p-2'>{index + 1}</td>
                  <td className='border border-gray-300 p-2'>
                    {course.course_code}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    {course.course_name}
                  </td>
                  
                </tr>
              );
            })}
            <tr className='border border bg-gray-300'>
              <td></td>
              <td></td>
              <td className='px-2'>YEAR 4 SEMESTER 1</td>
            </tr>
            {formattedCourses.year_4?.sem_1?.map((course, index) => {
              return (
                <tr key={course.course_code}>
                  <td className='border border-gray-300 p-2'>{index + 1}</td>
                  <td className='border border-gray-300 p-2'>
                    {course.course_code}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    {course.course_name}
                  </td>
                  
                </tr>
              );
            })}
            <tr className='border bg-gray-300'>
              <td></td>
              <td></td>
              <td className='px-2'>YEAR 4 SEMESTER 2</td>
            </tr>
            {formattedCourses.year_4?.sem_2?.map((course, index) => {
              return (
                <tr key={course.course_code}>
                  <td className='border border-gray-300 p-2'>{index + 1}</td>
                  <td className='border border-gray-300 p-2'>
                    {course.course_code}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    {course.course_name}
                  </td>
                  
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default CourseListPage;
