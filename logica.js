document.addEventListener("DOMContentLoaded", () => {
  const mesesPCI = document.getElementById("mesesPCI");
  const inflacionesContainer = document.getElementById("inflacionesContainer");
  const calcularBtn = document.getElementById("calcularBtn");
  const detalleCalculoDiv = document.getElementById("detalleCalculo");
  const imagenBtn = document.getElementById("imagenBtn");
  const whatsappBtn = document.getElementById("whatsappBtn");
  const resultadoCard = document.getElementById("resultadoCard");
  const nombreInquilino = document.getElementById("inquilinoNombre");
  const mesInicial = document.getElementById("mesInicial");
  const anioInicial = document.getElementById("anioInicial");
  const mesFinal = document.getElementById("mesFinal");
  const anioFinal = document.getElementById("anioFinal");

  // Generar inputs dinámicos
  mesesPCI.addEventListener("change", () => {
    inflacionesContainer.innerHTML = "";
    const cantidad = parseInt(mesesPCI.value);
    for (let i = 1; i <= cantidad; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "form-control form-control-sm mb-2";
      input.placeholder = `Inflación mes ${i} (%)`;
      inflacionesContainer.appendChild(input);
    }
  });

  // Calcular
  calcularBtn.addEventListener("click", () => {
    const alquilerInput = document.getElementById("alquilerActual");
    const depositoMeses = document.getElementById("depositoMeses").value;

    const alquilerActual =
      parseFloat(alquilerInput.value.replace(/\./g, "").replace(",", ".")) || 0;
    const factorDeposito = parseFloat(depositoMeses) || 0;

    // Inflaciones
    const inflacionInputs = inflacionesContainer.querySelectorAll("input");
    let inflaciones = [];
    inflacionInputs.forEach((input) => {
      const valor = parseFloat(input.value.replace(",", "."));
      if (!isNaN(valor)) {
        inflaciones.push(valor);
      }
    });

    // Calculo
    let factorInflacion = 1;
    inflaciones.forEach((pci) => {
      factorInflacion *= 1 + pci / 100;
    });
    const alquilerNuevo = alquilerActual * factorInflacion;

    const depositoActual = alquilerActual * factorDeposito;
    const depositoNuevo = alquilerNuevo * factorDeposito;
    const diferenciaDeposito = depositoNuevo - depositoActual;

    // Meses y años seleccionados
    const mesIni = parseInt(mesInicial.value);
    const anioIni = parseInt(anioInicial.value);
    const mesFin = parseInt(mesFinal.value);
    const anioFin = parseInt(anioFinal.value);

    // Nombres de meses
    const mesesNombres = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Generar detalle de IPC con mes/año
    let ipcDetalle = "";
    let mesActual = mesIni;
    let anioActual = anioIni;
    inflaciones.forEach((pci, idx) => {
      ipcDetalle += `<li>${mesesNombres[mesActual - 1]} ${anioActual}: <strong>${pci}%</strong></li>`;
      mesActual++;
      if (mesActual > 12) {
        mesActual = 1;
        anioActual++;
      }
    });

    // Fórmula estilo producto
    let formula = `${alquilerActual.toFixed(2)}`;
    inflaciones.forEach((pci) => {
      formula += ` × (${pci}/100 + 1)`;
    });
    formula += ` = ${alquilerNuevo.toFixed(2)}`;

    // Detalle
    detalleCalculoDiv.innerHTML = `
          <h6 class="fw-bold">Detalle del cálculo</h6>
          <strong>Nombre:</strong> ${nombreInquilino.value}<br>
          <strong>Período:</strong> ${mesesNombres[mesIni - 1]} ${anioIni} a ${mesesNombres[mesFin - 1]} ${anioFin}<br>
          <ul>${ipcDetalle}</ul>
          <p>${formula}</p>
          <hr>
          <p><strong>Alquiler actual:</strong> $${alquilerActual.toFixed(2)}</p>
          <p><strong>Alquiler nuevo:</strong> $${alquilerNuevo.toFixed(2)}</p>
          <hr>
          <p><strong>Depósito actual:</strong> $${depositoActual.toFixed(2)}</p>
          <p><strong>Depósito nuevo:</strong> $${depositoNuevo.toFixed(2)}</p>
          <p><strong>Diferencia de depósito:</strong> $${diferenciaDeposito.toFixed(2)}</p>
          <hr>
          <p><strong>Total a abonar:</strong> $${alquilerNuevo.toFixed(2)} + $${diferenciaDeposito.toFixed(2)} = $${(diferenciaDeposito + alquilerNuevo).toFixed(2)}</p>
        `;

    // Mostrar detalle directamente
    detalleCalculoDiv.classList.remove("d-none");

    // Mostrar botones
    imagenBtn.classList.remove("d-none");
    whatsappBtn.classList.remove("d-none");

    // Descargar como imagen
    imagenBtn.onclick = () => {
      const contenedor = document.getElementById("resultadoContainer");
      const nombreArchivo = `${nombreInquilino.value} ${mesesNombres[mesFin - 1]}-${anioFin}`.replace(/[\s\/]+/g, "_");
      html2canvas(contenedor).then((canvas) => {
        const link = document.createElement("a");
        link.download = `${nombreArchivo}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    };

    // Compartir en WhatsApp (imagen)
    whatsappBtn.onclick = () => {
      const contenedor = document.getElementById("resultadoContainer");
      const nombreArchivo = `${nombreInquilino.value} ${mesesNombres[mesFin - 1]}-${anioFin}`.replace(/[\s\/]+/g, "_");
      html2canvas(contenedor).then((canvas) => {
        canvas.toBlob((blob) => {
          const file = new File([blob], `${nombreArchivo}.png`, { type: "image/png" });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator
              .share({
                files: [file],
                title: "Resultado alquiler",
                text: "Aquí está el cálculo del alquiler 📊",
              })
              .catch((err) => console.log("Error al compartir:", err));
          } else {
            alert(
              "Tu navegador no soporta compartir imágenes directamente. Usa 'Descargar como imagen' y envíala manualmente."
            );
          }
        });
      });
    };
  });
});

