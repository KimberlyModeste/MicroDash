import {  Routes, Route } from 'react-router';


import Home from './pages/home';
import Cart from './pages/cart';
import Menu from './pages/menu';

const API_URL = "http://localhost:3000";

function App() {

return (
  <>
  <Routes>
    <Route exact path="/" element = {<Home/>}/>
    <Route exact path="/cart" element={<Cart API_URL={API_URL} />} />
    <Route exact path="/restaurants/:id/menu" element={<Menu API_URL={API_URL} />} />
  </Routes>
  </>
  )
}

export default App