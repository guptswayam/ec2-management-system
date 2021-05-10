import React from "react";
import Spinner from "react-bootstrap/Spinner"
const Loader = props=>{
    return (
        <div style={{textAlign: "center"}}>
            <Spinner animation="border" role="status" size="lg" style={{marginTop: "30px"}}>
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
    )
}

export default Loader;