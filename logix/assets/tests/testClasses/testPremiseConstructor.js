const assert = require('assert');
import PremiseConstructor from '../../logix/classes/PremiseConstructor';

describe('PremiseConstructor tests', function() {
  it('makeCustomPremise basic conditional', function() {
    const pc = new PremiseConstructor();
    const premise = pc.makeCustomPremise('P→Q');
    assert.equal(premise.premiseString, 'P → Q');
    assert.equal(premise.type, 'conditional');
  });
  it('makeCustomPremise basic biconditional', function() {
    const pc = new PremiseConstructor();
    const premise = pc.makeCustomPremise('P↔Q');
    assert.equal(premise.premiseString, 'P ↔ Q');
    assert.equal(premise.type, 'biconditional');
  });
  it('makeCustomPremise basic or', function() {
    const pc = new PremiseConstructor();
    const premise = pc.makeCustomPremise('PvQ');
    assert.equal(premise.premiseString, 'P v Q');
    assert.equal(premise.type, 'or');
  });
  it('makeCustomPremise basic and', function() {
    const pc = new PremiseConstructor();
    const premise = pc.makeCustomPremise('P^Q');
    assert.equal(premise.premiseString, 'P ^ Q');
    assert.equal(premise.type, 'and');
  });
  it('makeCustomPremise basic not', function() {
    const pc = new PremiseConstructor();
    const premise = pc.makeCustomPremise('~P');
    assert.equal(premise.premiseString, '~P');
    assert.equal(premise.type, 'not');
  });
  it('makeCustomPremise conditional bracketed', function() {
    const pc = new PremiseConstructor();
    const premise = pc.makeCustomPremise('(P→Q)→R');
    assert.equal(premise.premiseString, '(P → Q) → R');
    assert.equal(premise.type, 'conditional');
  });
  it('makeCustomPremise conditional negated antecedent', function() {
    const pc = new PremiseConstructor();
    const premise = pc.makeCustomPremise('~P→Q');
    assert.equal(premise.premiseString, '~P → Q');
    assert.equal(premise.type, 'conditional');
    assert.equal(premise.antecedent.type, 'not');
  });
  it('makeCustomPremise bracketed combination', function() {
    const pc = new PremiseConstructor();
    const premise = pc.makeCustomPremise('P^(R↔(~(QvS)→T))');
    assert.equal(premise.premiseString, 'P ^ (R ↔ (~(Q v S) → T))');
    assert.equal(premise.type, 'and');
  });
  it('makeCustomPremise fail', function() {
    const pc = new PremiseConstructor();
    const premise = pc.makeCustomPremise('P→');
    assert.equal(premise,
        'Bad Premise: Input Premise is not valid.');
  });
});
