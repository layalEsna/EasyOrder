


import { useNavigate } from "react-router-dom"

function Cart({ customer, setCustomer }) {
    const navigate = useNavigate()
    const orders = Array.isArray(customer?.orders) ? customer.orders : []
    
    console.log("Orders in Cart:", orders)

   
    const totalPrice = orders
        .filter(order => order && order.item && typeof order.item.price === 'number') // Filter valid orders
        .reduce((total, order) => {
            return total + (order.item.price * order.quantity)
        }, 0)

    function handleDelete(order_id) {
        fetch(`/cart/${order_id}/delete`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((err) => {
                        throw new Error(err.error || 'Failed to delete order.')
                    })
                }
                return res.json()
            })
            .then((updatedCartData) => {
                console.log("Updated cart data:", updatedCartData)
                if (Array.isArray(updatedCartData)) {
                    const updatedOrders = orders.filter(order => order.id !== order_id)
                    setCustomer((prev) => ({
                        ...prev,
                        orders: updatedOrders,
                    }))
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
            <h2>Your Cart</h2>

            {orders.length > 0 ? (
                orders
                    .filter(order => order && order.item) // ✅ Ensures order and item exist
                    .map((order) => {
                        console.log("Map Order:", order)
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
                <p>Your Cart Is Empty</p>
            )}

            
            {orders.length > 0 && (
                <h3>Total: ${totalPrice.toFixed(2)}</h3>
            )}
        </div>
    )
}

export default Cart
