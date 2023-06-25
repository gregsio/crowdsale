import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import logo from '../img/icons8-ethereum.svg'

function Navigation() {
  return (
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
            <img alt="" src={logo} width="30" height="30" className="d-inline-block align-top mx-3"/>
            SyZyGy ICO Crowdsale
          </Navbar.Brand>
        </Container>
      </Navbar>
  );
}

export default Navigation;