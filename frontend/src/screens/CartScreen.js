import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import { addToCart, removeFromCart } from '../actions/cartActions'

//match-get the id from the url
//location- to get the qty from url
//history- used to redirect
const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id

  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order } = orderDetails

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
    if (order) {
      history.push(`/order/${order._id}`)
    }
  }, [dispatch, productId, qty, history, order])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping')
  }

  return (
    <Row>
      <Col xl={12}>
        <h2 className='mx-3 py-2'>Cart</h2>
        <Card className='border-0'>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h6>
                Total ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h6>
              <h4>
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </h4>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
      <Col xl={12}>
        {cartItems.length === 0 ? (
          <Message variant='secondary'>
            <h6>Cart is empty</h6>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product} className='py-3'>
                <Row>
                  <Col xs={6} sm={2} className='py-2'>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fluid
                      rounded
                    ></Image>
                  </Col>
                  <Col sm={4} className='py-2'>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col sm={2} className='py-2'>
                    ${item.price}
                  </Col>
                  <Col xs={8} sm={3} className='py-2'>
                    <Form.Control
                      as='select'
                      className=''
                      value={item.qty}
                      onChange={(e) => {
                        dispatch(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col xs={4} sm={1} className='py-2'>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col xl={12}>
        <Row>
          <Col sm={6}>
            <Button
              type='button'
              // variant='secondary'
              style={{ backgroundColor: '#282828' }}
              className='my-3 btn-block  rounded-pill border-0'
              onClick={() => {
                history.push('/')
              }}
            >
              Continue Shopping
            </Button>
          </Col>
          <Col sm={6}>
            <Button
              type='button'
              variant='primary'
              className=' my-3 btn-block rounded-pill border-0'
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Checkout
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default CartScreen
