import React, {Component} from 'react';
import Derivation from './Derivation';

/**
 * React component for the main App window.
 */
class App extends Component {
  /**
   * The final HTML render from the Component.
   * @return {string} HTML containing all of the Component's elements.
   */
  render() {
    return (
      <div>
        <h1>Logic 2020 - Alpha v0.0.1</h1>
        <p>Can you solve the following derivation?</p>
        <Derivation />
      </div>
    );
  }
}

export default App;
