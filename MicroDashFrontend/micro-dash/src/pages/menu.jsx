import{ useEffect, useState } from 'react'

import MyCard from '../components/MyCard'
import Menubar from '../components/Menubar';
import FaveMealComp from '../components/FaveMealComp'
import SidebarCart from '../components/SidebarCart';


import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom';


Menu.propTypes = {
  API_URL: PropTypes.string
};

function Menu({API_URL}) {
  const rid = useParams();
  const [menu, setMenu] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
	const [loading, setLoading] = useState(true);
	const [isVisible, setVisible] = useState(false);
	const [cart, setCart] = useState([]);
	const [message, setMessage] = useState("");
    
  useEffect(() =>{

    fetch(`${API_URL}/restaurants/${rid.id}/menu`)
    .then((res) => {
      if(!res.ok) throw new Error("Could not load menu.")
      return res.json()
    })
    .then((r)=>{
      // console.log(r.menu)
      setSelectedRestaurant(r)
      setMenu(r.menu)
    })
    .catch(() => setMessage("Couldn't load this menu."))
    .finally(()=> setLoading(false));

    if((!(localStorage.getItem("myCart") === null)) && cart.length === 0)
		{
      setCart(JSON.parse(localStorage.getItem("myCart")));
		}

  }, [API_URL, rid.id, cart.length])
  
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
		  localStorage.setItem("myCart", JSON.stringify([...currentCart, {...item, quantity: 1, resId: rid.id}]))
		  return [...currentCart, {...item, quantity: 1, resId: rid.id}]
	
		})
    changeVisibility(true);
		setMessage("");
	  }

  
  function removeFromCart(id)
  {
    const tempCart = cart.filter((item) => item.id !== id)
    setCart(tempCart)
    localStorage.setItem("myCart", JSON.stringify(tempCart))
  }

	function changeVisibility(val){
    setVisible(val)
  }

  // console.log(selectedRestaurant)
  if (loading) return <main className="page"><p>Loading Micro Dash...</p></main>;
  
  return (
	<div>
    <Menubar />
    <main className="page">
      <FaveMealComp selectedRestaurant={selectedRestaurant} message={message} />        
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
  	    <aside  className={`${isVisible ? '' : 'isInvisible'} cart-panel`}  >
      <SidebarCart cart={cart} isVisible={isVisible} changeVisibility={changeVisibility} removeFromCart={removeFromCart}/>
    </aside> 
      </div>
    </main>
  </div>
  )
}

export default Menu
