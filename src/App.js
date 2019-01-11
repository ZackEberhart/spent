
import React, { Component } from 'react';
import './App.css';
import Swiper from './Swiper.js';
import OptionForm from './OptionForm.js';
import Spending from './Spending.js';
import * as h from './Helpers.js';

class App extends Component {
  
  /*******Component Management*******/

  constructor(props){
    super(props);
    this.state = {
      income:0,
      bills:0,
      spendingMonth: 0,
      spendingWeek: 0,
      spendingDay: 0,
      budgetMonth: 0,
      budgetWeek: 0,
      budgetDay: 0,
      unit: "day",
      weeksLeft: h.weeksLeftInMonth(h.firstDayOfMonth()),
      previousDate: h.today(),
      targetDate: h.firstDayOfMonth()
    };
  }

  componentDidMount(){
    this.monitorDay();
    this.timerID = setInterval(() => this.monitorDay(), 10000);
    this.hydrateStateWithLocalStorage();
    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
  } 

  componentWillUnmount(){
    clearInterval(this.timerID);
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
    this.saveStateToLocalStorage();
  } 

  hydrateStateWithLocalStorage(){
    for (let key in this.state) {
      if (localStorage.hasOwnProperty(key)) {
        let value = localStorage.getItem(key);
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          this.setState({ [key]: value });
        }
      }
    }
  }

  saveStateToLocalStorage() {
    for (let key in this.state) {
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  monitorDay(){
    if(this.state.previousDate !== h.today()){
      this.newDay();
    }
  }

  /********Callbacks*********/ 

  setOptions = (optionsState) =>{
    this.setState(optionsState);
    this.setState(h.calculateBudgetMonth);
    this.setState(h.calculateBudgetWeek);
    this.setState(h.calculateBudgetDay);
    this.saveStateToLocalStorage();
    this.setState({spendingWeek: 0,spendingDay: 0});
  }

  spend = (amount, unit) => {
    var amountRemaining;
    if(unit === "day"){
      amountRemaining = h.remaining(this.state.budgetDay, this.state.spendingDay);
      if(amount > amountRemaining) amount = amountRemaining;
      this.setState((state) => ({spendingMonth: state.spendingMonth + amount}));
      this.setState((state) => ({spendingWeek: state.spendingWeek + amount}));
      this.setState((state) => ({spendingDay: state.spendingDay + amount}));
    }else if (unit === "week") {
      amountRemaining = h.remaining(this.state.budgetWeek,this.state.spendingWeek);
      if(amount > amountRemaining) amount = amountRemaining;
      this.setState((state) => ({spendingMonth: state.spendingMonth + amount}));
      this.setState((state) => ({spendingWeek: state.spendingWeek + amount}));
      this.setState(h.calculateBudgetDay);
    }else if (unit === "month"){
      amountRemaining = h.remaining(this.state.budgetMonth, this.state.spendingMonth);
      if(amount > amountRemaining) amount = amountRemaining;
      this.setState((state) => ({spendingMonth: state.spendingMonth + amount}));
      this.setState(h.calculateBudgetWeek);
      this.setState(h.calculateBudgetDay);
    }
  }

  reset = () => {
    this.setState((state) => ({
        spendingMonth: 0,
        spendingWeek: 0,
        spendingDay: 0,
      }));
  }

  newDay(){
    if(h.daysLeftInMonth(this.state.targetDate) <= 0){
      this.setState((state) => ({
        savings: state.savings + h.remaining(state.budgetMonth, state.spendingMonth),
        spendingMonth: 0,
        spendingWeek: 0,
        spendingDay: 0,
        targetDate: h.firstDayOfMonth(),
        weeksLeft: h.weeksLeftInMonth(h.firstDayOfMonth())
      }));
      this.setState(h.calculateBudgetWeek);
      this.setState(h.calculateBudgetDay);
    }else if(h.weeksLeftInMonth(this.state.targetDate) < this.state.weeksLeft){
      this.setState({
        spendingDay: 0, 
        spendingWeek: 0,
        weeksLeft: h.weeksLeftInMonth(this.state.targetDate)
      });
      this.setState(h.calculateBudgetWeek);
      this.setState(h.calculateBudgetDay);
    }else{
      this.setState({
        spendingDay: 0
      });
      this.setState(h.calculateBudgetDay);
    }
    this.setState({previousDate: h.today()});
  }

  changeUnit = (dir) => {
    if(dir === 1){
      if(this.state.unit === "options") this.setState({unit:"day"});
      else if(this.state.unit === "month") this.setState({unit:"options"});
      else if(this.state.unit === "week") this.setState({unit:"month"});
      else if(this.state.unit === "day") this.setState({unit:"week"});
    }else{
      if(this.state.unit === "day") this.setState({unit:"options"});
      else if(this.state.unit === "week") this.setState({unit:"day"});
      else if(this.state.unit === "month") this.setState({unit:"week"});
      else if(this.state.unit === "options") this.setState({unit:"month"});
      
    }
  }

  /************ Rendering ************/

  render() {
    let content;
    if(this.state.unit === "options"){
      content = <OptionForm {...this.state} set = {this.setOptions} reset = {this.reset}/>;
    } else {
      content = <Spending {...this.state} unit = {this.state.unit} callback = {this.spend}/>;
    }

    return(
      <div className = "vertical-center">
        <div className = "container">
          <div className = "row">
            <div className = "col-lg-12 text-center">
              <Swiper callback = {this.changeUnit}/>
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
/***********END OF CLASS**************/



export default App;
