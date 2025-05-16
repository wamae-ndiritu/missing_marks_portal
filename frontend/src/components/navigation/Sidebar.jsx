import {NavLink} from "react-router-dom" 
import DashboardIcon from "@mui/icons-material/Dashboard";
import InsightsIcon from "@mui/icons-material/Insights";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import {useDispatch, useSelector} from "react-redux"
import { logout } from "../../redux/actions/userActions";
const Sidebar = () => {
  const dispatch = useDispatch();
  const {userInfo} = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout())
  }
  return (
    <div className='bg-blue-300 text-white w-48 py-4'>
      <div className='w-full border-b px-2 flex flex-col items-center'>
        <h5 className='my-3 text-xl font-semibold text-center'>Missing Marks System</h5>
      </div>
      <div className='px-2 py-4'>
        {userInfo?.user?.user_type === "admin" && (
          <ul className='list-type-none px-4'>
            <li className='my-1'>
              <NavLink
                to='/'
                className={({ isActive }) =>
                  isActive
                    ? "flex gap-3 p-2 bg-gray-200 text-gray-900"
                    : "flex gap-3 p-2 hover:bg-gray-200 hover:text-gray-900"
                }
              >
                <DashboardIcon />
                <h6>Dashboard</h6>
              </NavLink>
            </li>
            <li className='my-1'>
              <NavLink
                to='/students'
                className={({ isActive }) =>
                  isActive
                    ? "flex gap-3 p-2 bg-gray-200 text-gray-900"
                    : "flex gap-3 p-2 hover:bg-gray-200 hover:text-gray-900"
                }
              >
                <SchoolIcon />
                <h6>Students</h6>
              </NavLink>
            </li>
            <li className='my-1'>
              <NavLink
                to='/lecturers'
                className={({ isActive }) =>
                  isActive
                    ? "flex gap-3 p-2 bg-gray-200 text-gray-900"
                    : "flex gap-3 p-2 hover:bg-gray-200 hover:text-gray-900"
                }
              >
                <PsychologyIcon />
                <h6>Lecturers</h6>
              </NavLink>
            </li>
            <li className='my-1'>
              <NavLink
                to='/courses'
                className={({ isActive }) =>
                  isActive
                    ? "flex gap-3 p-2 bg-gray-200 text-gray-900"
                    : "flex gap-3 p-2 hover:bg-gray-200 hover:text-gray-900"
                }
              >
                <CastForEducationIcon />
                <h6>Courses</h6>
              </NavLink>
            </li>
            <li className=''>
              <NavLink
                to='/profile'
                className={({ isActive }) =>
                  isActive
                    ? "flex gap-3 p-2 bg-gray-200 text-gray-900"
                    : "flex gap-3 p-2 hover:bg-gray-200 hover:text-gray-900"
                }
              >
                <AccountCircleIcon />
                <h6>Profile</h6>
              </NavLink>
            </li>
            <li className='my-1'>
              <button
                className='flex gap-3 p-2 cursor-pointer hover:bg-gray-200 hover:text-gray-900'
                onClick={handleLogout}
              >
                <LogoutIcon />
                <h6>Logout</h6>
              </button>
            </li>
          </ul>
        )}
        {userInfo?.user?.user_type === "lecturer" && (
          <ul className='list-type-none px-4'>
            <li className='my-1'>
              <NavLink
                to='/'
                className={({ isActive }) =>
                  isActive
                    ? "flex gap-3 p-2 bg-gray-200 text-gray-900"
                    : "flex gap-3 p-2 hover:bg-gray-200 hover:text-gray-900"
                }
              >
                <DashboardIcon />
                <h6>Dashboard</h6>
              </NavLink>
            </li>
            <li className='my-1'>
              <NavLink
                to='/results'
                className={({ isActive }) =>
                  isActive
                    ? "flex gap-3 p-2 bg-gray-200 text-gray-900"
                    : "flex gap-3 p-2 hover:bg-gray-200 hover:text-gray-900"
                }
              >
                <InsightsIcon />
                <h6>Results</h6>
              </NavLink>
            </li>
            <li className='my-1'>
              <NavLink
                to='/courses'
                className={({ isActive }) =>
                  isActive
                    ? "flex gap-3 p-2 bg-gray-200 text-gray-900"
                    : "flex gap-3 p-2 hover:bg-gray-200 hover:text-gray-900"
                }
              >
                <CastForEducationIcon />
                <h6>Courses</h6>
              </NavLink>
            </li>
            <li className=''>
              <NavLink
                to='/profile'
                className={({ isActive }) =>
                  isActive
                    ? "flex gap-3 p-2 bg-gray-200 text-gray-900"
                    : "flex gap-3 p-2 hover:bg-gray-200 hover:text-gray-900"
                }
              >
                <AccountCircleIcon />
                <h6>Profile</h6>
              </NavLink>
            </li>
            <li className='my-1'>
              <button
                className='flex gap-3 p-2 cursor-pointer hover:bg-gray-200 hover:text-gray-900'
                onClick={handleLogout}
              >
                <LogoutIcon />
                <h6>Logout</h6>
              </button>
            </li>
          </ul>
        )}
        {userInfo?.user?.user_type === "student" && (
          <ul className='list-type-none px-4'>
            <li className='my-1'>
              <NavLink
                to='/'
                className={({ isActive }) =>
                  isActive
                    ? "flex gap-3 p-2 bg-gray-200 text-gray-900"
                    : "flex gap-3 p-2 hover:bg-gray-200 hover:text-gray-900"
                }
              >
                <DashboardIcon />
                <h6>Dashboard</h6>
              </NavLink>
            </li>
            <li className='my-1'>
              <NavLink
                to='/results'
                className={({ isActive }) =>
                  isActive
                    ? "flex gap-3 p-2 bg-gray-200 text-gray-900"
                    : "flex gap-3 p-2 hover:bg-gray-200 hover:text-gray-900"
                }
              >
                <InsightsIcon />
                <h6>Results</h6>
              </NavLink>
            </li>
            <li className='my-1'>
              <NavLink
                to='/courses'
                className={({ isActive }) =>
                  isActive
                    ? "flex gap-3 p-2 bg-gray-200 text-gray-900"
                    : "flex gap-3 p-2 hover:bg-gray-200 hover:text-gray-900"
                }
              >
                <CastForEducationIcon />
                <h6>Courses</h6>
              </NavLink>
            </li>
            <li className=''>
              <NavLink
                to='/profile'
                className={({ isActive }) =>
                  isActive
                    ? "flex gap-3 p-2 bg-gray-200 text-gray-900"
                    : "flex gap-3 p-2 hover:bg-gray-200 hover:text-gray-900"
                }
              >
                <AccountCircleIcon />
                <h6>Profile</h6>
              </NavLink>
            </li>
            <li className='my-1'>
              <button
                className='flex gap-3 p-2 cursor-pointer hover:bg-gray-200 hover:text-gray-900'
                onClick={handleLogout}
              >
                <LogoutIcon />
                <h6>Logout</h6>
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
