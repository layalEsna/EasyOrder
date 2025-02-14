import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Item from "./Item";
import Login from "./Login";
import ItemDetail from "./ItemDetail";
import Cart from "./Cart";

// import Signup from "./Signup";

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
        if(data.customer){
      setCustomer(data)}
    })
    .catch(e => console.error(e))
  }, [])

  return (
    <div>
      <h1>Welcome to Easy Order</h1>
      <Router>
        <Routes>
          <Route path='/items' element={<Item/> } />
          <Route path='/items/:item_id' element={<ItemDetail/> } />
          <Route path='/login' element={<Login/> } />
          <Route path='/cart' element={<Cart/> } />
          {/* <Route path='/signup' element={<Signup/> } /> */}
        </Routes>

      </Router>
    </div>
  )
}

export default App;
