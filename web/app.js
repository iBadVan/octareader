const warningDefs = [
  {
    key: "alto_azucar",
    label: "ALTO EN AZÚCAR",
    short: "AZÚCAR",
    description: "Supera el umbral regulado de azúcar."
  },
  {
    key: "alto_sodio",
    label: "ALTO EN SODIO",
    short: "SODIO",
    description: "Supera el umbral regulado de sodio."
  },
  {
    key: "alto_grasas_saturadas",
    label: "ALTO EN GRASAS SATURADAS",
    short: "GRASAS SAT.",
    description: "Supera el umbral de grasas saturadas."
  },
  {
    key: "contiene_grasas_trans",
    label: "CONTIENE GRASAS TRANS",
    short: "GRASAS TRANS",
    description: "El producto contiene grasas trans."
  }
];

const state = {
  a: emptyProfile(),
  b: emptyProfile()
};

function emptyProfile() {
  return Object.fromEntries(warningDefs.map(w => [w.key, 0]));
}

function renderWarnings(product) {
  const root = document.getElementById(product === "a" ? "warningsA" : "warningsB");
  root.innerHTML = "";

  warningDefs.forEach(def => {
    const button = document.createElement("button");
    button.className = "warning";
    button.dataset.key = def.key;
    button.innerHTML = `
      <div class="octagon">${def.short.replace(" ", "<br>")}</div>
      <div>
        <strong>${def.label}</strong>
        <small>Seleccionar / quitar</small>
      </div>
    `;
    button.addEventListener("click", () => {
      state[product][def.key] = state[product][def.key] ? 0 : 1;
      button.classList.toggle("active", Boolean(state[product][def.key]));
      updateAll();
    });
    root.appendChild(button);
  });
}

function updateButtons(product) {
  const root = document.getElementById(product === "a" ? "warningsA" : "warningsB");
  root.querySelectorAll(".warning").forEach(button => {
    button.classList.toggle("active", Boolean(state[product][button.dataset.key]));
  });
}

function updateProfiles() {
  document.getElementById("profileA").textContent = JSON.stringify(state.a, null, 2);
  document.getElementById("profileB").textContent = JSON.stringify(state.b, null, 2);
}

function statusBadge(value) {
  return `<span class="badge ${value ? "yes" : "no"}">${value ? "SÍ" : "NO"}</span>`;
}

