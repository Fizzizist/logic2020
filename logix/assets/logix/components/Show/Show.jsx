import React, {Component} from 'react';

/**
 * React Component for the Show window of the Derivation.
 */
class Show extends Component {
  /**
   * Constructor for the Component.
   * @param {array} props - Array of state variables from parent Component.
   */
  constructor(props) {
    super(props);
  }

  /**
   * The final HTML render from the Component.
   * @return {string} HTML containing all of the Component's elements.
   */
  render() {
    return (
      <div>
        <p>Show {this.props.conclusion.getPremiseString()}</p>
      </div>
    );
  }
};

export default Show;
