import React, { Component } from 'react';
import './App.css';

class Light {
  constructor () {
    this.hue = 0;
    this.lit = false;
  }

  get color () {
    return this.hue;
  }

  set color (command) {
    if (command === "f") this.hue += 30;
    else if (command === "b") this.hue -= 30;
    else if (!Number.isNaN(command)) this.hue = 360 % (this.hue + command);
    else console.log ('invalid color command')
  }

  get light () {
    return this.lit;
  }

  set light (on) {
    this.lit = !!on;
  }
}

function ResetButton (props) {
  return <div className="reset-button" onClick={props.click}>{props.text}</div>
}

function Bulb (props) {
  let on = props.light.light ? '50' : '0';
  let divStyle = {
    background: 'hsl(' + props.light.color + ', 100%, ' + on + '%)'
  }

  return <div className="bulb" style={divStyle} onClick={props.handleClick}></div>
}

function Picture (props) {

  function recursivelyCreateBulbs (index = 0, bulbArr = []) {
    for (let i = 0; i < props.lights.length; i++) {
      bulbArr.push(<Bulb key={i} light={props.lights[i]} handleClick={x => props.handleClick(i)}/>);
    }
    return bulbArr;
    /*if (props.lights.length === index) return bulbArr;
    bulbArr.push(<Bulb key={index} color={props.lights[index].color} handleClick={x => props.handleClick(index)}/>);
    recursivelyCreateBulbs(++index, bulbArr);*/
  }
  
  return <div id="board">{recursivelyCreateBulbs()}</div>
}

class App extends Component {
  constructor(props) {
    super (props);
    this.state = {
      clicking: false,
      recentClick: undefined,
      lastClicked: undefined,
      lights: Array(100).fill().map(x => new Light())
    }

    this.resetColor = this.resetColor.bind(this);
    this.resetAll = this.resetAll.bind(this);
  }

  handleClick (index) {
    let lights = [...this.state.lights];
    let current = lights[index];
    let recentClick = this.state.recentClick;
    let timeout;

    if (recentClick === index) current.light = false;
    else {
      if (current.light) current.color = "f";
      else current.light = true;
      timeout = setTimeout(() => this.setState({ recentClick: undefined }), 500);
    }

    clearTimeout(this.state.timeout);
    
    this.setState({
      lights: lights,
      lastClicked: recentClick === index ? undefined : index,
      recentClick: recentClick === index ? undefined : index,
      timeout: timeout
    })
  }

  changeClicking () {
    this.setState({
      clicking: !this.state.clicking
    })
  }

  resetColor () {
    let lights = [...this.state.lights];
    let last = lights[this.state.lastClicked];
    last.color = "b";
    last.light = false;

    this.setState({
      lights: lights
    })
  }

  resetAll () {
    let originalLights = [...this.state.lights]
    function resetRecursion (index = 0, lights = originalLights) {
      if (index === lights.length) return lights;
      else {
        lights[index].light = false;
        lights[index].color = 0;
        resetRecursion(++index,lights);
      }
    }

    this.setState({
      lights: resetRecursion(),
      lastClicked: undefined
    })
  }

  render () {
    return (
      <div id="app">
        <div id="buttons">
          <ResetButton text="Reset Color" click={this.resetColor}/>
          <ResetButton text="Reset All" click={this.resetAll}/>
        </div>
        <Picture lights={this.state.lights} onMouseDown={this.changeClicking} onMouseUp={this.changeClicking} handleClick={x => this.handleClick(x)}/>
      </div>
      )
  }



}

export default App;
