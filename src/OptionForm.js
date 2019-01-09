
import React, { Component } from 'react';


class OptionForm extends Component {

  constructor(props){
    super(props); 
    this.state = {
      income:props.income,
      bills:props.bills,
      visible:true
    };
  }

  componentDidMount = () => {
    this.hydrateStateWithLocalStorage();
  } 

  hydrateStateWithLocalStorage = () =>{
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

  switchVisible = (e) => {
    e.preventDefault();
    this.setState((state) => ({
      visible:!this.state.visible
    }));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.callback(this.state);
  }

  handleInputChange = (e) => {
    const target = e.target;
    const value = target.type === "number" ? parseInt(target.value, 10) : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return(
      <div>
        {this.state.visible && 
          <form onSubmit={this.handleSubmit}>
            <label>
              Income:
              <input 
                name="income"
                type="number" 
                value={this.state.income} 
                onChange={this.handleInputChange} />
            </label>
            <br />
            <label>
              Bills:
              <input 
                name="bills"
                type="number" 
                value={this.state.bills} 
                onChange={this.handleInputChange} />
            </label>
            <br />
            <input 
              type="submit" 
              value="Submit" 
              disabled = {(this.state.disabled)? "disabled" : ""}/>
          </form>
        }
      </div>
    );
  }
}

export default OptionForm;

