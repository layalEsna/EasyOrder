import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Item from "./Item";
import Login from "./Login";
import ItemDetail from "./ItemDetail";

// import Signup from "./Signup";

function App() {
  return (
    <div>
      <h1>Welcome to Easy Order</h1>
      <Router>
        <Routes>
          <Route path='/items' element={<Item/> } />
          <Route path='/items/:item_id' element={<ItemDetail/> } />
          <Route path='/login' element={<Login/> } />
          {/* <Route path='/signup' element={<Signup/> } /> */}
        </Routes>

      </Router>
    </div>
  )
}

export default App;
