

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Cart({ customer }) {
    const [items, setItems] = useState([])
    const navigate = useNavigate()
    

    useEffect(() => {
        fetch('/cart')
            .then(res => res.json())
            .then(data => setItems(data))

            .catch(e => console.error('Failed to fetch cart items:', e))
    }, [])


    const totalPrice = Array.isArray(items)
        ? items.reduce((sum, order) => sum + (order.selected_item?.price || 0) * (order.quantity || 0), 0)
        : 0

    function handleCheckout() {
        fetch('/checkout', {
            method: 'POST',
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => { throw new Error(err.error || 'Checkout failed.') }) // Improved error handling
                }
                return res.json()
            })
            .then(() => {
                setItems([])
                navigate('/confirmation')
            })
            .catch(error => {
                console.error("Checkout error:", error)
                alert(error.message)
            })
    }

    function handleDelete(order_id) {
        fetch(`/cart/${order_id}/delete`, {
            method: 'DELETE',

        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => {
                        throw new Error(err.error || 'Failed to delete order.');
                    });
                }
                return res.json()
            })

            .then(updatedCart => {

                setItems([...updatedCart])
                console.log("Order deleted and cart updated:", updatedCart)
            })
            .catch(error => {
                console.error("Error deleting order:", error)
                alert(error.message)
            })
    }

    function navigateToEdit(order_id) {
        navigate(`/edit/${order_id}`)
    }
    // function navigateToEdit(order_id) {
    //     navigate(`/cart/${order_id}/edit`)
    // }
    return (
        <div>
            <h2>Your Cart</h2>

            {items.length > 0 ? (
                items.map((order, index) => (
                    order.selected_item ? (
                        <div key={index}>
                            <h3>{order.selected_item.name}</h3>
                            <p>Quantity: {order.quantity}</p>
                            <p>Price: ${order.selected_item.price.toFixed(2)}</p>

                            <button className='btn' onClick={() => navigateToEdit(order.id)}>Edit</button>
                            <button className='delete-btn' onClick={() => handleDelete(order.id)}>Delete</button>

                        </div>
                    ) : (
                        <div key={index}>
                            <p>Error: Item data missing.</p>
                        </div>
                    )
                ))
            ) : (
                <p>Your Cart Is Empty</p>
            )}

            {items.length > 0 && <h3>Total: ${totalPrice.toFixed(2)}</h3>}
            <button className='btn' onClick={handleCheckout} disabled={!Array.isArray(items) || items.length===0}>Checkout</button>

        </div>
    )
}

export default Cart