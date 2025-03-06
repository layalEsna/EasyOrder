
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useFormik } from "formik";
// import * as Yup from "yup"

// function Edit() {

//     const { order_id } = useParams()
//     const navigate = useNavigate()
//     const [order, setOrder] = useState(null)
    
//     useEffect(() => {
//         fetch(`/cart/${order_id}`)
//             .then(res => {
//                 if (!res.ok) {
//                 throw new Error('Failed to fetch data.')
//                 }return res.json()
//         })
//             .then(data => {
//                 console.log(data)
//                 setOrder(data)
//         })
//         .catch(e => console.error(e))
//     }, [order_id])

//     const formik = useFormik({
//         enableReinitialize: true,
//         initialValues: {
//             quantity: order.quantity
//         },

//         validationSchema: Yup.object({
//             quantity: Yup.number()
//                 .min(1, 'Quantity must be at least 1')
//                 .max(5, 'Quantity must not exceed 5')
//                 .required('Quantity is required'),
//             }),


//         onSubmit: (values => {
//             fetch(`/cart/${order_id}/edit`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(values)
//             })
//                 .then(res => {
//                     if (!res.ok) {
//                     throw new Error('Failed to fetch data.')
//                     }
//                     return res.json()
//             })
//                 .then(data => {
//                     console.log(data)
//                 navigate('/cart')
//             })
//             .catch(e => console.error(e))
//         })
//     })


//     return (
//         <div>
//              <form onSubmit={formik.handleSubmit}>
//                 <label htmlFor="quantity">Qty</label>
//                 <select
//                     id="quantity"
//                     name="quantity"
//                     value={formik.values.quantity}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                 >
//                     <option value='1'>1</option>
//                     <option value='2'>2</option>
//                     <option value='3'>3</option>
//                     <option value='4'>4</option>
//                     <option value='5'>5</option>
                    
//                 </select>
//                 {formik.errors.quantity && formik.touched.quantity && (
//                     <div className="error">{formik.errors.quantity}</div>
//                 )}

//                 <button type="submit">Add to Cart</button>

//             </form>

//         </div>
//     )

// }

// export default Edit

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function Edit() {
    const { order_id } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [item, setItem] = useState(null)

    useEffect(() => {
        fetch(`/cart/${order_id}`)
            .then(res => {
                if (!res.ok) {
                throw new Error('Failed to fetch order.')
                }
                return res.json()
        })
            .then(data => {
                setOrder(data)
                setItem({
                    name: data.item_name,
                    price: data.item_price,
                })
        } )
        .catch(e => console.error(e))
    }, [order_id])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            quantity: order?.quantity || 1,
        },
        validationSchema: Yup.object({
            quantity: Yup.number()
                .min(1, 'Quantity must be at least 1')
                .max(5, 'Quantity must not exceed 5')
                .required('Quantity is required'),
        }),
        onSubmit: (values) => {
            const quantity = Number(values.quantity)
            
            fetch(`/cart/${order_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({item_id: item.id, quantity: quantity})

            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Failed to update data.')
                    }
                    return res.json()
                })
                .then((updatedData) => {
                    if(updatedData){
                    navigate('/cart')}
                    
                })
                .catch((e) => console.error(e))
        },
    })
    
    if(!order) return <p>Loading...</p>

    return (
        <div>
            <h3>Edit Form</h3>
            <p>{item.name}</p>
            <p>{item.price}</p>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="quantity">Qty</label>
                <select
                    id="quantity"
                    name="quantity"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                {formik.errors.quantity && formik.touched.quantity && (
                    <div className="error">{formik.errors.quantity}</div>
                )}

                <button className='btn' type="submit">Back to the cart</button>
            </form>
        </div>
    )
}

export default Edit
