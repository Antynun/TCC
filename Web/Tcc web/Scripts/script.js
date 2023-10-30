// Carrega a biblioteca Google Charts com o pacote 'corechart'.
google.charts.load('current', { packages: ['corechart'] });

// Variável para armazenar o termo de busca.
let searchTerm = "";

// Define a função de callback que será chamada após o carregamento da biblioteca.
google.charts.setOnLoadCallback(drawCharts);

function drawCharts() {
    // Realiza uma solicitação para buscar o arquivo CSV de dados.
    fetch('./scripts/data.csv')
        .then(response => response.text())
        .then(data => {
            console.log("Dados CSV buscados com sucesso.");
            const lines = data.split('\n');

            // Cria um objeto para organizar os dados por item.
            const dataByItem = {};

            // Itera pelas linhas do arquivo CSV.
            for (let i = 1; i < lines.length; i++) { // Começa do índice 1 para pular o cabeçalho
                const line = lines[i];
                const columns = line.split(',');
                console.log("Colunas:", columns); // Registra as colunas para visualizar seus valores
                
                // Verifica se a linha possui pelo menos 5 colunas (nome, preço, etc.).
                if (columns.length >= 5) {
                    const name = columns[0].trim();
                    const price = parseFloat(columns[1].replace(/\"/g, '').trim());
                    const timestamp = columns[4].replace(/\"/g, '').trim();
                
                    // Verifica se o preço é um número válido.
                    if (!isNaN(price)) {
                        if (!dataByItem[name]) {
                            dataByItem[name] = {};
                        }
                        // Adiciona o preço ao item correspondente, indexado pela data.
                        const dateParts = timestamp.split(' ')[0].split('-');
                        const day = dateParts[2];
                        const month = dateParts[1];
                        const formattedDate = `${day}/${month}`;
                        if (!dataByItem[name][formattedDate]) {
                            dataByItem[name][formattedDate] = price;
                        }
                    }
                }
            }

            // Filtra os dados com base no termo de busca.
            const filteredDataByItem = {};

            for (const name in dataByItem) {
                if (dataByItem.hasOwnProperty(name)) {
                    if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
                        filteredDataByItem[name] = dataByItem[name];
                    }
                }
            }

            // Itera pelos itens filtrados e cria gráficos para cada um.
            for (const name in filteredDataByItem) {
                if (filteredDataByItem.hasOwnProperty(name)) {
                    // Cria uma tabela de dados do Google Charts.
                    const dataTable = new google.visualization.DataTable();
                    dataTable.addColumn('string', 'Data');
                    dataTable.addColumn('number', 'Preço Total');
                    
                    // Preenche a tabela com os dados do item.
                    for (const date in filteredDataByItem[name]) {
                        if (filteredDataByItem[name].hasOwnProperty(date)) {
                            dataTable.addRow([date, filteredDataByItem[name][date]]);
                        }
                    }
            
                    // Define as opções para o gráfico.
                    const options = {
                        title: name,
                        hAxis: {
                            title: 'Data'
                        },
                        vAxis: {
                            title: 'Preço Total',
                        },
                        legend: 'none'
                    };
            
                    // Cria um gráfico de linha do Google Charts em um contêiner HTML.
                    const chart = new google.visualization.LineChart(document.createElement('div'));
                    chart.draw(dataTable, options);
                    const chartContainer = document.createElement('div');
                    chartContainer.appendChild(chart.getContainer());
                    // Adiciona o gráfico ao elemento com o ID 'chart'.
                    document.getElementById('chart').appendChild(chartContainer);
                }
            }
        })
        .catch(error => {
            console.error('Erro ao carregar o CSV:', error);
        });
}

// Adiciona um evento de clique para o botão de busca.
document.getElementById('searchButton').addEventListener('click', function() {
    searchTerm = document.getElementById('searchInput').value;
    // Limpa os gráficos existentes.
    document.getElementById('chart').innerHTML = "";
    // Desenha os gráficos com base no novo termo de busca.
    drawCharts();
});
