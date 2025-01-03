import React from 'react'
import {createBrowserRouter,createRoutesFromElements,RouterProvider,Route,} from 'react-router-dom';
import AddLauch from './pages/AddLauch';
import Home from './pages/Home'
import Voting from './pages/voting';
const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      {/* <Route path="/" element={<Hero/>} /> */}
      <Route path="/" element={<Home/>} />
      <Route path="/addlauch" element={<AddLauch/>} />
      <Route path="/voting" element={<Voting/>} />
      </>
    )
  )
  return (  
     <RouterProvider router={router}/>
  )
}

export default App