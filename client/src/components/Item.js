

import React, { useEffect, useState } from "react"
import ItemDetail from "./ItemDetail"
// cart

function Item({ customer, updateCustomerOrder }) {

    const [items, setItems] = useState([])
    
    useEffect(() => {
        fetch('/items')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch items.')
                }
                return res.json()
            })
            .then(data => {
                setItems(data)
            })
            .catch()
       
    }, [])

    return (
        <div>


            <h3>Welcome {customer ? customer.username : "Guest"}</h3>

            {
                items.length > 0 ? (items.map(item => (
                    <ItemDetail
                        key={item.id}                        
                        item={item}
                        customer={customer}
                        updateCustomerOrder={updateCustomerOrder}
                    />
                   

                    
                ))) : (
                    <div>loading...</div>
                )
            }

        </div>
    )
}

export default Item



