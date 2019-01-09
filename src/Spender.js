
import React, { Component } from 'react';
import Konva from 'konva';
import { Stage, Layer, Circle, Text } from 'react-konva';


class Spender extends Component {

  constructor(props){
    super(props); 
    // this.state = {}
    this.timer = 0;
    this.speed = 3500;
    this.width = Math.min(window.innerHeight, window.innerWidth)/1.5;
    this.height = this.width;
    this.area = 3*(this.height*this.height/4);
    this.gradient = ctx.createRadialGradient(0,0,0,0,0,this.width/2);
    this.gradient.addColorStop(0.0, "rgba(255, 255, 255, 0.0)");
    this.gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.2)");
    this.gradient.addColorStop(1.00, "rgba(255, 255, 255, 0.3)");
  }

  amountClick = (e) => {
    if(!this.timer) this.timer = setInterval(() => this.increaseAmount(), 1);
  }

  increaseAmount = () => {
    var budget = this.props.unit === "day" ? this.props.budgetDay :
      (this.props.unit === "week" ? this.props.budgetWeek : this.props.budgetMonth);
    var increment = budget/this.speed;
    if(this.speed > 2300) this.speed -= 25;
    this.props.increaseAmount(increment);
  }

  amountRelease = (e) => {
    clearInterval(this.timer);
    this.timer = false;
    this.speed = 5000;
  }

  render() {
    let totalRadius;
    let remainingRadius;
    let temporaryRadius;
    let factor;
    
    let displayedBudget = 1;
    let displayedSpending = 1;
    
    if(this.props.unit === "month") {
      displayedBudget = this.props.budgetMonth;
      displayedSpending = this.props.spendingMonth;
      factor = 1;
    }
    else if(this.props.unit === "week"){
      displayedBudget = this.props.budgetWeek;
      displayedSpending = this.props.spendingWeek;
      factor = .9;
    }
    else if(this.props.unit === "day"){
      displayedBudget = this.props.budgetDay;
      displayedSpending = this.props.spendingDay;
      factor = .8;
    }
    
    if(displayedSpending > displayedBudget) displayedSpending = displayedBudget;
    totalRadius = factor * Math.sqrt(this.area/3.14);
    remainingRadius = factor * Math.sqrt(this.area*(displayedBudget-displayedSpending)/displayedBudget/3.14);
    temporaryRadius = factor * Math.sqrt(this.area*(displayedBudget-displayedSpending-this.props.amount)/displayedBudget/3.14);

    if(temporaryRadius < 0 || isNaN(temporaryRadius)) temporaryRadius = 0;
    if(remainingRadius < 0 || isNaN(remainingRadius)) remainingRadius = 0;

    return(
      <div onMouseOut = {this.amountRelease} onMouseUp = {this.amountRelease}>
        <Stage width={this.width} height={this.height}>
          <Layer>
            <Circle x={this.width/2} y={this.height/2} radius={totalRadius} fill="white" opacity = ".5" stroke = "black" strokeWidth = "5"/>
            <Circle x={this.width/2} y={this.height/2} radius={remainingRadius} fill="#50d878" />
            <Circle x={this.width/2} y={this.height/2} radius={temporaryRadius} fill="#278b43" />
            <Circle x={this.width/2} y={this.height/2} radius={totalRadius}
            stroke = "black" strokeWidth = {5}
            fillPriority= 'radial-gradient'
            fill= {this.gradient}
            onMouseDown = {this.amountClick}
            opacity = {.5}
            />
          </Layer>
        </Stage>
      </div>
    );
  }
}

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

export default Spender;



























