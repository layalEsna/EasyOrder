import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
// cart
function ItemDetail({ item, updateCustomerOrder }) {
    const navigate = useNavigate()

    const [error, setError] = useState('')



    function handleAddToCart(quantity) {
        fetch('/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_id: item.id, quantity }),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch data.')
                }
                return res.json()
            })
            .then(newOrder => {
                updateCustomerOrder(newOrder, item)
                navigate('/orders')
            })
            .catch(e => {
                setError(e.message)
            })
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

            handleAddToCart(Number(values.quantity))
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


                <button className='btn' type="submit">Add to Ordes</button>

            </form>
        </div>
    )

}


export default ItemDetail