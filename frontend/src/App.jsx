import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './user/home';
import Signup_User from './login_signup/signup_user';
import Signup_Seller from './login_signup/signup_seller';
import Login from './login_signup/login';

import Seller from './seller/seller';

import Admin from './admin/admin';


export default function App() {
  return (
    <>
      <Router>
        <Routes>

          <Route path='/'>
            <Route path='/' element={<Home />}></Route>
            <Route path='signup_user' element={<Signup_User />}></Route>
            <Route path='signup_seller' element={<Signup_Seller />}></Route>
            <Route path='login' element={<Login />}></Route>
          </Route>
          <Route path='/seller'>
            <Route path='/seller' element={<Seller />}></Route>
          </Route>
          <Route path='/admin'>
            <Route path='/admin' element={<Admin />}></Route>
          </Route>

        </Routes>
      </Router>
    </>
  )
}