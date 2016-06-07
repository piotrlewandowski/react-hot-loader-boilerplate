import React, { Component, PropTypes } from 'react';

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
      <div>
        <h2>Sample Component</h2>

        <div>
          <button onClick={this.tick}>Click</button>
          <p>Clicks: {this.state.count}</p>
        </div>
      </div>
    );
  }
}

SampleComponent.propTypes = {
  initialCount: React.PropTypes.number
};

SampleComponent.defaultProps = {
  initialCount: 0
};

export default SampleComponent;
