import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const CheckoutSteps = ({ step1, step2, step3 }) => {
  return (
    <Nav className='justify-content-center' style={{ fontSize: '10px' }}>
      <Nav.Item>
        {step1 ? (
          <LinkContainer to='/shipping'>
            <Nav.Link>Shipping</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Shipping</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to='/placeorder'>
            <Nav.Link>Summary</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Summary</Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step3 ? (
          <Nav.Link>Payment</Nav.Link>
        ) : (
          <Nav.Link disabled>Payment</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  )
}

export default CheckoutSteps
