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
    assert.equal(ruleMP.getName(), 'MP');
  });
  it('getAllowedPremises', function() {
    assert.equal(ruleMP.getAllowedPremises(), 2);
  });
  it('getResultingPremise for MP', function() {
    const rule = new Rule('MP', premiseA, premiseAB);
    const newPremise = rule.getResultingPremise();
    assert.equal(newPremise.getPremiseString(), 'B');
  });
  it('getResultingPremise for MP reverse', function() {
    const rule = new Rule('MP', premiseAB, premiseA);
    const newPremise = rule.getResultingPremise();
    assert.equal(newPremise.getPremiseString(), 'B');
  });
  it('getResultingPremise for MP fails: bad premises', function() {
    const rule = new Rule('MP', premiseA, premiseB);
    assert.equal(
        rule.getResultingPremise(),
        'Modus Ponens cannot be performed on these premises.');
  });
  it('getResultingPremise for MP fails: not enough premises', function() {
    const rule = new Rule('MP', premiseA);
    assert.equal(
        rule.getResultingPremise(),
        'The MP rule needs exactly two premises.');
  });
});
