import React, { Component } from 'react';

class SampleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { count: props.initialCount };
    this.tick = this.tick.bind(this);
  }

  tick() {
    this.setState({ count: ++this.state.count });
  }

  render() {
    return (
      <div className="component">
        <h2 className="heading">Sample Component</h2>

        <div>
          <button onClick={this.tick}>Click</button>
          <p>Clicks: {this.state.count}</p>
        </div>
      </div>
    );
  }
}

SampleComponent.defaultProps = {
  initialCount: 0
};

export default SampleComponent;
