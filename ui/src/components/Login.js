import React, { useState, useContext, useEffect } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../context';
import config from '../config'

const API_URL = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

export const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  useEffect(() => {
    if (user != null) {
      navigate("/items");
    }
  }, [user])

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    let res = await fetch(API_URL + '/login', {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    let resJson = await res.json();

    if (res.status !== 202) {
      alert(resJson);
      return;
    }

    setUser(resJson.user);
  };

  const handleChange = (event) => {
    let newData = { ...formData, [event.target.name]: event.target.value };
    setFormData(newData);
  }

  return (
    <Container className='login'>
      <h1 className='mt-4'>Login</h1>
      <Form noValidate validated={validated} onSubmit={handleSubmit} className="mt-4">
        <Row className="justify-content-center">
          <Form.Group as={Col} sm="12" md="8" lg="6" xl="4" controlId="validationCustom01">
            <Form.Label>Username</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Username"
              minLength={"3"}
              value={formData.username}
              name="username"
              onChange={handleChange}
              autoComplete="username"
            />
            <Form.Control.Feedback type="invalid">
                Please choose a username. Usernames must have at least 3 characters.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="justify-content-center mt-4">
          <Form.Group as={Col} sm="12" md="8" lg="6" xl="4" controlId="validationCustom02">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Password"
              minLength={"3"}
              value={formData.password}
              name="password"
              onChange={handleChange}
              autoComplete="new-password"
            />
            <Form.Control.Feedback type="invalid">
                Please choose a password. Passwords must have at least 3 characters.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row xs="8" sm="8" md="6" lg="8" xl="8" className="justify-content-center">
          <Button className="mt-5" type="submit">Login</Button>
        </Row>
      </Form>
      <p className='mt-4'>New to Inventory? <Link to='/register'>Create an Account</Link></p>
      <p><Link to='/items'>Login as a Guest</Link></p>
    </Container>
    
  )
}
