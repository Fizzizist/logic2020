import React, {Component} from 'react';
import Show from '../Show';
import {Button} from 'react-bootstrap';
import InputController from '../InputController';
import Premise from '../../classes/Premise';

/**
 * React Component for the Derivation. This is basically a container for the
 * Show and InputController Components.
 */
class Derivation extends Component {
  /**
   * Constructor for the Component.
   * @param {array} props - Array of state variables from parent Component.
   */
  constructor(props) {
    super(props);
    const premiseA = new Premise({type: 'atomic', premise1: 'P'});
    const premiseB = new Premise({type: 'atomic', premise1: 'Q'});
    const premiseC = new Premise({type: 'atomic', premise1: 'R'});
    const premiseAB = new Premise({
      type: 'conditional',
      premise1: premiseA,
      premise2: premiseB,
      id: 'PR1',
    });
    const premiseBC = new Premise({
      type: 'conditional',
      premise1: premiseB,
      premise2: premiseC,
      id: 'PR2',
    });
    const conc = new Premise({
      type: 'conditional',
      premise1: premiseA,
      premise2: premiseC,
      id: 'C',
    });
    this.state = {
      showing: false,
      premises: [
        premiseAB,
        premiseBC,
      ],
      conclusion: conc,
      solved: false,
    };
    this.showC = this.showC.bind(this);
    this.getDerivationPremiseString =
    this.getDerivationPremiseString.bind(this);
    this.solvedCallback = this.solvedCallback.bind(this);
  }

  /**
   * Toggles the show box for showing the conclusion.
   */
  showC() {
    this.setState((state) => ({
      showing: true,
    }));
  }

  /**
   * Function to concatenate all of the Premise strings into one for display.
   * @return {string} - String containing the premise' text.
   */
  getDerivationPremiseString() {
    let returnString = '';
    this.state.premises.forEach(function(premise, index) {
      returnString = returnString + `${premise.id}: ` +
      `${premise.premiseString} `;
    });
    return returnString;
  }

  /**
   * Callback function to Show for when the derivation is finally solved.
   */
  solvedCallback() {
    this.setState({solved: true});
  }

  /**
   * The final HTML render from the Component.
   * @return {string} HTML containing all of the Component's elements.
   */
  render() {
    let derColor = {color: 'black'};
    if (this.state.solved) {
      derColor = {color: 'green'};
    }
    return (
      <div>
        <p style={derColor}>{this.getDerivationPremiseString()} &there4; {
          this.state.conclusion.premiseString}</p>
        {this.state.showing &&
          <React.Fragment>
            <Show lastNumber={1}
              conclusion={this.state.conclusion}
              premises={this.state.premises}
              solved={this.solvedCallback}
              outerPremises={[]}/>
          </React.Fragment>
        }
        {!this.state.showing &&
          !this.state.solved &&
          <Button type="button" onClick={this.showC}>Show Conc</Button>
        }
        {this.state.solved &&
          <p style={{color: 'green'}}>You solved it!</p>
        }
      </div>
    );
  }
}

export default Derivation;
