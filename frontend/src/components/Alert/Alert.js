import React from "react";

const Alert = props=>{
    return (
        <p className={`alert alert-${props.type}`} style={{display: "inline", position: "fixed", top: "100px", left: "50%", transform: "translateX(-50%)", zIndex: 500}}>{props.value}</p>
    )
}

export default Alert;