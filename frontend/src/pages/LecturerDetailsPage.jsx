import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getLecturerDetails } from "../redux/actions/userActions";
const LecturerDetailsPage = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const { lecturerInfo } = useSelector((state) => state.user);

  const lecturerId = params?.id ? Number(params.id) : null;

  useEffect(() => {
    if (lecturerId) {
      dispatch(getLecturerDetails(lecturerId));
    }
  }, [dispatch, lecturerId]);
  return (
    <div className='w-max bg-slate-200 p-4'>
      <div className='col-span-1 md:col-span-3 bg-white p-4'>
        <h6 className='text-2xl font-semibold text-gray-900 mt-2'>
          Lecturer&apos;s Info
        </h6>
        <div className='bg-white'>
          <h2 className='my-3 text-md'>Lecturer: {lecturerInfo.full_name}</h2>
          <h2 className='my-3 text-md'>Email: {lecturerInfo.email}</h2>
          <h2 className='my-3 text-md'>Contact: {lecturerInfo.contact}</h2>
          <div className='flex gap-2'>
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
              to={`/lecturers/${lecturerId}/assign-course`}
              className='bg-indigo-500 text-white border px-4 py-1'
            >
              Assign Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDetailsPage;
