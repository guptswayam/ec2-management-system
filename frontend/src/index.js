import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {compose, combineReducers, createStore, applyMiddleware} from "redux"
import {Provider} from "react-redux";
import reduxThunk from "redux-thunk";
import authReducer from "./store/reducers/auth"
// import reportWebVitals from './reportWebVitals';

const composeEnhancers = process.env.NODE_ENV==="development"?window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const rootReducer = combineReducers({
  authReducer
})

const store= createStore(rootReducer, composeEnhancers(applyMiddleware(reduxThunk)));

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
