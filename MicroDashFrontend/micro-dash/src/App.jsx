import {  Routes, Route } from 'react-router';


import Home from './pages/Home';
import Cart from './pages/Cart';
import Menu from './pages/menu';
import Order from './pages/order';

const API_URL = "http://localhost:3000";

function App() {

return (
  <>
  <Routes>
    <Route exact path="/" element = {<Home API_URL={API_URL}/>}/>
    <Route exact path="/cart" element={<Cart API_URL={API_URL} />} />
    <Route exact path="/restaurants/:id/menu" element={<Menu API_URL={API_URL} />} />
    <Route exact path="/orders" element={<Order API_URL={API_URL} />} />
  </Routes>
  </>
  )
}

export default App