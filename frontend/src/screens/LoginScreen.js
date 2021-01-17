import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login } from '../actions/userActions'
import FormContainer from '../components/FormContainer'

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    //if the user is loged in
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  return (
    <FormContainer>
      <h1 className='my-5'>Log In</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader></Loader>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='John@example.com'
            // className='rounded border-0 my-3'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ fontSize: '16px' }}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='******'
            // className='rounded border-0 my-3'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ fontSize: '16px' }}
          ></Form.Control>
        </Form.Group>

        <Button
          type='submit'
          variant='primary'
          className='my-5 btn-block rounded-pill border-0'
        >
          Log in
        </Button>
        <Row className='py-3 text-center'>
          <Col>
            Don’t have an account yet? &nbsp;
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
            >
              Sign Up
            </Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  )
}

export default LoginScreen
