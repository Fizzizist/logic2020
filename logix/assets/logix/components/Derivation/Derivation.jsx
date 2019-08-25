import React, {Component} from 'react';
import Show from '../Show';
import InputController from '../InputController';
import Premise from '../../classes/Premise';
import {newShow} from '../../actions/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

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
    };
    this.showC = this.showC.bind(this);
    this.getDerivationPremiseString =
    this.getDerivationPremiseString.bind(this);
  }

  /**
   * Toggles the show box for showing the conclusion.
   */
  showC() {
    this.props.newShow();
    this.setState({showing: true});
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
              premises={this.props.inputPremises}/>
            <InputController premises={this.state.premises}
              conclusion={this.state.conclusion}/>
          </React.Fragment>
        }
        {!this.state.showing &&
          <button type="button" onClick={this.showC}>Show Conc</button>
        }
      </div>
    );
  }
}

/**
 * Function to map the redux state to the local props.
 * @param {dict} state - The input redux state.
 * @return {dict} - props to be mapped.
 */
const mapStateToProps = (state) => {
  return {
    inputPremises: state.inputPremises,
  };
};

/**
 * Function to map actions to the redux state.
 * @param {dict} dispatch
 * @return {dict}
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
      {
        newShow,
      },
      dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Derivation);
