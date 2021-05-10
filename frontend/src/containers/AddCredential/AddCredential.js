import React, { Component } from "react";
import Alert from "../../components/Alert/Alert";
import classes from "./AddCredential.module.css"


class AddCredential extends Component{
    state={
        formData: {
            accessKey: "",
            secretKey: ""
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

    addCredentialHandler= async (e)=>{
        e.preventDefault();
        try {
            console.log(this.state.formData);
            const res = await fetch(`/api/v1/users/awsCredentials`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(this.state.formData)
            });
            const resData = await res.json();
            if(resData.status==="success"){
                this.setState({
                    alertType: "success",
                    showAlert: true,
                    alertMsg: "Credentials Added Successfully..."
                })
                setTimeout(()=>{
                    this.setState({
                        showAlert: false
                    })
                    this.props.history.push("/instances");
                },3000)
                console.log(resData)
            }
            else{
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
            <React.Fragment>
                <div className="container-fluid">
                    {alert}
                    <h1 style={{textAlign: "center"}}>EDIT AWS CREDENTIALS</h1>
                    <form className="form-group" style={{maxWidth: "500px", margin: "auto"}} onSubmit={this.addCredentialHandler}>
                        <input type="text" placeholder="Access Key" className="form-control" value={this.state.formData.accessKey} onChange={this.inputChangeHandler.bind(this, "accessKey")} required/>
                        <br/>
                        <input type="text" placeholder="Secret Key" className="form-control" value={this.state.formData.secretKey} onChange={this.inputChangeHandler.bind(this, "secretKey")} required/>
                        <br/>
                        <div className={classes.address_buttons}>
                            <span></span>
                            <div>
                                <button className="btn btn-success" type="submit">Save</button>
                                <button className="btn btn-danger" type="button" style={{marginLeft: "15px"}} onClick={()=>{this.props.history.push("/instances")}}>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        )
    }


}

export default AddCredential;