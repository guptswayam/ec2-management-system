import React, { Component } from "react"
import Loader from "../../components/Loader/Loader";
import { capitalize } from "../../utils/utility";
import classes from "./InstanceView.module.css"
import Alert from "../../components/Alert/Alert";

class InstanceView extends Component{
    state = {
        instance: {},
        loading: true,
        error: null,
        disabled: false,
        showAlert: false,
        alertType: "success",
        alertMsg: ""
    }

    getInstance = async (useCache="yes") => {
        this.setState({
            loading: true
        })
        const res = await fetch(`/api/v1/instances/${this.props.match.params.id}/${this.props.match.params.region}/?useCache=${useCache}`)
        const resData = await res.json()
        console.log(resData)
        if(resData.status === "success"){
            this.setState({
                loading: false,
                instance: resData.data
            })
        }
        else {
            this.setState({
                error: resData.message,
                loading: false
            })
        }
    }

    componentDidMount() {
        this.getInstance()
    }

    changeState = async () => {
        this.setState({
            disabled: true
        })
        const res = await fetch(`/api/v1/instances/${this.state.instance.State.Name==="running" ? "stop": "start"}/${this.props.match.params.id}/${this.props.match.params.region}`, {
            method: "PATCH"
        })
        const resData = await res.json()

        if(resData.status === "success"){
            this.setState(prevState => ({
                instance: {
                    ...prevState.instance,
                    State: {
                        ...prevState.State,
                        Name: resData.data[prevState.instance.State.Name==="running" ? "StoppingInstances": "StartingInstances"][0].CurrentState.Name
                    }
                },
                alertType: "success",
                showAlert: true,
                alertMsg: "Changing the Instance State..."
            }))
            setTimeout(()=>{
                this.setState({
                    showAlert: false
                })
            },3000)
        }
        else{
            this.setState({
                alertType: "danger",
                showAlert: true,
                alertMsg: resData.message,
                disabled: false
            })
            setTimeout(()=>{
                this.setState({
                    showAlert: false
                })
            },3000)
        }

    }

    viewDetails(id) {
        this.props.history.push(`/instances/${id}`)
    }

    render() {
        let content = <Loader />
        if(!this.state.loading)
            if(this.state.error)
                content = (
                    <div style={{textAlign: "center"}}>
                            <h2>something Went wrong!</h2>
                    </div>
                )
            else
                content=(
                    <React.Fragment>
                        <div style={{textAlign: "right"}}>
                            <br></br>
                            <button className="btn btn-secondary" onClick={() => {this.getInstance("no")}}><span style={{fontSize: "20px"}}>↻ </span>Refresh</button>
                        </div>

                        <div style={{padding: "20px", border: "2px solid black", margin: "30px auto"}}>
                            <div className={classes.my_address}>
                                <p><span style={{fontWeight: "bold"}}>Instance Id: </span>{this.state.instance.id}</p>
                                <p><span style={{fontWeight: "bold"}}>Region: </span>{this.state.instance.region}</p>
                            </div>
                            <div className={classes.my_address}>
                                <p><span style={{fontWeight: "bold"}}>Current State: </span>{capitalize(this.state.instance.State.Name)}</p>
                                <p><span style={{fontWeight: "bold"}}>Type: </span>{this.state.instance.InstanceType}</p>
                            </div>
                            <div className={classes.my_address}>
                                <p><span style={{fontWeight: "bold"}}>Launch Time: </span>{new Date(this.state.instance.LaunchTime).toLocaleString("en-US", {dateStyle: "long", timeStyle: "long"})}</p>
                                <p><span style={{fontWeight: "bold"}}>Public IP Address: </span>{this.state.instance.PublicIpAddress}</p>
                            </div>
                            <div className={classes.my_address}>
                                <p><span style={{fontWeight: "bold"}}>Public DNS Name: </span>{this.state.instance.PublicDnsName}</p>
                                <p><span style={{fontWeight: "bold"}}>Cpu Count: </span>{this.state.instance.CpuOptions.CoreCount}</p>
                            </div>
                            {this.state.instance.Tags.length > 0 &&
                                <div className={classes.my_address}>
                                    <p><span style={{fontWeight: "bold"}}>{this.state.instance.Tags[0].Key}: </span>{this.state.instance.Tags[0].Value}</p>
                                </div>
                            }
                            <div className={classes.address_buttons}>
                                <span></span>
                                <div>
                                    {this.state.instance.State.Name === "running" || this.state.instance.State.Name === "stopped"
                                    ? <button className="btn btn-danger" style={{marginLeft: "15px"}} onClick={this.changeState} disabled={this.state.disabled}>{this.state.instance.State.Name === "running" ? "Stop": "Start"}</button>
                                    :  <button className="btn btn-danger" style={{marginLeft: "15px"}} disabled>Pending</button>
                                    }
                                </div>
                            </div>
                        </div>
                        
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
export default InstanceView