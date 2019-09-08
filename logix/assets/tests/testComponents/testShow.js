import React from 'react';
import Show from '../../logix/components/Show';
import Premise from '../../logix/classes/Premise';
import {mount} from 'enzyme';
import {assert} from 'chai';

describe('Show unit tests', () => {
  const prem1 = new Premise({type: 'atomic', premise1: 'P', id: 'PR1'});
  const prem2 = new Premise({type: 'atomic', premise1: 'Q', id: '2'});
  const prem3 = new Premise({type: 'atomic', premise1: 'R'});
  const conclusionPrem = new Premise({
    type: 'conditional',
    premise1: prem2,
    premise2: prem3});
  it('tests initial Show state', () => {
    const wrapper = mount(<Show premises={[prem1, prem2]}
      conclusion={conclusionPrem} lastNumber={1}
      outerPremises={[prem3]}/>);
    assert(wrapper.props().conclusion.id === '1',
        'Show should change the conclusion id to a string of lastNumber value');
    assert(wrapper.state('lineNumber') === 2,
        'lineNumber should be 1 plus lastNumber');
    assert(wrapper.state('ownLineNumber') === 1,
        'ownLineNumber should be lastNumber');
    assert(wrapper.state('displayDict').lines.length === 1,
        'lines should only have the Show line in it.');
    assert(wrapper.state('outerPremises').length === 1,
        'should populate state with outerPremises');
  });
  it('tests submitCommandCallback (solved false)', () => {
    const wrapper = mount(<Show premises={[prem1, prem2]}
      conclusion={conclusionPrem} lastNumber={1}
      outerPremises={[prem3]}/>);
    wrapper.instance().submitCommandCallback(prem3);
    assert(wrapper.state('displayDict').lines.length === 2,
        'adds a show line');
    assert(wrapper.state('linePremises').length === 1,
        'adds a new line premise.');
    assert(wrapper.state('lineNumber') === 3,
        'increments line number by 1');
  });
});
