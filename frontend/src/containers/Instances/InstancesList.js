import React, { Component } from "react"
import Instance from "../../components/Instance/Instance";
import Loader from "../../components/Loader/Loader";

class InstancesList extends Component{
    state = {
        instances: [],
        loading: true,
        error: null
    }

    getInstances = async (useCache="yes") => {
        this.setState({
            loading: true
        })
        const res = await fetch(`/api/v1/instances/?useCache=${useCache}`)
        const resData = await res.json()
        console.log(resData)
        if(resData.status === "success"){
            this.setState({
                loading: false,
                instances: resData.data
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
        this.getInstances()
    }

    viewDetails(id, region) {
        this.props.history.push(`/instances/${id}/${region}`)
    }

    render() {
        let content = <Loader />
        if(!this.state.loading)
            content=(
                <React.Fragment>
                    <h1 style={{textAlign: "center"}}>ALL EC2 INSTANCES</h1>
                    <div style={{textAlign: "right"}}>
                        <button className="btn btn-secondary" onClick={() => {this.getInstances("no")}}><span style={{fontSize: "20px"}}>↻ </span>Refresh</button>
                    </div>
                    {this.state.instances.length === 0 && this.state.error===null? 
                        <div style={{textAlign: "center"}}>
                            <h2 style={{textAlign: "center"}}>Your account has no EC2 Instances!</h2>
                            <br></br>
                            <button className="btn btn-success" onClick={() => {this.props.history.push("/add-credentials")}}>Edit Credentials</button>
                        </div>
                    : null}
                    {this.state.error && 
                        <div style={{textAlign: "center"}}>
                            <h2>{this.state.error}</h2>
                            <br></br>
                            <button className="btn btn-success" onClick={() => {this.props.history.push("/add-credentials")}}>Edit Credentials</button>
                        </div>
                    }
                    { this.state.instances.map(el => {
                        return <Instance {...el} key={el.id} viewDetails={()=>{this.viewDetails(el.id, el.region)}}/>
                    })}
                </React.Fragment>
            )
        return (
            <div className="container-fluid">
                {content}
            </div>
        )
    }

}
export default InstancesList