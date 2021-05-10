import React, { Component, createRef } from "react";
import Alert from "../../components/Alert/Alert";
class Signup extends Component{

    constructor(props){
        super(props);
        this.buttonRef = createRef();
    }

    state = {
        formData: {
            email: "",
            password: "",
            name: ""
        },
        showAlert: false,
        alertType: "success",
        alertMsg: ""
    }

    inputChangeHandler= (key,event)=>{
        this.setState({
            formData: {
                ...this.state.formData,
                [key]: event.target.value
            }
        })
    }

    loginHandler= async (event)=>{
        event.preventDefault();
        try {
            this.buttonRef.current.textContent = "Signing up...";
            this.buttonRef.current.disabled=true;
            const res = await fetch("/api/v1/users/signup", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(this.state.formData)
            });
            const resData = await res.json();
            if(resData.status === "success"){
                this.buttonRef.current.textContent = "Signup";
                this.buttonRef.current.disabled=false;
                 this.setState({
                    alertType: "success",
                    showAlert: true,
                    alertMsg: "Signup Successful..."
                })
                setTimeout(()=>{
                    this.setState({
                        showAlert: false
                    })
                    this.props.history.push("/login");
                },3000)
            }
            else{
                console.log(resData.message);
                this.buttonRef.current.textContent = "Signup";
                this.buttonRef.current.disabled=false;
                this.setState({
                    alertType: "danger",
                    showAlert: true,
                    alertMsg: resData.message
                })
                setTimeout(()=>{
                    this.setState({
                        showAlert: false
                    })
                },3000)
            }
            

        } catch (error) {
            console.log(error);
            this.buttonRef.current.textContent = "Signup";
            this.buttonRef.current.disabled=false;
            this.setState({
                alertType: "danger",
                showAlert: true,
                alertMsg: "something went wrong"
            })
            setTimeout(()=>{
                this.setState({
                    showAlert: false
                })
            },3000)
        }
    }

    render(){

        let alert = null;
        if(this.state.showAlert){
            alert = <Alert type={this.state.alertType} value={this.state.alertMsg} />
        }
        return (
            <form className="form-group" style={{maxWidth: "600px", margin: "auto"}} onSubmit={this.loginHandler}>
                {alert}
                <label>Name</label>
                <input type="text" required placeholder="Name" className="form-control" value={this.state.formData.name} onChange={this.inputChangeHandler.bind(this, "name")}/>
                <label>Email</label>
                <input type="email" required placeholder="Email" className="form-control" value={this.state.formData.email} onChange={this.inputChangeHandler.bind(this, "email")}/>
                <label>Password</label>
                <input type="password" required placeholder="Password" className="form-control" value={this.state.formData.password} onChange={this.inputChangeHandler.bind(this, "password")}/>
                <br></br>
                <button className="btn btn-primary" type="submit" ref={this.buttonRef}>Signup</button>
            </form>

        )
    }
}

export default Signup;