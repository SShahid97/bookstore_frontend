import React from 'react';
import {Route, Routes} from "react-router-dom";

import Home from './Home';
import PageNotFound from "./PageNotFound";
import Books from './Books';
import Register from './LogIn_Out/Register';
import Login from './LogIn_Out/Login';
import UserAccount from './UserAccount/UserAccount';
import Checkout from './Check_Out/Checkout';
import Searched from './Searched';
import Book from './Book';
import Cart from './Cart';

import AdminPanel from './Admin_Panel/AdminPanel';
import Dashboard from './Admin_Panel/Dashboard';
import AddItem from './Admin_Panel/AddItem';
import ViewAllItems from './Admin_Panel/ViewAllItems';
import ViewAllUsers from './Admin_Panel/ViewAllUsers';
import SearchOrder from './Admin_Panel/SearchOrder';
import SearchUser from './Admin_Panel/SearchUser';
import EditItem from './Admin_Panel/EditItem';
import UserAddress from './Admin_Panel/UserAddress';
import UserOrderHistory from './Admin_Panel/UserOrderHistory';
import ContactUs from './ContactUs';
import AboutUs from './AboutUs';
import Faqs from './Faqs';

function Pages() {
  return (
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/search/:search" element={<Searched/>} />
        <Route path="/books/:cat" element={<Books/>} />
        <Route path="/book/:id" element={<Book/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        {/* <Route path="/admin-panel/:name" element={<AdminPanel/>} /> */}
        {/* <Route path="/admin-panel" element={<AdminHome/>} /> */}
        <Route path="/user/account" element={<UserAccount/>} />
        <Route path="/cart/:id" element={<Cart/>} />
        <Route path="/checkout/:name" element={<Checkout/>} />
        <Route path="/contact-us" element={<ContactUs/>}/>
        <Route path="/about-us" element={<AboutUs/>}/>
        <Route path="/faqs" element={<Faqs/>}/>
        
        <Route path="admin-panel" element={<AdminPanel />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="manage-books/view-all-items" element={<ViewAllItems />} />
            {/* <Route path="manage-books/view-all-items/:cat" element={<ViewAllItems />} /> */}
            <Route path="manage-books/view-all-items/edit-item/:id" element={<EditItem />} />
            <Route path="manage-books/add-item" element={<AddItem />} />
            <Route path="manage-users/view-all-users" element={<ViewAllUsers />} /><></>
            <Route path="manage-users/view-all-users/user-address/:id" element={<UserAddress />} />
            <Route path="manage-users/view-all-users/user-orderhistory/:id" element={<UserOrderHistory />} />
            <Route path="manage-users/search-user" element={<SearchUser />} />
            <Route path="manage-users/search-order" element={<SearchOrder />} />
            <Route path="*" element={<PageNotFound />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
  )
}

export default Pages
