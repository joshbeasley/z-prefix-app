import React from 'react';
import {Modal, Button} from 'react-bootstrap';

// eslint-disable-next-line react/prop-types
export const DeleteWarning = ({showWarning, handleCloseWarning, handleDelete}) => {
  return (
    <Modal
        show={showWarning}
        onHide={handleCloseWarning}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header >
          <Modal.Title>CONFIRM</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you wish to delete this entry?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseWarning}>
            Close
          </Button>
          <Button variant="warning" onClick={() => {
          handleDelete()
        }}>Delete</Button>
        </Modal.Footer>
      </Modal>
  )
}
