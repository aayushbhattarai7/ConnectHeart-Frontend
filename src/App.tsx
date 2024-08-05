import Login from './ui/landingPage/organisms/Login'
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Route } from './ui/landingPage/molecules/Route'
import Signup from './ui/landingPage/organisms/Signup'
import Home from './ui/landingPage/organisms/Home'
import Post from './ui/landingPage/organisms/Post'
import ShowPost from './ui/landingPage/organisms/ShowPost'
import Request from './ui/landingPage/organisms/Request'
import Connection from './ui/landingPage/organisms/Connection'
import User from './ui/landingPage/organisms/User'
const router = createBrowserRouter([
  
  {
    path:'/',
    element:<Route/>,
    children: [
      {
        path:'',
        element:<Home/>
      },
      {
        path:'/login',
        element: <Login/>
      }, {
        path:'/signup',
        element:<Signup/>
      }, {
        path:'/post',
        element:<Post/>
      },
     { path:'/posts',
      element: <ShowPost/>
    }, 
    {
      path: '/connect',
      element:<Connection/>
    }, 
    {
      path:'/requests',
      element:<Request/>
    },
    {
      path:'/users',
    element:<User/>
  }
    ]
  },
 
])

function App() {

  return <RouterProvider router={router}/>
}

export default App
