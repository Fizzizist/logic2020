const assert = require('assert');
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
    assert.equal(premiseA.getPremiseString(), 'A');
  });
  it('getPremiseString for conditional', function() {
    assert.equal(premiseCond.getPremiseString(), 'A → B');
  });
  it('getPremiseString for biconditional', function() {
    assert.equal(premiseBicond.getPremiseString(), 'A ↔ B');
  });
  it('getPremiseString for and', function() {
    assert.equal(premiseAnd.getPremiseString(), 'A ^ B');
  });
  it('getPremiseString for or', function() {
    assert.equal(premiseOr.getPremiseString(), 'A v B');
  });
  it('getPremiseString for not', function() {
    assert.equal(premiseNot.getPremiseString(), '~A');
  });
  it('getType', function() {
    assert.equal(premiseA.getType(), 'atomic');
  });
  it('setID, getID', function() {
    premiseA.setID('PR1');
    assert.equal(premiseA.getID(), 'PR1');
  });
  it('toggleAnteAssumed, getAnteAssumed', function() {
    assert.equal(premiseA.getAnteAssumed(), false);
    premiseA.toggleAnteAssumed();
    assert.equal(premiseA.getAnteAssumed(), true);
    premiseA.toggleAnteAssumed();
    assert.equal(premiseA.getAnteAssumed(), false);
  });
  it('getAntecedent', function() {
    const newPremise = premiseCond.getAntecedent();
    assert.equal(newPremise.getPremiseString(), 'A');
  });
  it('getConsequent', function() {
    const newPremise = premiseCond.getConsequent();
    assert.equal(newPremise.getPremiseString(), 'B');
  });
  it('setCommandText, getCommandText', function() {
    premiseA.setCommandText('PR1 PR2 MP');
    assert.equal(premiseA.getCommandText(), 'PR1 PR2 MP');
  });
  it('equalsPremise atomic true', function() {
    assert.equal(premiseA.equalsPremise(premiseCond.getAntecedent()), true);
  });
  it('equalsPremise atomic false', function() {
    assert.equal(premiseA.equalsPremise(premiseCond.getConsequent()), false);
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
});
