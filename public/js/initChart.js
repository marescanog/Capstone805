document.addEventListener('DOMContentLoaded', (event) => {
    const dataString = document.getElementById('chartData').value;
    if (dataString) {
      const chartData = JSON.parse(dataString);
      const ctx = document.getElementById('myChart').getContext('2d');
      const myChart = new Chart(ctx, {
        type: 'bar', // or 'line', 'pie', etc.
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'Sales Over Time',
            data: chartData.values,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  });