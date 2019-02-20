import React, { Component } from 'react'

class WithMouse extends Component {
  state = {
    x: 0,
    y: 0,
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    })
  }

  render() {
    this.props.render(this.state)
  }
}

const App = props => (
  <div style={{height: '100%'}}>
    <WithMouse render={mouse => (
      <h1>The mouse position is ({mouse.x}, {mouse.y})</h1>
    )/>
  </div>
)

export default App
