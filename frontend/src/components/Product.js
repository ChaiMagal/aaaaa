import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from './Rating'

const Product = ({ product }) => {
  return (
    <Card className='my-3 rounded border-0 text-center'>
      <Link to={`/product/${product._id}`}>
        <Card.Img
          src={product.image}
          variant='top'
          className='rounded'
          // style={{ width: '70%' }}
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as='h6'>${product.price}</Card.Text>
        <Card.Text as='div'>
          <Rating
            value={product.rating}
            // text={`${product.numReviews} reviews`}
          />
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
