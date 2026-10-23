import { useState, useEffect } from 'react'
import '../App.css'
import Menubar from '../components/Menubar';
import MyCard from '../components/MyCard';
import FaveMealComp from '../components/FaveMealComp';
import { useNavigate } from 'react-router-dom';
// import CartComp from './components/CartComp';
// import Cart from '../pages/cart';
import PropTypes from 'prop-types';

Home.propTypes = {
  API_URL: PropTypes.string,
};

function Home({API_URL}) {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  // const [ordering, setOrdering] = useState(false);
  
  // const deliveryFee = 3.99;
  // const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // const total = subtotal + deliveryFee;

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/restaurants`)
    .then((res) =>{
      if(!res.ok) throw new Error("Could not load restaurants.")
      return res.json()
    })
    .then(setRestaurants)
    .catch(() => setMessage("Could not connect to backend."))
    .finally(()=> setLoading(false));
  }, [API_URL])


  async function onclickRestaurant(restaurant)
  {
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/restaurants/${restaurant.id}/menu`)

      if(!res.ok) throw new Error("Could not load menu.")
      
      setSelectedRestaurant(restaurant);

    } catch {
      setMessage("Couldn't load this menu.")
    }
  }

  // function toLocalDateTimeInput(date) {
  //   const offset = date.getTimezoneOffset();
  //   return new Date(date.getTime() - offset * 60000)
  //     .toISOString()
  //     .slice(0, 16);
  // }


  if (loading) return <main className="page"><p>Loading Micro Dash...</p></main>;


  return (
	  <>

		<div className="app">
			<Menubar />
	
		  <main className="page">
        <FaveMealComp selectedRestaurant={selectedRestaurant} message={message} />

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
			  <>
        {navigate(`/restaurants/${selectedRestaurant.id}/menu`)}
        </>

        
			)}
		  </main>
		  <footer>Micro Dash · A class project</footer>
		</div>
		</>
  )
}

export default Home
