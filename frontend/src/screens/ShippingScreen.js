import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart
  const dispatch = useDispatch()
  const [address, setAddress] = useState(shippingAddress.address)
  const [city, setCity] = useState(shippingAddress.city)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const [country, setCountry] = useState(shippingAddress.country)

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order } = orderDetails

  useEffect(() => {
    if (order) {
      history.push(`/order/${order._id}`)
    }
  }, [dispatch, order, history])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ address, city, postalCode, country }))
    history.push('/placeorder')
  }
  return (
    <FormContainer>
      <CheckoutSteps step1 />
      <h3 className='my-5 text-center'>Shipping</h3>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='new-address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='address'
            // className='rounded border-0 my-3'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
            style={{ fontSize: '16px' }}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            placeholder='city name'
            // className='rounded border-0 my-3'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
            style={{ fontSize: '16px' }}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='postalCode'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='tel'
            placeholder='123456789'
            // className='rounded border-0 my-3'
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
            style={{ fontSize: '16px' }}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='postalCode'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            placeholder='country name'
            // className='rounded border-0 my-3'
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
            style={{ fontSize: '16px' }}
          ></Form.Control>
        </Form.Group>

        <Button
          type='submit'
          variant='primary'
          className='my-5 btn-block rounded-pill border-0'
        >
          Next &gt;
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
