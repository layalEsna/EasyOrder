import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Item from "./Item";
import Login from "./Login";
import ItemDetail from "./ItemDetail";
import Cart from "./Cart";
import Confirmation from "./Confirmation";

import Signup from "./Signup";
import NavBar from "./NavBar";

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
        if(data.customer || data){
      setCustomer(data.customer || data)}
    })
    .catch(e => console.error(e))
  }, [])

 

  return (
    <div>
      
      <Router>
      <NavBar customer={customer}/>
        <Routes>
          <Route path='/items' element={<Item customer={customer}/> } />
          <Route path='/items/:item_id' element={<ItemDetail customer={customer}/> } />
          <Route path='/login' element={<Login setCustomer={setCustomer}/> } />
          <Route path='/cart' element={<Cart customer={customer}/> } />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/navbar" element={<NavBar customer={customer}/>} />
          <Route path='/signup' element={<Signup setCustomer={setCustomer}/> } />
        </Routes>

      </Router>
    </div>
  )
}

export default App;
