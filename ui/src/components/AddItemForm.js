import React, { useContext, useState } from 'react';
import { Button, Form, Row, Modal } from 'react-bootstrap';
import config from '../config';
import UserContext from '../context';

const API_URL = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

export const AddItemForm = () => {
  const {user} = useContext(UserContext);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setFormData({
      itemName: '',
      description: '',
      quantity: 1,
    })
  }
  const handleShow = () => setShow(true);

  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    quantity: 1,
  })

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    let res = await fetch(API_URL + '/items', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...formData, userId: user.id}),
    });

    let resJson = await res.json();

    if (res.status !== 201) {
      alert(resJson);
      return;
    }
    handleClose();
  };

  const handleChange = (event) => {
    let newData = { ...formData, [event.target.name]: event.target.value };
    setFormData(newData);
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add an Item
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add an Item</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSubmit} className="mt-4">
          <Row className="add-item">
              <Form.Group controlId="validationCustom01">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Item Name"
                  value={formData.itemName}
                  name="itemName"
                  onChange={handleChange}
                  autoComplete="on"
                />
                <Form.Control.Feedback type="invalid">
                    Please enter the item name. 
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mt-4 add-item">
              <Form.Group controlId="validationCustom01">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  required
                  as="textarea"
                  rows="5"
                  placeholder="Enter item description..."
                  value={formData.description}
                  name="description"
                  onChange={handleChange}
                  autoComplete="on"
                />
                <Form.Control.Feedback type="invalid">
                  Please enter an item description. 
                </Form.Control.Feedback>
                <Form.Text id="passwordHelpBlock" muted>
                  Limit of 255 characters
              </Form.Text>
              </Form.Group>
            </Row>
            <Row className="mt-4 add-item">
              <Form.Group controlId="validationCustom01">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  required
                  type="number"
                  step={"1"}
                  placeholder="1"
                  min={"1"}
                  value={formData.quantity}
                  name="quantity"
                  onChange={handleChange}
                  autoComplete="on"
                />
                <Form.Control.Feedback type="invalid">
                    Please enter a quantity greater or equal to 1.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className='add-item'>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Row>
        </Form>
          
      </Modal>
    </>
  )
}
