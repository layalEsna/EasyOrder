
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup"
// cart
function CreateItem() {

    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            name: '',
            price: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Name is required.'),
            price: Yup.number()
                .required('Price is required.')
                .min(1, 'Price must be a positive number greater than 1.')

        }),
        onSubmit: (values => {
            const addNewValue = {...values}
            fetch('/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // credentials: 'same-origin',
                body: JSON.stringify(addNewValue)
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch data.')
                    }
                    return res.json()
                })
                .then(() => {

                    navigate('/items')
                })
                
                .catch(e => console.error(e))
        })
    })
    return (
        <div>
            <div>
  <h2>Seller Dashboard</h2>
  <p>List your products for sale by filling out the form below.</p>
</div>
            <h2>Create a New Item</h2>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="name">Item Name:</label>
                    <input
                        name="name"
                        id="name"
                        type="text"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.name && formik.touched.name && (
                        <div className="error">{formik.errors.name}</div>
                    )}

                </div>
                <div>
                    <label htmlFor="price">Item Price:</label>
                    <input
                        name="price"
                        id="price"
                        type="number"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.errors.price && formik.touched.price && (
                        <div className="error">{formik.errors.price}</div>
                    )}

                </div>
                <div>
                    <button type="submit" className="btn">Add New Item</button>
                </div>

            </form>

        </div>
    )
}

export default CreateItem