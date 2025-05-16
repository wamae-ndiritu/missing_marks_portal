import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Papa from "papaparse";
import {
  autoSaveMarks,
  getClassList,
  getMyCourses,
  listStudentMissingResults,
  listStudentReportedMissingResults,
  publishResults,
  reportMissingMarks,
} from "../redux/actions/courseActions";
import Message from "../components/Message";
import { getStudentResults } from "../redux/actions/userActions";
import { resetCourseState } from "../redux/slices/courseSlice";

const ResultPage = () => {
  const dispatch = useDispatch();
  const { myCourses } = useSelector((state) => state.user);
  const {
    classList,
    loading,
    loadingReport,
    saving,
    error,
    published,
    studentMissingResults,
    studentReportedMissingResults,
    missingReportedSuccess,
  } = useSelector((state) => state.course);
  const { userInfo, myResults } = useSelector((state) => state.user);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [publishSuccess, setPublishSuccess] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [missingResultId, setMissingResultId] = useState("");

  // Downloading class List
  const fetchClassList = () => {
    dispatch(getClassList({ course_code: selectedCourse }));
  };

  useEffect(() => {
    if (classList?.course && published){
      dispatch(getClassList({course_code: classList?.course}))
    }
  }, [dispatch, classList, published])

  const getDataForDownload = () => {
    const data = classList?.students.map((student, index) => ({
      "S/NO": index + 1,
      "REG NO": student.reg_no,
      "FULL NAME": student.student_name,
    }));
    return data;
  };

  const handleDownload = () => {
    const data = getDataForDownload();
    const csvData = Papa.unparse(data, { header: true });
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "class_list.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSearchStudentByStaffId = (e) => {
    e.preventDefault();
    dispatch(getClassList({ course_code: selectedCourse }, searchId));
  }

  useEffect(() => {
    dispatch(getMyCourses("lecturer"));
  }, [dispatch]);

  useEffect(() => {
    if (classList?.students) {
      setEnrollments(classList.students);
    }
  }, [classList]);

  const handleEnrollmentsChange = (e, index) => {
    const { name, value } = e.target;
    setEnrollments((prevEnrollments) => {
      const updatedEnrollments = [...prevEnrollments];
      const updatedStudent = { ...updatedEnrollments[index], [name]: value };
      updatedEnrollments[index] = updatedStudent;
      return updatedEnrollments;
    });
  };

  const handleReportMissing = () => {
    if (missingResultId) {
      dispatch(reportMissingMarks(missingResultId));
      setMissingResultId("");
    }
  }

  const handlePublishResults = () => {
    dispatch(publishResults({ course_code: classList?.course }));
  };

  const closePublishSuccess = () => {
    dispatch(resetCourseState());
    setPublishSuccess(null);
  }

  useEffect(() => {
    const newTimeoutId = setTimeout(() => {
      dispatch(autoSaveMarks({ enrollments }));
    }, 5000);

    // Cleanup function to clear the timeout on component unmount or when the timeout is reset
    return () => clearTimeout(newTimeoutId);
  }, [dispatch, enrollments]); // Trigger the effect whenever enrollments change

  useEffect(() => {
    if (userInfo?.user?.user_type === 'student'){
      dispatch(getStudentResults());
      dispatch(listStudentMissingResults())
      dispatch(listStudentReportedMissingResults())
    }
  }, [dispatch, userInfo, missingReportedSuccess])

  useEffect(() => {
    if (published){
      setPublishSuccess(published);
    }
  }, [published])

  useEffect(() => {
    if (publishSuccess){
      const interval = setInterval(() => {
        dispatch(resetCourseState());
        setPublishSuccess(null);
      }, 5000)

      return () => clearInterval(interval);
    }
  }, [dispatch, publishSuccess, missingReportedSuccess])

  return (
    <>
      {/* For the Lecturer */}
      {userInfo?.user?.user_type === "lecturer" && (
        <section className='bg-slate-100 shadow-sm p-4'>
          <section className='w-full bg-white px-4 '>
            <div className='border-b flex justify-between items-center'>
              <h3 className='my-auto text-xl font-semibold'>Results</h3>
              <div className='flex gap-3 items-center'>
                <div className='flex gap-3 items-center my-2'>
                  <h6 className='text-gray-900'>Select Course:</h6>
                  <select
                    className='border focus:outline-none p-2'
                    onChange={(e) => setSelectedCourse(e.target.value)}>
                    <option value=''>--Select Course--</option>
                    {myCourses.map((course) => {
                      return (
                        <option
                          key={course.course_id}
                          value={course.course_code}>
                          {course.course_code} - {course.course_name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <button
                  className='bg-gray-900 text-white px-4 py-2 rounded'
                  onClick={fetchClassList}>
                  Get Class List
                </button>
              </div>
            </div>
            <div className='my-3 border-b flex justify-between items-center'>
              <form
                className='flex justify-end gap-1 my-2'
                onSubmit={handleSearchStudentByStaffId}>
                <input
                  type='text'
                  className='border border-gray-300 rounded p-2 text-gray-600 focus:outline-amber-400'
                  placeholder='Search by REG NO'
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
                <button
                  type='submit'
                  className='bg-gray-900 px-4 py-1 rounded text-white'>
                  Search
                </button>
              </form>
              {classList && (
                <div className='flex md:justify-end gap-3 items-end my-3'>
                  <h3 className='text-xl uppercase text-gray-600'>
                    {classList?.course}
                  </h3>
                  {classList?.students?.length > 0 && (
                    <>
                      <button
                        className='bg-gray-800 px-4 py-1 text-white'
                        onClick={handleDownload}>
                        Download Class List
                      </button>
                      <button
                        type='button'
                        className='bg-green-600 px-4 py-1 text-white'
                        onClick={() =>
                          dispatch(autoSaveMarks({ enrollments }))
                        }>
                        Save Results
                      </button>
                      <button
                        type='button'
                        className='bg-orange-800 px-4 py-1 text-white'
                        onClick={handlePublishResults}>
                        Publish Results
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            <p
              className={`text-green-600 text-xs ${
                saving ? "visible" : "invisible"
              }`}>
              Saving...
            </p>
            <p
              className={`text-red-600 text-xs ${
                error ? "visible" : "invisible"
              }`}>
              Changes not saved! check your internet...
            </p>
            {loading && <p className='text-gray-600'>Loading...</p>}
            {publishSuccess && (
              <Message variant='success' onClose={closePublishSuccess}>
                {publishSuccess}
              </Message>
            )}
          </section>
          <section className='w-full overflow-x-auto bg-white overflow-x-auto p-4'>
            <table className='w-max text-gray-600 border border-collapse border-gray-300'>
              <thead>
                <tr>
                  <th className='border border-gray-300 p-2 text-left'>S/NO</th>
                  <th className='border border-gray-300 p-2 text-left'>
                    Reg No
                  </th>
                  <th className='border border-gray-300 p-2 text-left'>
                    Full Names
                  </th>
                  <th className='border border-gray-300 p-2 text-left'>
                    CAT Marks
                  </th>
                  <th className='border border-gray-300 p-2 text-left'>
                    Exam Marks
                  </th>
                  <th className='border border-gray-300 p-2 text-left'>
                    Grade
                  </th>
                  <th className='border border-gray-300 p-2 text-left'>
                    Comment
                  </th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((student, index) => {
                  return (
                    <tr key={student.student_id}>
                      <td className='border border-gray-300 px-2'>
                        {index + 1}
                      </td>
                      <td className='border border-gray-300 px-2'>
                        {student.reg_no}
                      </td>
                      <td className='border border-gray-300 px-2 uppercase'>
                        {student.student_name}
                      </td>
                      <td className='border border-gray-300 py-1 px-2'>
                        <input
                          type='number'
                          className='border px-2 focus:outline-none text-gray-600'
                          value={student.coursework_marks}
                          name='coursework_marks'
                          onChange={(e) => handleEnrollmentsChange(e, index)}
                        />
                      </td>
                      <td className='border border-gray-300 py-1 px-2'>
                        <input
                          type='number'
                          className='border px-2 focus:outline-none text-gray-600'
                          value={student.exam_marks}
                          name='exam_marks'
                          onChange={(e) => handleEnrollmentsChange(e, index)}
                        />
                      </td>
                      <td className='border border-gray-300 px-2 uppercase'>
                        {student.grade}
                      </td>
                      <td className='border border-gray-300 px-2 uppercase'>
                        <input
                          type='text'
                          placeholder='comment'
                          className='w-full px-2 focus:outline-none'
                        />
                      </td>
                    </tr>
                  );
                })}
                {classList?.students?.length === 0 && (
                  <tr className='p-2'>
                    <td className='text-orange-600'>
                      No Enrolled students in this course!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </section>
      )}
      {/* For the lecturer end */}
      {/* For the student start */}
      {userInfo?.user?.user_type === "student" && (
        <section className='bg-slate-100 shadow-sm p-4'>
          <div className='flex flex-col items-center bg-white p-4'>
            <h3 className='text-gray-600 uppercase'>
              {userInfo?.user?.full_name}
            </h3>
            <h6 className='text-gray-600 uppercase'>FACULTY OF EDUCATION</h6>
            <h6 className='text-gray-600 uppercase'>
              Bachelor of Education (ICT)
            </h6>
            {missingReportedSuccess && (
              <Message variant='success' onClose={closePublishSuccess}>
                Missing result reported successfully!
              </Message>
            )}
            {/* Notice about reporting missing results */}
            <div className='w-full my-4'>
              <h3 className='text-gray-600 font-semibold mb-2'>
                Reporting Missing Results
              </h3>
              <div className='flex bg-blue-50 border-l-4 border-blue-500 p-4 rounded'>
                <div className='flex-shrink-0 mr-3'>
                  <svg
                    className='h-6 w-6 text-blue-500'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z'
                    />
                  </svg>
                </div>
                <div>
                  <p className='text-blue-800 font-semibold mb-1'>
                    How reporting missing results works:
                  </p>
                  <ul className='text-blue-700 text-sm list-disc pl-5 space-y-1'>
                    <li>
                      When you report a missing result, your lecturer will be
                      notified and a follow-up will be initiated.
                    </li>
                    <li>
                      If your marks are found and uploaded, the report will be
                      resolved and you will receive a confirmation email.
                    </li>
                    <li>
                      If you missed an exam (and that&apos;s why you have a
                      missing result), the lecturer will note this as the
                      reason. You will receive a confirmation email marked as
                      resolved, and you will be required to arrange how to sit
                      for the exam.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='w-full flex items-end gap-3 my-2'>
              <div className='flex-1 flex flex-col'>
                <h6>Select Course</h6>
                <select
                  className='border border-gray-300 p-2 outline-none'
                  onChange={(e) => setMissingResultId(e.target.value)}
                  value={missingResultId}>
                  <option value=''>--Select Course--</option>
                  {studentMissingResults.map((result) => {
                    return (
                      <option
                        key={result.enrollment_id}
                        value={result.enrollment_id}>
                        {result.course_code} - {result.course_name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <button
                className={`bg-gray-900 text-white px-4 py-2 rounded ${
                  missingResultId || !loadingReport
                    ? ""
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleReportMissing}
                disabled={!missingResultId || loadingReport}>
                {loadingReport ? "Reporting..." : "Report"}
              </button>
            </div>
            <h3 className='text-gray-600 font-semibold mb-2 text-left my-4'>
              Results
            </h3>
            <table className='min-w-full w-max my-3 text-gray-600 border border-collapse border-gray-300'>
              <thead>
                <tr>
                  <th className='border border-gray-300 p-2 text-left'>S/NO</th>
                  <th className='border border-gray-300 p-2 text-left'>
                    Course Code
                  </th>
                  <th className='border border-gray-300 p-2 text-left'>
                    Course Name
                  </th>
                  <th className='border border-gray-300 p-2 text-left'>CAT</th>
                  <th className='border border-gray-300 p-2 text-left'>Exam</th>
                  <th className='border border-gray-300 p-2 text-left'>
                    Total Marks
                  </th>
                  <th className='border border-gray-300 p-2 text-left'>
                    Grade
                  </th>
                </tr>
              </thead>
              {Object.entries(myResults)
                .map(([semesterId, courses]) => ({
                  id: semesterId,
                  courses: Object.values(courses),
                }))
                .map((item) => {
                  return (
                    <tbody key={item.id}>
                      <tr className='border border-gray-300 '>
                        <td className='p-2'>{item.id}</td>
                      </tr>
                      {item.courses.map((course, index) => {
                        return (
                          <tr key={course.enrollment_id}>
                            <td className='border border-gray-300 p-2'>
                              {index + 1}
                            </td>
                            <td className='border border-gray-300 p-2'>
                              {course.course_code}
                            </td>
                            <td className='border border-gray-300 p-2'>
                              {course.course_name}
                            </td>
                            <td className='border border-gray-300 p-2'>
                              {course.coursework_marks}
                            </td>
                            <td className='border border-gray-300 p-2'>
                              {course.exam_marks}
                            </td>
                            <td className='border border-gray-300 p-2'>
                              {course.score}
                            </td>
                            <td className='border border-gray-300 p-2'>
                              {course.grade}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  );
                })}
            </table>
            {/* List a table showing reported missing marks and their status (resolved, reason etc) */}
            {studentReportedMissingResults &&
              studentReportedMissingResults.length > 0 && (
                <div className='w-full mt-6'>
                  <h3 className='text-gray-600 font-semibold mb-2 text-left'>
                    Reported Missing Results
                  </h3>
                  <table className='min-w-full w-max my-3 text-gray-600 border border-collapse border-gray-300'>
                    <thead>
                      <tr>
                        <th className='border border-gray-300 p-2 text-left'>
                          S/NO
                        </th>
                        <th className='border border-gray-300 p-2 text-left'>
                          Course Code
                        </th>
                        <th className='border border-gray-300 p-2 text-left'>
                          Course Name
                        </th>
                        <th className='border border-gray-300 p-2 text-left'>
                          Semester
                        </th>
                        <th className='border border-gray-300 p-2 text-left'>
                          Exam Type
                        </th>
                        <th className='border border-gray-300 p-2 text-left'>
                          Status
                        </th>
                        <th className='border border-gray-300 p-2 text-left'>
                          Reason
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentReportedMissingResults.map((item, idx) => (
                        <tr key={item.enrollment_id}>
                          <td className='border border-gray-300 p-2'>
                            {idx + 1}
                          </td>
                          <td className='border border-gray-300 p-2'>
                            {item.course_code}
                          </td>
                          <td className='border border-gray-300 p-2'>
                            {item.course_name}
                          </td>
                          <td className='border border-gray-300 p-2'>
                            {item.semester}
                          </td>
                          <td className='border border-gray-300 p-2'>
                            {item.exam_type}
                          </td>
                          <td className='border border-gray-300 p-2'>
                            {item.is_resolved ? (
                              <span className='bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold'>
                                Resolved
                              </span>
                            ) : (
                              <span className='bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold'>
                                Pending
                              </span>
                            )}
                          </td>
                          <td className='border border-gray-300 p-2'>
                            {item.reason ? item.reason : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            
          </div>
        </section>
      )}
      {/* For the student end */}
    </>
  );
};

export default ResultPage;
