import React, { useState, useEffect} from "react";
import { Navbar, Container, Nav, NavDropdown, Button, Dropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "./../util/auth.js";

function NavbarCustom(props) {
  const auth = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setIsMobile(true);
    }
  }, [])

  return (
    <Navbar bg={props.bg} variant={props.variant} expand={props.expand} style={{paddingTop: isMobile ? 20 : 0}}>
      <Container>
        {isMobile ? 
          <Navbar.Brand>
            <img
              className="d-inline-block align-top"
              src={props.logo}
              alt="Logo"
              height="30"
              className="mt-3"
            />
          </Navbar.Brand> 
          : 
          <LinkContainer to="/">
            <Navbar.Brand>
              <img
                className="d-inline-block align-top"
                src={props.logo}
                alt="Logo"
                height="30"
                className="mt-3"
              />
            </Navbar.Brand>
          </LinkContainer>
        }
        {!isMobile && (
          <>
          <Navbar.Toggle aria-controls="navbar-nav" className="border-0" />
          <Navbar.Collapse id="navbar-nav" className="justify-content-end">
            <Nav>
              {auth.user && (
                <NavDropdown id="dropdown" title="Account" alignRight={true}>
                  <LinkContainer to="/dashboard">
                    <NavDropdown.Item active={false}>Dashboard</NavDropdown.Item>
                  </LinkContainer>
  
                  <LinkContainer to="/alerts">
                    <NavDropdown.Item active={false}>Alerts</NavDropdown.Item>
                  </LinkContainer>
  
                  {auth.user && auth.user.admin && (
                    <LinkContainer to="/posts">
                      <NavDropdown.Item active={false}>Posts</NavDropdown.Item>
                    </LinkContainer>
                  )}
  
                  <Dropdown.Divider />
  
                  <LinkContainer to="/auth/signout">
                    <NavDropdown.Item
                      active={false}
                      onClick={(e) => {
                        e.preventDefault();
                        auth.signout();
                      }}
                    >
                      Sign out
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
  
              {!auth.user && (
                <Nav.Item>
                  <LinkContainer to="/auth/signin">
                    <Nav.Link active={false}>Sign in</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              )}
              <LinkContainer to="/download">
                <Button className="ml-2">Download</Button>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
}

export default NavbarCustom;
