
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
        <div>
            {customers.length > 0 ? (
                customers.map(customer => (
                    <ul key={customer.id}>
                        <li>{customer.username}</li>
                        <div>
                            {customer.orders && customer.orders.length > 0 ? (
                                customer.orders.map(order => (
                                    <ul key={order.id}>
                                        <li>{order.item.name}</li>
                                    </ul>
                                ))
                            ) : <p>No orders found!</p>}
                        </div>
                    </ul>
                ))
            ) : <p>No customers found!</p>}
        </div>
    )
}

export default Customer
