
import React, { Component } from 'react';
import Swiper from './Swiper.js';
import OptionForm from './OptionForm.js';
import Spending from './Spending.js';


class Platform extends Component {

  constructor(props){
    super(props);
    this.state = { 
      unit: "day"
    }
  }

  changeUnit = (dir) => {
    if(dir === 1){
      if(this.state.unit === "day") this.setState({unit:"options"});
      else if(this.state.unit === "week") this.setState({unit:"day"});
      else if(this.state.unit === "month") this.setState({unit:"week"});
      else if(this.state.unit === "options") this.setState({unit:"month"});
    }else{
      if(this.state.unit === "options") this.setState({unit:"day"});
      else if(this.state.unit === "month") this.setState({unit:"options"});
      else if(this.state.unit === "week") this.setState({unit:"month"});
      else if(this.state.unit === "day") this.setState({unit:"week"});
    }
  }

  setOptions = () => {
    this.props.setOptions();
    // this.setState({unit:"day"});
  }

  spend = () => {
    this.props.spend();
  }

  Options = () => {
    if(this.state.unit === "options"){
      return(<OptionForm {...this.props} callback = {this.props.setOptions} />);
    }
  }
  
  render() {
    return(
      <div>
        <div class = "row">
          <div class = "col-lg-12 text-center">
            <h1> snakes </h1>
            <Swiper callback = {this.changeUnit}/>
            {this.Options()}
            <Spending {...this.props} unit = {this.state.unit} callback = {this.props.spend}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Platform;

