document.addEventListener("DOMContentLoaded", () => {
  const mesesPCI = document.getElementById("mesesPCI");
  const inflacionesContainer = document.getElementById("inflacionesContainer");
  const calcularBtn = document.getElementById("calcularBtn");
  const resultadoDiv = document.getElementById("resultado");
  const detalleCalculoDiv = document.getElementById("detalleCalculo");
  const verCalculoBtn = document.getElementById("verCalculoBtn");
  const imagenBtn = document.getElementById("imagenBtn");
  const whatsappBtn = document.getElementById("whatsappBtn");
  const resultadoCard = document.getElementById("resultadoCard");

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

    // Mostrar resultado
    resultadoDiv.classList.remove("d-none");
    resultadoDiv.innerHTML = `
          <strong>Alquiler actual:</strong> $${alquilerActual.toFixed(2)}<br>
          <strong>Depósito actual:</strong> $${depositoActual.toFixed(2)}<br>
          <hr>
          <strong>Alquiler nuevo:</strong> $${alquilerNuevo.toFixed(2)}<br>
          <strong>Depósito nuevo:</strong> $${depositoNuevo.toFixed(2)}<br>
          <strong>Diferencia de depósito:</strong> $${diferenciaDeposito.toFixed(
            2
          )}
        `;

    // Fórmula estilo producto
    let formula = `${alquilerActual.toFixed(2)}`;
    inflaciones.forEach((pci) => {
      formula += ` × (${pci}/100 + 1)`;
    });
    formula += ` = ${alquilerNuevo.toFixed(2)}`;

    // Detalle
    detalleCalculoDiv.innerHTML = `
          <h6 class="fw-bold">Detalle del cálculo</h6>
          <p>${formula}</p>
          <p>Depósito actual: $${depositoActual.toFixed(2)}</p>
          <p>Depósito nuevo: $${depositoNuevo.toFixed(2)}</p>
          <p><strong>Diferencia:</strong> $${diferenciaDeposito.toFixed(2)}</p>
        `;

    // Mostrar botones
    verCalculoBtn.classList.remove("d-none");
    imagenBtn.classList.remove("d-none");
    whatsappBtn.classList.remove("d-none");
    detalleCalculoDiv.classList.add("d-none");

    // Descargar como imagen
    imagenBtn.onclick = () => {
      const contenedor = document.getElementById("resultadoContainer");
      html2canvas(contenedor).then((canvas) => {
        const link = document.createElement("a");
        link.download = "resultado.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    };

    // Compartir en WhatsApp (si navegador soporta API)
    // Compartir en WhatsApp (imagen)
    whatsappBtn.onclick = () => {
      const contenedor = document.getElementById("resultadoContainer");
      html2canvas(contenedor).then((canvas) => {
        canvas.toBlob((blob) => {
          const file = new File([blob], "resultado.png", { type: "image/png" });
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

  // Toggle detalle
  verCalculoBtn.addEventListener("click", () => {
    detalleCalculoDiv.classList.toggle("d-none");
    verCalculoBtn.textContent = detalleCalculoDiv.classList.contains("d-none")
      ? "Ver cálculo"
      : "Ocultar cálculo";
  });
});
