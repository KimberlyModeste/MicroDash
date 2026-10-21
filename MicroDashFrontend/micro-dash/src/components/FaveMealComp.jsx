import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import '../App.css'


FaveMealComp.propTypes = {
  message: PropTypes.string,
  selectedRestaurant: PropTypes.object,

};




function FaveMealComp({selectedRestaurant, message}) {
  const navigate = useNavigate();
  
  return (
	<>
     <section className="hero">
      <p className="eyebrow">YOUR NEXT FAVORITE MEAL</p>
      <h1>{selectedRestaurant ? selectedRestaurant.restaurantName : "Hungry for something fun?"}</h1>
      <p> {selectedRestaurant ? selectedRestaurant.restaurantCuisine : "Explore our one-of-a-kind restaurants and order something delicious."}</p>

      {selectedRestaurant && (
      <button className="secondary-button" onClick={()=> navigate('/')}>
        ← All restaurants
      </button>
      )}
    </section>
      {message && (
			  <div className="notice" role="status">
				 {message}
			  </div>
			)}
  </>
  )
}

export default FaveMealComp
