import React from 'react';
import {Route, Routes} from "react-router-dom";

import Home from './Home';
import PageNotFound from "./PageNotFound";
import Books from './Books';
import Register from './LogIn_Out/Register';
import Login from './LogIn_Out/Login';
import Cart from './Cart';
import UserAccount from './UserAccount/UserAccount';
import UserOrders from './UserAccount/UserOrders';
import UserWishlist from './UserAccount/UserWishlist';

import Checkout from './Check_Out/Checkout';
import Searched from './Searched';
import Book from './Book';
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
import AddStock from './Admin_Panel/AddStock';
import ViewEditStock from './Admin_Panel/ViewEditStock';
import ChangePassword from './UserAccount/ChangePassword';
import AddEditAddress from './UserAccount/AddEditAddress';
import Invoice from './Admin_Panel/Invoice';
import VerifyEmail from './UserAccount/VerifyEmail';
import ResetPassword from './UserAccount/ResetPassword';
import Statistics from './Admin_Panel/Statistics';
import AdminProfile from './Admin_Panel/AdminProfile';
import Loader from '../components/Loader';

function Pages() {
  return (
    <React.Suspense fallback={<Loader/>}>
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
        <Route path="/user/orders" element={<UserOrders/>} />
        <Route path="/user/wishlist" element={<UserWishlist/>} />
        <Route path="/user/change-password" element={<ChangePassword/>} />
        <Route path="/user/verify-email" element={<VerifyEmail/>} />
        <Route path="/user/reset-password/:id" element={<ResetPassword/>} />
        <Route path="/user/user-address/:type" element={<AddEditAddress/>} />
        <Route path="/cart/:id" element={<Cart/>} />
        <Route path="/checkout/:name" element={<Checkout/>} />
        <Route path="/contact-us" element={<ContactUs/>}/>
        <Route path="/about-us" element={<AboutUs/>}/>
        <Route path="/faqs" element={<Faqs/>}/>
        
        <Route path="admin-panel" element={<AdminPanel />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="admin-profile" element={<AdminProfile />} />
            <Route path="manage-books/view-all-items" element={<ViewAllItems />} />
            {/* <Route path="manage-books/view-all-items/:cat" element={<ViewAllItems />} /> */}
            <Route path="manage-books/view-all-items/edit-item/:id" element={<EditItem />} />
            <Route path="manage-books/view-all-items/view-edit-stock/:code" element={<ViewEditStock />} />
            <Route path="manage-books/add-item" element={<AddItem />} />
            <Route path="manage-books/add-item/add-stock/:code" element={<AddStock />} />
            <Route path="manage-users/view-all-users" element={<ViewAllUsers />} /><></>
            <Route path="manage-users/view-all-users/user-address/:id" element={<UserAddress />} />
            <Route path="manage-users/view-all-users/user-orderhistory/:id" element={<UserOrderHistory />} />
            <Route path="manage-users/search-user" element={<SearchUser />} />
            <Route path="manage-users/search-order" element={<SearchOrder />} />
            <Route path="manage-users/search-order/invoice/:id" element={<Invoice />} />
            <Route path="manage-books/statistics" element={<Statistics />} />
            <Route path="*" element={<PageNotFound />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      </React.Suspense>
  )
}

export default Pages
