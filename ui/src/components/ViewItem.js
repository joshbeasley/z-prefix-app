/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react';
import { Button, Form, Row, Modal } from 'react-bootstrap';
import config from '../config';
import UserContext from '../context';
import {Eye} from 'react-bootstrap-icons';

const API_URL = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

export const ViewItem = ({ item, toggleRefresh }) => {
  const {user} = useContext(UserContext);
  const [show, setShow] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const handleClose = () => {
    setShow(false);
  }
  const handleShow = () => setShow(true);

  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    itemName: item.itemName,
    description: item.description,
    quantity: item.quantity,
  })

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    let res = await fetch(API_URL + `/items/${item.id}`, {
      method: "PUT",
      credentials: "include",
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
    toggleRefresh();
    handleClose();
  };

  const handleDelete = async () => {
    try {
      let res = await fetch(`http://localhost:8080/items/${item.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status !== 202) {
        throw new Error();
      }

      toggleRefresh();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    let newData = { ...formData, [event.target.name]: event.target.value };
    setFormData(newData);
  }

  const renderButtons = () => {
    if (!user) {
      return (
        <Row className='add-item'>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Row>
      )
    }

    if (disabled) {
      return (
        <Row className='add-item'>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button key={0} variant="warning" onClick={() => {setDisabled(false)}}>
            Edit
          </Button> 
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Row>
      )
    }

    return (
      <Row className='add-item'>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button key={1} variant="primary" type="submit">
            Submit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Row>
    )
  }

  return (
    <>
      <Button variant="secondary" className="pb-2" onClick={handleShow}>
        <Eye/>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>View Item</Modal.Title>
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
                  disabled={disabled}
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
                  disabled={disabled}
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
                  disabled={disabled}
                />
                <Form.Control.Feedback type="invalid">
                    Please enter a quantity greater or equal to 1.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            {renderButtons()}
        </Form>
          
      </Modal>
    </>
  )
}
