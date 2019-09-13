const assert = require('chai').assert;
import Argument from '../../logix/classes/Argument';
import Premise from '../../logix/classes/Premise';

describe('Argument Tests', function() {
  const premSet1 = [];
  const premSet2 = [];
  const premiseP = new Premise({type: 'atomic', premise1: 'P'});
  const premiseQ = new Premise({type: 'atomic', premise1: 'Q'});
  const premiseR = new Premise({type: 'atomic', premise1: 'R'});
  premSet1.push(premiseP);
  premSet1.push(premiseQ);
  premSet2.push(premiseR);
  premSet2.push(premiseP);
  premSet2.push(premiseQ);
  const conclusion1 = new Premise({
    type: 'conditional',
    premise1: premiseP,
    premise2: premiseQ,
  });
  it('tests initial construction', function() {
    const argument = new Argument(premSet1, conclusion1);
    assert(argument.premises[0].id === 'PR1',
        'First premise in premise set should be have id of PR1');
  });
  it('tests set premises, update new IDs', function() {
    const argument = new Argument(premSet1, conclusion1);
    argument.premises = premSet2;
    assert(argument.premises[1].id === 'PR2',
        'When a new premise set is given to Argument,' +
        'it should reset the IDs.');
  });
});
