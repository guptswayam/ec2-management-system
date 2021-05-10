import React from "react";
import { capitalize } from "../../utils/utility";
import classes from "./Instance.module.css"

const Instance = props=>{
    return (
        <div style={{padding: "20px", border: "2px solid black", margin: "30px auto"}}>
            <div className={classes.my_address}>
                <p><span style={{fontWeight: "bold"}}>Instance Id: </span>{props.id}</p>
                <p><span style={{fontWeight: "bold"}}>Region: </span>{props.region}</p>
            </div>
            <div className={classes.my_address}>
                <p><span style={{fontWeight: "bold"}}>Current State: </span>{capitalize(props.State.Name)}</p>
                {props.Tags.length > 0 ? 
                    <p><span style={{fontWeight: "bold"}}>{props.Tags[0].Key}: </span>{props.Tags[0].Value}</p>
                : <p><span style={{fontWeight: "bold"}}>Type: </span>{props.InstanceType}</p>}
            </div>
            <div className={classes.address_buttons}>
                <span></span>
                <div>
                    <button className="btn btn-danger" style={{marginLeft: "15px"}} onClick={props.viewDetails}>View Details</button>
                </div>
            </div>
        </div>
)
}

export default Instance;