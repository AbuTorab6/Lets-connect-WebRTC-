import React,{Fragment} from 'react';

import {Navbar,Nav,Container,NavDropdown} from 'react-bootstrap'
const Navigation = () => {
    return (
        <Fragment>
            <Navbar collapseOnSelect expand="lg" bg="danger" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">Let's connect</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        
                    </Nav>
                    <Nav>
                       
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Fragment>
    );
};

export default Navigation;