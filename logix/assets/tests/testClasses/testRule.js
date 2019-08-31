const assert = require('assert');
import Rule from '../../logix/classes/Rule';
import Premise from '../../logix/classes/Premise';

describe('Rule tests', function() {
  const ruleMP = new Rule('MP');
  const premiseA = new Premise({type: 'atomic', premise1: 'A'});
  const premiseB = new Premise({type: 'atomic', premise1: 'B'});
  const premiseAB = new Premise({
    type: 'conditional',
    premise1: premiseA,
    premise2: premiseB,
  });
  it('getName', function() {
    assert.equal(ruleMP.name, 'MP');
  });
  it('getAllowedPremises', function() {
    assert.equal(ruleMP.allowedPremises, 2);
  });
  it('getResultingPremise for MP', function() {
    const rule = new Rule('MP', premiseA, premiseAB);
    const newPremise = rule.resultingPremise;
    assert.equal(newPremise.premiseString, 'B');
  });
  it('getResultingPremise for MP reverse', function() {
    const rule = new Rule('MP', premiseAB, premiseA);
    const newPremise = rule.resultingPremise;
    assert.equal(newPremise.premiseString, 'B');
  });
  it('getResultingPremise for MP fails: bad premises', function() {
    const rule = new Rule('MP', premiseA, premiseB);
    assert.equal(
        rule.resultingPremise,
        'Modus Ponens cannot be performed on these premises.');
  });
  it('getResultingPremise for MP fails: not enough premises', function() {
    const rule = new Rule('MP', premiseA);
    assert.equal(
        rule.resultingPremise,
        'The MP rule needs exactly two premises.');
  });
  it('getResultingPremise for DD success', function() {
    const rule = new Rule('DD', premiseA, premiseA);
    assert.equal(rule.resultingPremise, premiseA);
  });
  it('getResultingPremise for DD fail', function() {
    const rule = new Rule('DD', premiseA, premiseB);
    assert.equal(rule.resultingPremise,
        'That is not the correct premise for a Direct Derivation.');
  });
  it('getResultingPremise for CD success', function() {
    const rule = new Rule('CD', premiseA, premiseA, premiseAB);
    assert.equal(rule.resultingPremise, premiseAB);
  });
  it('getResultingPremise for CD fail', function() {
    const rule = new Rule('CD', premiseA, premiseB, premiseAB);
    assert.equal(rule.resultingPremise,
        'That is not the correct premise for a Conditional ' +
        'Derivation.');
  });
});
