document.addEventListener('DOMContentLoaded', function() {
    const temperatureValueElement = document.querySelector('#temperature-value');
    const thermometerFillElement = document.querySelector('#thermometer-fill');
    const alertSound = document.getElementById('alert-sound');
    const humidityValueElement = document.querySelector('#humidity-value');
    const humidityFillElement = document.querySelector('#humidity-fill');
    const smokeValueElement = document.querySelector('#smoke-value')
    const ctx = document.getElementById('myChart').getContext('2d');

    const serverURL = 'http://localhost:8080/api/v1/monitoramento';

    let lastMonitoramentoData;

    fetch(serverURL,
        {
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json",
            },
            method: "GET"
        })
        .then(function (res) {
            if(res.status >= 200 && res.status <= 299){
                console.log(res)
                res.json().then((monitoramento) => {

                    lastMonitoramentoData = monitoramento[monitoramento.length - 1];
                
                    let chartData = {
                            labels: ['0h', '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h'],
                            datasets: [{
                                label: 'Dados de Qualidade do Ar',
                                data: monitoramento.map(x => x.temperatura),
                                borderColor: 'blue',
                                backgroundColor: 'rgba(0, 0, 255, 0.2)'
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
                        tempValue = lastMonitoramentoData.temperatura
                        thermometerHeightPercentage = (tempValue / 50) * 100;
                        humidityValue = lastMonitoramentoData.umidade;
                        smokeValue = lastMonitoramentoData.fumaca;
                
                        if(smokeValue == true){
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
                        if(lastMonitoramentoData.id != monitoramento[monitoramento.length - 1].id){
                            monitoramento.push(lastMonitoramentoData);
                            chartData.datasets[0].data.push(tempValue); // verificar id
                        }
                        if(chartData.datasets[0].data.length == 25){
                            chartData.datasets[0].data = [];
                        }
                        
                        myChart.update();
                    }

                    updateSensorData();
                    
                    // Chame a função de atualização a cada hora (3600000 milissegundos)
                    setInterval(function(){
                        lastMonitoramentoAPI();
                        updateSensorData();
                    }, 6000); // 3600000 tentar sincronizar com hora da api
                })

            }})
            
        .catch(function (res) { console.log(res) })

    function lastMonitoramentoAPI(){
        fetch(serverURL + '/last',
            {
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json",
                },
                method: "GET"
            })
            .then(function (res) {
                if(res.status >= 200 && res.status <= 299){
                    console.log(res)
                    res.json().then((monitoramento) => {
                        lastMonitoramentoData = monitoramento;
                    })
                }
            })
            .catch(function (res) { console.log(res) })
        }
});



