

import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'


function Item() {

    const [items, setItems] = useState([])
    const navigate = useNavigate()
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
            {
                items.length > 0 ? (items.map(item => (
                    <div key={item.id}>
                        <h4>{item.name}</h4>
                        <p>{item.price}</p>
                        <button onClick=''>Buy</button>
                    </div>
                ))):(
                    <div>loading...</div>
           )
            }

        </div>
    )
}

export default Item