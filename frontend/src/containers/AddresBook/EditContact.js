import React, { Component } from "react";
import Alert from "../../components/Alert/Alert";
import Loader from "../../components/Loader/Loader";
import classes from "./EditContact.module.css"

class EditContact extends Component{

    state={
        formData: {
            name: null,
            number: null
        },
        invalidId: false,
        loading: true,
        showAlert: false,
        alertType: "success",
        alertMsg: ""
    }

    async componentDidMount(){
        // console.log(this.props);
        try {
            const res= await fetch(`/api/v1/contacts/${this.props.match.params.id}`);
            const resData = await res.json();
            console.log(resData);
            if(resData.status ==="success")
                this.setState({
                    formData: {
                        name: resData.data.name,
                        number: resData.data.number
                    },
                    loading: false
                })
            else{
                this.setState({
                    invalidId: true
                })
            }    
        } catch (error) {
            console.log(error);
        }
    }

    inputChangeHandler= (key,event)=>{
        this.setState({
            formData: {
                ...this.state.formData,
                [key]: event.target.value
            }
        })
    }

    editContactHandler = async (e)=>{
        e.preventDefault();
        try {
            console.log(this.state.formData);
            const res = await fetch(`/api/v1/contacts/${this.props.match.params.id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(this.state.formData)
            });
            const resData = await res.json();
            if(resData.status==="success"){
                this.setState({
                    alertType: "success",
                    showAlert: true,
                    alertMsg: "Contact Edited Successfully..."
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
        let editDOM;
        if(this.state.loading){
            editDOM = <Loader />;
        }
        else{
            editDOM = (
                <React.Fragment>
                    <h1 style={{textAlign: "center"}}>EDIT CONTACT</h1>
                    <form className="form-group" style={{maxWidth: "500px", margin: "auto"}} onSubmit={this.editContactHandler}>
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
                </React.Fragment>
            )
        }

        if(this.state.invalidId){
            editDOM= <h1>Invalid Id</h1>
        }

        let alert = null;
        if(this.state.showAlert){
            alert = <Alert type={this.state.alertType} value={this.state.alertMsg} />
        }

        return (
            <div className="container-fluid">
                {alert}
                {editDOM}
            </div>
        )
    }
}

export default EditContact;