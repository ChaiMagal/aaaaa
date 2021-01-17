import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import Meta from '../components/Meta'
import ProductCarousel from '../components/ProductCarousel'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'

const HomeScreen = ({ history, match }) => {
  const keyword = match.params.keyword

  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, products, error, page, pages } = productList

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order } = orderDetails

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
    if (order) {
      history.push(`/order/${order._id}`)
    }
  }, [dispatch, order, history, keyword, pageNumber])

  return (
    <>
      <Meta />
      {!keyword ? (
        <div className='mb-3'>
          <ProductCarousel />
        </div>
      ) : (
        <Link to='/' className='btn btn-light mb-5'>
          &lt; Back
        </Link>
      )}
      {loading ? (
        <Loader></Loader>
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <>
          <h6>Products</h6>
          <Row>
            {products.map((product) => (
              <Col key={product._id} xs={6} sm={4} md={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  )
}

export default HomeScreen
