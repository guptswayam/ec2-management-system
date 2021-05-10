import React, { Component } from "react";
import Alert from "../../components/Alert/Alert";
import Contact from "../../components/Contact/Contact";
import Loader from "../../components/Loader/Loader";

class Contacts extends Component{

    state = {
        contacts: [],
        showAlert: false,
        alertType: "success",
        alertMsg: "",
        loading: true,
        filteredContacts: []
    }

    async componentDidMount(){
        try {
            // if(!this.state.contacts){
                const res = await fetch("/api/v1/users/get_my_contacts");
                const resData = await res.json();
                if(resData.status==="success")
                    this.setState({
                        contacts: resData.data,
                        loading: false,
                        filteredContacts: resData.data
                    })
                else
                    this.setState({
                        loading: false
                    })
            // }

        } catch (error) {
            console.log(error);
            this.setState({
                loading: false
            })
        }
    }

    deleteButtonHandler = async (id)=>{
        try {
            const res = await fetch(`/api/v1/contacts/${id}`, {
                method: "DELETE"
            })
            const resData = await res.json();
            if(resData.status==="success"){
                const index = this.state.contacts.findIndex(el=>el._id===id);
                console.log(index);
                let contacts = [...this.state.contacts];
                contacts.splice(index,1);
                console.log(contacts);
                console.log(contacts);
                this.setState({
                    alertType: "success",
                    showAlert: true,
                    alertMsg: "Contact Added Successfully...",
                    contacts: contacts,
                    filteredContacts: contacts
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

    editButtonHandler = (id)=>{
        this.props.history.push(`/edit-contact/${id}`);
    }

    searchBynameHandler = (e)=>{
        let filteredContacts = this.state.contacts.filter((el)=>{
            const index = el.name.toLowerCase().indexOf(e.target.value.toLowerCase());
            if(index!==-1)
                return true;
            else
                return false;
        })
        this.setState({
            filteredContacts: filteredContacts
        })
    }

    render(){

        let content = <Loader />
        if(!this.state.loading)
            content=(
                <React.Fragment>
                    <h1 style={{textAlign: "center"}}>MY ADDRESS BOOK</h1>
                    <div style={{textAlign: "right"}}>
                        <input type="text" placeholder="Search by name" onChange={this.searchBynameHandler}/>
                    </div>
                    {this.state.filteredContacts.length === 0? <h1 style={{textAlign: "center"}}>You have no contacts!!!</h1>: null}
                    {this.state.filteredContacts.map(el=>{
                        return <Contact key={el._id} name={el.name} number={el.number} id={el._id} editButtonHandler={this.editButtonHandler} deleteButtonHandler={this.deleteButtonHandler}/>
                    })}
                    
                </React.Fragment>
            )
        let alert = null;
        if(this.state.showAlert){
            alert = <Alert type={this.state.alertType} value={this.state.alertMsg} />
        }
        return (
            <div className="container-fluid">
                {content}
                {alert}
            </div>
        )
    }
}

export default Contacts;