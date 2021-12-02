import React, { useState, useEffect } from 'react'
import logo from '../logo.png'
import { LinkContainer } from 'react-router-bootstrap'
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { Cross as Hamburger } from 'hamburger-react'
import { withRouter, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../actions/userActions'
import SearchBox from './SearchBox'

const Header = ({ history }) => {
  //Manage hamburger icon change
  const [isOpen, setOpen] = useState(false)
  const isCollapsed = React.createRef()

  useEffect(() => {
    // console.log(isCollapsed.current.className)
    if (isCollapsed.current.className === 'navbar-toggler collapsed') {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [isCollapsed])

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
    localStorage.clear()
    history.push('/')
    window.location.reload()
  }

  return (
    <header>
      <Navbar
        // bg='dark'
        id='navbarhead'
        variant='dark'
        expand='lg'
        collapseOnSelect
        className='border-0 fixed-top'
        fixed='top'
      >
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              <img
                src={logo}
                alt='logo'
                width='15px'
                height='15px'
                style={{
                  marginTop: '-4px',
                  marginRight: '5px',
                  marginLeft: '10px',
                  fontSize: '10px',
                }}
              />
              <span
                style={{
                  fontSize: '16px',
                }}
              >
                eCommerce
              </span>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle
            aria-controls='basic-navbar-nav'
            style={{ border: 'none', padding: '0' }}
            ref={isCollapsed}
          >
            <Hamburger
              toggled={isOpen}
              toggle={setOpen}
              size={20}
              rounded
            ></Hamburger>
          </Navbar.Toggle>

          <Navbar.Collapse
            style={{
              fontSize: '16px',
            }}
          >
            <Nav
              className='ml-auto'
              style={{
                lineHeight: '2em',
              }}
            >
              <Route
                render={({ history }) => <SearchBox history={history} />}
              />
              <LinkContainer to='/cart'>
                <Nav.Link className='px-3'>
                  <i className='fas fa-shopping-cart'></i>
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown
                  title={
                    <>
                      <i className='fas fa-user' /> &nbsp;{userInfo.name}
                    </>
                  }
                  id='username'
                  className='border-0 rounded px-3 custom-nav'
                  // style={{ backgroundColor: 'white', font: 'black' }}
                >
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item className='border-0 rounded'>
                      Profile
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Log out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link className='px-3'>
                    <i className='fas fa-user px-1'></i>
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title='Admin'
                  id='adminmenue'
                  className='border-0 rounded px-3 custom-nav'
                >
                  <LinkContainer to='/admin/userList'>
                    <NavDropdown.Item className='border-0 rounded'>
                      Users
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productList'>
                    <NavDropdown.Item className='border-0 rounded'>
                      Products
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderList'>
                    <NavDropdown.Item className='border-0 rounded'>
                      Orders
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default withRouter(Header)
