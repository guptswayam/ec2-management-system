import React from "react"
import {NavLink} from "react-router-dom"

const Header = (props)=>{
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" >
            <NavLink className="navbar-brand" to={props.user?"/instances": "/"}>EC2 Management System</NavLink>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <span className="mr-auto"></span>
                <ul className="navbar-nav mr-right">
                    {props.user ? 
                        (
                            <React.Fragment>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/add-credentials">Edit Credentials</NavLink>
                                </li>
                                <li className="nav-item">
                                    <button style={{background: "none", border: "none", padding: "0px", marginTop: "7px",color:"lightgray", outline: "none"}} onClick={props.logoutHandler}>Logout</button>
                                </li>
                            </React.Fragment>
                        ):
                        (
                        <React.Fragment>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/login">Login</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/signup">Sign up</NavLink>
                            </li>
                        </React.Fragment>
                    )
                    }
                </ul>
            </div>
        </nav>
    )
}

export default Header;