import React from 'react';
import {Route, Routes} from "react-router-dom";

import Home from './Home';
import Books from './Books';
import Register from './LogIn_Out/Register';
import Login from './LogIn_Out/Login';
import AdminPanel from './Admin_Panel/AdminPanel';
import UserAccount from './UserAccount/UserAccount';
import Checkout from './Check_Out/Checkout';
import Searched from './Searched';
import Book from './Book';
import Cart from './Cart';

function Pages() {
  return (
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/search/:search" element={<Searched/>} />
        <Route path="/books/:cat" element={<Books/>} />
        <Route path="/book/:id" element={<Book/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/admin-panel/:name" element={<AdminPanel/>} />
        <Route path="/user/account" element={<UserAccount/>} />
        {/* <Route path="/edit-item/:id" element={<EditItem/>} /> */}
        <Route path="/cart/:id" element={<Cart/>} />
        <Route path="/checkout" element={<Checkout/>} />

      
        {/* <Route path="/shop" element={<Shop/>} />
        <Route path="/shop/:id" element={<ItemDetail/>} /> */}


      </Routes>
  )
}

export default Pages
