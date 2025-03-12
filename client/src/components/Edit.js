

import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
// cart
function Edit({ customer, setCustomer }) {
    const navigate = useNavigate()

    const order_id = Number(window.location.pathname.split('/').pop())  

    const order = customer.orders.find((order) => order.id === Number(order_id))
    
    
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

            // Make the API call to update the order
            fetch(`/orders/${order.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ item_id: order.item.id, quantity: quantity }),
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Failed to update data.')
                    }
                    return res.json()
                })
                .then((updatedData) => {
                    if (updatedData) {
                        // Update the local state to reflect the changes immediately
                        setCustomer((prevCustomer) => {
                            const updatedOrders = prevCustomer.orders.map((existingOrder) =>
                                existingOrder.id === order.id
                                    ? { ...existingOrder, quantity: updatedData.quantity }
                                    : existingOrder
                            )

                            return {
                                ...prevCustomer,
                                orders: updatedOrders,
                            }
                        })
                        // Navigate back to the cart page after update
                        navigate('/orders')
                    }
                })
                .catch((e) => console.error(e))
        },
    })

    if (!customer || !Array.isArray(customer.orders)) {
        return <p>No orders found.</p>
    }
    if (!order) {
        return <p>Order not found...</p>
    }

    const item = order.item

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

                <button className="btn" type="submit">Back To The Orders</button>
            </form>
        </div>
    )
}

export default Edit

