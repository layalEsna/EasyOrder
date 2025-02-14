

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";



function Cart({customer}) {

    const [items, setItems] = useState([])
    const navigate = useNavigate()


    useEffect(() => {
        fetch('/cart')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch items.')
                }
                return res.json()
            })
            .then(data => {
                console.log(data)
                setItems(data)
            })
            .catch(e => console.error(e))

    }, [])


    return (
        <div>
            <h2>Your Cart {customer && customer.username ? customer.username : "Guest"}</h2>

            {items.length > 0 ? (
                
                items.map((order, index) => (
                    <div key={index}>

                        <h3>{order.selected_item.name}</h3>
                        <p>Quantity: {order.quantity}</p>
                        <p>Total price: ${(order.selected_item.price * order.quantity).toFixed(2)}</p>

                    </div>
                ))
            ) : ''
            }
            <button onClick={() => navigate('/confirmation')}>Checkout</button>
        </div>
    )
}

export default Cart