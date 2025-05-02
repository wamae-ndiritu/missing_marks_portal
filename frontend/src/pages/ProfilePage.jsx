import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/actions/userActions";
import Message from "../components/Message";
import { resetState } from "../redux/slices/userSlices";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo, loading, error, updated } = useSelector((state) => state.user);
  const [contact, setContact] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [updateErr, setUpdateErr] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  const current_year = new Date().getFullYear();

  useEffect(() => {
    if (userInfo) {
      setContact(userInfo.user.contact);
    }
  }, [userInfo, updated]);

  useEffect(() => {
    if (error){
      setPass("");
      setCurrentPass("");
      setConfirmPass("")
    }
  }, [error])

  const handleSubmit = (e) => {
    e.preventDefault();
    let userObj = null;
    if (contact !== userInfo?.user?.contact){
      userObj = {...userObj, contact}
    }
    if (pass !== ""){
      if (currentPass === ""){
        setUpdateErr("Current password is required to update password!");
        return;
      } else {
        if (confirmPass === ""){
          setUpdateErr("Confirm password required!");
          return;
        }else{
          if (confirmPass !== pass){
            setUpdateErr("Password do not match!");
            return;
          }else{
            userObj = {...userObj, current_password: currentPass, password: pass}
          }
        }
      } 
    }
    if (!updateErr && userObj){
      dispatch(updateUser(userObj));
    }
  }

  useEffect(() => {
    if (updated){
      setUpdateSuccess("Profile updated successfully!")
    }
  }, [updated])

  console.log(updated);

  return (
    <div className='h-screen flex flex-col'>
      <form
        className='flex flex-col md:w-2/5 border p-4'
        onSubmit={handleSubmit}
      >
        <img
          className='m-auto h-32 w-32 rounded-full'
          src='/assets/profile.jpeg'
          alt='profile'
        />
        <section className='my-4 font-semibold'>
          <h3 className='flex justify-between'>
            <span className='capitalize text-xl'>
              {userInfo?.user?.full_name || userInfo?.user?.username}
            </span>
            <span className='bg-amber-500 px-4 py-1 rounded text-white capitalize'>
              {userInfo?.user?.user_type}
            </span>
          </h3>
          {userInfo?.user?.user_type === "student" && (
            <h3>REG NO: {userInfo?.user?.reg_no}</h3>
          )}
          {userInfo?.user?.user_type === "student" && (
            <h3>YEAR: {current_year - userInfo?.user?.year_joined}</h3>
          )}
          <h2 className='mt-3 text-xl'>Edit Profile Info</h2>
          {loading && <p>Loading...</p>}
          {updateSuccess && <Message variant="success" onClose={() => setUpdateSuccess(null)}>{updateSuccess}</Message>}
          {error && (
            <Message onClose={() => dispatch(resetState())}>{error}</Message>
          )}
          {updateErr && (
            <Message onClose={() => setUpdateErr(null)}>{updateErr}</Message>
          )}
        </section>
        <div className='flex gap-1 flex-col mb-2'>
          <label className='text-lg text-gray-600' htmlFor='contact'>
            Contact
          </label>
          <input
            placeholder=''
            type='text'
            id='contact'
            className='border rounded text-black p-2 text-gray-600 focus:outline-amber-400'
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        <div className='flex gap-1 flex-col mb-2'>
          <label className='text-lg text-gray-600' htmlFor='current_pass'>
            Current Password
          </label>
          <input
            placeholder=''
            type='password'
            id='current_pass'
            className='border rounded text-black p-2 text-gray-600 focus:outline-amber-400'
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
          />
        </div>
        <div className='flex gap-1 flex-col mb-2'>
          <label className='text-lg text-gray-600' htmlFor='newPass'>
            New Password
          </label>
          <input
            placeholder=''
            type='password'
            id='newPass'
            className='border rounded text-black p-2 text-gray-600 focus:outline-amber-400'
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>
        <div className='flex gap-1 flex-col mb-2'>
          <label className='text-lg text-gray-600' htmlFor='confirmPass'>
            Confirm New Password
          </label>
          <input
            placeholder=''
            type='password'
            id='confirmPass'
            className='border rounded text-black p-2 text-gray-600 focus:outline-amber-400'
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </div>
        <button
          type='submit'
          className='bg-gray-900 rounded my-2 text-white p-1'
        >
          Update Detail
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
