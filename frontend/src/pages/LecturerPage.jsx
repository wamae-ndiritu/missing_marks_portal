import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  importLecturers,
  listLecturers,
} from "../redux/actions/userActions";
import { resetState } from "../redux/slices/userSlices";
import Message from "../components/Message";

const LecturerPage = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState("");
  const [fileErr, setFileErr] = useState("");
  const [successImport, setSuccessImport] = useState(null);
  const [showImportBtn, setShowImportBtn] = useState(false);
  const [searchId, setSearchId] = useState('');

  const {
    loading,
    lecturers: lecturersList,
    error,
    deleted,
    updateInfo,
  } = useSelector((state) => state.user);

  const importFromExcel = () => {
    if (file === "") {
      setFileErr("Please choose an excel file to upload!");
    } else {
      const reader = new FileReader();

      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const LecturerData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const obj = LecturerData.slice(1).map((row) => ({
          staff_no: row[0],
          full_name: row[1],
          email: row[2],
          contact: row[3],
          user_type: "lecturer",
        }));

        // setLecturers(obj);

        dispatch(importLecturers(obj));
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDeleteUser = (userId) => {
    alert("Are you sure you want to delete the user?");
    dispatch(deleteUser(userId));
  };

  const handleSearchLecturerByStaffId = (e) => {
    e.preventDefault();
    dispatch(listLecturers(searchId));
  }

  useEffect(() => {
    if (updateInfo?.total_items) {
      setSuccessImport(`${updateInfo?.updates_count}/${updateInfo?.total_items} added successfully!`);
    }
    const timeout = setTimeout(() => {
      dispatch(resetState());
      setSuccessImport(null);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [dispatch, updateInfo]);

  useEffect(() => {
    dispatch(listLecturers());
  }, [dispatch]);

  useEffect(() => {
    if (deleted || updateInfo?.total_items) {
      dispatch(listLecturers());
    }
  }, [dispatch, deleted, updateInfo]);

  return (
    <div className='w-full'>
      <h2 className='text-lg uppercase font-semibold text-gray-600'>
        Lecturer
      </h2>
      <div className='flex justify-between items-end my-4'>
        {!showImportBtn ? (
          <span className='flex gap-5 items-center border text-sm text-gray-600 p-2'>
            <span>
              <h6 className='text-xl font-semibold text-gray-900'>
                Import Lecturers
              </h6>
              <p>
                To Import lecturers data, please click on Import, select an
                excel file and upload data.
              </p>
            </span>
            <button
              className='bg-blue-300 text-white px-4 py-2 rounded'
              onClick={() => setShowImportBtn(true)}>
              Import
            </button>
          </span>
        ) : (
          <div className='flex gap-3 border p-2 relative'>
            <input
              type='file'
              id='file'
              accept='.xlsx, .ods'
              onChange={handleFileChange}
              className='border focus:outline-blue-300 px-4 py-1 rounded'
            />
            <button
              className='bg-blue-300 text-white px-4 py-2 rounded'
              onClick={importFromExcel}>
              Upload data
            </button>
            <button
              className='bg-gray-200 h-6 w-6 text-gray-900 rounded-full flex justify-center items-center absolute top-0 close-import-btn'
              onClick={() => setShowImportBtn(false)}>
              x
            </button>
          </div>
        )}
        <form
          className='flex justify-end gap-1'
          onSubmit={handleSearchLecturerByStaffId}>
          <input
            type='text'
            className='border border-gray-300 rounded p-2 text-gray-600 focus:outline-blue-300'
            placeholder='Search by STAFF NO'
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button
            type='submit'
            className='bg-blue-300 px-4 py-1 rounded text-white'>
            Search
          </button>
        </form>
      </div>
      <section className='w-full overflow-x-auto'>
        {loading && <p>Loading...</p>}
        {error && (
          <Message onClose={() => dispatch(resetState())}>{error}</Message>
        )}
        {successImport && (
          <Message variant='success' onClose={() => setSuccessImport(null)}>
            {successImport}
          </Message>
        )}
        {fileErr && (
          <Message onClose={() => setFileErr(null)}>{fileErr}</Message>
        )}
        <table className='w-full border border-gray-400'>
          <thead className=''>
            <tr className='bg-gray-200'>
              <th className='border border-gray-400 p-2'>S/NO</th>
              <th className='border border-gray-400 p-2'>FULL NAME</th>
              <th className='border border-gray-400 p-2'>EMAIL</th>
              <th className='border border-gray-400 p-2'>STAFF NO</th>
              <th className='border border-gray-400 p-2'>CONTACT</th>
              <th className='border border-gray-400 p-2'>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {lecturersList.map((lecturer, index) => {
              return (
                <tr key={index}>
                  <td className='border border-gray-400 p-2'>{index + 1}</td>
                  <td className='border border-gray-400 p-2'>
                    {lecturer.full_name}
                  </td>
                  <td className='border border-gray-400 p-2'>
                    {lecturer.email}
                  </td>
                  <td className='border border-gray-400 p-2'>
                    {lecturer.staff_no}
                  </td>
                  <td className='border border-gray-400 p-2'>
                    {lecturer.contact}
                  </td>
                  <td className='border border-gray-400 flex gap-3 p-2'>
                    <Link
                      to={`/lecturers/${lecturer.lecturer_id}`}
                      className='bg-green-500 text-white rounded px-2 py-1 text-sm'>
                      View
                    </Link>
                    <button
                      className='bg-red-500 text-white rounded px-2 py-1 text-sm'
                      onClick={() => handleDeleteUser(lecturer.user_id)}>
                      Deregister
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default LecturerPage;
