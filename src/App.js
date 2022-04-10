import './App.css';
import Pages from './pages/Pages';
import Footer from './components/Footer';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
// import SideNavbar from './components/SideNavbar';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        
        {/* <div className='container'> */}
          {/* <SideNavbar/> */}
          <div className='main-container'>
            <Pages/>
          {/* </div> */}
        </div> 
        <Footer/>
     </BrowserRouter>
    </div>
  );
}

export default App;
