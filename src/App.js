import React, { Component } from 'react';
import './App.css';
import {DropdownButton, Glyphicon, MenuItem, Radio, Button, ButtonGroup, ButtonToolbar, FormGroup} from 'react-bootstrap'

//ensure app can work on touch screen as well 
//Add Redux
    //Undo
    //Redo

class Light {
    constructor() {
        this.hue = 330;
        this.lit = false;
    }

    get color() {
        return this.hue;
    }

    set color(command) {
        if (command === "f") this.hue = (this.hue + 30) % 360;
        else if (command === "b") this.hue = (this.hue - 30) % 360;
        else if (!Number.isNaN(command)) this.hue = command;
        else console.log('invalid color command')
    }

    get light() {
        return this.lit;
    }

    set light(on) {
        this.lit = !!on;
    }
}

function ResetButton(props) {
    return 
}

function Bulb(props) {
    let on = props.light.light ? '50' : '0';
    let divStyle = {
        background: 'hsl(' + props.light.color + ', 100%, ' + on + '%)'
    }

    return <div className="bulb" style={divStyle} onClick={props.handleClick} onMouseEnter={props.handleSlide}/>
}

function Picture(props) {
    function recursivelyCreateBulbs(index = 0, bulbArr = []) {
        for (let i = 0; i < props.lights.length; i++) {
            bulbArr.push(<Bulb key={i} light={props.lights[i]} changeClicking={props.changeClicking} handleClick={x => props.handleClick(i)} handleSlide={x => props.handleSlide(i)} />);
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
        super(props);
        this.initBoardSize = 70;
        this.state = {
            sensitivity: 250,
            clicking: false,
            recentClick: undefined,
            lastClicked: undefined,
            lights: Array(Math.pow(this.initBoardSize, 2)).fill().map(x => new Light())
        }

        this.resetColor = this.resetColor.bind(this);
        this.resetAll = this.resetAll.bind(this);
        this.changeClicking = this.changeClicking.bind(this);
    }

    handleClick(index, clr) {
        console.log(this.state.lastColor)
        let lights = [...this.state.lights];
        let current = lights[index];
        let recentClick = this.state.recentClick;
        let timeout;

        if (recentClick === index && current.light) {
            current.color = 330;
            current.light = false;
        }
        else {
            if (this.state.clicking) current.color = clr;
            else if (current.light) current.color = "f";
            else current.color = this.state.lastColor || 0;
            current.light = true;
            timeout = setTimeout(() => this.setState({ recentClick: undefined }), this.state.sensitivity);
        }

        clearTimeout(this.state.timeout);

        this.setState({
            lights: lights,
            lastClicked: recentClick === index ? undefined : index,
            recentClick: recentClick === index ? undefined : index,
            timeout: timeout,
            lastColor: clr || current.color
        })
    }

    handleSlide(index) {
        //console.log(this.state.clicking);
        if (this.state.clicking) this.handleClick(index, this.state.lastColor);
    }

    changeClicking() {
        this.setState({
            clicking: !this.state.clicking
        })
    }

    resetColor() {
        let lights = [...this.state.lights];
        let last = lights[this.state.lastClicked];
        last.color = "b";
        //last.light = false;

        this.setState({
            lights: lights,
            lastColor: last.color
        })
    }

    resetAll() {
        let lights = [...this.state.lights]

        for (let i = 0; i < lights.length; i++) {
            lights[i].light = false;
            lights[i].color = 330;
        }

        this.setState({
            lights: lights,
            lastClicked: undefined,
            lastColor: undefined
        })
    }

    changeSize (size) {
        document.documentElement.style.setProperty('--cell-width', 'calc(var(--board-width)/' + size + ')')
        this.setState({
            lastColor: undefined,
            clicking: false,
            recentClick: undefined,
            lastClicked: undefined,
            lights: Array(Math.pow(size, 2)).fill().map(x => new Light())
        })
    }

    changeSensitivity (speed) {
        this.setState({ sensitivity : speed })
    }

    componentDidMount () {
        document.addEventListener("mousedown", this.changeClicking);
        document.addEventListener("mouseup", this.changeClicking);
    }

    render() {
        return (
            <div id="app">
                <ButtonToolbar id="buttons">
                    <ButtonGroup>
                      <Button onClick={this.resetColor}>Reset Color</Button>
                      <Button bsStyle="danger" onClick={this.resetAll}>Reset All</Button>
                      <DropdownButton title="Size" pullRight noCaret id="size">
                        <MenuItem onClick={() => this.changeSize(10)}>10x10</MenuItem>
                        <MenuItem onClick={() => this.changeSize(20)}>20x20</MenuItem>
                        <MenuItem onClick={() => this.changeSize(30)}>30x30</MenuItem>
                        <MenuItem onClick={() => this.changeSize(40)}>40x40</MenuItem>
                        <MenuItem onClick={() => this.changeSize(50)}>50x50</MenuItem>
                        <MenuItem onClick={() => this.changeSize(60)}>60x60</MenuItem>
                        <MenuItem onClick={() => this.changeSize(70)}>70x70</MenuItem>
                      </DropdownButton>
                      <DropdownButton title="Sensitivity" pullRight noCaret id="sensitivity">
                        <MenuItem onClick={() => this.changeSensitivity(500)}>Low</MenuItem>
                        <MenuItem onClick={() => this.changeSensitivity(250)}>Normal</MenuItem>
                        <MenuItem onClick={() => this.changeSensitivity(100)}>High</MenuItem>
                      </DropdownButton>
                    </ButtonGroup>
                </ButtonToolbar>
                <Picture 
                lights={this.state.lights} 
                changeClicking={this.changeClicking} 
                handleClick={x => this.handleClick(x)}
                handleSlide={x => this.handleSlide(x)}
                />
             </div>
        )
    }



}

export default App;