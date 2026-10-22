import { Item, Sidebar, Button, Container } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'



SidebarCart.propTypes = {
  cart: PropTypes.object,
  isVisible: PropTypes.bool,
  removeFromCart: PropTypes.func,
  changeVisibility: PropTypes.func
}


function SidebarCart({cart, isVisible, removeFromCart, changeVisibility}) {
  const navigate = useNavigate();


  return (
	<>
  {
    cart.length > 0 ? 
    (
    <Sidebar className={`right sidebar-cart ${isVisible ? 'isVisible' : 'isInvisible'}`}>
      <div className='sidebar-x' onClick={()=>changeVisibility(false)}>
        x
      </div>
    {
      cart.map((item) => (
        <Item className="cart-item" key={item.id}>
          <Container>
         <div className="media-row">
            <img className='sidcart-img' src={item.image} alt={item.name}></img>
            <div className="text-content">
              <strong>{item.name}</strong>
              <p>${((item.price * item.quantity) / 100).toFixed(2)}</p>
              <span className="remove-sidebar" onClick={()=>removeFromCart(item.id)}>remove</span>
            </div>
          </div>
          </Container>
        </Item>
      ))}
      <Button className='checkout-button checkout' onClick={()=>navigate('/cart')}>
        Checkout
      </Button>
      <Button className='checkout-button edit' onClick={() =>navigate('/cart')}>
        Edit cart
      </Button>
    </Sidebar>
    )
    :
    (<></>)
  }


	</>
	)
}

export default SidebarCart