function updateComparison() {
  const table = document.getElementById("comparisonTable");
  table.innerHTML = `
    <div class="row header">
      <div>Advertencia</div>
      <div>Producto A</div>
      <div>Producto B</div>
      <div>Resultado</div>
    </div>
  `;

  warningDefs.forEach(def => {
    const same = state.a[def.key] === state.b[def.key];
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div><strong>${def.label}</strong></div>
      <div>${statusBadge(state.a[def.key])}</div>
      <div>${statusBadge(state.b[def.key])}</div>
      <div><span class="badge ${same ? "same" : "diff"}">${same ? "COINCIDE" : "DIFIERE"}</span></div>
    `;
    table.appendChild(row);
  });

  const aCount = Object.values(state.a).reduce((s, n) => s + n, 0);
  const bCount = Object.values(state.b).reduce((s, n) => s + n, 0);
  const shared = warningDefs.filter(w => state.a[w.key] && state.b[w.key]).map(w => w.label);
  const onlyA = warningDefs.filter(w => state.a[w.key] && !state.b[w.key]).map(w => w.label);
  const onlyB = warningDefs.filter(w => !state.a[w.key] && state.b[w.key]).map(w => w.label);

  const bits = [
    `Producto A: <strong>${aCount}</strong> advertencia(s). Producto B: <strong>${bCount}</strong> advertencia(s).`
  ];

  if (shared.length) bits.push(`Coinciden en: <strong>${shared.join(", ")}</strong>.`);
  if (onlyA.length) bits.push(`Solo A presenta: <strong>${onlyA.join(", ")}</strong>.`);
  if (onlyB.length) bits.push(`Solo B presenta: <strong>${onlyB.join(", ")}</strong>.`);

  bits.push("OctaReader no interpreta estas diferencias como cantidad nutricional ni determina cuál producto es más saludable.");
  document.getElementById("interpretation").innerHTML = bits.join(" ");
}

function updateAll() {
  updateProfiles();
  updateComparison();
}

function bindUploader(product) {
  const suffix = product.toUpperCase();
  const input = document.getElementById(`file${suffix}`);
  const drop = document.getElementById(`drop${suffix}`);
  const preview = document.getElementById(`preview${suffix}`);
  const content = document.getElementById(`dropContent${suffix}`);
  const status = document.getElementById(`state${suffix}`);

  function loadFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.style.display = "block";
      content.style.opacity = "0";
      status.textContent = "Imagen cargada";
      drop.classList.add("scanning");
      setTimeout(() => drop.classList.remove("scanning"), 2600);
    };
    reader.readAsDataURL(file);
  }

  input.addEventListener("change", () => loadFile(input.files[0]));
  ["dragenter", "dragover"].forEach(event => {
    drop.addEventListener(event, e => {
      e.preventDefault();
      drop.classList.add("dragover");
    });
  });
  ["dragleave", "drop"].forEach(event => {
    drop.addEventListener(event, e => {
      e.preventDefault();
      drop.classList.remove("dragover");
    });
  });
  drop.addEventListener("drop", e => loadFile(e.dataTransfer.files[0]));
}

function createSvgData(label, color) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="560">
    <defs>
      <linearGradient id="g" x1="0" x2="1">
        <stop offset="0" stop-color="${color}"/>
        <stop offset="1" stop-color="#111820"/>
      </linearGradient>
    </defs>
    <rect width="900" height="560" rx="38" fill="url(#g)"/>
    <rect x="48" y="48" width="804" height="464" rx="28" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.16)"/>
    <text x="74" y="116" fill="white" font-family="Arial" font-size="26" font-weight="700">${label}</text>
    <text x="74" y="162" fill="rgba(255,255,255,.62)" font-family="Arial" font-size="15">OCTAREADER DEMO PRODUCT</text>
    <circle cx="690" cy="305" r="110" fill="rgba(255,255,255,.07)"/>
    <rect x="74" y="384" width="410" height="24" rx="12" fill="rgba(255,255,255,.11)"/>
    <rect x="74" y="428" width="310" height="16" rx="8" fill="rgba(255,255,255,.08)"/>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function loadExample() {
  state.a = {
    alto_azucar: 1,
    alto_sodio: 0,
    alto_grasas_saturadas: 1,
    contiene_grasas_trans: 0
  };
  state.b = {
    alto_azucar: 0,
    alto_sodio: 1,
    alto_grasas_saturadas: 1,
    contiene_grasas_trans: 0
  };

  document.getElementById("previewA").src = createSvgData("Producto A", "#263d12");
  document.getElementById("previewB").src = createSvgData("Producto B", "#172e48");
  ["A", "B"].forEach(suffix => {
    document.getElementById(`preview${suffix}`).style.display = "block";
    document.getElementById(`dropContent${suffix}`).style.opacity = "0";
    document.getElementById(`state${suffix}`).textContent = "Demo cargada";
    const drop = document.getElementById(`drop${suffix}`);
    drop.classList.add("scanning");
    setTimeout(() => drop.classList.remove("scanning"), 2600);
  });

  updateButtons("a");
  updateButtons("b");
  updateAll();
}

function resetAll() {
  state.a = emptyProfile();
  state.b = emptyProfile();

  ["A", "B"].forEach(suffix => {
    const preview = document.getElementById(`preview${suffix}`);
    preview.removeAttribute("src");
    preview.style.display = "none";
    document.getElementById(`dropContent${suffix}`).style.opacity = "1";
    document.getElementById(`state${suffix}`).textContent = "Sin imagen";
    document.getElementById(`file${suffix}`).value = "";
  });

  updateButtons("a");
  updateButtons("b");
  updateAll();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
}

document.querySelectorAll("[data-copy]").forEach(button => {
  button.addEventListener("click", async () => {
    const product = button.dataset.copy;
    await navigator.clipboard.writeText(JSON.stringify(state[product], null, 2));
    showToast("JSON copiado");
  });
});

renderWarnings("a");
renderWarnings("b");
bindUploader("a");
bindUploader("b");
updateAll();

document.getElementById("loadExample").addEventListener("click", loadExample);
document.getElementById("resetAll").addEventListener("click", resetAll);
