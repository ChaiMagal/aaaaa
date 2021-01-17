import React from 'react'
import { Spinner } from 'react-bootstrap'
const Loader = () => {
  return (
    // <Button
    //   variant='primary'
    //   style={{
    //     margin: '50px auto',
    //     borderRadius: '50px',
    //     padding: '10px',
    //     width: '50px',
    //     height: '50px',
    //     display: 'block',
    //     border: '0',
    //   }}
    // >
    //   <Spinner
    //     as='span'
    //     animation='border'
    //     size='sm'
    //     role='status'
    //     aria-hidden='true'
    //   />
    //   <span className='sr-only'>Loading...</span>
    // </Button>
    <div className='d-flex justify-content-center my-5'>
      <Spinner animation='grow' size='sm' className='mx-1' />
      <Spinner animation='grow' size='sm' className='mx-1' />
      <Spinner animation='grow' size='sm' className='mx-1' />
    </div>
  )
}

export default Loader
