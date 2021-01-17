import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Card, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import {
  listProductsDetails,
  createProductReview,
} from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstans'

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order } = orderDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productReviewCreate = useSelector((state) => state.productReviewCreate)
  const {
    success: successProductReview,
    error: errorProductReview,
  } = productReviewCreate

  useEffect(() => {
    if (successProductReview) {
      alert('Review Submitted')
      setRating(0)
      setComment('')
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
    dispatch(listProductsDetails(match.params.id))
  }, [dispatch, match, successProductReview])

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(match.params.id, { rating, comment }))
  }

  return (
    <>
      <Link className='ml-3' to='/'>
        &lt; Back
      </Link>
      {loading ? (
        <Loader></Loader>
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <>
          <Meta title={product.name} description={product.description} />
          <Row>
            <Col md={4}>
              <Card className='my-3 p-3 rounded border-0'>
                <Card.Img
                  src={product.image}
                  alt={product.name}
                  variant='top'
                  // style={{ width: '70%' }}
                />
                {/* 'fluid' makes image stay in the borders of the container */}
              </Card>
            </Col>
            <Col md={4}>
              <ListGroup variant='flush'>
                {/* 'flush' makes klist with no borders */}
                <ListGroup.Item>
                  <h2>{product.name}</h2>
                </ListGroup.Item>
                <ListGroup.Item>${product.description}</ListGroup.Item>
                {/* <ListGroup.Item>${product.price}</ListGroup.Item> */}
                <ListGroup.Item>
                  <Row>
                    <Col xs={6}>
                      <Rating value={product.rating}></Rating>
                    </Col>
                    <Col xs={6}>
                      <span>{`${product.numReviews} reviews`}</span>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item></ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col xs={3}>Price:</Col>
                    <Col xs={9}>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col xs={3}>Status:</Col>
                    <Col xs={9}>
                      {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col xs={3}>Qty</Col>
                      <Col xs={9}>
                        <Form.Control
                          as='select'
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Button
                    onClick={addToCartHandler}
                    type='button'
                    className='btn-block my-3 rounded-pill border-0'
                    disabled={product.countInStock === 0 || order}
                  >
                    Add To Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <ListGroup variant='flush' className='border-0'>
            <Row className='justify-content-left'>
              <Col md={6}>
                <h3>Reviews</h3>
                {product.reviews.length === 0 && <Message>No Reviews</Message>}
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <Row className='justify-content-left'>
                      <Col xs={12}>
                        <h6>{review.name}</h6>
                      </Col>
                      <Col xs={12}>
                        <sup>{review.createdAt.substring(0, 10)}</sup>
                      </Col>
                      <Col xs={12}>
                        <Rating value={review.rating} className='text-left' />
                      </Col>
                      <Col xs={12} className='my-2'>
                        <i>{review.comment}</i>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </Col>
              <Col md={6}>
                <h3>Add review</h3>
                {errorProductReview && (
                  <Message variant='danger'>{errorProductReview}</Message>
                )}
                <ListGroup.Item>
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1</option>
                          <option value='2'>2</option>
                          <option value='3'>3</option>
                          <option value='4'>4</option>
                          <option value='5'>5</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button type='submit' variant='light'>
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message variant='light'>
                      Pleas <Link to='/login'>Log in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </Col>
            </Row>
          </ListGroup>
        </>
      )}
    </>
  )
}

export default ProductScreen
