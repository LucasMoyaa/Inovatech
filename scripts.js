var humidityValue = 0;
var tempValue = 0;
var smokeValue = 0;

document.addEventListener('DOMContentLoaded', function() {
    const temperatureValueElement = document.querySelector('#temperature-value');
    const thermometerFillElement = document.querySelector('#thermometer-fill');
    const alertSound = document.getElementById('alert-sound');
    const humidityValueElement = document.querySelector('#humidity-value');
    const humidityFillElement = document.querySelector('#humidity-fill');
    const smokeValueElement = document.querySelector('#smoke-value')
    const ctx = document.getElementById('myChart').getContext('2d');

    let chartData = {
        labels: ['0h', '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h'],
        datasets: [{
            label: 'Dados de Qualidade do Ar',
            data: [10, 20, 15, 25, 30, 28, 22, 18, 16, 20, 25, 27, 30, 28, 26, 24, 22, 20, 18, 15, 12, 10, 8, 5],
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
        }]
    };

    let myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: false, // Desativar a responsividade
            maintainAspectRatio: false,
            aspectRatio: 2, // Proporção personalizada
        }
    });

    function updateSensorData() {
        let smoke = "Não Detectada";
        tempValue = Math.floor(Math.random() * 50);
        thermometerHeightPercentage = (tempValue / 50) * 100;
        humidityValue = Math.floor(Math.random() * 100);
        smokeValue = Math.floor(Math.random() * 50);

        if(smokeValue > 10){
            smoke = "Detectada"
        }

        smokeValueElement.textContent = `${smoke}`;
        temperatureValueElement.textContent = `${tempValue}°C`;
        humidityValueElement.textContent = `${humidityValue}%`;
        humidityFillElement.style.width = `${humidityValue}%`;
        thermometerFillElement.style.width = `${thermometerHeightPercentage}%`;

        if (tempValue >= 50) {
            document.body.classList.add('temperature-alert');
            alertSound.play();
        } else {
            document.body.classList.remove('temperature-alert');
            alertSound.pause();
        }

        // Atualize os dados do gráfico a cada hora
        chartData.datasets[0].data.push(tempValue);
        chartData.datasets[0].data.shift();
        myChart.update();
    }
    
    updateSensorData();
    // Chame a função de atualização a cada hora (3600000 milissegundos)
    setInterval(function(){
        updateSensorData();
    }, 60000); // 3600000
});
