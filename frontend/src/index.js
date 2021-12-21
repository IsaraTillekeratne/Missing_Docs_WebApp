import React from 'react';
import ReactDOM from 'react-dom';
import App from "./components/App";
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userReducer from './features/user'

const store = configureStore({
    reducer: {
        user: userReducer
    },
})

ReactDOM.render(
    <Provider store={store}><App /></Provider>
    , document.getElementById('root'));
