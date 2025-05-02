const MessageCard = () => {
  return (
    <div className='bg-white border rounded-md p-4 w-full my-2'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-lg font-semibold'>Sender</h2>
          <p className='text-gray-500'>Date Sent: April 1, 2024</p>
        </div>
        <button className='bg-gray-200 hover:bg-gray-900 rounded'>
          <p className='text-gray-900 p-2 hover:text-white'>Mark as Read</p>
        </button>
      </div>
      <hr className='my-4' />
      <p className='text-gray-600'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere
        justo non neque commodo, sit amet dapibus odio pulvinar. Integer eget
        quam eget arcu tempus convallis et eget odio.
      </p>
    </div>
  );
};

export default MessageCard;
