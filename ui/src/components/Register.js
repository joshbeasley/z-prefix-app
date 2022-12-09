import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import config from '../config'
import { ArchiveFill } from 'react-bootstrap-icons';

const API_URL = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

export const Register = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: ''
  })

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    let res = await fetch(API_URL + '/register', {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    let resJson = await res.json();

    if (res.status !== 201) {
      alert(resJson);
      return;
    }

    navigate('/');
  };

  const handleChange = (event) => {
    let newData = { ...formData, [event.target.name]: event.target.value };
    setFormData(newData);
  }

  return (
    <Container className='login'>
      <h3 className='mt-4'>Create an Account for</h3>
      <h1><ArchiveFill className="login-logo"/>TIMS</h1>
      <h5>The Inventory Management System</h5>
      <Form noValidate validated={validated} onSubmit={handleSubmit} className="mt-4">
      <Row className="justify-content-center">
          <Form.Group as={Col} sm="12" md="8" lg="6" xl="4" controlId="validationCustom01">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              name="firstName"
              onChange={handleChange}
              autoComplete="on"
            />
            <Form.Control.Feedback type="invalid">
                Please enter your first name. 
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="justify-content-center mt-4">
          <Form.Group as={Col} sm="12" md="8" lg="6" xl="4" controlId="validationCustom02">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              name="lastName"
              onChange={handleChange}
              autoComplete="on"
            />
            <Form.Control.Feedback type="invalid">
              Please enter your last name. 
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="justify-content-center mt-4">
          <Form.Group as={Col} sm="12" md="8" lg="6" xl="4" controlId="validationCustom03">
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
          <Form.Group as={Col} sm="12" md="8" lg="6" xl="4" controlId="validationCustom04">
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
          <Button className="mt-5" type="submit">Register</Button>
        </Row>
      </Form>
      <p className='mt-4'><Link to='/inventory'>Login as a Guest</Link></p>
      <p><Link to='/'>Login as an Authenicated User</Link></p>
    </Container>
  )
}
