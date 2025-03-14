

import { Link, useNavigate } from "react-router-dom"


function NavBar({customer}) {

    const navigate = useNavigate()

    function handleLogout() {
        fetch('/logout', {
            method: 'DELETE',

        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Logout failed.')
                }
                return res.json()
            })
            .then(data => {
                console.log(data.message)
                
                navigate('/login')
            })
            .catch(e => {
                console.error(`Error during logout: ${e}`)
            })
    }


    return (

        <nav>


            <Link className='nav' to='/items'>Items</Link>
            <Link className='nav' to='/customer'>My Items</Link>

            <Link className='nav' to='/orders'>My Orders</Link>
            <Link className='nav' to='/create-item'>Create a New Item</Link>
            {customer ? (
                <>
                    
                    <div className="span_div"> <span>Username: {customer.username}</span></div>
                    <button className='logout-btn' onClick={handleLogout}>logout</button>
                </>
            ) : (
                    <>
                        
                   <div className="span_div"><span>Welcome to Easy Order</span></div> 
                    <button className='btn' onClick={() => navigate('/login')}>login</button>
                </>)

            }


        </nav>


    )

}

export default NavBar