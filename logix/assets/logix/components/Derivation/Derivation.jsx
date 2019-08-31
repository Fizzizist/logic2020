import React, {Component} from 'react';
import Show from '../Show';
import {Button} from 'react-bootstrap';
import InputController from '../InputController';
import Premise from '../../classes/Premise';

// Might not end up using redux.
// import {newShow} from '../../actions/index';
// import {connect} from 'react-redux';
// import {bindActionCreators} from 'redux';

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
    const premiseA = new Premise({type: 'atomic', premise1: 'A'});
    const premiseB = new Premise({type: 'atomic', premise1: 'B'});
    const premiseC = new Premise({type: 'atomic', premise1: 'C'});
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
      returnString = returnString + `${premise.getID()}: ` +
      `${premise.getPremiseString()} `;
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
    return (
      <div>
        <p>{this.getDerivationPremiseString()} &there4; {
          this.state.conclusion.getPremiseString()}</p>
        {this.state.showing &&
          <React.Fragment>
            <Show conclusion={this.state.conclusion}
              inputPremises={this.props.inputPremises}
              premises={this.state.premises}
              solved={this.solvedCallback}/>
          </React.Fragment>
        }
        {!this.state.showing &&
          !this.state.solved &&
          <Button type="button" onClick={this.showC}>Show Conc</Button>
        }
        {this.state.solved &&
          <p>You solved it!</p>
        }
      </div>
    );
  }
}

// Might not actually have to use Redux at all.

// /**
//  * Function to map the redux state to the local props.
//  * @param {dict} state - The input redux state.
//  * @return {dict} - props to be mapped.
//  */
// const mapStateToProps = (state) => {
//   return {
//     inputPremises: state.inputPremises,
//     solved: state.shows[0].solved,
//   };
// };

// /**
//  * Function to map actions to the redux state.
//  * @param {dict} dispatch
//  * @return {dict}
//  */
// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//       {
//         newShow,
//       },
//       dispatch);
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Derivation);
export default Derivation;
