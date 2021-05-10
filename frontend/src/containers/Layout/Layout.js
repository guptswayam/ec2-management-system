import React, { Component } from "react";
import Header from "../../components/Header/Header";

class Layout extends Component{

    logoutHandler =async ()=>{
        const res = await fetch("/api/v1/users/logout");
        const resData = await res.json();
        if(resData.status === "success")
            window.location.assign("/");
    }

    render(){
        return (
            <div className="container-fluid">
                <Header user={this.props.user} logoutHandler={this.logoutHandler}/>
                {this.props.children}
            </div>
        )
    }
}

export default Layout;