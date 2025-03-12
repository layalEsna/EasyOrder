
// updateCustomerOrder

import { useNavigate } from "react-router-dom"

function Order({ customer, setCustomer }) {
    const navigate = useNavigate()
    const orders = Array.isArray(customer?.orders) ? customer.orders : []


    const totalPrice = orders
        .filter(order => order && order.item && typeof order.item.price === 'number')
        .reduce((total, order) => {
            return total + (order.item.price * order.quantity)
        }, 0)

    

    function handleDelete(order_id) {
        fetch(`/orders/${order_id}/delete`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch data.')
                }
                return res.json()
                
            })
            .then((updatedCartData) => {
                

                if (Array.isArray(updatedCartData)) {
                    setCustomer((prev) => {
                        
                        const updatedOrders = prev.orders.filter(order => order.id !== order_id)
                        const deletedOrder = prev.orders.find(order => order.id === order_id)
                        const deletedItemId = deletedOrder ? deletedOrder.item_id : null

                        const updatedItems = deletedItemId
                            ? prev.items.filter(item =>
                                item.id !== deletedItemId ||
                                updatedOrders.some(order => order.item_id === deletedItemId)
                            )
                            : prev.items

                        return {
                            ...prev,
                            orders: updatedOrders,
                            items: updatedItems,
                        }
                    })
                }
            })
            .catch((error) => {
                console.error("Error deleting order:", error)
                alert(error.message)
            })
    }

    function navigateToEdit(order_id) {
        navigate(`/edit/${order_id}`)
    }

    return (
        <div>
            <h2>Your Orders</h2>

            {orders.length > 0 ? (
                orders
                    .filter(order => order && order.item)
                    .map((order) => {

                        return (
                            <div key={order.id}>
                                <h3>{order.item.name || "Unknown Item"}</h3>
                                <p>Quantity: {order.quantity || 0}</p>
                                <p>Price: ${order.item.price ? order.item.price.toFixed(2) : "N/A"}</p>

                                <button className="btn" onClick={() => navigateToEdit(order.id)}>
                                    Edit
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(order.id)}>
                                    Delete
                                </button>
                            </div>
                        )
                    })
            ) : (
                <p>No Orders</p>
            )}


            {orders.length > 0 && (
                <h3>Total: ${totalPrice.toFixed(2)}</h3>
            )}
        </div>
    )
}

export default Order
