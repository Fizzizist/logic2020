import React from 'react';
import {assert} from 'chai';
import {mount} from 'enzyme';
import InputController from '../../logix/components/InputController';
import Premise from '../../logix/classes/Premise';
import Rule from '../../logix/classes/Rule';

describe('InputController tests', () => {
  const ruleMP = new Rule('MP');
  const prem1 = new Premise({type: 'atomic', premise1: 'P', id: 'PR1'});
  const prem2 = new Premise({type: 'atomic', premise1: 'Q', id: '2'});
  const prem3 = new Premise({type: 'atomic', premise1: 'R'});
  const prem4 = new Premise({
    type: 'conditional',
    premise1: prem1,
    premise2: prem2,
    id: 'PR2',
  });
  const conclusionPrem = new Premise({
    type: 'conditional',
    premise1: prem2,
    premise2: prem3});
  it('tests initial state', () => {
    const wrapper = mount(<InputController premises={[prem1]}
      conclusion={conclusionPrem} innerPremises={[]} outerPremises={[]}/>);
    assert(wrapper.state('availableRules').length === 3, '3 available rules');
    assert(wrapper.state('premises').length === 1, '1 premises from props');
    assert(wrapper.state('availablePremises').length === 1,
        '1 available premise');
  });
  it('tests assumeCD', () => {
    const wrapper = mount(<InputController premises={[prem1]}
      conclusion={conclusionPrem} innerPremises={[]} outerPremises={[]}/>);
    wrapper.instance().assumeCD();
    assert(wrapper.state('inputString') === 'Ass CD',
        'Ass CD should appear in command box');
    assert(wrapper.state('selectedPremises').length === 1,
        'antecedent should be selected');
    assert(wrapper.state('assumeSelected') === true,
        'assumeSelected should be true');
    assert(wrapper.state('availableRules').length === 4,
        'CD should be added to availableRules');
  });
  it('tests assumeID', () => {
    const wrapper = mount(<InputController premises={[prem1]}
      conclusion={conclusionPrem} innerPremises={[]} outerPremises={[]}/>);
    wrapper.instance().assumeID();
    assert(wrapper.state('inputString') === 'Ass ID',
        'Ass CD should appear in command box');
    assert(wrapper.state('selectedPremises').length === 1,
        'antecedent should be selected');
    assert(wrapper.state('assumeSelected') === true,
        'assumeSelected should be true');
    assert(wrapper.state('availableRules').length === 4,
        'CD should be added to availableRules');
  });
  it('tests resetButtons', () => {
    const wrapper = mount(<InputController premises={[prem1]}
      conclusion={conclusionPrem} innerPremises={[]} outerPremises={[]}/>);
    wrapper.instance().assumeID();
    wrapper.instance().resetButtons();
    assert(wrapper.state('inputString') === '',
        'Ass CD should appear in command box');
    assert(wrapper.state('selectedPremises').length === 0,
        'antecedent should be selected');
    assert(wrapper.state('assumeSelected') === false,
        'assumeSelected should be true');
    assert(wrapper.state('availableRules').length === 3,
        'CD should be added to availableRules');
  });
  it('tests selectPremise', () => {
    const wrapper = mount(<InputController premises={[prem1]}
      conclusion={conclusionPrem} innerPremises={[]} outerPremises={[]}/>);
    wrapper.instance().selectPremise(prem1);
    assert(wrapper.state('availablePremises').length === 0,
        'prem1 should be removed from availablePremises');
    assert(wrapper.state('selectedPremises').length === 1,
        'a premise should be added to selectedPremises');
  });
  it('tests selectRule MP', () => {
    const wrapper = mount(<InputController premises={[prem1, prem4]}
      conclusion={conclusionPrem} innerPremises={[]} outerPremises={[]}/>);
    wrapper.instance().selectPremise(prem1);
    wrapper.instance().selectPremise(prem4);
    wrapper.instance().selectRule(ruleMP);
    assert(wrapper.state('selectedPremises').length === 1,
        'a premise should be added to selectedPremises');
    assert(wrapper.state('selectedRules').length === 1,
        'a new rule should be added to selectedRules');
    assert(wrapper.state('inputString') === ' PR1 PR2 MP',
        'PR1 PR2 MP should appear in command box');
    assert(wrapper.state('submitToggle') === true,
        'submit button should be available');
  });
  it('tests selectRule MP error', () => {
    const wrapper = mount(<InputController premises={[prem1, prem2]}
      conclusion={conclusionPrem} innerPremises={[]} outerPremises={[]}/>);
    wrapper.instance().selectPremise(prem1);
    wrapper.instance().selectPremise(prem2);
    wrapper.instance().selectRule(ruleMP);
    assert(wrapper.state('selectedPremises').length === 0,
        'selectedPremises should be reset to zero');
    assert(wrapper.state('selectedRules').length === 0,
        'selectedRules should be reset');
    assert(wrapper.state('inputString') === '',
        'inputString should be reset');
    assert(wrapper.state('submitToggle') === false,
        'submit button should be unavailable');
    assert(wrapper.state('assumeSelected') === false,
        'assumeSelected should be false');
    assert(wrapper.state('errorMessage') ===
    'Modus Ponens cannot be performed on these premises.',
    'an error message should occur.');
  });
  it('tests submitCommand', () => {
    function submitCallback(premise) {
      //pass
    }
    const wrapper = mount(<InputController premises={[prem1, prem4]}
      conclusion={conclusionPrem} innerPremises={[]} outerPremises={[]}
      lineNumber={1} submitCommand={submitCallback}/>);
    wrapper.instance().assumeCD();
    wrapper.instance().submitCommand();
    assert(wrapper.state('selectedPremises').length === 0,
        'selected premises should be reset to zero');
    assert(wrapper.state('inputString') === '',
        'inputString should be reset');
    assert(wrapper.state('assumeSubmitted') === true,
        'assumedSubmitted should be true now.');
    assert(wrapper.state('lineNumber') === 2,
        'lineNumber should be incremented by 1');
  });
});
