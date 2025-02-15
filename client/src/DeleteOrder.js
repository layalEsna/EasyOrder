
import { useParams, useNavigate } from "react-router-dom"

function DeleteOrder() {

    const { order_id } = useParams
    const navigate = useNavigate()
    
    function handleDelete(){
    fetch(`/cart/${order_id}`, {
        method: 'DELETE',
        
    })
        .then(res => {
            if (!res.ok) {
            throw new Error('Failed to fetch data.')
        }return res.json()
    })
        .then(data => {
            console.log(data)
            navigate('/cart')
    })
    .catch(e => console.error(e))
}
    return (


        <div>
              <button onClick={handleDelete}>Delete</button>
        </div>
    )
}

export default DeleteOrder