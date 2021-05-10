import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class Homepage extends Component{
    render(){
        return (
            <div style={{textAlign: "center"}}>
                <br/>
                <h2>To Manage your EC2 Instances, Please signup/login</h2>
                <NavLink to="/signup" className="btn btn-primary">SIGNUP</NavLink>
                <br></br><br></br>
                <NavLink to="/login" className="btn btn-success">LOGIN</NavLink>
                <br/><br/>
                {/* <h2>To Check/Edit Your Address Book, Please login...</h2>
                <NavLink to="/login" className="btn btn-success">LOGIN</NavLink> */}
            </div>
        )
    }
}

export default Homepage;