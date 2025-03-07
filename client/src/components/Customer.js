
import { useState, useEffect } from "react";

function Customer() {
    const [customers, setCustomers] = useState([])
    
    useEffect(() => {
        fetch('/customers')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch data.')
                }
                return res.json()
            })
            .then(data => {
                setCustomers(data)
            })
            .catch(e => console.error(e))
    }, [])
    
    return (
        <div className="list">
            {customers.length > 0 ? (
                customers.map(customer => (
                    <div key={customer.id}>
                        <h4>{customer.username}</h4>
                        <div>
                            {customer.orders && customer.orders.length > 0 ? (
                                customer.orders.map(order => (
                                    <div key={order.id}>
                                        <p>Item Name: {order.item.name}</p>
                                        
                                    </div>
                                    
                                ))
                            ) : <p>No orders found!</p>}
                            <div><p className="star">**********</p></div>
                        </div>
                    </div>
                ))
            ) : <p>No customers found!</p>}
        </div>
    )
}

export default Customer
