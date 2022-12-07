import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import UserContext from '../context';
import config from '../config'
import { useNavigate } from 'react-router';

const API_URL = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

export const InventoryNav = () => {
  const {user, setUser} = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    let res = await fetch(API_URL + '/logout', {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let resJson = await res.json();

    if (res.status !== 202) {
      alert(resJson);
      return;
    }

    setUser(null);
    navigate('/');
  }

  return (
    <Navbar variant="dark" bg="dark">
      <Container>
        <Navbar.Brand href="#home">Inventory</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-space-between">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          {user ? 
          <Navbar.Text>
            Signed in as: {user.firstName} {user.lastName}
          </Navbar.Text> :
          null }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
