

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


            <Link className='nav' to='/items'>Easy Order</Link>

            <Link className='nav' to='/cart'>Cart</Link>
            {customer ? (
                <>
                    
                    <span>Welcome, {customer.username}</span>
                    <button className='btn' onClick={handleLogout}>logout</button>
                </>
            ) : (
                    <>
                        
                    <span>Welcome to Easy Order</span>
                    <button onClick={() => navigate('/login')}>login</button>
                </>)

            }


        </nav>


    )

}

export default NavBar