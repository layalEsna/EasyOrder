import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Item from "./Item";
import Login from "./Login";
import ItemDetail from "./ItemDetail";
import Cart from "./Cart";
import Confirmation from "./Confirmation";

import Signup from "./Signup";
import NavBar from "./NavBar";
import Edit from "./Edit";

function App() {

  const [customer, setCustomer] = useState(null)


  useEffect(() => {
    fetch('/check_session')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch custome_id.')
        }
        return res.json()
      })
      .then(data => {
        if (data.customer || data) {
          setCustomer(data.customer || data)
        }
      })
      .catch(e => console.error(e))
  }, [])

  function ConditionNavbar({ customer }) {

    const location = useLocation()
    const hiddenNavBar = location.pathname == '/login' || location.pathname == '/logout'

    return hiddenNavBar ? null : <NavBar customer={customer} />

  }

  return (
    <div>

      <Router>
        <ConditionNavbar customer={customer} />
        <Routes>
          <Route path='/items' element={<Item customer={customer} />} />
          <Route path='/items/:item_id' element={<ItemDetail customer={customer} />} />
          <Route path='/login' element={<Login setCustomer={setCustomer} />} />
          <Route path='/cart' element={<Cart customer={customer} />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/navbar" element={<NavBar customer={customer} />} />
          <Route path='/signup' element={<Signup setCustomer={setCustomer} />} />
          <Route path='/cart/:order_id/edit' element={<Edit customer={customer} />} />
          <Route path='/cart/:order_id/delete' element={<DeleteOrder />} />
        </Routes>

      </Router>
    </div>
  )

}

export default App;
