/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import UserContext from '../context';
import config from '../config'
import { useNavigate } from 'react-router';
import { AddItemForm } from './AddItemForm';

const API_URL = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

export const InventoryNav = ({toggleRefresh}) => {
  const {user, setUser} = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    let res = await fetch(API_URL + '/logout', {
      method: "DELETE",
      credentials: "include",
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
            <Nav.Link onClick={() => {navigate('/items')}}>Home</Nav.Link>
            {user ?
              (<><Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              <AddItemForm toggleRefresh={toggleRefresh}/></>) :
              <Nav.Link onClick={() => {navigate('/')}}>Login</Nav.Link>
            }
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
          {user ? 
            `Signed in as: ${user.firstName} ${user.lastName}`:
            'Signed in as: Guest'
          }
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
