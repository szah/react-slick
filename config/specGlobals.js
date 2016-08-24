import chai from 'chai';
import { shallow } from 'enzyme';
import { spy, stub } from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

global.spy = spy;
global.stub = stub;
global.expect = chai.expect;
global.shallow = shallow;
