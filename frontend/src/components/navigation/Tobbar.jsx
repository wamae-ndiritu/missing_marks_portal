import { Link } from "react-router-dom";
import {useSelector} from "react-redux"

const Tobbar = () => {
    const { userInfo } = useSelector((state) => state.user);
    const current_year = new Date().getFullYear();
  return (
    <div className='bg-blue-50 border-b  px-4 py-3 flex justify-between items-center'>
      <div className=''>
        <h4 className='text-xl font-semibold'>Missing Marks System</h4>
        {/* <h6>Bachelor of Education (ICT)</h6> */}
      </div>
      <div className='flex items-center gap-3'>
        <span className='text-sm text-gray-600 text-right'>
          {userInfo?.user?.user_type === "admin" && (
            <div className='flex flex-col items-center'>
              <h6 className='capitalize py-1'>
                Hi, {userInfo?.user?.username}
              </h6>
              <span className='bg-blue-300 rounded-full text-white px-2 py-0.5'>
                Admin
              </span>
            </div>
          )}
          {userInfo?.user?.user_type === "lecturer" && (
            <div className='flex flex-col items-center'>
              <h6 className='capitalize py-1'>
                Hi, {userInfo?.user?.full_name}
              </h6>
              <span className='bg-blue-300 rounded-full text-white px-2 py-0.5'>
                Lecturer
              </span>
            </div>
          )}
          {userInfo?.user?.user_type === "student" && (
            <>
              <h6 className='uppercase'>{userInfo?.user?.full_name}</h6>
              <p>Year {current_year - userInfo?.user?.year_joined}</p>
            </>
          )}
        </span>
        <Link to='/profile'>
          <img
            src='/assets/avatar.jpg'
            alt='profile'
            className='h-10 w-10 rounded-full object-cover'
          />
        </Link>
      </div>
    </div>
  );
}

export default Tobbar