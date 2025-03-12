
function Customer({ customer }) {
    

    if (!customer) return <p>Loading...</p>

    return (
        <div>
            <h4>{customer.username}</h4>
            <p>{customer.email}</p>
            {
                 Array.isArray(customer.items) && customer.items.length > 0 ? (
                    customer.items.map(item => (
                        <div key={item.id}>
                            <h4>Item Name: {item.name}</h4>
                            <p>Price: ${item.price}</p>
                        </div>

                    ))
                ) : (<p>No Item</p>)
            }


        </div>
    )
}

export default Customer


