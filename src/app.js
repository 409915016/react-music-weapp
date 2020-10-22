import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import './app.scss'
import './assets/fonts/iconfont.css'
import 'taro-ui/dist/style/index.scss'

import rootReducer from './reducers/rootReducer'
const store = createStore(rootReducer)

class App extends Component {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  render () {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
