import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export function show_alerta(mensaje, icono, foco = "") {
  MySwal.fire({
    title: mensaje,
    icon: icono,
  }).then(() => {
    onfocus(foco);
  });
}

function onfocus(foco) {
  if (foco !== "") {
    const element = document.getElementById(foco);
    if (element) {
      element.focus();
    }
  }
}
