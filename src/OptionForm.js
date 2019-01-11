
import React, { Component } from 'react';


class OptionForm extends Component {

  constructor(props){
    super(props); 
    this.state = {
      income:props.income,
      bills:props.bills,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let items = {};
    Object.keys(this.state).map(
    i => items[i] = this.state[i] || 0 );
    this.setState(items);
    this.props.set(items);
  }

  resetSpending = (e) => {
    this.props.reset();
  }

  handleInputChange = (e) => {
    const target = e.target;
    const value = target.type === "number" ? parseInt(target.value, 10) : target.value;
    const name = target.name;
    this.setState({[name]: value});
  }

  render() {
    return(
      <div className = "row justify-content-md-center">
        <div className = "col-md-auto text-left">
          <form onSubmit={this.handleSubmit}>
            <label>
              Income:
              <input 
                name="income"
                type="number" 
                value={!this.state.income&& this.state.income!== 0 ? '' : this.state.income}
                onChange={this.handleInputChange} />
            </label>
            <br />
            <label>
              Bills:
              <input 
                name="bills"
                type="number" 
                value={!this.state.bills && this.state.bills !== 0 ? '' : this.state.bills} 
                onChange={this.handleInputChange} />
            </label>
            <br />
            <input 
              type="submit" 
              value="Submit" 
              disabled = {(this.state.disabled)? "disabled" : ""}/>
          </form>
          
          <button onClick = {this.resetSpending}> Reset Spending </button>  
        </div> 
      </div>
    );
  }
}

export default OptionForm;

