import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { Button, Modal, Table } from 'react-bootstrap';

export default function CategoryManager2() {''
    const [categories, setCategories] = useState([]);
    const [editing, setEditing] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const baseUrl = 'http://localhost:8080/api/categories';

    const fetchCategories = () => {
        axios.get(baseUrl)
        .then(res => setCategories(res.data))
        .catch(err => console.error('Error al cargar categorías', err));
    }

    useEffect (() => {
        fetchCategories();
    },[])

    const formik = useFormik({
        initialValues: {
            id: '',
            name: ''
        },
        enableReinitialize: true, 
        onSubmit: (values) => {
          const method = editing ? axios.put : axios.post;
          method(baseUrl, values)
          .then(() => {
            fetchCategories();
            formik.resetForm();
            setEditing(null);
            setShowModal(false);
          })
          .catch(err => console.error(err))
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

    const editCategory = category =>{
      formik.setValues(category);
      setEditing(true);
      setShowModal(true);
    };

    const deleteCategory = id => {
      axios.delete(`${baseUrl}/${id}`)
      .then(fetchCategories)
      .catch(err => console.error('Error al eliminar', err))
    }
  return (
    <div>
      <h3>Gestión de Categorías</h3>

      <Button variant="success" className='mb-3' onClick={openNewForm}>
        Agregar categoría
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>
                <Button size="sm" variant="warning" className='me-2' onClick={() => editCategory(c)}>Editar</Button>
                <Button size="sm" variant="danger" onClick={() => deleteCategory(c.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={closeModal}>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editing ? 'Editar' : 'Agregar'} Categoría </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              name="name"
              className='form-control'
              placeholder='Nombre'
              value={formik.values.name}
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
