import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Navbar, Container, Nav} from 'react-bootstrap'
import CategoryManager from './components/CategoryManager';
import ProductManager from './components/ProductManager';
import CategoryManager2 from './components/CategoryManager2';
import ProductManager2 from './components/ProductManager2';

function App() {
  const [view, setView] = useState('products');

  return (
    <>
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">CRUD Products</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => setView('products')}>Productos</Nav.Link>
            <Nav.Link onClick={() => setView('categories')}>Categorías</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <Container className='mt-4'>
      {view === 'products' ? <ProductManager2 /> : <CategoryManager2 />}
    </Container>
    </>
  )
}

export default App
