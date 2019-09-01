import React, {Component} from 'react';
import InputController from '../InputController';

/**
 * React component that displays the output of a particular Show.
 * @param {dict} props - dict of props passed in by Derivation component.
 * @return {html} - returns html to be displayed.
 */
class Show extends Component {
  /**
   * Constructor to the Show component.
   * @param {dict} props - dict passed in from parant Show or Derivation.
   */
  constructor(props) {
    super(props);
    this.props.conclusion.id = this.props.lastNumber.toString();
    this.state = {
      childShow: false,
      outerPremises: this.props.outerPremises,
      linePremises: [],
      solved: false,
      lineNumber: this.props.lastNumber + 1,
    };
    this.constructLines = this.constructLines.bind(this);
    this.submitCommandCallback = this.submitCommandCallback.bind(this);
    this.newShow = this.newShow.bind(this);
  }

  /**
   * Function for constructing the lines to be displayed.
   * @return {string} - HTML for lines and show statement.
   */
  constructLines() {
    const lines = [];
    let showStatement;
    if (this.state.linePremises.length > 0) {
      this.state.linePremises.forEach((premise, _) => {
        lines.push(
            <p>{premise.id}: {premise.commandText} {
              premise.premiseString}</p>
        );
      });
    }

    // Construct show statement.
    if (this.state.solved) {
      showStatement = <p>{this.props.conclusion.id}: <strike>Show</strike> {
        this.props.conclusion.premiseString}</p>;
    } else {
      showStatement = <p>{this.props.conclusion.id}: Show {
        this.props.conclusion.premiseString}</p>;
    }

    // Add show statement to the front.
    lines.unshift(showStatement);

    return lines;
  }

  /**
   * Callback function for InputController to submit a command to the main show
   * window.
   * @param {Premise} premise - Premise being passed out of the controller.
   */
  submitCommandCallback(premise) {
    if (premise.equalsPremise(this.props.conclusion)) {
      this.props.solved();
      this.setState((state) => ({
        solved: true,
      }));
    }
    this.setState((state) => ({
      linePremises: [...state.linePremises, premise],
      lineNumber: state.lineNumber + 1,
    }));
  }

  /**
   * callback function to instantiate a new child Show for this show.
   * @param {Premise} customPremise - The Premise to show from the new Show.
   */
  newShow(customPremise) {
    this.setState((state) => ({
      childShow: true,
      childConclusion: customPremise,
    }));
  }

  /**
   * The final HTML render from the Component.
   * @return {string} HTML containing all of the Component's elements.
   */
  render() {
    const lines = this.constructLines();
    return (
      <div>
        {lines}
        {!this.state.solved &&
          !this.state.childShow &&
        <InputController premises={this.props.premises}
          conclusion={this.props.conclusion}
          submitCommand={this.submitCommandCallback}
          newShow={this.newShow}
          lineNumber={this.state.lineNumber}
          linePremises={this.state.outerPremises}/>
        }
        {this.state.childShow &&
        <Show premises={this.props.premises}
          conclusion={this.state.childConclusion}
          lastNumber={this.state.lineNumber}
          outerPremises={this.state.linePremises}/>
        }
      </div>
    );
  }
}

export default Show;
