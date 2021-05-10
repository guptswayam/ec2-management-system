import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './containers/Layout/Layout';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Login from './containers/Auth/Login';
import Homepage from './containers/Homepage/Homepage';
import Signup from './containers/Auth/Signup';
import InstancesList from "./containers/Instances/InstancesList"
import React, { Component } from "react";
import {connect} from "react-redux"
import * as authActions from "./store/actions/auth"
import Loader from './components/Loader/Loader';
import AddCredential from "./containers/AddCredential/AddCredential"
import InstanceView from './containers/Instances/InstanceView';

class App extends Component {

  state={
    appLoading: true
  }

  componentDidMount(){
    this.props.checkUserSession();
    this.setState({
      appLoading: false
    })
  }

  render(){

    let routes;

    if(this.props.user){
      routes = (
        <Switch>
          <Route path="/add-credentials" component={AddCredential} />
          <Route path="/instances/:id/:region" component={InstanceView}></Route>
          <Route path="/instances" exact component={InstancesList}></Route>
          <Redirect from="/" to="/instances" />
        </Switch>
      )
    }
    else{
      routes = (
        <Switch>
          <Route path="/login" exact component={Login}></Route>
          <Route path="/signup" exact component={Signup}></Route>
          <Route path= "/" exact component={Homepage}></Route>
          <Redirect from="/" to="/" />
        </Switch>
      )
    }

    if(this.props.loading)
      routes = <Loader />

    return (
      <BrowserRouter>
        <Layout user={this.props.user}>
          {this.state.appLoading?null: routes}
        </Layout>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state=>{
  return{
    user: state.authReducer.user,
    error: state.authReducer.error,
    loading: state.authReducer.loading
  }
}

const mapDispatchToProps = dispatch=>{
  return{
    checkUserSession: ()=>dispatch(authActions.checkUserSession())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
