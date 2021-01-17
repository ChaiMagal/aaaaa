import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PayPalButton } from 'react-paypal-button-v2'
import Message from '../components/Message'
import Loader from '../components/Loader'
import CheckoutSteps from '../components/CheckoutSteps'
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants'

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id

  const [sdkReady, setSdkReady] = useState(false)

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    //PayPal Button
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    if (!order || order._id !== orderId || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [dispatch, order, orderId, successPay, successDeliver, history, userInfo])

  const successPaymentHandler = (paymentResault) => {
    dispatch(payOrder(orderId, paymentResault))
  }
  const successDeliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  const backToProfileHandler = () => {
    history.push('/profile')
    window.location.reload()
    localStorage.removeItem('cartItems')
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message>{error}</Message>
  ) : (
    <>
      {!order.isPaid ? (
        <CheckoutSteps step1 step2 step3 />
      ) : (
        <Button variant='light' className='ml-3' onClick={backToProfileHandler}>
          &lt; Back
        </Button>
      )}
      <Row>
        <Col xs={12}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h4 className='mt-3'>Order</h4>
              <h6 className='font-weight-light'>#{order._id}</h6>
              <h6>
                {order.user.name} | &nbsp;
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </h6>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>

      <Row>
        <Col md={order.isPaid ? 8 : 4}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h4>Shipping</h4>
              <div>
                {order.shippingAddress.address},{order.shippingAddress.city}
              </div>
              <div>
                {order.shippingAddress.postalCode},
                {order.shippingAddress.country}
              </div>
              <div>
                {order.isDelivered ? (
                  <Message variant='success'>
                    Delivered on {order.deliveredAt}
                  </Message>
                ) : (
                  <Message variant='danger'>Not Delivered</Message>
                )}
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>Payment</h4>
              <div>
                {order.isPaid ? (
                  <Message variant='success'>
                    Paid on {order.paidAt.substring(0, 10)} with{' '}
                    {order.paymentMethod}
                  </Message>
                ) : (
                  <Message variant='danger'>Not Paid</Message>
                )}
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>Your Order</h4>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
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
        <Col md={order.isPaid ? 4 : 4}>
          <Card className='border-0'>
            <ListGroup variant='flush' style={{ background: 'none' }}>
              <ListGroup.Item className='bg-light'>
                <h4>Order Summary</h4>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax (17%)</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col md={order.isPaid ? 0 : 4}>
          <ListGroup>
            {!order.isPaid && (
              <ListGroup.Item>
                {loadingPay && <Loader />}
                {!sdkReady ? (
                  <Loader />
                ) : (
                  <PayPalButton
                    amount={order.totalPrice}
                    onSuccess={successPaymentHandler}
                  />
                )}
              </ListGroup.Item>
            )}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <ListGroup.Item>
                  {loadingDeliver && <Loader />}
                  <Button
                    onClick={successDeliverHandler}
                    type='button'
                    className='btn-block my-3 rounded-pill border-0'
                  >
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
          </ListGroup>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
