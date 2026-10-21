import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import Menubar from '../components/Menubar';
// import CartComp from '../components/CartComp';



Cart.propTypes = {
  API_URL: PropTypes.string,
};

function Cart({API_URL}) {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [userName, setUserName] = useState("");
  const [, setMessage] = useState("");
  // const [message, setMessage] = useState("");
  // const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);

  const deliveryFee = 3.99;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;


  useEffect(()=>{
    if((!(localStorage.getItem("myCart") === null)) && cart.length === 0)
    {
      setCart(JSON.parse(localStorage.getItem("myCart")));
    }
  }, [cart.length])

    
  function changeQuantity(itemId, amount)
  {
    setCart((currentCart) =>
      currentCart
      .map((item) => 
      
          item.id === itemId 
          ? { ...item, quantity: item.quantity + amount} 
        : item
      )
      .filter((item) => item.quantity > 0)
    )

  }

  async function placeOrder(event) {
    event.preventDefault();
    
    if(cart.length === 0)
    {
      setMessage("Choose a restaurant and add something to your cart!")
      return;
    }
    
    setOrdering(true);
    setMessage("");
    const rID = cart[0].id[0];

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          restaurantId: String(rID),
          items: cart.map((item)=>({
            menuItemId: String(item.id),
            quantity: item.quantity
          })),
          deliveryAddress: address,
          name: userName
        })
      })

      const data = await res.json();

      if(!res.ok) 
      {
        throw new Error(data.error || "Order could not be placed.")
      }
      setMessage(
        `Order #${data.id} placed successfully! Total: $${(data.lineTotal / 100).toFixed(2)}`
      );
      setCart([]);
      setAddress("");
      setUserName("");
    } catch(error) {
      setMessage(error.message ||"Cannot place order. Try again later.")
    } finally {
      setOrdering(false);
    }
  }

  	  function goHome() {
		// setSelectedRestaurant(null);
		// setMenu([]);
		setCart([]);
		setMessage("");
	  }

  // if (loading) return <main className="page"><p>Loading Micro Dash...</p></main>;


  return (
    	<div>
        <Menubar passingGoHome={goHome} cart={cart} />
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
            <p><span>Delivery</span><span>${(deliveryFee / 100).toFixed(2)}</span></p>
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

export default Cart
