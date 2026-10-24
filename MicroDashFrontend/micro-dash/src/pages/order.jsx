import { useState } from 'react'
import PropTypes from 'prop-types';
import Menubar from '../components/Menubar';

Order.propTypes = {
  API_URL: PropTypes.string,
};

function Order({ API_URL }) {

	const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const canCancel = order?.status === "scheduled";
  
  async function findOrder(event) {
    event.preventDefault();
    setLoading(true);
    setOrder(null);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/orders/${encodeURIComponent(orderNumber.trim())}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order not found.");
      }

      setOrder(data);
    } catch (error) {
      setMessage(error.message || "Could not look up this order.");
    } finally {
      setLoading(false);
    }
  }

  async function cancelOrder() {
    if (!order) return;

    const confirmed = window.confirm(
      `Cancel order #${order.id}? This cannot be undone.`
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/orders/${order.id}/cancel`,
        { method: "PATCH" }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not cancel this order.");
      }

      setOrder(data.order);
      setMessage(data.message || "Order cancelled successfully.");
    } catch (error) {
      setMessage(error.message || "Could not cancel this order.");
    } finally {
      setLoading(false);
    }
  }

  return (
	  <main className="order-lookup">
      <Menubar />
      <div className='order-menu'>
        <h1>Find Your Order</h1>
        <p>Enter the order number you received at checkout.</p>

        <form onSubmit={findOrder}>
          <label className='order-label' htmlFor="orderNumber">Order number: </label>
          <input
            id="orderNumber"
            className='orderNumber'
            value={orderNumber}
            onChange={(event) => setOrderNumber(event.target.value)}
            placeholder="e.g. 1001"
            required
          />
          <button type="submit" disabled={loading} className='order-button'>
            {loading ? "Searching..." : "Find Order"}
          </button>
        </form>

        {message && <p role="status">{message}</p>}

        {order && (
          <section className="order-details">
            <h2>Order #{order.id}</h2>
            <p>
              <strong>Status: </strong> {order.status.toUpperCase()}
            </p>
            <p>
              <strong>Restaurant: </strong>{" "}
              {order.restaurantName || order.restaurantId}
            </p>
            <p>
              <strong>Delivery address: </strong>{" "}
              {order.deliveryAddress}
            </p>

            {order.scheduledDeliveryTime && (
              <p>
                <strong>Scheduled delivery: </strong>{" "}
                {new Date(order.scheduledDeliveryTime).toLocaleString()}
              </p>
            )}

            {Array.isArray(order.items) && (
              <div>
                <h3>Items</h3>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={item.menuItemId || item.id || index}>
                      {item.name || item.menuItemId}
                      {" — "}Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {typeof order.total === "number" && (
              <p>
                <strong>Total:</strong> ${(order.total / 100).toFixed(2)}
              </p>
            )}

            {canCancel ? (
              <button
                type="button"
                onClick={cancelOrder}
                disabled={loading}
                className="cancel-button"
              >
                {loading ? "Processing..." : "Cancel Scheduled Order"}
              </button>
            ) : (
              <p>
                This order can no longer be cancelled through this page.
              </p>
            )}
          </section>
        )}
      </div>
    </main>
  )
}

export default Order
