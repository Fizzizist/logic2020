import React, {Component} from 'react';
import {Button, ButtonToolbar, Modal} from 'react-bootstrap';
import Rule from '../../classes/Rule';

// Might not end up using redux at all.
// import {connect} from 'react-redux';
// import {bindActionCreators} from 'redux';
// import {submitCommandAction, showSolved, newShow} from '../../actions';

/**
 * React Component for user input into the Derivation Component.
 */
class InputController extends Component {
  /**
   * Constructor for the Component.
   * @param {array} props - Array of state variables from parent Component.
   */
  constructor(props) {
    super(props);
    const mp = new Rule('MP');
    const dd = new Rule('DD');
    const cd = new Rule('CD');
    this.state = {
      premises: this.props.premises,
      conclusion: this.props.conclusion,
      availablePremises: this.props.premises,
      selectedPremises: [],
      linePremises: [],
      availableRules: [mp, dd, cd],
      selectedRules: [],
      buttons: [],
      inputString: '',
      submitToggle: false,
      errorMessage: '',
      lineNumber: 1,
      showShowMenuModal: false,
    };
    this.constructButtons = this.constructButtons.bind(this);
    this.selectPremise = this.selectPremise.bind(this);
    this.assumeCD = this.assumeCD.bind(this);
    this.submitCommand = this.submitCommand.bind(this);
    this.toggleShowMenu = this.toggleShowMenu.bind(this);
  }

  /**
   * Generates a button in the controller for each premise available to the
   * user.
   * @return {array} - Array of html button tags to be displayed in the
   * component.
   */
  constructButtons() {
    const buttons = [];

    // Add custom Show buttons
    const showButton = <Button onClick={this.toggleShowMenu}>Show</Button>;
    buttons.push(showButton);

    // Add buttons for Assume statements.
    if (this.state.conclusion.getType() === 'conditional' &&
        !this.state.conclusion.getAnteAssumed()) {
      const button = <Button onClick={
        this.assumeCD}>Assume CD</Button>;
      buttons.push(button);
    }
    // Add Premise buttons for each Premise available to the user.
    this.state.availablePremises.forEach(function(premise, _) {
      const button = <Button onClick={() => this.selectPremise(premise)
      }>{premise.getID()}</Button>;
      buttons.push(button);
    }.bind(this));

    // Generate buttons for Rules
    this.state.availableRules.forEach(function(rule, _) {
      if (this.state.selectedPremises.length === rule.getAllowedPremises()) {
        const button = <Button onClick={() =>this.selectRule(rule)
        }>{rule.getName()}</Button>;
        buttons.push(button);
      }
    }.bind(this));
    return buttons;
  }

  /**
   * on-click function for Assume CD button that allows the user to assume
   * the antecedent to the conditional conclusion.
   */
  assumeCD() {
    this.setState((state) => ({
      selectedPremises: [...state.selectedPremises,
        state.conclusion.getAntecedent()],
      inputString: state.inputString.concat('Ass CD'),
      submitToggle: true,
    }));
    this.state.conclusion.toggleAnteAssumed();
  }

  /**
   * When a premise is clicked, it needs to be added to selectedPremises in
   * state.
   * @param {Premise} premise - The ID of the premise being selected.
   */
  selectPremise(premise) {
    this.setState((state) => ({
      selectedPremises: [...state.selectedPremises, premise],
      availablePremises: state.availablePremises.filter(
          (p) => p.getID() !== premise.getID()),
      inputString: state.inputString.concat(' ', premise.getID()),
    }));
  }

  /**
   * On-click function for selecting a rule.
   * @param {Rule} rule - Rule object being selected.
   */
  selectRule(rule) {
    let newRule;
    if (rule.getName() === 'DD') {
      newRule = new Rule(
          rule.getName(),
          this.state.selectedPremises[0],
          this.state.conclusion,
      );
    } else if (rule.getName() === 'CD') {
      newRule = new Rule(
          rule.getName(),
          this.state.selectedPremises[0],
          this.state.conclusion.getConsequent(),
          this.state.conclusion
      );
    } else if (rule.getAllowedPremises() === 2) {
      newRule = new Rule(
          rule.getName(),
          this.state.selectedPremises[0],
          this.state.selectedPremises[1]
      );
    } else if (rule.getAllowedPremises() === 1) {
      newRule = new Rule(
          rule.getName(),
          this.state.selectedPremises[0]
      );
    }

    const newPremise = newRule.getResultingPremise();
    if (typeof newPremise === 'string') {
      this.setState((state) => ({
        availablePremises: this.props.premises.concat(
            state.linePremises),
        selectedPremises: [],
        inputString: '',
        errorMessage: newPremise,
      }));
    } else {
      const newDeepCopy = Object.assign(Object.create( Object.getPrototypeOf(
          newPremise)), newPremise);
      this.setState((state) => ({
        selectedPremises: [newDeepCopy],
        selectedRules: [...state.selectedRules, newRule],
        inputString: state.inputString.concat(' ', rule.getName()),
        submitToggle: true,
      }));
    }
  }

  /**
   * On-click function for the submit button that takes the resulting premise
   * and pushes it into the redux state.
   */
  submitCommand() {
    if (this.state.selectedPremises.length === 1) {
      this.state.selectedPremises[0].setID(this.state.lineNumber.toString());
      this.state.selectedPremises[0].setCommandText(this.state.inputString);
      this.props.submitCommand(this.state.selectedPremises[0]);
      this.setState((state) => ({
        inputString: '',
        submitToggle: false,
        availablePremises: this.props.premises.concat(
            state.linePremises).concat(
            state.selectedPremises),
        selectedPremises: [],
        linePremises: [...state.linePremises, state.selectedPremises[0]],
        lineNumber: state.lineNumber + 1,
      }));
    }
  }

  /**
   * Toggle for Show Modal that pops up to make a custom Show.
   */
  toggleShowMenu() {
    if (this.state.showShowMenuModal) {
      this.setState((state) => ({
        showShowMenuModal: false,
      }));
    } else {
      this.setState((state) => ({
        showShowMenuModal: true,
      }));
    }
  }

  /**
   * The final HTML render from the Component.
   * @return {string} HTML containing all of the Component's elements.
   */
  render() {
    const buttons = this.constructButtons();
    // const showMenuButtons = this.constructShowMenuButtons();
    return (
      <div>
        <ButtonToolbar>
          {buttons}
        </ButtonToolbar>

        <Modal size='sm' show={this.state.showShowMenuModal} onHide={
          this.toggleShowMenu
        }>
          <Modal.Header>
            <Modal.Title>{this.customShowContent}
              <Button type="submit" onClick={() =>
                this.props.newShow(this.customShowContent)}>Submit</Button>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>#Menu Buttons</Modal.Body>
        </Modal>

        <p>Command: {this.state.inputString}</p>
        {this.state.submitToggle &&
        <Button type='button' onClick={
          this.submitCommand}>Submit Command</Button>}
        <p>**{this.state.errorMessage}**</p>
      </div>
    );
  }
}

// Might not end up using Redux.

// /**
//  * Function to map the redux actions to props.
//  * @param {dict} dispatch - redux dispatcher
//  * @return {dict} - bound action creators.
//  */
// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({
//     submitCommandAction,
//     showSolved,
//     newShow,
//   },
//   dispatch);
// }

// export default connect(null, mapDispatchToProps)(InputController);
export default InputController;
