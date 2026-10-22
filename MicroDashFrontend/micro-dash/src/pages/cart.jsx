import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import Menubar from '../components/Menubar';
import { Segment, SegmentGroup, Form, FormField, Radio } from 'semantic-ui-react';
// import CartComp from '../components/CartComp';



Cart.propTypes = {
  API_URL: PropTypes.string,
};

function Cart({API_URL}) {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [orderType, setOrderType] = useState("standard");
  const [deliveryTime, setDeliveryTime] = useState(0);
  const [scheduledDeliveryTime, setScheduledDeliveryTime] = useState("");
  // const [message, setMessage] = useState("");
  // const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);

  const deliveryFee = 399;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;
  const minScheduledTime = toLocalDateTimeInput(new Date(Date.now() + 45 * 60 * 1000));
  const maxScheduledTime = toLocalDateTimeInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  useEffect(()=>{
    if((!(localStorage.getItem("myCart") === null)) && cart.length === 0)
    {
      console.log(localStorage.getItem("myCart"))
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
    if(orderType === "schedule" && !scheduledDeliveryTime)
    {
      setMessage("Please enter a scheduled delivery time.")
      return;
    }
    
    setOrdering(true);
    setMessage("");
    const rID = cart[0].id[0];
    const schTemp = orderType === "schdule" ?  new Date(scheduledDeliveryTime).toISOString() : ""

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
          name: userName,
          scheduledDeliveryTime: schTemp
        })
      })

      const data = await res.json();

      if(!res.ok) 
      {
        throw new Error(data.error || "Order could not be placed.")
      }
      setMessage(
        orderType === "scheduled" ? `Order #${data.id} scheduled successfully!` : `Order #${data.id} placed successfully!`
      );
      setCart([]);
      setAddress("");
      setUserName("");
    } catch(error) {
      setMessage(error.message ||"Cannot place order. Try again later.")
    } finally {
      setOrdering(false);
      localStorage.removeItem("myCart");
    }
  }

  function goHome() {
		setMessage("");
  }

  function toLocalDateTimeInput(date) {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000)
      .toISOString()
      .slice(0, 16);
  }

  // if (loading) return <main className="page"><p>Loading Micro Dash...</p></main>;

  return (
  <div>
    <Menubar passingGoHome={goHome} cart={cart} />
    {
      message && (
			  <div className="notice" role="status">
				  {message}
			  </div>
      )
    }
    <div className='cart-menu'>
      <h2>Your order</h2>
      { 
        cart.length === 0 ?
          <p className="muted">Your cart is empty. Add something tasty!</p>
        :
          <SegmentGroup horizontal>
            <Segment>
              <Form onSubmit={placeOrder}>
                <FormField>
                  <h2>Delivery Time: {deliveryTime} - {deliveryTime + 10} min</h2>
                  <SegmentGroup horizontal>
                    <Segment>
                      <Radio
                        label='Standard'
                        name='radioGroup'
                        value='standard'
                        checked={orderType === 'standard'}
                        onChange={(e, {value}) => setOrderType(value)}
                      />
                    </Segment>
                    <Segment>
                      <Radio
                        label='Schedule Order'
                        name='radioGroup'
                        value='schedule'
                        checked={orderType === 'schedule'}
                        onChange={(e, {value}) => setOrderType(value)}
                      />
                    </Segment>
                  </SegmentGroup> 
                </FormField>
                  {orderType === "schedule" && (
                    <FormField>
                      <label htmlFor="scheduledDeliveryTime">
                        Scheduled delivery time
                      </label>

                      <input
                        id="scheduledDeliveryTime"
                        type="datetime-local"
                        value={scheduledDeliveryTime}
                        min={minScheduledTime}
                        max={maxScheduledTime}
                        onChange={(event) =>
                          setScheduledDeliveryTime(event.target.value)
                        }
                        required
                      />
                      <small>
                        Choose a time at least 45 minutes and no more than
                        7 days from now. The restaurant must be open then.
                      </small>
                    </FormField>
                  )}
                <FormField>
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    value={userName}
                    onChange={(event) => setUserName(event.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </FormField>
                <FormField>
                  <label htmlFor="address">Delivery address</label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Enter your delivery address"
                    required
                  />
                </FormField>
                <button className="checkout-button" disabled={ordering}>
                  {ordering ? "Placing order..." : "Place order"}
                </button>
              </Form>
            </Segment>
            <Segment>
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
                        className='center-quantity'
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        aria-label={`Add one ${item.name}`}
                        onClick={() => changeQuantity(item.id, 1)}
                        className='center-quantity'
                      >
                        +
                      </button>
                    </div>
                  </div> 
                ))
              }

              <div className="totals">
                <p><span>Subtotal</span><span>${(subtotal / 100).toFixed(2)}</span></p>
                <p><span>Delivery</span><span>${(deliveryFee / 100).toFixed(2)}</span></p>
                {/* <p><span>Estimated tax</span><span>${(tax / 100).toFixed(2)}</span></p>  */}
                <p className="grand-total"><span>Total</span><span>${(total / 100).toFixed(2)}</span></p>
              </div>
            </Segment>
          </SegmentGroup>
      }
    </div>
	</div>
  )
}

export default Cart
