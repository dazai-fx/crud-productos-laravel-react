import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alerta } from "../functions";

export const ShowProducts = () => {
  const url = "http://localhost:8000/api/products";

  // Estados para los datos de la API
  const [products, setProducts] = useState([]);
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // Estado para controlar el título del Modal y la operación (1: Añadir, 2: Editar)
  const [operation, setOperation] = useState(1);
  const [titleModal, setTitleModal] = useState("");

  useEffect(() => {
    getProducts();
  }, []);

  // 1. OBTENER PRODUCTOS (GET)
  const getProducts = async () => {
    try {
      const respuesta = await axios.get(url);
      setProducts(respuesta.data);
    } catch (error) {
      show_alerta("Error al conectar con la API", "error", "");
    }
  };

  // 2. PREPARAR EL MODAL (Limpiar inputs o cargar datos existentes)
  const openModal = (op, id = "", description = "", price = "", stock = "") => {
    setId(id);
    setDescription(description);
    setPrice(price);
    setStock(stock);
    setOperation(op);

    if (op === 1) {
      setTitleModal("Registrar Producto");
    } else if (op === 2) {
      setTitleModal("Editar Producto");
    }

    // Foco automático al primer input
    window.setTimeout(() => {
      const input = document.getElementById("description");
      if (input) input.focus();
    }, 500);
  };

  // 3. VALIDAR E ENVIAR PETICIÓN (POST / PUT)
  const validar = () => {
    if (description.trim() === "") {
      show_alerta(
        "Escribe la descripción del producto",
        "warning",
        "description",
      );
    } else if (price === "") {
      show_alerta("Escribe el precio del producto", "warning", "price");
    } else if (stock === "") {
      show_alerta("Escribe el stock del producto", "warning", "stock");
    } else {
      let parametros;
      let metodo;

      if (operation === 1) {
        parametros = {
          description: description.trim(),
          price: price,
          stock: stock,
        };
        metodo = "POST";
      } else {
        parametros = {
          id: id,
          description: description.trim(),
          price: price,
          stock: stock,
        };
        metodo = "PUT";
      }

      enviarSolicitud(metodo, parametros);
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    try {
      let respuesta;
      if (metodo === "POST") {
        respuesta = await axios.post(url, parametros);
      } else if (metodo === "PUT") {
        respuesta = await axios.put(`${url}/${id}`, parametros);
      }

      const msj = respuesta.data.message || "Operación realizada con éxito";
      show_alerta(msj, "success", "");

      // Si la operación fue exitosa, cerrar el modal usando el botón 'close' nativo
      document.getElementById("btnCerrar").click();
      getProducts();
    } catch (error) {
      show_alerta("Error en la solicitud HTTP", "error", "");
    }
  };

  // 4. ELIMINAR PRODUCTO (DELETE)
  const deleteProduct = (id, description) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro de eliminar el producto ${description}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${url}/${id}`);
          show_alerta("Producto eliminado correctamente", "success", "");
          getProducts();
        } catch (error) {
          show_alerta("Error al eliminar el producto", "error", "");
        }
      }
    });
  };

  return (
    <div className="container-fluid mt-4">
      {/* BOTÓN AÑADIR PRODUCTO */}
      <div className="row mt-3">
        <div className="col-md-4 offset-md-4">
          <div className="d-grid mx-auto">
            <button
              onClick={() => openModal(1)}
              className="btn btn-dark"
              data-bs-toggle="modal"
              data-bs-target="#modalProducts"
            >
              <i className="fa-solid fa-circle-plus"></i> Añadir Producto
            </button>
          </div>
        </div>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="row mt-3">
        <div className="col-12 col-lg-8 offset-0 offset-lg-2">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>DESCRIPCIÓN</th>
                  <th>PRECIO</th>
                  <th>STOCK</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {products.length > 0 ? (
                  products.map((product, i) => (
                    <tr key={product.id || i}>
                      <td>{i + 1}</td>
                      <td>{product.description}</td>
                      <td>${product.price}</td>
                      <td>{product.stock}</td>
                      <td>
                        <button
                          onClick={() =>
                            openModal(
                              2,
                              product.id,
                              product.description,
                              product.price,
                              product.stock,
                            )
                          }
                          className="btn btn-warning me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#modalProducts"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button
                          onClick={() =>
                            deleteProduct(product.id, product.description)
                          }
                          className="btn btn-danger"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No hay productos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL BOOTSTRAP PARA AÑADIR / EDITAR */}
      <div id="modalProducts" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">{titleModal}</label>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input type="hidden" id="id" value={id} />

              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="description"
                  className="form-control"
                  placeholder="Descripción"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-dollar-sign"></i>
                </span>
                <input
                  type="number"
                  id="price"
                  className="form-control"
                  placeholder="Precio"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-boxes-stacked"></i>
                </span>
                <input
                  type="number"
                  id="stock"
                  className="form-control"
                  placeholder="Stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="d-grid col-6 mx-auto">
                <button onClick={() => validar()} className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk"></i> Guardar
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button
                id="btnCerrar"
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProducts;
