import PropTypes from 'prop-types';
import { Menu, Icon, Label } from 'semantic-ui-react';
import {Link, useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';

Menubar.propTypes = {
  passingGoHome: PropTypes.func.isRequired, 
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

function Menubar() {
  const navigate = useNavigate();
  const[cart, setCart] = useState([])

  useEffect(() =>{
    // localStorage.clear()
    if((!(localStorage.getItem("myCart") === null)) && cart.length === 0)
		{
      
      setCart(JSON.parse(localStorage.getItem("myCart")));
		}
  }, [cart.length])


  return (
	<div>
	  <header className="topbar">
      <button className="brand" onClick={()=> navigate('/')}>
        🍔 Micro Dash
      </button>
      <span className='title'>Food out of this world, straight to your hands.</span>
      {/* <div className="cart-count">🛒 {cart.reduce((n, item) => n + item.quantity, 0)}</div> */}
      <div>
        <Menu compact className='cart-w-notif' >
          <Menu.Item style={{ position: 'relative' }} as={Link} to="/orders">
            <Icon name='file alternate outline' size='large'  />
            Orders
          </Menu.Item>
          <Menu.Item style={{ position: 'relative' }} as={Link} to="/cart">
            <Icon name='shopping cart' size='large' />
            {cart.reduce((n, item) => n + item.quantity, 0) > 0 && (
              <Label color='red' floating circular size='mini'>
                {cart.reduce((n, item) => n + item.quantity, 0)}
              </Label>
            )}
            Cart
          </Menu.Item>
          <Menu.Item style={{ position: 'relative' }} as={Link} to="/restaurant/orders">
            <Icon name='address book outline' size='large'  />
            Login
          </Menu.Item>
        </Menu>
      </div>
    </header>
	</div>
  )
}

export default Menubar
