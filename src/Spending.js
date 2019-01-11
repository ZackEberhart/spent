
import React, { Component } from 'react';
import Konva from 'konva';
import { Stage, Layer, Circle, Text } from 'react-konva';
import Spender from './Spender.js';



class Spending extends Component {

  constructor(props){
    super(props); 
    this.state = {
      amount: 0,
    };
  }

  commitAmount = (e) => {
    e.preventDefault();
    this.props.callback(this.state.amount, this.props.unit);
    this.setState({amount:0});
  }

  cancelAmount = (e) => {
    e.preventDefault();
    this.setState({amount:0});
  }

  increaseAmount = (increment) => {
    this.setState((state) => ({
      amount:this.state.amount + increment
    }));
  }

  CommitOrCancel(){
    // if(this.state.amount > 0){
    return(
      <div>
        Spending {Math.min(Math.round(this.state.amount), Math.round(this.props.budget))}
        <br />
        <button onClick = {this.commitAmount}> Confirm </button> 
        <button onClick = {this.cancelAmount}> Cancel </button>
      </div> 
    );
    // }else{
    //   return <div></div>;
    // }
  }

  Message = () => {
    return( 
      <div>
        <h1>$ {Math.round(remaining(this.props.budget, this.props.spending))}</h1>
        for the rest of the {this.props.unit}
      </div>
    );
  }

  render() {
    return(
      <div>
        {this.Message()}
        <Spender {...this.props} amount = {this.state.amount} increaseAmount = {this.increaseAmount}/>
        {this.CommitOrCancel()}
      </div>
    );
  }
}

/*********HELPER FUNCTIONS**********/
//Note: these are copied from the App.js file, probably a better way to do this

function remaining(budget, spending){
  return spending > budget ? 0 : budget - spending;
}

function daysLeftInMonth(targetDate){
  var startDate = new Date();
  var endDate = new Date(targetDate);
  var timeDiff = endDate.getTime() - startDate.getTime();
  var daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
}
function weeksLeftInMonth(targetDate){
  var daysDiff = daysLeftInMonth(targetDate);
  return Math.ceil(daysDiff / 7);
}
function daysLeftInWeek(targetDate){
  var daysDiff = daysLeftInMonth(targetDate);
  return daysDiff - ((weeksLeftInMonth(targetDate) - 1) * 7 );
}

export default Spending;



























