import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { Button, Modal, Table } from 'react-bootstrap';

export default function ProductManager2() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const baseUrl='http://localhost:8080/api/products'

  const fetchProducts = () =>{
    axios.get(baseUrl)
    .then(res => setProducts(res.data))
    .catch(err => console.error('Error al cargar categorías', err))
  }

  const fetchCategories = ()

  useEffect(() => {
    fetchProducts();
  }, []);

  const formik = useFormik({
    initialValues: {
      id: '',
      name: '',
      price: '', 
      quantity: '',
      category: ''
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const method = editing ? axios.put : axios.post;
      method(baseUrl, values)
      .then(() => {
        fetchProducts();
        formik.resetForm();
        setEditing(null);
        setShowModal(false);
      })
      .catch(err => console.error(err));
    }
  });

  const openNewForm = () => {
    formik.resetForm();
    setEditing(null);
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  }

  const editProduct = (category) => {
    formik.setValues(category);
    setEditing(true);
    setShowModal(true);
  }

  const deleteProduct = (id) => {
    axios.delete(`${baseUrl}/${id}`)
    .then(fetchProducts)
    .catch(err => console.error(err))
  }

  return (
    <div>
      <h3>Gestión de Productos</h3>

      <Button variant='success' className='mb-3' onClick={openNewForm}>
        Agregar producto
      </Button>

      <Table striped>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td>{p.category ? p.category.name : "Sin Categoría"}</td>
              <td>
              <Button size='sm' variant="warning" className='me-2' onClick={() => editProduct(p)}>Editar</Button>
              <Button size='sm' variant='danger' onClick={() => deleteProduct(p.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={closeModal}>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editing ? 'Editar' : 'Agregar'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <input
                    type="text"
                    name="name"
                    className="form-control mb-2"
                    placeholder="Nombre"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                  <input
                    type="number"
                    name="price"0
                    className="form-control mb-2"
                    placeholder="Precio"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                  />
                  <input
                    type="number"
                    name="quantity"
                    className="form-control mb-2"
                    placeholder="Cantidad"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                  />
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={closeModal}>Cancelar</Button>
                        <Button type="submit" variant='primary'>
                          {editing ? 'Actualizar' : 'Guardar'}
                        </Button>
          </Modal.Footer>
        </form>
      </Modal>


    </div>
  )
}
