import React from 'react';
import ReactDOM from 'react-dom';
import App from "./components/App";
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import leaderReducer from './features/leader';
import membersReducer from './features/members';

const store = configureStore({
    reducer: {
        leader: leaderReducer,
        members: membersReducer,
    },
})

ReactDOM.render(
    <Provider store={store}><App /></Provider>
    , document.getElementById('root'));
