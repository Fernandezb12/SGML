export function buildDonut(canvas, data) {
  if (!window.Chart || !canvas) return;
  const context = canvas.getContext('2d');
  const dataset = data.map((item) => item.cantidad);
  const labels = data.map((item) => item.estado || item.label);
  const colors = ['#006837', '#a0001e', '#f2b705', '#0a9e67', '#f2542d', '#3a506b'];

  return new Chart(context, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: dataset,
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            font: {
              family: 'Poppins',
            },
          },
        },
      },
    },
  });
}
