
import PropTypes from 'prop-types';

CartComp.propTypes = {
  cart: PropTypes.object,
  changeQuantity: PropTypes.func,
  ordering: PropTypes.func,
  placeOrder: PropTypes.func,
  subtotal: PropTypes.number,
  delivery: PropTypes.number,
  total: PropTypes.number,
  setAddress: PropTypes.string, 
  address: PropTypes.string, 
  userName: PropTypes.string, 
  setUserName: PropTypes.string
};

function CartComp({cart, changeQuantity, subtotal, delivery, total, placeOrder, ordering, setAddress, address, userName, setUserName}) {
  return (
	<div>
	  <h2>Your order</h2>
    { cart.length === 0 ?
        <p className="muted">Your cart is empty. Add something tasty!</p>
      :
      <>
        {
          cart.map((item)=> (
            <div className="cart-item" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <p>${((item.price * item.quantity) / 100).toFixed(2)}</p>
              </div>
              <div className='quantity-controls'>
                <button
                  aria-label={`Remove one ${item.name}`}
                  onClick={() => changeQuantity(item.id, -1)}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  aria-label={`Add one ${item.name}`}
                  onClick={() => changeQuantity(item.id, 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <div className="totals">
            <p><span>Subtotal</span><span>${(subtotal / 100).toFixed(2)}</span></p>
            <p><span>Delivery</span><span>${(delivery / 100).toFixed(2)}</span></p>
            {/* <p><span>Estimated tax</span><span>${(tax / 100).toFixed(2)}</span></p>  */}
            <p className="grand-total"><span>Total</span><span>${(total / 100).toFixed(2)}</span></p>
          </div>

          <form onSubmit={placeOrder}>
            
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              placeholder="Enter your name"
              required/>
            <label htmlFor="address">Delivery address</label>
            <textarea
              id="address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Enter your delivery address"
              required
            />

            <button className="checkout-button" disabled={ordering}>
              {ordering ? "Placing order..." : "Place order"}
            </button>
          </form>
      </>
    }
	</div>
  )
}

export default CartComp
