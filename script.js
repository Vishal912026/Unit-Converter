const units = {
  Length: {
    Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001,
    Mile: 1609.344, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254,
  },
  Weight: {
    Kilogram: 1, Gram: 0.001, Milligram: 0.000001, Quintal: 100,
    Tonne: 1000, Pound: 0.45359237, Ounce: 0.028349523125,
  },
  Volume: {
    Litre: 1, Millilitre: 0.001, "Cubic Meter": 1000,
    Gallon: 3.785411784, Cup: 0.2365882365, "Fluid Ounce": 0.0295735296,
  },
  Speed: {
    "Meter/second": 1, "Kilometer/hour": 0.277777778,
    "Mile/hour": 0.44704, Knot: 0.514444444,
  },
  Temperature: { Celsius: null, Fahrenheit: null, Kelvin: null },
};

const tabsEl = document.getElementById("tabs");
const fromValue = document.getElementById("fromValue");
const toValue = document.getElementById("toValue");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const resultText = document.getElementById("resultText");
const swapBtn = document.getElementById("swapBtn");
const copyBtn = document.getElementById("copyBtn");
const themeBtn = document.getElementById("themeBtn");

let category = "Length";

function convertTemp(value, from, to) {
  let c;
  if (from === "Celsius") c = value;
  else if (from === "Fahrenheit") c = (value - 32) * 5 / 9;
  else c = value - 273.15;

  if (to === "Celsius") return c;
  if (to === "Fahrenheit") return c * 9 / 5 + 32;
  return c + 273.15;
}

function convert() {
  const value = parseFloat(fromValue.value);
  if (isNaN(value)) {
    toValue.value = "";
    resultText.textContent = "Enter a number";
    return;
  }
  const from = fromUnit.value;
  const to = toUnit.value;
  let result;

  if (category === "Temperature") {
    result = convertTemp(value, from, to);
  } else {
    const base = value * units[category][from];
    result = base / units[category][to];
  }

  const rounded = parseFloat(result.toPrecision(10));
  toValue.value = rounded;
  resultText.textContent = `${value} ${from} = ${rounded} ${to}`;
}

function loadUnits() {
  const names = Object.keys(units[category]);
  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";
  names.forEach((n) => {
    fromUnit.add(new Option(n, n));
    toUnit.add(new Option(n, n));
  });
  fromUnit.value = names[0];
  toUnit.value = names[1];
  convert();
}

function buildTabs() {
  Object.keys(units).forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "tab" + (cat === category ? " active" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      category = cat;
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      btn.classList.add("active");
      loadUnits();
    });
    tabsEl.appendChild(btn);
  });
}

swapBtn.addEventListener("click", () => {
  const temp = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = temp;
  convert();
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(resultText.textContent);
  copyBtn.textContent = "Copied ✓";
  setTimeout(() => (copyBtn.textContent = "Copy result"), 1500);
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  themeBtn.textContent = dark ? "☀️" : "🌙";
  try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
});

try {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
  }
} catch (e) {}

[fromValue, fromUnit, toUnit].forEach((el) => el.addEventListener("input", convert));

buildTabs();
loadUnits();