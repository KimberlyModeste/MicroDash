import { useState, useEffect } from 'react'
import './App.css'
import Menubar from './components/Menubar';
import MyCard from './components/MyCard';
import CartComp from './components/CartComp';


const API_URL = "http://localhost:3000";

function App() {

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  
  const deliveryFee = 3.99;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  useEffect(() => {
    fetch(`${API_URL}/restaurants`)
    .then((res) =>{
      if(!res.ok) throw new Error("Could not load restaurants.")
      return res.json()
    })
    .then(setRestaurants)
    .catch(() => setMessage("Could not connect to backend."))
    .finally(()=> setLoading(false));
  })

  async function onclickRestaurant(restaurant)
  {
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/restaurants/${restaurant.id}/menu`)

      if(!res.ok) throw new Error("Could not load menu.")
      
      const data = await res.json();
      setSelectedRestaurant(restaurant);
      setMenu(data.menu)

    } catch {
      setMessage("Couldn't load this menu.")
    }
  }

  function addToCart(item) {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (cartItem) => cartItem.id === item.id
      )

      if(existing)
      {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id ?
            {...cartItem, quantity: cartItem.quantity + 1}: 
            cartItem
        )
      }
      
      return [...currentCart, {...item, quantity: 1}]

    })
    setMessage("");
  }

  function changeQuantity(itemId, amount)
  {
    console.log(`ItemId: ${itemId}: Amount: ${amount}`)
    setCart((currentCart) =>
      currentCart
      .map((item) => 
      
          item.id === itemId 
          ? { ...item, quantity: item.quantity + amount} 
        : item
      )
      .filter((item) => item.quantity > 0)
    )

    // cart.map((item)=>console.log("Aftercart", item))
  }

  async function placeOrder(event) {
    event.preventDefault();
    
    if(!selectedRestaurant || cart.length === 0)
    {
      setMessage("Choose a restaurant and add something to your cart!")
      return;
    }
    
    setOrdering(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          restaurantId: String(selectedRestaurant.id),
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
    setSelectedRestaurant(null);
    setMenu([]);
    setCart([]);
    setMessage("");
  }


  if (loading) return <main className="page"><p>Loading Micro Dash...</p></main>;

  return (
    <>
    <div className="app">
      <Menubar passingGoHome={goHome} cart={cart} />

      <main className="page">
        <section className="hero">
          <p className="eyebrow">YOUR NEXT FAVORITE MEAL</p>
          <h1>{selectedRestaurant ? selectedRestaurant.name : "Hungry for something fun?"}</h1>
          <p> {selectedRestaurant? selectedRestaurant.cuisine : "Explore our one-of-a-kind restaurants and order something delicious."}</p>

          {selectedRestaurant && (
            <button className="secondary-button" onClick={goHome}>
              ← All restaurants
            </button>
          )}
        </section>

        {message && (
          <div className="notice" role="status">
            {message}
          </div>
        )}

        {!selectedRestaurant ? (
          <section>
            <h2>Explore restaurants</h2>
            <div className="restaurant-grid">
              {restaurants.map((restaurant) => (
                <MyCard 
                  key={restaurant.id} 
                  restaurant={restaurant}
                  clickRest={onclickRestaurant}
                  isHome={selectedRestaurant}
                />
              ))}
            </div>
          </section>
        ) : (
          <div className="order-layout">
            <section className="menu-section">
              <h2>Menu</h2>
              <div className="menu-grid">
                {menu.map((item) => (
                  <MyCard 
                    key={item.id} 
                    item={item}
                    clickCart={addToCart}
                    isHome={selectedRestaurant}
                  />
                ))}
              </div>
            </section>

            <aside className="cart-panel">
              <CartComp 
                cart={cart}
                changeQuantity={changeQuantity}
                subtotal={subtotal}
                delivery={deliveryFee}
                total={total}
                placeOrder={placeOrder}
                ordering={ordering}
                setAddress={setAddress} 
                address={address} 
                userName={userName} 
                setUserName={setUserName}
              />
{/* 
              {cart.length === 0 ? (
                <p className="muted">Your cart is empty. Add something tasty!</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div>
                        <strong>{item.name}</strong>
                        <p>${((item.price * item.quantity) / 100).toFixed(2)}</p>
                      </div>
                      <div className="quantity-controls">
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
                    <p><span>Estimated tax</span><span>${(tax / 100).toFixed(2)}</span></p> 
                    <p><span>Subtotal</span><span>${(subtotal / 100).toFixed(2)}</span></p>
                    <p><span>Delivery</span><span>${(deliveryFee / 100).toFixed(2)}</span></p>
                    <p className="grand-total"><span>Total</span><span>${(total / 100).toFixed(2)}</span></p>
                  </div>

                  <form onSubmit={placeOrder}>
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
              )} */}
            </aside>
          </div>
        )}
      </main>

      <footer>Micro Dash · A class project</footer>
    </div>
    </>
  )
}

export default App