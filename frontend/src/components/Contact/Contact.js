import React from "react";
import classes from "./Contact.module.css"

const Contact = props=>{
    return (
        <div style={{padding: "20px", border: "2px solid black", margin: "30px auto"}}>
            <div className={classes.my_address}>
                <p><span style={{fontWeight: "bold"}}>Name: </span>{props.name}</p>
                <p><span style={{fontWeight: "bold"}}>Number: </span>{props.number}</p>
            </div>
            <div className={classes.address_buttons}>
                <span></span>
                <div>
                    <button className="btn btn-warning" onClick={props.editButtonHandler.bind(null,props.id)}>Edit</button>
                    <button className="btn btn-danger" style={{marginLeft: "15px"}} onClick={props.deleteButtonHandler.bind(null, props.id)}>Delete</button>
                </div>
            </div>
        </div>
)
}

export default Contact;