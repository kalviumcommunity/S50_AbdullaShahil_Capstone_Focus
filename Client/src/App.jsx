import { Routes, Route } from 'react-router-dom';
import Landing from './Components/Landing';
import Signup from './Components/Signup';
import Login from './Components/Login'
import Home from './Components/Home';
import Post from './Components/Post';
import Write from './Components/Write';
import UserProfile from './Components/UserProfile';
import Settings from './Components/Settings';
import LensHub from './Components/LensHub';
import EditEntity from './Components/EditEntity';
import Chats from './Components/Chats';
import CreateCommunity from './Components/CreateCommunity';

import MyComponent from './Components/Utils/ApiUtils';
import './App.css'


function App() {
  return (
    <div>
    <Routes>
      <Route path='/' element={<Landing/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/post' element={<Post/>}/>
      <Route path='/profile' element={<UserProfile/>}/>
      <Route path='/settings' element={<Settings/>}/>
      <Route path='/lenshub' element={<LensHub/>}/>
      <Route path='/write' element={<Write/>}/>
      <Route path='/edit/:type/:id' element={<EditEntity/>}/>
      <Route path='/chats' element={<Chats/>}/>
      <Route path='/createCommunity' element={<CreateCommunity/>}/>
      <Route path='/testApi' element={<MyComponent/>}/>
    </Routes>
    </div>
  )
}

export default App