import {useState, useEffect} from 'react'
import PropTypes from 'prop-types';
import Menubar from '../components/Menubar';
// import { error } from 'node:console';

Restaurants.propTypes = {
  API_URL: PropTypes.string,
};

function Restaurants({API_URL}) {
  // const [hasAccess, setHasAccess] = useState(true);
  // const CORRECT_PASSWORD = "password123";
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeChange, setTimeChange] = useState(0);

  // useEffect(() => {
  //   const input = prompt("Please enter the password to access this page:");
    
  //   if (input === CORRECT_PASSWORD) {
  //     setHasAccess(true);
  //   } else {
  //     alert("Wrong password!");
  //     window.location.href = "/"; // Redirect back to safety
  //   }
  // }, []);

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const response = await fetch(`${API_URL}/restaurants`);
        if (!response.ok) {
          throw new Error("Could not load restaurants.");
        }

        const data = await response.json();
        setRestaurants(data);

        if (data.length > 0) {
          setRestaurantId(String(data[0].id));
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    loadRestaurants();
  }, [API_URL]);

  useEffect(() => {
    if (!restaurantId) {
      setOrders([]);
      return;
    }

    let active = true;

    async function loadOrders() {
      try {
        const response = await fetch(
          `${API_URL}/restaurants/${restaurantId}/orders`
        );
        

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load orders.");
        }

        if (active) {
          setOrders(data);
          setMessage("");
        }
      } catch (error) {
        if (active) console.log(error.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    setLoading(true);
    loadOrders();

    const intervalId = setInterval(loadOrders, 5000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [API_URL, restaurantId]);

  async function changeTime (time)
  {
    try {
      // console.log(vr)
        const res = await fetch(`${API_URL}/clock`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          minutes: time
        })
      })
      console.log(res)
      }
      catch(error) {
        console.log(error.message)
      }

  }

  // if (!hasAccess) {
  //   return <h1>Loading secure page...</h1>;
  // }

  return (
	<div>
    <Menubar />
	  <main className="restaurant-dashboard">
      <h1>Restaurant Order Dashboard</h1>
      <p>New orders refresh automatically every five seconds.</p>
      <div style={{padding: "10px", fontSize: "large"}}>
        <label>Input minutes: </label>
        <input
          id="timeChange"
          className='timeChange'
          value={timeChange}
          onChange={(event) => setTimeChange(event.target.value)}
          type='number'
          required
        />
        <button type='submit' style={{background: "antiquewhite", margin: "10px"}} onClick={()=>changeTime(timeChange)}>
          Submit
        </button>
      </div>
      <label className='order-label' htmlFor="restaurant">Choose restaurant: </label>
      <select
        id="restaurant"
        value={restaurantId}
        className='order-label'
        onChange={(event) => setRestaurantId(event.target.value)}
      >
        {restaurants.map((restaurant) => (
          <option key={restaurant.id} value={restaurant.id}>
            {restaurant.name}
          </option>
        ))}
      </select>

      {message && <p role="status">{message}</p>}

      <h2>Incoming Orders ({orders.length})</h2>

      {loading && orders.length === 0 && <p>Loading orders...</p>}

      {!loading && orders.length === 0 && (
        <p>No orders have been released to this restaurant yet.</p>
      )}

      <div className="restaurant-order-list">
        {orders.map((order) => (
          <article className="restaurant-order" key={order.id}>
            <h3>Order #{order.id}</h3>
            <p><strong>Status:</strong> {order.status.toUpperCase()}</p>
            <p>
              <strong>Received:</strong>{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "Not provided"}
            </p>
            <p>
              <strong>Delivery address:</strong>{" "}
              {order.deliveryAddress}
            </p>

            {order.scheduledDeliveryTime && (
              <p>
                <strong>Scheduled delivery:</strong>{" "}
                {new Date(order.scheduledDeliveryTime).toLocaleString()}
              </p>
            )}

            {Array.isArray(order.items) && (
              <ul>
                {order.items.map((item, index) => (
                  <li key={item.menuItemId || item.id || index}>
                    {item.name || item.menuItemId}
                    {" × "}{item.quantity}
                  </li>
                ))}
              </ul>
            )}

            {typeof order.total === "number" && (
              <p>
                <strong>Total:</strong>{" "}
                ${(order.total / 100).toFixed(2)}
              </p>
            )}
          </article>
        ))}
      </div>
    </main>
	</div>
  )
}

export default Restaurants
