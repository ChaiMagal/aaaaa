import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Table, Accordion, Card } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { listMyOrders } from '../actions/orderActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

const ProfileScreen = ({ history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile

  const orderListMy = useSelector((state) => state.orderListMy)
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

  useEffect(() => {
    //if the user isnt loged in
    if (!userInfo) {
      history.push('/login')
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET })
        dispatch(getUserDetails('profile'))
        dispatch(listMyOrders())
      } else {
        setName(user.name)
        setEmail(user.email)
      }
    }
  }, [dispatch, history, userInfo, user, success])

  const submitHandler = (e) => {
    e.preventDefault()
    //Dispatch Register
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      //Dispatch Update Profile
      setMessage(null)
      dispatch(updateUserProfile({ id: user._id, name, email, password }))
      const timer = setTimeout(() => {
        setSuccessMsg('Profile Updated Successfully')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }

  return (
    <Row>
      <Col lg={4}>
        <h3 className='my-3 text-center'>Hi, {name}</h3>
        <Accordion defaultActiveKey='0' className='my-3 text-center'>
          <Card className='my-3 p-3 rounded border-0 '>
            <Accordion.Toggle as={Button} eventKey='1' variant='secondary'>
              Update your Info
            </Accordion.Toggle>
            <Accordion.Collapse eventKey='1'>
              <Card.Body>
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type='name'
                      placeholder='John Doe'
                      // className='rounded border-0 my-3'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ fontSize: '16px' }}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type='email'
                      placeholder='example@example.com'
                      // className='rounded border-0 my-3'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ fontSize: '16px' }}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId='password'>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type='password'
                      placeholder='******'
                      // className='rounded border-0 my-3'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ fontSize: '16px' }}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId='confirmPassword'>
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type='password'
                      placeholder='******'
                      // className='rounded border-0 my-3'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ fontSize: '16px' }}
                    ></Form.Control>
                  </Form.Group>

                  <Button
                    type='submit'
                    variant='primary'
                    className='my-5 btn-block rounded-pill border-0'
                  >
                    Update
                  </Button>
                </Form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>

        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {successMsg && <Message variant='success'>{successMsg}</Message>}
        {loading && <Loader></Loader>}
      </Col>
      <Col lg={8}>
        <h3 className='my-3 text-center'>Your Orders</h3>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant='warning'>{errorOrders}</Message>
        ) : (
          <Table hover responsive className='table-sm text-center my-3'>
            <caption>{name} orders</caption>
            <thead>
              <tr>
                <th style={{ padding: '10px 30px' }}>DATE</th>
                <th style={{ padding: '10px 30px' }}>TOTAL</th>
                <th style={{ padding: '10px 30px' }}>PAYED</th>
                <th style={{ padding: '10px 30px' }}>DELIVERED</th>
                <th style={{ padding: '10px 30px' }}></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className='fas fa-times'></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className='fas fa-times'></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn btn-secondary btn-sm'>
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  )
}

export default ProfileScreen
