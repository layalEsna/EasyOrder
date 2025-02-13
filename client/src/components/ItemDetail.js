import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useFormik } from "formik"

function ItemDetail({customer}) {
    const navigate = useNavigate() 
    const { item_id } = useParams()
    const [item, setItem] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [error, setError] = useState('')

    
    useEffect(() => {
        fetch(`/items/${item_id}`)
            .then(res => {
                if (!res.ok) {
                throw new Error(`failed to fetch item ID: ${item_id}`)
                }
                return res.json()
            })
            .then(data => {
                setItem(data)
                
            })
        .catch(()=> setError('Failed to fetch item details'))

    }, [item_id])

    const formik = useFormik({
        initialValues: {
            quantity: 1 
        },
        onSubmit: (values) => {
            const quantity = Number(values.quantity)
            fetch('/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({item_id: item.id, quantity: quantity})
            })
            .then(res => res.json())
                .then(data => {
                    if (data.error) {
                    setError(data.error)
                    } else {
                        navigate('/cart')
                }
            })
                .catch(() => {
                setError('Failed to add item to cart')
            })
        }
    })
    if (error) {
        return <div>Error: {error}</div>
    }
    if (!item) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h2>{customer && customer.username ? customer.username : "Guest"}</h2>

            <h2>{item.name}</h2>
            <p>Price: ${item.price.toFixed(2)}</p>

            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="quantity">Qty</label>
                <select
                    id="quantity"
                    name="quantity"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                    
                </select>

                <button type="submit">Add to Cart</button>

            </form>
        </div>
    )

}

export default ItemDetail