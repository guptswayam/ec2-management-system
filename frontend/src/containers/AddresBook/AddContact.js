import React, { Component } from "react";
import Alert from "../../components/Alert/Alert";
import classes from "./EditContact.module.css"


class AddContact extends Component{
    state={
        formData: {
            name: "",
            number: ""
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

    addContactHandler= async (e)=>{
        e.preventDefault();
        try {
            console.log(this.state.formData);
            const res = await fetch(`/api/v1/contacts`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(this.state.formData)
            });
            const resData = await res.json();
            if(resData.status==="success"){
                this.setState({
                    alertType: "success",
                    showAlert: true,
                    alertMsg: "Contact Added Successfully..."
                })
                setTimeout(()=>{
                    this.setState({
                        showAlert: false
                    })
                    this.props.history.push("/contacts");
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
                    <h1 style={{textAlign: "center"}}>ADD NEW CONTACT</h1>
                    <form className="form-group" style={{maxWidth: "500px", margin: "auto"}} onSubmit={this.addContactHandler}>
                        <input type="text" placeholder="Name" className="form-control" value={this.state.formData.name} onChange={this.inputChangeHandler.bind(this, "name")} required/>
                        <br/>
                        <input type="text" placeholder="Number" className="form-control" value={this.state.formData.number} onChange={this.inputChangeHandler.bind(this, "number")} required minLength="10" maxLength="10"/>
                        <br/>
                        <div className={classes.address_buttons}>
                            <span></span>
                            <div>
                                <button className="btn btn-success" type="submit">Save</button>
                                <button className="btn btn-danger" type="button" style={{marginLeft: "15px"}} onClick={()=>{this.props.history.push("/contacts")}}>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        )
    }


}

export default AddContact;