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
  const [deliveryTime, ] = useState(0);
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
      // console.log(localStorage.getItem("myCart"))
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
    if(orderType === "scheduled" && !scheduledDeliveryTime)
    {
      setMessage("Please enter a scheduled delivery time.")
      return;
    }
    
    setOrdering(true);
    setMessage("");

    // console.log("ordertype", orderType)
    const schTemp = orderType === "scheduled" ?  new Date(scheduledDeliveryTime).toISOString() : null

    try {
      const restaurants = await fetch(`${API_URL}/restaurants`)
      .then((res) => {return res.json()})

      const filteredCart = await cart.map((item) =>{
        const tempRest = restaurants.find((rest) => rest.id === item.resId)

        if(!tempRest.openingHours)
        {
          setMessage("There are no opening hours for this restaurant. Cancelling order");
          return;
        }
        if(timeInBetween(tempRest.openingHours.split(" - ")))
        {
          return item;
        }
        
      }).filter((item) => item !== undefined)
      
      if(filteredCart.length === 0)
      {
        setMessage("None of the items can be bought at this time.")
        return;
      }
      if(filteredCart.length !== cart.length)
      {
        const notAvailable = cart.filter(item => !filteredCart.some(filt => filt.id === item.id))
        var mes = "This scheduled time does not allow the food items: "
        
        for(var i = 0; i < notAvailable.length; i++)
        {
          if(notAvailable.length === 1)
            mes+= `${notAvailable[i].name}.`
          else
          {
            if(i+1 === notAvailable.length)
            { 
              mes = mes.slice(0, -2)
              mes += ` and ${notAvailable[i].name}. `
          
            }
            else
              mes += `${notAvailable[i].name}, `
          }
          
        }
        
        mes += `Only the food items: `
        for(i = 0; i < filteredCart.length; i++)
        {
          if(filteredCart.length === 1)
            mes+= `${filteredCart[i].name}.`
          else{
            if(i+1 === filteredCart.length)
            { 
              mes = mes.slice(0, -2)
              mes += ` and ${filteredCart[i].name}. `
          
            }
          else
          {
            mes += `${filteredCart[i].name}, `
          }
          }
        }
        console.log(mes)
        setMessage(mes)
      }

      // filteredCart.map((item)=>console.log(item))
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          items: filteredCart.map((item)=>({
            restaurantId: String(item.resId),
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
      localStorage.removeItem("myCart");
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
		setMessage("");
  }

  // async function test() 
  // {
  //   try{
  //     const restaurants = await fetch(`${API_URL}/restaurants`)
  //     .then((res) => {return res.json()})

  //     const filteredCart = await cart.map((item) =>{
  //       const tempRest = restaurants.find((rest) => rest.id === item.resId)

  //       if(timeInBetween(tempRest.openingHours.split(" - ")))
  //       {
  //         return item;
  //       }
        
  //     }).filter((item) => item !== undefined)
      
  //     if(filteredCart.length === 0)
  //     {
  //       setMessage("None of the items can be bought at this time.")
  //       return;
  //     }
  //     console.log(filteredCart)
  //     const notAvailable = cart.filter(item => !filteredCart.some(filt => filt.id === item.id))
  //     console.log(notAvailable)
  //     var mes = "This scheduled time does not allow the food items: "
        
  //       for(var i = 0; i < notAvailable.length; i++)
  //       {
  //         if(notAvailable.length === 1)
  //           mes+= `${notAvailable[i].name}.`
  //         else
  //         {
  //           if(i+1 === notAvailable.length)
  //           { 
  //             mes = mes.slice(0, -2)
  //             mes += ` and ${notAvailable[i].name}. `
          
  //           }
  //           else
  //             mes += `${notAvailable[i].name}, `
  //         }
          
  //       }
        
  //       mes += `Only the food items: `
  //       for(i = 0; i < filteredCart.length; i++)
  //       {
  //         if(filteredCart.length === 1)
  //           mes+= `${filteredCart[i].name}.`
  //         else{
  //           if(i+1 === filteredCart.length)
  //           { 
  //             mes = mes.slice(0, -2)
  //             mes += ` and ${filteredCart[i].name}. `
          
  //           }
  //         else
  //         {
  //           mes += `${filteredCart[i].name}, `
  //         }
  //         }
  //       }
  //       console.log(mes)

  //   } catch {
  //     console.log("Not able to")
  //   }

    

  // }

  function timeInBetween(openingHours)
  {
    const schH = Number(scheduledDeliveryTime.split("T")[1].split(":")[0]);
    const schM = Number(scheduledDeliveryTime.split("T")[1].split(":")[0]);

    const startH = Number(openingHours[0].split(':')[0]);
    const startM = Number(openingHours[0].split(':')[1].split(' ')[0]);
    
    const endH =  openingHours[1].split(':')[1].split(' ')[1] ==="PM" ? Number(openingHours[1].split(':')[0]) + 12 : Number(openingHours[1].split(':')[0]);
    const endM = Number(openingHours[1].split(':')[1].split(' ')[0]);

    if((startH < schH || (startH === schH && startM <= schM)) && (schH < endH || (schH === endH && schM < endM)))
      return true;

    return false;
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
      <h2 className='cart-empty'>Your order</h2>
      { 
        cart.length === 0 ?
          <p className="muted cart-empty">Your cart is empty. Add something tasty!</p>
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
                        value='scheduled'
                        checked={orderType === 'scheduled'}
                        onChange={(e, {value}) => setOrderType(value)}
                      />
                    </Segment>
                  </SegmentGroup> 
                </FormField>
                  {orderType === "scheduled" && (
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
                {/* <button onClick={() =>test()}>
                  test
                </button> */}
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
