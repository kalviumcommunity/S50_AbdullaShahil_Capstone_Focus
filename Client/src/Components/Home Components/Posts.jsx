
function Posts() {
  return (
    <center className="border border-gray-300 pl-5 pr-5 pt-10">
        
        <select className='border border-gray-400 rounded px-2 py-4' id="genreSelect" >
            <option value="">Select the creator </option>
            <option value="All">All</option>
        </select>

        <div className="posts border flex flex-col mb-10 p-5" >
                <div className=' top-opt flex justify-between items-center'>
                  <div className=''>
                    <h1 className='post-title font-bold'></h1>
                    <h3 className='post-username mb-5'></h3>
                  </div>
                  <div>
                    <div className="post-top mb-5 rounded text-white p-3 flex items-center  justify-between">
                      <h1><strong></strong></h1>
                    </div>
                  </div>
                </div>
                <div className="post-options bg-gray-700 rounded text-white p-3 flex items-center  justify-between  mt-5">
                  <h1>Artist: <strong></strong></h1>
                  <h1>Release Year: <strong></strong></h1>
                </div>
              </div>
        
        </center>
  )
}

export default Posts