import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Item from "./Item";
import Login from "./Login";
// import ItemDetail from "./ItemDetail";
import Cart from "./Cart";
// import Confirmation from "./Confirmation";

import Signup from "./Signup";
import NavBar from "./NavBar";
import Edit from "./Edit";
import CreateItem from "./CreateItem";
import Customer from "./Customer";


function App() {

  const [customer, setCustomer] = useState({
    username: '',
    orders: [],
    id: null,
    email: ''
  })
  // const [cart, setCart] = useState([])


  useEffect(() => {
    fetch('/check_session')
      
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch custome_id.')
        }
        return res.json()
      })
      .then(data => {
        console.log("Session Data:", data)
        if (data.customer || data) {
          setCustomer(data.customer || data)
                  }
      })
      .catch(e => console.error(e))
  }, [])

  function ConditionNavbar({ customer }) {

    const location = useLocation()
    const hiddenNavBar = location.pathname == '/login' || location.pathname == '/logout' || location.pathname == '/signup'

    return hiddenNavBar ? null : <NavBar customer={customer} />

  }

  

  function updateCustomerCart(newOrder) {
    setCustomer(prev => {
        
        const updatedOrders = [...prev.orders, newOrder]
        return {
            ...prev,
            orders: updatedOrders,
        }
    })
}

  return (
    <div>

      <Router>
        <ConditionNavbar customer={customer} />
        
        <Routes>
          <Route path='/items' element={<Item customer={customer} setCustomer={setCustomer} updateCustomerCart={updateCustomerCart} />} />
          <Route path='/login' element={<Login setCustomer={setCustomer} />} />
          <Route path='/cart' element={<Cart customer={customer} setCustomer={setCustomer} updateCustomerCart={updateCustomerCart}/>} />
          <Route path="/navbar" element={<NavBar customer={customer} />} />
          <Route path='/signup' element={<Signup setCustomer={setCustomer}/>} />
          <Route path='/edit/:order_id' element={<Edit customer={customer} setCustomer={setCustomer}/>} />
          <Route path="/create-item" element={<CreateItem />} />
          <Route path="/customer" element={<Customer customer={customer} />} />
          {/* <Route path="/customer/:id" element={<Customer customer={customer} />} /> */}
          
         
          
          
        </Routes>

      </Router>
    </div>
  )

}

export default App



// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
// import Item from "./Item";
// import Login from "./Login";
// import Cart from "./Cart";
// import Signup from "./Signup";
// import NavBar from "./NavBar";
// import Edit from "./Edit";
// import CreateItem from "./CreateItem";
// import Customer from "./Customer";

// function App() {
//     const [customer, setCustomer] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetch('/check_session')
//             .then((res) => {
//                 if (!res.ok) {
//                     throw new Error('Failed to fetch customer_id.');
//                 }
//                 return res.json();
//             })
//             .then((data) => {
//                 if (data.customer || data) {
//                     setCustomer(data.customer || data);
//                 }
//                 setLoading(false);
//             })
//             .catch((e) => {
//                 console.error(e);
//                 setLoading(false);
//             });
//     }, []);

//     function ConditionNavbar({ customer }) {
//         const location = useLocation();
//         const hiddenNavBar = location.pathname === '/login' || location.pathname === '/logout' || location.pathname === '/signup';
//         return hiddenNavBar ? null : <NavBar customer={customer} />;
//     }

//     function updateCustomerCart(newOrder) {
//         setCustomer((prev) => {
//             const updatedOrders = [...prev.orders, newOrder];
//             return {
//                 ...prev,
//                 orders: updatedOrders,
//             };
//         });
//     }

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div>
//             <Router>
//                 <ConditionNavbar customer={customer} />
//                 <Routes>
//                     <Route
//                         path="/items"
//                         element={<Item customer={customer} setCustomer={setCustomer} updateCustomerCart={updateCustomerCart} />}
//                     />
//                     <Route path="/login" element={<Login setCustomer={setCustomer} />} />
//                     <Route path="/cart" element={<Cart customer={customer} setCustomer={setCustomer} updateCustomerCart={updateCustomerCart} />} />
//                     <Route path="/navbar" element={<NavBar customer={customer} />} />
//                     <Route path="/signup" element={<Signup setCustomer={setCustomer} />} />
//                     <Route path="/edit/:order_id" element={<Edit customer={customer} setCustomer={setCustomer} />} />
//                     <Route path="/create-item" element={<CreateItem />} />
//                     <Route path="/customer" element={<Customer customer={customer} />} />
//                 </Routes>
//             </Router>
//         </div>
//     );
// }

// export default App