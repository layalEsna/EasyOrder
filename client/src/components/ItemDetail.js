import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"

function ItemDetail({customer, item, updateCustomerCart}) {
    const navigate = useNavigate() 
    // const { item_id } = useParams()
    // const [item, setItem] = useState(null)
    const [order, setOrder] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [error, setError] = useState('')


    const handleAddToCart = (quantity) => {
        fetch('/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_id: item.id, quantity }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                setError(data.error)
            } else {
                // add order to state
                updateCustomerCart(data.order)
                navigate('/cart')

            }
        })
        .catch(() => setError('Failed to add item to cart'))
    }


    const formik = useFormik({
        initialValues: {
            quantity: 1 
        },
        validationSchema: Yup.object({
            quantity: Yup.number()
                .min(1, 'Quantity must be at least 1')
                .max(5, 'Quantity must not exceed 5')
                .required('Quantity is required'),
        }),

        onSubmit: (values) => {
            handleAddToCart(item.id, Number(values.quantity))
            
        }
        
        



        // onSubmit: (values) => {
        //     const quantity = Number(values.quantity)
        //     fetch('/cart', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({item_id: item.id, quantity: quantity})
        //     })
        //     .then(res => res.json())
        //         .then(data => {
        //             if (data.error) {
        //             setError(data.error)
        //             } else {
        //                 navigate('/cart')
        //         }
        //     })
        //         .catch(() => {
        //         setError('Failed to add item to cart')
        //     })
        // }prev.orders 
    })
    if (error) {
        return <div>Error: {error}</div>
    }
    if (!item) {
        return <div>Loading...</div>
    }


        

    return (
        <div>
           
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
                {formik.errors.quantity && formik.touched.quantity && (
                    <div className="error">{formik.errors.quantity}</div>
                )}


                <button className='btn' type="submit">Add to Cart</button>

            </form>
        </div>
    )

}


export default ItemDetail