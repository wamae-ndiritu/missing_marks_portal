import MessageCard from "../components/feedback/MessageCard";

const FeedbackPage = () => {
  return (
    <div className='bg-slate-100 p-4'>
      <div className='w-full h-full mt-6'>
        {/* Search section */}
        <div className='relative w-80 mx-auto'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-500 left-3'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
          <input
            type='text'
            placeholder='Search'
            className='border pl-12 pr-4 py-2 focus:outline-none'
          />
        </div>
        {/* Header section */}
        <div className='w-full h-full flex flex-row justify-between items-center mt-12 bg-white p-4 border-b'>
          <div className='flex flex-col justify-center items-start'>
            <h3 className='text-2xl font-semibold'>Messages</h3>
            <p className='text-gray-500'>You&apos;ve 3 unread messages</p>
          </div>
          <button className='bg-gray-200 hover:bg-gray-900'>
            <p className='text-gray-900 p-2 hover:text-white'>
              Mark all as read
            </p>
          </button>
        </div>
        {/* Notifications section */}
        <div className='w-full h-full bg-white p-4'>
          <MessageCard />
          <MessageCard />
          <MessageCard />
        </div>
      </div>
    </div>
  );
}

export default FeedbackPage