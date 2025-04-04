import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const[showModal, setShowModal] = useState(false);

  const fetchCategories = () => {
    axios.get('http://localhost:8080/api/categories')
    .then(res => setCategories(res.data))
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      id: '',
      name: ''
    },
    enableReinitialize: true, 
    onSubmit: (values) => {
      const method = editing ? axios.put: axios.post;
      method('http://localhost:8080/api/categories', values)
      .then(() => {
        fetchCategories();
        formik.resetForm();
        setEditing(null);
        setShowModal(false);
      })
      .catch(err => console.error ('Error al guardar', err));
    }
  });

  const editCategory = (categorie) => {
    formik.setValues(categorie);
    setEditing(true);
    setShowModal(true);
  }

  const deleteCategory = id => {
    axios.delete(`http://localhost:8080/api/categories/${id}`)
    .then(fetchCategories)
    .catch(err => console.error('Error al eliminar', err));
};


  return (
    <div>
    <h3> Gestión de Categorías </h3>

    <button class="btn btn-success mb-3" onClick={() => {
      formik.resetForm();
      setEditing(null);
      setShowModal(true);
    }}>
      Agregar categoría
      </button>

      <table class="table table-striped">
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
                <button class="btn btn-sm btn-warning me-2" onClick={() => editCategory(c)}>Editar</button>
                <button class="btn btn-sm btn-danger" onClick={() => deleteCategory(c.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div class="modal show d-block" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <form onSubmit={formik.handleSubmit}>
              <div class="modal-header">
                <h5 class="modal-title">Modal title</h5>
                <button type="button" class="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <input 
                  type="text"
                  name="name"
                  class="form-control mb-2"
                  placeholder='Nombre'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" class="btn btn-primary">
                  {editing ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      )

      }
    </div>
  )

}
