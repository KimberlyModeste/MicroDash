// import { goHome, cart } from '../App'
import '../App.css'
import PropTypes from 'prop-types';

Menubar.propTypes = {
  passingGoHome: PropTypes.func.isRequired, 
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

function Menubar({passingGoHome, cart}) {
  return (
	<div>
	  <header className="topbar">
        <button className="brand" onClick={passingGoHome}>
          🍔 Micro Dash
        </button>
        <span>Food out of this world, straight to your hands.</span>
        <div className="cart-count">🛒 {cart.reduce((n, item) => n + item.quantity, 0)}</div>
      </header>
	</div>
  )
}

export default Menubar
