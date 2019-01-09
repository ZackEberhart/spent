
import React, { Component } from 'react';

var WheelSwipe = require('wheel-swipe');

class Swiper extends Component {

  constructor(props){
    super(props); 
    this.ws = new WheelSwipe((window, {debounceThreshold:30}));
  }

  componentDidMount = () => {
    window.addEventListener('wheelup', (e) => { 
        this.handleScroll(0);
    });
     
    window.addEventListener('wheeldown', (e) => { 
        this.handleScroll(1);
    });
  } 

  componentWillUnmount = () => {
    window.removeEventListener('wheelup', (e) => { 
        this.handleScroll(0);
    });
     
    window.removeEventListener('wheeldown', (e) => { 
      this.handleScroll(1);
    });
  }

  handleScroll = (dir) => {
        this.props.callback(dir);
    }

  render() {
    return <div></div>;
  }
}

export default Swiper;

