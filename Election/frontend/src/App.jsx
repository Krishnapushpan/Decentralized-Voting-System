import React from 'react'
import {createBrowserRouter,createRoutesFromElements,RouterProvider,Route,} from 'react-router-dom';
import AddLauch from './pages/AddLauch';
import Home from './pages/Home'
import Viewvoted from './pages/viewvoted';
import Votenow from './pages/votenow';
const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      {/* <Route path="/" element={<Hero/>} /> */}
      <Route path="/" element={<Home/>} />
      <Route path="/addlauch" element={<AddLauch/>} />
      <Route path="/votenow/:electionID" element={<Votenow/>} />
      <Route path="/viewvoted" element={<Viewvoted/>} />
      </>
    )
  )
  return (  
     <RouterProvider router={router}/>
  )
}

export default App