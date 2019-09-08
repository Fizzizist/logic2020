import React from 'react';
import Derivation from '../../logix/components/Derivation';
import {mount} from 'enzyme';
import {assert} from 'chai';


describe('Derivation unit tests', () => {
  it('tests showC', () => {
    const wrapper = mount(<Derivation />);
    wrapper.instance().showC();
    assert(wrapper.state('showing') === true,
        'toggle showing state');
  });
});
