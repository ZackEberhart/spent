
import React, { Component } from 'react';
import Konva from 'konva';
import { Stage, Layer, Circle, Rect, Text } from 'react-konva';


class Spender extends Component {

  constructor(props){
    super(props); 
    this.refItem = React.createRef();
    this.timer = 0;
    this.speed = 3500;
    // this.gradient = ctx.createRadialGradient(0,0,0,0,0,this.state.width/2);
    // this.gradient.addColorStop(0.0, "rgba(255, 255, 255, 0.0)");
    // this.gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.2)");
    // this.gradient.addColorStop(1.00, "rgba(255, 255, 255, 0.3)");
    this.state = {
      width:window.innerWidth,
      height:window.innerHeight/2,
      area:3*(window.innerHeight**2/4),
    };
  }

  componentDidMount () {
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  }

  componentWillUnmount (){
      window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({
      width: this.refItem.current.offsetWidth, 
      height: window.innerHeight/2,
      area:3*((window.innerHeight/2)**2/4),
    });
    // console.log( this.refItem.current.parentElement.curre);
  }

  amountClick = (e) => {
    if(!this.timer) this.timer = setInterval(() => this.increaseAmount(), 1);
  }

  increaseAmount = () => {
    var increment = this.props.budget/this.speed;
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
    
    let displayedBudget = this.props.budget;
    let displayedSpending = this.props.spending;
    if(displayedSpending > displayedBudget) displayedSpending = displayedBudget;
    
    totalRadius = Math.sqrt(this.state.area/3.14);
    remainingRadius = Math.sqrt(this.state.area*(displayedBudget-displayedSpending)/displayedBudget/3.14);
    temporaryRadius = Math.sqrt(this.state.area*(displayedBudget-displayedSpending-this.props.amount)/displayedBudget/3.14);

    if(totalRadius < 0 || isNaN(totalRadius)) totalRadius = 0;
    if(temporaryRadius < 0 || isNaN(temporaryRadius)) temporaryRadius = 0;
    if(remainingRadius < 0 || isNaN(remainingRadius)) remainingRadius = 0;

    return(
      <div ref = {this.refItem} onMouseOut = {this.amountRelease} onMouseUp = {this.amountRelease} >
        <Stage width={this.state.width} height={this.state.height} >
          <Layer>
            <Circle x={this.state.width/2} y={this.state.height/2} radius={totalRadius} fill="white" opacity = {.5} stroke = "black" strokeWidth = {5}/>
            <Circle x={this.state.width/2} y={this.state.height/2} radius={remainingRadius} fill="#50d878" />
            <Circle x={this.state.width/2} y={this.state.height/2} radius={temporaryRadius} fill="#278b43" />
            <Circle x={this.state.width/2} y={this.state.height/2} radius={totalRadius}
            stroke = "black" strokeWidth = {5}
            fillPriority= "#green"
            fill= {this.gradient}
            onMouseDown = {this.amountClick}
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



























