/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import UserContext from '../context';
import config from '../config'
import { useNavigate } from 'react-router';
import { AddItemForm } from './AddItemForm';
import { PersonCircle } from 'react-bootstrap-icons';
import { ArchiveFill } from 'react-bootstrap-icons';

const API_URL = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

export const InventoryNav = ({toggleRefresh, allItems, setAllItems}) => {
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
        <Navbar.Brand href="#home"><ArchiveFill className="login-logo"/>TIMS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" >
          <Nav className="me-auto justify-content-center">
            <Nav.Link onClick={() => {navigate('/items')}}>Home</Nav.Link>
            {user ?
              (allItems ?
                <>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                  <AddItemForm toggleRefresh={toggleRefresh}/>
                  <Button key={0} variant='secondary' className='ms-3' onClick={() => {setAllItems(false); toggleRefresh();}}>See My Items</Button>
                </> :
                <>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                  <AddItemForm toggleRefresh={toggleRefresh}/>
                  <Button key={1} variant='secondary' className='ms-3' onClick={() => {setAllItems(true); toggleRefresh();}}>See All Items</Button>
                </>
                
              ) :
              <Nav.Link onClick={() => {navigate('/')}}>Login</Nav.Link>
            }
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
          {user ? 
            `${user.firstName} ${user.lastName}`:
            'Guest'
          }
          </Navbar.Text>
          <Navbar.Text className='ms-2 mb-1' >
            <PersonCircle className='person'/>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
