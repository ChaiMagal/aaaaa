import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { Link } from 'react-router-dom'
import { savePaymentMethod } from '../actions/cartActions'
import { createOrder } from '../actions/orderActions'

const PlaceOrderScreen = ({ history }) => {
  const [paymentMethod, setPaymentMethod] = useState('')

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order: orderD } = orderDetails

  //Calculate prices
  cart.itemsPrice = Number(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  ).toFixed(2)

  cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 10
  cart.taxPrice = Number((0.17 * cart.itemsPrice).toFixed(2))
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2)

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`)
    }
    if (orderD) {
      history.push(`/order/${orderD._id}`)
    }
  }, [history, success, dispatch, order, orderD])

  const placeOrderHandler = () => {
    if (paymentMethod === '') {
      alert('Please Choose Payment Method')
    } else {
      dispatch(
        createOrder({
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        })
      )
    }
  }

  return (
    <>
      <CheckoutSteps step1 step2 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h4>Shipping</h4>
              <div>
                {cart.shippingAddress.address},{cart.shippingAddress.city}
              </div>
              <div>
                {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <Form>
                <h4>Payment Method</h4>

                <Form.Check
                  type='radio'
                  label='PayPal or Credit Card'
                  id='PayPal'
                  name='paymentMethod'
                  value='PayPal'
                  className='my-2'
                  onChange={(e) => {
                    setPaymentMethod(e.target.value)
                    dispatch(savePaymentMethod(e.target.value))
                  }}
                ></Form.Check>
              </Form>
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>Your Cart</h4>
              {cart.cartItems.length === 0 ? (
                <Message>Cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col xs={3} sm={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col xs={5} sm={5}>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col xs={4} sm={5}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card className='border-0'>
            <ListGroup variant='flush' style={{ background: 'none' }}>
              <ListGroup.Item className='bg-light'>
                <h4>Order Summary</h4>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax (17%)</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
                <Button
                  type='button'
                  variant='primary'
                  className='my-5 btn-block rounded-pill border-0'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order &gt;
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
