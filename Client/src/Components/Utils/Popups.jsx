
// DELETE POPUP

export const DeletePopup = ({ handleDelete, handleNoClick }) => (
    <div>
        <div className="overlay"></div>
        <div className="logout-popup p-6 rounded-[12px] flex flex-col justify-around text-center">
            <h2>Are you sure you want to delete?</h2>
            <div className='flex justify-around mt-5 '>
                <button onClick={handleDelete} className='py-3 px-5 rounded bg-red-600 text-white font-bold hover:bg-red-400'>Yes</button>
                <button onClick={handleNoClick} className='py-3 px-5 border rounded text-black font-bold hover:bg-gray-50'>No</button>
            </div>
        </div>
    </div>
);


// ADD MEMBER POPUP
import NoProfile from "../../assets/noprofile.png"

export const AddMemberPopup = ({ userData, handleAddMember, setAddMemberPopupOpen }) => (
    <div>
        <div className="overlay bg-blue-black bg-opacity-60"></div>
        <div className="border h-[60vh] logout-popup p-5 rounded-lg flex flex-col justify-around text-center">
            <h2 className='text-lg poppins mb-5'>Add new members</h2>
            <div className='border border-gray-300 rounded-lg overflow-scroll'>
                <ul className='user-list'>
                    {userData.map(user => (
                        <li key={user._id} className='p-2'>
                            <button onClick={() => handleAddMember(user._id)} className='p-2 w-full flex items-center justify-left bg-gray-50 poppins text-gray-700 rounded hover:bg-gray-200 transition'>
                                <img
                                    className="w-16 h-16 border rounded-full mr-2"
                                    src={user.profile_img ? user.profile_img : NoProfile}
                                    alt="Profile"
                                />
                                <h1 className='p-4 poppins text-lg'>{user.name}</h1>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <button onClick={() => setAddMemberPopupOpen(false)} className='gradient2 mt-4 py-2 px-4 border rounded text-white font-bold hover:opacity-90'>Cancel</button>
        </div>
    </div>
);

