import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import App from './App'

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import noteReducer from './reducers/noteReducer.js'

const store = createStore(noteReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
)
