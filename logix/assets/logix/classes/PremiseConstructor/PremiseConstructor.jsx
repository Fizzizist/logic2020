import React from 'react';
import {Button} from 'react-bootstrap';
import Premise from '../Premise';
import uniqid from 'uniqid';

/**
 * Class for constructing custom premises which can be used for showing or
 * creating custom arguments.
 */
class PremiseConstructor {
  /**
   * Constructor for the PremiseConstructor class.
   * @param {function} updateCallback - Callback function to update the calling
   * component.
   */
  constructor(updateCallback) {
    this.premise = null;
    this.premiseString = '';
    this.buttons = [];
    this.atomicsArray = ['P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    this.joiningSymbols = ['↔', '→', 'v', '^'];
    this.negationSymbol = '~';
    this.bracketSymbols = ['(', ')'];
    this.constructButtons();
    this.updateCallback = updateCallback;
  }

  /**
   * Getter for buttons property
   * @return {Array} - Array of HTML Buttons.
   */
  get buttons() {
    return this._buttons;
  }

  /**
   * Getter for resulting string as its being constructed.
   * @return {Array} - Array of HTML Buttons.
   */
  get premiseString() {
    return this._premiseString;
  }

  /**
   * Getter that resolves the premiseString into an actual Premise object using
   * the string Parser.
   */
  get resultingPremise() {
    return this.makeCustomPremise(this.premiseString);
  }

  /**
   * Setter for buttons property
   * @param {Array} value - Array of HTML buttons or nothing.
   */
  set buttons(value) {
    this._buttons = value;
  }

  /**
   * Setter for premiseString property
   * @param {string} value - representing the premiseString.
   */
  set premiseString(value) {
    this._premiseString = value;
  }

  // TODO: Add in more logic to these add symbol functions such that the user
  // cannot make a mistake in constructing the premise.

  /**
   * Function for adding an Atomic to the premise string.
   * @param {string} atomicStr - String representing the atomic symbol.
   */
  addAtomic(atomicStr) {
    this.premiseString = this.premiseString.concat(atomicStr);
    this.updateCallback();
  }

  /**
   * Function for adding a joining symbol to the premise string.
   * @param {string} symbol - String representing the atomic symbol.
   */
  addJoiningSymbol(symbol) {
    this.premiseString = this.premiseString.concat(symbol);
    this.updateCallback();
  }

  /**
   * Function for adding a negation symbol to the premise string.
   */
  addNegation() {
    this.premiseString = this.premiseString.concat('~');
    this.updateCallback();
  }

  /**
   * Function for adding a bracket symbol to the premise string.
   * @param {string} symbol - String representing the atomic symbol.
   */
  addBracketSymbol(symbol) {
    this.premiseString = this.premiseString.concat(symbol);
    this.updateCallback();
  }

  /**
   * Function to construct a series of buttons for the user to use to construct
   * a premise.
   */
  constructButtons() {
    // construct atomic buttons
    this.atomicsArray.forEach(function(atomicStr, i) {
      const button = <Button key={uniqid()} onClick={() =>
        this.addAtomic(atomicStr)}>{atomicStr}</Button>;
      this.buttons.push(button);
    }.bind(this));

    // construct joining symbol buttons.
    this.joiningSymbols.forEach(function(symbol, i) {
      const button = <Button key={uniqid()} onClick={() =>
        this.addJoiningSymbol(symbol)}>{symbol}</Button>;
      this.buttons.push(button);
    }.bind(this));

    // construct negations button
    const button = <Button key={uniqid()} onClick={
      this.addNegation}>{this.negationSymbol}</Button>;
    this.buttons.push(button);

    // construct bracket symbol buttons.
    this.bracketSymbols.forEach(function(symbol, i) {
      const button = <Button key={uniqid()} onClick={() =>
        this.addBracketSymbol(symbol)}>{symbol}</Button>;
      this.buttons.push(button);
    }.bind(this));
  }

  /**
   * String parsing algorithm to make Premise out of a string.
   * This function was adapted from Logic 2018 so it could use a cleanup.
   * It can probably be broken up into several functions.
   * @param {string} inputString - The string to parse.
   * @return {Premise} - Resulting Premise object.
   */
  makeCustomPremise(inputString) {
    let objectString = [];
    let count = 0;
    let unbracketed = '';
    let newPremise;

    // Deal with the case that the input string is just a single letter.
    if (inputString.length === 1 && this.atomicsArray.includes(inputString)) {
      newPremise = new Premise({type: 'atomic', premise1: inputString});
      return newPremise;

    // Deal with the constructing inside of brackets.
    } else if (inputString.includes('(')) {
      let _object = '';
      const inputStringArr = inputString.split('');
      inputStringArr.forEach(function(inputChar, _) {
        if (inputChar === ')' && count === 1) {
          objectString.push(_object);
          _object = '';
          count--;
          unbracketed = unbracketed.concat(inputChar);
        } else if (count > 0 && inputChar === ')') {
          count --;
          _object = _object.concat(inputChar);
        } else if (inputChar === '(' && count === 0) {
          unbracketed = unbracketed.concat(inputChar);
          count++;
        } else if (count > 0 && inputChar === '(') {
          count++;
          _object = _object.concat(inputChar);
        } else if (count > 0) {
          _object = _object.concat(inputChar);
        } else if (count === 0) {
          unbracketed = unbracketed.concat(inputChar);
        }
      });
      // If the premise is just wrapped in brackets, run this function again
      // with the brackets stripped off.
      if (unbracketed === '()') {
        return this.makeCustomPremise(objectString[0]);
      }

      // Construct each joined Premise by priority '↔' > '→' > 'v' > '^'
      for (let i = 0; i < this.joiningSymbols.length; i++) {
        if (unbracketed.includes(this.joiningSymbols[i])) {
          const tempObjectString = this.constructObjectString(
              inputString, unbracketed, objectString, this.joiningSymbols[i]);
          objectString = [];
          objectString.push(tempObjectString[0]);
          objectString.push(tempObjectString[1]);
          break;
        }
      };

    // The simple case with no brackets.
    } else {
      let tokens = [];
      for (let i = 0; i < this.joiningSymbols.length; i++) {
        if (inputString.includes(this.joiningSymbols[i])) {
          tokens = inputString.split(this.joiningSymbols[i]);
          objectString.push(tokens[0]);
          objectString.push(tokens[1]);
          unbracketed = this.joiningSymbols[i];
          break;
        }
      }
      if (tokens.length === 0 && inputString.includes('~')) {
        objectString.push(inputString.substring(inputString.length-1));
        unbracketed = inputString.substring(0, 1);
      }
    }

    // Return Premise for basic negation cases.
    if (objectString.length === 1 && unbracketed.includes('~')) {
      let negationCounter = 0;
      const unbracketedArr = unbracketed.split('');

      unbracketedArr.forEach(function(unbrackChar, _) {
        if (unbrackChar === '~') negationCounter++;
      });

      if (negationCounter === 1 && (unbracketed.includes('(') ||
      unbracketed.length === 1)) {
        const negatedPremise = this.makeCustomPremise(objectString[0]);
        newPremise = new Premise({type: 'not', premise1: negatedPremise});
        return this.validatedPremise(newPremise);
      } else if (negationCounter > 1 && unbracketed.includes('(')) {
        objectString[0] = '(' + objectString[0] + ')';
        for (let i = negationCounter-1; i > 0; i--) {
          objectString[0] = '~' + objectString[0];
        }
        const negatedPremise = this.makeCustomPremise(objectString[0]);
        newPremise = new Premise({type: 'not', premise1: negatedPremise});
        return this.validatedPremise(newPremise);
      } else {
        for (let i = negationCounter-1; i > 0; i--) {
          objectString[0] = '~' + objectString[0];
        }
        const negatedPremise = this.makeCustomPremise(objectString[0]);
        newPremise = new Premise({type: 'not', premise1: negatedPremise});
        return this.validatedPremise(newPremise);
      }
    }

    // Return Premise for Conditional, Biconditional, AND, or OR.
    for (let i = 0; i < this.joiningSymbols.length; i++) {
      if (unbracketed.includes(this.joiningSymbols[i])) {
        const premise1 = this.makeCustomPremise(objectString[0]);
        const premise2 = this.makeCustomPremise(objectString[1]);
        newPremise = new Premise({
          type: this.getWordFromJoiningSymbol(this.joiningSymbols[i]),
          premise1: premise1,
          premise2: premise2,
        });
        return this.validatedPremise(newPremise);
      }
    }
    return 'Bad Premise: That String could not be parsed into a Premise.';
  }

  /**
   * Function to turn a word from a joining symbol.
   * @param {string} symbol - symbol representing some type of Premise.
   * @return {string} - word of the same type.
   */
  getWordFromJoiningSymbol(symbol) {
    switch (symbol) {
      case '↔':
        return 'biconditional';
      case '→':
        return 'conditional';
      case '^':
        return 'and';
      case 'v':
        return 'or';
      case '~':
        return 'not';
    }
  }

  /**
   * Function to construct a new string to be fed back into makeCustomPremise.
   * @param {string} originalInput - The original input to makeCustomPremise.
   * @param {string} unbrack - Unbracketed inner string constructed from
   * makeCustomPremise.
   * @param {array} objStr - objectString array from makeCustomPremise.
   * @param {string} symbol - Inner symbol of the Premise.
   * @return {Array} - Array of strings to be fed back into makeCustomPremise.
   */
  constructObjectString(originalInput, unbrack, objStr, symbol) {
    const temp = unbrack.split(symbol);
    const tempObjectString = [];
    const originalInputArr = originalInput.split('');
    if (!temp[0].includes('()')) tempObjectString.push(temp[0]);
    else if (temp[0] === '()') tempObjectString.push(objStr[0]);
    else if (temp[0] === '~()') tempObjectString.push('~(' + objStr[0] + ')');
    else {
      let upToOperator = '';
      let bracketed = 0;
      const done = false;
      for (let i = 0; i < originalInput.length; i++) {
        if (originalInputArr[i] === '(') bracketed++;
        if (originalInputArr[i] === ')') bracketed--;
        if (bracketed === 0 && originalInputArr[i] === symbol) done = true;
        if (done === false) {
          upToOperator = upToOperator.concat(originalInputArr[i]);
        }
      }
      tempObjectString.push(upToOperator);
    }
    if (!temp[1].includes('()')) tempObjectString.push(temp[1]);
    else {
      let upToOperator = '';
      let bracketed = 0;
      let notYet = true;
      for (let i = 0; i < originalInput.length; i++) {
        if (originalInputArr[i] === '(') bracketed++;
        if (originalInputArr[i] === ')') bracketed--;
        if (notYet === false) {
          upToOperator = upToOperator.concat(originalInputArr[i]);
        }
        if (bracketed === 0 && originalInputArr[i] === symbol) {
          notYet = false;
        }
      }
      tempObjectString.push(upToOperator);
    }
    return tempObjectString;
  }

  /**
   * Function to validate a constructed premise for integrity.
   * @param {Premise} premise - premise to be validated.
   * @return {Premise | string} - validated premise or error string.
   */
  validatedPremise(premise) {
    if (premise.isValid() === true) return premise;
    else return 'Bad Premise: Input Premise is not valid.';
  }
}

export default PremiseConstructor;
