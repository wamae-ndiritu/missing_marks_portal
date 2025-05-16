import {useEffect, useState} from "react"
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux"
import { login } from "../redux/actions/userActions";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudent, setIsStudent] = useState(true);
  const [isLecturer, setIsLecturer] = useState(false);

  const {loading, error, userInfo} = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username: regNo, password }));
    setRegNo('');
    setPassword('');
  }

  const handleToggle = (type) => {
    if (type === 'admin'){
      setIsLecturer(false);
      setIsStudent(false);
      setIsAdmin(true);
    } else if (type === 'lecturer'){
      setIsAdmin(false);
      setIsStudent(false);
      setIsLecturer(true);
    } else if (type === 'student'){
      setIsAdmin(false);
      setIsLecturer(false);
      setIsStudent(true);
    }
  }

  useEffect(() => {
    if (userInfo?.token){
      navigate('/')
    }
  }, [navigate, userInfo])
  return (
    <div className='h-screen bg-blue-200 flex flex-col items-center justify-center'>
      <form
        className='bg-white md:w-2/5 h-max flex flex-col flex-wrap p-4 rounded'
        onSubmit={handleSubmit}>
        <div className='flex space-x-1 items-center justify-center'>
          <button
            type='button'
            className={`text-black border rounded px-6 py-2 ${
              isStudent && "bg-blue-300 text-white"
            }`}
            onClick={() => handleToggle("student")}>
            Student
          </button>
          <button
            type='button'
            className={`text-black border rounded px-6 py-2 ${
              isLecturer && "bg-blue-300 text-white"
            }`}
            onClick={() => handleToggle("lecturer")}>
            Lecturer
          </button>
          <button
            type='button'
            className={`text-black border rounded px-6 py-2 ${
              isAdmin && "bg-blue-300 text-white"
            }`}
            onClick={() => handleToggle("admin")}>
            Admin
          </button>
        </div>
        <div className='flex flex-col items-center'>
          <h4 className='mt-5 font-semibold text-2xl text-blue-300 capitalize'>
            Missing Marks System
          </h4>
          <span className='text-md text-gray-600 font-normal'>
            Login as{" "}
            {(isAdmin && "Admin") ||
              (isLecturer && "Lecturer") ||
              (isStudent && "Student")}{" "}
          </span>
        </div>
        {loading && <p>Loading....</p>}
        {error && (
          <p className='bg-red-500 p-4 rounded text-oranger-500'>{error}</p>
        )}
        <div className='mb-2 flex flex-col'>
          <label className='py-1'>
            {(isAdmin && "Username") ||
              (isStudent && "Reg No") ||
              (isLecturer && "Staff No")}
          </label>
          <input
            type='text'
            placeholder={
              (isAdmin && "Username") ||
              (isStudent && "Reg No") ||
              (isLecturer && "Staff No")
            }
            className='border px-4 py-2 rounded-lg text-gray-600 focus:outline-blue-300'
            onChange={(e) => setRegNo(e.target.value)}
            value={regNo}
          />
        </div>
        <div className='mb-2 flex flex-col'>
          <label className='py-1'>Password</label>
          <input
            type='password'
            placeholder='********'
            className='border px-4 py-2 rounded-lg text-gray-600 focus:outline-blue-300'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button
          className='bg-blue-300 border text-white rounded py-3 px-4 text-xl font-semibold hover:bg-transparent hover:text-blue-300 hover:border-gray-600'
          type='submit'>
          Sign In
        </button>
      </form>
    </div>
  );
}

export default LoginPage
