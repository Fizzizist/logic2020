import React, {Component} from 'react';
import InputController from '../InputController';
import {Table} from 'react-bootstrap';
import uniqid from 'uniqid';

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
      displayDict: {
        lines: [<tr key={uniqid()}><td>{
          this.props.lastNumber}</td><td>Show {
          this.props.conclusion.premiseString}</td><td></td></tr>],
      },
      childShow: false,
      outerPremises: this.props.outerPremises,
      linePremises: [],
      solved: false,
      lineNumber: this.props.lastNumber + 1,
      ownLineNumber: this.props.lastNumber,
      errorMessage: '',
    };
    this.submitCommandCallback = this.submitCommandCallback.bind(this);
    this.newShow = this.newShow.bind(this);
    this.constructLines = this.constructLines.bind(this);
    this.solvedCallback = this.solvedCallback.bind(this);
    this.checkSolved = this.checkSolved.bind(this);
  }

  /**
   * In-built component method for after render.
   * @param {dict} prevProps - props from previous state.
   * @param {dict} prevState - previous state.
   */
  componentDidUpdate(prevProps, prevState) {
    if (prevState.errorMessage !== '') {
      this.setState({errorMessage: ''});
    }
  }

  /**
   * Callback function for InputController to submit a command to the main show
   * window.
   * @param {Premise} premise - Premise being passed out of the controller.
   */
  submitCommandCallback(premise) {
    const newElement = <tr key={uniqid()}><td>{
      this.state.lineNumber}</td><td>{
      premise.premiseString}</td><td>{premise.commandText}</td></tr>;
    this.setState(
        {
          displayDict: {
            lines: [...this.state.displayDict.lines, newElement],
          },
          linePremises: [...this.state.linePremises, premise],
          lineNumber: this.state.lineNumber + 1,
        },
        () => this.checkSolved(premise)
    );
  }

  /**
   * Callback function for set state in submitCommandCallback.
   * @param {Premise} premise - resulting premise.
   */
  checkSolved(premise) {
    if (premise.equalsPremise(this.props.conclusion)) {
      const newLineNumber = parseInt(premise.id);
      premise.id = this.state.ownLineNumber.toString();
      const newElement = <tr key={uniqid()}><td>{
        this.state.ownLineNumber}</td><td><strike>Show</strike> {
        premise.premiseString}</td><td></td></tr>;
      this.setState(
          {
            displayDict: {
              lines: [
                newElement,
                ...this.state.displayDict.lines.slice(1),
              ],
            },
            solved: true,
          },
          () => this.props.solved(
              premise,
              this.state.displayDict,
              newLineNumber)
      );
    }
  }

  /**
   * callback function to instantiate a new child Show for this show.
   * @param {Premise} customPremise - The Premise to show from the new Show.
   */
  newShow(customPremise) {
    if (typeof customPremise === 'string') {
      this.setState({
        errorMessage: customPremise,
      });
    } else {
      this.setState((state) => ({
        childShow: true,
        childConclusion: customPremise,
        errorMessage: '',
      }));
    }
  }

  /**
   * Callback function to pass into child Show that gets triggered when that
   * show is solved.
   * @param {Premise} solvedConclusion - conclusion that got solved.
   * @param {dict} displayD - line dictionary from child show.
   * @param {number} newLineNumber - to update line number properly
   */
  solvedCallback(solvedConclusion, displayD, newLineNumber) {
    this.setState((state) => ({
      displayDict: {
        lines: [...state.displayDict.lines, displayD.lines],
      },
      linePremises: [...state.linePremises, solvedConclusion],
      lineNumber: newLineNumber + 1,
      childShow: false,
    }));
  }

  // This function should be changed when we distinguish the styling among
  // nested show boxes.
  /**
   * Function for constructing lines to be displays with this show.
   * @param {Array} linesArr - nested array of elements.
   * @return {Array} - array of html elements.
   */
  constructLines(linesArr) {
    const lines = [];
    lines.push(linesArr[0]);
    linesArr.slice(1).forEach(function(line, _) {
      if (line instanceof Array) {
        const linesTable = this.constructLines(line);
        lines.push(<tr key={uniqid()}><td colSpan="3">{
          linesTable}</td></tr>);
      } else {
        lines.push(line);
      }
    }.bind(this));
    const table = <Table striped bordered hover>
      <tbody id={`show-table-${this.state.ownLineNumber}`}>
        {lines}
      </tbody>
    </Table>;
    return table;
  }

  /**
   * The final HTML render from the Component.
   * @return {string} HTML containing all of the Component's elements.
   */
  render() {
    const linesTable = this.constructLines(this.state.displayDict.lines);
    let inputDisplay = {display: 'none'};
    if (!this.state.solved && !this.state.childShow) {
      inputDisplay = {display: 'inline'};
    }
    return (
      <div>
        {linesTable}
        {this.state.childShow &&
        <Show premises={this.props.premises}
          conclusion={this.state.childConclusion}
          lastNumber={this.state.lineNumber}
          outerPremises={this.state.linePremises.concat(
              this.state.outerPremises)}
          solved={this.solvedCallback}/>
        }
        <div style={inputDisplay}>
          <InputController
            premises={this.props.premises}
            conclusion={this.props.conclusion}
            submitCommand={this.submitCommandCallback}
            newShow={this.newShow}
            lineNumber={this.state.lineNumber}
            outerPremises={this.state.outerPremises}
            innerPremises={this.state.linePremises}/>
        </div>
        <p style={{color: 'red'}}>{this.state.errorMessage}</p>
      </div>
    );
  }
}

export default Show;
