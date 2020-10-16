import React, {Component} from 'react'

import {View} from '@tarojs/components'

import Navbar from "../../component/Navbar/index"

import './index.scss'

class Layout extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount () {
    //console.log(this.props.canPlayList)
  }

  render () {
    const { nav, container, footer, children } = this.props
    return (
      <View className="wrapper">
        <View className="header">
          <Navbar/>
        </View>
        <View className="container">
          { children }
        </View>
        <View className="footer"></View>
      </View>
    )
  }
}

export default Layout
