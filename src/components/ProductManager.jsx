import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Cargar productos al iniciar
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:8080/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error al cargar productos', err));
  };

  const formik = useFormik({
    initialValues: {
      id: '',
      name: '',
      price: '',
      quantity: ''
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const method = editing ? axios.put : axios.post;
      method('http://localhost:8080/api/products', values)
        .then(() => {
          fetchProducts();
          formik.resetForm();
          setEditing(null);
          setShowModal(false);
        })
        .catch(err => console.error('Error al guardar', err));
    }
  });

  const editProduct = (product) => {
    formik.setValues(product);
    setEditing(true);
    setShowModal(true);
  };

  const deleteProduct = (id) => {
    axios.delete(`http://localhost:8080/api/products/${id}`)
      .then(fetchProducts)
      .catch(err => console.error('Error al eliminar', err));
  };

  return (
    <div>
      <h3>Gestión de Productos</h3>

      <button className="btn btn-success mb-3" onClick={() => {
        formik.resetForm();
        setEditing(null);
        setShowModal(true);
      }}>
        Agregar producto
      </button>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.quantity}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => editProduct(p)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={formik.handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{editing ? 'Editar' : 'Agregar'} Producto</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
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
                    name="price"
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
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">
                    {editing ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManager;