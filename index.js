const canvas = document.getElementById("canvas").getContext("2d");

let plot = undefined;

const setup = () => {
  plot = new Chart(canvas, {
    type: "line",
    data: { datasets: [] },
  });

  const [lambda, n, a, d] = [600, 20, 0.1, 0.2];

  document.getElementById("lambda").value = lambda;
  document.getElementById("n").value = n;
  document.getElementById("a").value = a;
  document.getElementById("d").value = d;

  make_plot(make_data(lambda, n, a, d));
}

const make_plot = (data) => {
  plot.destroy();
  plot = new Chart(canvas, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Интенсивность",
          borderColor: "rgba(200, 77, 123, .8)",
          data: data,
          lineTension: 0.4,
          pointRadius: 0
        },
      ]
    },
    options: {
      bezierCurve: false,
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: { display: true, text: "sin θ (синус угла дифракции)" }
        },
        y: {
          type: "linear",
          position: "left",
          title: { display: true, text: "I, Вт / м^2" }
        }
      },
      layout: {
        padding: 50,
      },
    }
  });
}

const sinc = x => Math.sin(x) / x;

const make_data = (lambda, n, a, d) => {
  const result = [];
  const i0 = 1;
  lambda = lambda / Math.pow(10, 9); // nano metre -> metre
  a = a / Math.pow(10, 6); // micro metre -> metre
  d = d / Math.pow(10, 6); // micro metre -> metre
  const b = d - a;

  const left_border = -1;
  const right_border = 1;
  const size = right_border - left_border;
  const step = size / 1000;

  for (let x = left_border; x < right_border; x += step) {
    const first = sinc(Math.PI * a * x / lambda);
    const second = Math.sin(n * Math.PI * b * x / lambda) / Math.sin(Math.PI * b * x / lambda);
    result.push({
      x: x,
      y: i0 * Math.pow(first, 2) * Math.pow(second, 2)
    });
  }

  return result;
}

const parse_input = () => {
  return [
    parseFloat(document.getElementById("lambda").value),
    parseFloat(document.getElementById("n").value),
    parseFloat(document.getElementById("a").value),
    parseFloat(document.getElementById("d").value),
  ]
}

const isInt = x => {
  if (isNaN(x)) return false;
  return (x | 0) === x;
}

const run = () => {
  const [lambda, n, a, d] = parse_input();
  if (isNaN(lambda) || !isInt(n) || isNaN(a) || isNaN(d)) {
    alert("Некорретный ввод!");
    return;
  }
  if (lambda <= 0 || n <= 0 || a <= 0 || d <= 0) {
    alert("Некорретный ввод!");
    return;
  }
  if (a >= d) {
    alert("Некорретный ввод! Ширина щели не может быть больше или равна периоду");
    return;
  }
  make_plot(make_data(lambda, n, a, d));
}
