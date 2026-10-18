import { Card, Image } from 'semantic-ui-react'
import  'semantic-ui-css/semantic.min.css'
import '../App.css'

import PropTypes from 'prop-types';

MyCard.propTypes = {
  restaurant: PropTypes.object,
  item: PropTypes.object,
  clickRest: PropTypes.func,
  clickCart: PropTypes.func,
  isHome: PropTypes.bool
};


function MyCard({restaurant, item, clickRest, clickCart, isHome}) {
  return (
    <>
    {
      !isHome?
      (
      <div>
        < Card className='mcard'>
          <Image id="img-round" className='img-card-home' src={restaurant.image} alt={restaurant.name}/>
          <Card.Content className='card-content' >
            <Card.Header>
              {restaurant.name}
            </Card.Header>
            <Card.Description className='cardDesc'>
              {restaurant.cuisine}
            </Card.Description>
            <Card.Meta className='meta-padding'>
              {restaurant.openingHours}
              <br/>
              About {restaurant.averagePrepTimeMinutes} min prep.
            </Card.Meta>
            <button onClick={() =>clickRest(restaurant)}>
                View menu →
            </button>
          </Card.Content>
        </Card>
      </div>
      )
    :
    (
    <div>
      
      < Card className='mcard-menu'>
        <Image id="img-round" className='img-card-menu' src={item.image} alt={item.name} />
        <Card.Content className='card-content' >
          <Card.Header>
            <div className="item-heading">
              <h3>{item.name}</h3>
              <strong>${(item.price / 100).toFixed(2)}</strong>
            </div>
          </Card.Header>
          <Card.Description className='cardDesc'>
            {item.description}
          </Card.Description>
        </Card.Content>
        <button className='card-btn checkout-button' onClick={() =>clickCart(item)}>
          + Add to cart
        </button>
      </Card>
    </div>
  )
    }
    </>
    
  )
}

export default MyCard
