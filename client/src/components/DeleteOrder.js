

// // import { useParams, useNavigate } from "react-router-dom"

// // function DeleteOrder() {

// //     const { order_id } = useParams()
// //     console.log(order_id)
// //     const navigate = useNavigate()
    
// //     function handleDelete() {
// //         console.log("Deleting order", order_id)
// //     fetch(`/cart/${order_id}/delete`, {
// //         method: 'DELETE',
        
// //     })
// //         .then(res => {
// //             if (!res.ok) {
// //             throw new Error('Failed to fetch data.')
// //         }return res.json()
// //     })
// //         .then(data => {
// //             console.log(data)
// //             navigate('/cart')
// //     })
// //     .catch(e => console.error(e))
// // }
// //     return (


// //         <div>
// //               <button onClick={handleDelete}>Delete</button>
// //         </div>
// //     )
// // }

// // export default DeleteOrder




// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// function DeleteOrder() {
//     const { order_id } = useParams();
//     const navigate = useNavigate();

//     useEffect(() => {
//         console.log("DeleteOrder component mounted. order_id:", order_id);
//     }, [order_id]);

//     function handleDelete() {
//         console.log("Delete button clicked!"); // Check if this appears
//     console.log("Deleting order", order_id);
//         fetch(`/cart/${order_id}/delete`, {
//             method: 'DELETE',
//             credentials: 'include',
//         })
//             .then((res) => {
//                 if (!res.ok) {
//                     console.log("Response received:", res.status)
//                     throw new Error('Failed to delete item.');
//                 }
//                 return res.json();
//             })
//             .then((data) => {
//                 console.log("Delete successful:", data)
//                 navigate('/cart');
//             })
//             .catch((e) => console.error(e));
//     }

//     return (
//         <div>
//             <button onClick={handleDelete}>Delete Order</button>
//         </div>
//     );
// }

// export default DeleteOrder;
