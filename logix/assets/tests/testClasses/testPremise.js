const assert = require('assert');
const expect = require('chai').expect;
import Premise from '../../logix/classes/Premise';

describe('Premise tests', function() {
  const premiseA = new Premise({type: 'atomic', premise1: 'A'});
  const premiseB = new Premise({type: 'atomic', premise1: 'B'});
  const premiseCond = new Premise({
    type: 'conditional',
    premise1: premiseA,
    premise2: premiseB,
  });
  const premiseBicond = new Premise({
    type: 'biconditional',
    premise1: premiseA,
    premise2: premiseB,
  });
  const premiseAnd = new Premise({
    type: 'and',
    premise1: premiseA,
    premise2: premiseB,
  });
  const premiseOr = new Premise({
    type: 'or',
    premise1: premiseA,
    premise2: premiseB,
  });
  const premiseNot = new Premise({
    type: 'not',
    premise1: premiseA,
  });
  it('getPremiseString for atomic', function() {
    assert.equal(premiseA.premiseString, 'A');
  });
  it('getPremiseString for conditional', function() {
    assert.equal(premiseCond.premiseString, 'A → B');
  });
  it('getPremiseString for biconditional', function() {
    assert.equal(premiseBicond.premiseString, 'A ↔ B');
  });
  it('getPremiseString for and', function() {
    assert.equal(premiseAnd.premiseString, 'A ^ B');
  });
  it('getPremiseString for or', function() {
    assert.equal(premiseOr.premiseString, 'A v B');
  });
  it('getPremiseString for not', function() {
    assert.equal(premiseNot.premiseString, '~A');
  });
  it('getType', function() {
    assert.equal(premiseA.type, 'atomic');
  });
  it('setID, getID', function() {
    premiseA.id = 'PR1';
    assert.equal(premiseA.id, 'PR1');
  });
  it('getAntecedent', function() {
    const newPremise = premiseCond.antecedent;
    assert.equal(newPremise.premiseString, 'A');
  });
  it('getConsequent', function() {
    const newPremise = premiseCond.consequent;
    assert.equal(newPremise.premiseString, 'B');
  });
  it('setCommandText, getCommandText', function() {
    premiseA.commandText = 'PR1 PR2 MP';
    assert.equal(premiseA.commandText, 'PR1 PR2 MP');
  });
  it('equalsPremise atomic true', function() {
    assert.equal(premiseA.equalsPremise(premiseCond.antecedent), true);
  });
  it('equalsPremise atomic false', function() {
    assert.equal(premiseA.equalsPremise(premiseCond.consequent), false);
  });
  it('equalsPremise wrong type', function() {
    assert.equal(premiseA.equalsPremise(premiseCond), false);
  });
  it('equalsPremise conditional true', function() {
    const newPremise = new Premise({
      type: 'conditional',
      premise1: premiseA,
      premise2: premiseB,
    });
    assert.equal(newPremise.equalsPremise(premiseCond), true);
  });
  it('equalsPremise conditional false', function() {
    const newPremise = new Premise({
      type: 'conditional',
      premise1: premiseB,
      premise2: premiseA,
    });
    assert.equal(newPremise.equalsPremise(premiseCond), false);
  });
  it('equalsPremise biconditional true', function() {
    const newPremise = new Premise({
      type: 'biconditional',
      premise1: premiseB,
      premise2: premiseA,
    });
    assert.equal(newPremise.equalsPremise(premiseBicond), true);
  });
  it('equalsPremise biconditional false', function() {
    const newPremise = new Premise({
      type: 'biconditional',
      premise1: premiseCond,
      premise2: premiseA,
    });
    assert.equal(newPremise.equalsPremise(premiseBicond), false);
  });
  it('equalsPremise "not" true', function() {
    const newPremise = new Premise({
      type: 'not',
      premise1: premiseA,
    });
    assert.equal(newPremise.equalsPremise(premiseNot), true);
  });
  it('equalsPremise "not" false', function() {
    const newPremise = new Premise({
      type: 'not',
      premise1: premiseB,
    });
    assert.equal(newPremise.equalsPremise(premiseNot), false);
  });
  it('toJSON atomic', function() {
    expect(premiseA.toJSON()).to.eql({
      id: 'PR1',
      type: 'atomic',
      symbol: 'A'});
  });
  it('toJSON conditional (nesting)', function() {
    expect(premiseCond.toJSON()).to.eql({
      id: null,
      type: 'conditional',
      antecedent: {
        id: 'PR1',
        type: 'atomic',
        symbol: 'A',
      },
      consequent: {
        id: null,
        type: 'atomic',
        symbol: 'B',
      },
    });
  });
});
