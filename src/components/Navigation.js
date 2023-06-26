import Navbar from 'react-bootstrap/Navbar';
import logo from '../img/icons8-ethereum.svg'

function Navigation() {
  return (
      <Navbar className="my-3">
          <img alt="" src={logo} width="40" height="40" className="d-inline-block align-top mx-3"/>
          <Navbar.Brand href="#">SyZyGy ICO Crowdsale</Navbar.Brand>
      </Navbar>
  );
}

export default Navigation;