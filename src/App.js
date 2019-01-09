
import React, { Component } from 'react';
import './App.css';
import Platform from './Platform.js';

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
      weeksLeft: weeksLeftInMonth(firstDayOfMonth()),
      previousDate: today(),
      targetDate: firstDayOfMonth()
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
    if(this.state.previousDate !== today()){
      this.newDay();
    }
  }

  /********Callbacks*********/ 

  setOptions = (optionsState) =>{
    this.setState(optionsState);
    this.setState(calculateBudgetMonth);
    this.setState(calculateBudgetWeek);
    this.setState(calculateBudgetDay);
    this.setState({spendingWeek: 0,spendingDay: 0});
  }

  spend = (amount, unit) => {
    var amountRemaining;
    if(unit === "day"){
      amountRemaining = remaining(this.state.budgetDay, this.state.spendingDay);
      if(amount > amountRemaining) amount = amountRemaining;
      this.setState((state) => ({spendingMonth: state.spendingMonth + amount}));
      this.setState((state) => ({spendingWeek: state.spendingWeek + amount}));
      this.setState((state) => ({spendingDay: state.spendingDay + amount}));
    }else if (unit === "week") {
      amountRemaining = remaining(this.state.budgetWeek,this.state.spendingWeek);
      if(amount > amountRemaining) amount = amountRemaining;
      this.setState((state) => ({spendingMonth: state.spendingMonth + amount}));
      this.setState((state) => ({spendingWeek: state.spendingWeek + amount}));
      this.setState(calculateBudgetDay);
    }else if (unit === "month"){
      amountRemaining = remaining(this.state.budgetMonth, this.state.spendingMonth);
      if(amount > amountRemaining) amount = amountRemaining;
      this.setState((state) => ({spendingMonth: state.spendingMonth + amount}));
      this.setState(calculateBudgetWeek);
      this.setState(calculateBudgetDay);
    }
  }

  newDay(){
    if(daysLeftInMonth(this.state.targetDate) <= 0){
      this.setState((state) => ({
        savings: state.savings + remaining(state.budgetMonth, state.spendingMonth),
        spendingMonth: 0,
        spendingWeek: 0,
        spendingDay: 0,
        targetDate: firstDayOfMonth(),
        weeksLeft: weeksLeftInMonth(firstDayOfMonth())
      }));
      this.setState(calculateBudgetWeek);
      this.setState(calculateBudgetDay);
    }else if(weeksLeftInMonth(this.state.targetDate) < this.state.weeksLeft){
      this.setState({
        spendingDay: 0, 
        spendingWeek: 0,
        weeksLeft: weeksLeftInMonth(this.state.targetDate)
      });
      this.setState(calculateBudgetWeek);
      this.setState(calculateBudgetDay);
    }else{
      this.setState({
        spendingDay: 0
      });
      this.setState(calculateBudgetDay);
    }
    this.setState({previousDate: today()});
  }

  /************ Rendering ************/

  render(){
    return (
      <div>
        <Platform {...this.state} setOptions = {this.setOptions} spend = {this.spend}/>
      </div>
    );
  }
}
/***********END OF CLASS**************/

/**************Helper Functions**********/

function sum(total, num){
  return total+num;
}

function remaining(budget, spending){
  return spending > budget ? 0 : budget - spending;
}

function dateToString(date){
  return date.toISOString().substr(0, 10);
}

function today(){
  return dateToString(new Date());
}

function firstDayOfMonth(){
  var date = new Date();
  return dateToString(new Date(date.getFullYear(), date.getMonth() + 1, 1));
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

function calculateBudgetMonth(state){
  return {budgetMonth: state.income - state.bills};
}

function calculateBudgetWeek(state){
  return {budgetWeek: (state.budgetMonth - state.spendingMonth + state.spendingWeek) / weeksLeftInMonth(state.targetDate)};
}

function calculateBudgetDay(state){
  return {budgetDay: (state.budgetWeek - state.spendingWeek + state.spendingDay) / daysLeftInWeek(state.targetDate)};
}

export default App;
