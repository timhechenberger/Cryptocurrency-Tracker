import axios from 'axios';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Chart = () => {
    const [coinList, setCoinList] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState('');
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchCoinList = async () => {
            try {
                const response = await axios.get('https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD&api_key=ccdb986ab06821f96baee562ee614f44ec55a2959324e2888ea1ed2ff3db42a2');
                const coins = response.data.Data.map(item => ({
                    name: item.CoinInfo.FullName,
                    symbol: item.CoinInfo.Name
                }));
                setCoinList(coins);
        
                if (coins.length > 0) {
                    setSelectedCoin(coins[0].symbol);
                }
            } catch (error) {
                console.error("Error fetching coin list:", error);
            }
        };

        fetchCoinList();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selectedCoin) {
                    const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${selectedCoin}&tsym=USD&limit=30&api_key=ccdb986ab06821f96baee562ee614f44ec55a2959324e2888ea1ed2ff3db42a2`);
                    const data = response.data.Data.Data.map(item => ({
                        x: new Date(item.time * 1000),
                        y: item.close
                    }));
                    setChartData(data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [selectedCoin]);

    const handleCoinChange = (event) => {
        setSelectedCoin(event.target.value);
    };

    return (
        <>
            <div style={{ width: '40%' ,margin: 'auto', marginTop: '1.5rem', textAlign: 'center' }}>
                <label style={{ margin: '1rem', fontFamily: 'sans-serif', fontWeight: 'bold'}}>Select a coin:</label>
                <select id="coin-select" value={selectedCoin} onChange={handleCoinChange}>
                    {coinList.map(coin => (
                        <option key={coin.symbol} value={coin.symbol}>{coin.name}</option>
                    ))}
                </select>
            </div>
            {chartData && (
                <div style={{ width: '50%', margin: 'auto', marginTop: '2rem',  marginBottom: '3.5rem' ,borderCollapse: 'collapse', backgroundColor: 'gray', }}>
                    <Line
                        data={{
                            datasets: [{
                                label: `Price (${selectedCoin})`,
                                data: chartData,
                                borderColor: '#83e6c0',
                                backgroundColor: 'rgba(131, 230, 192, 0.1)',
                                fill: true
                            }]
                        }}
                        options={{
                            scales: {
                                x: {
                                    type: 'time',
                                    time: {
                                        tooltipFormat: 'MMM d, yyyy',
                                        displayFormats: {
                                            day: 'MMM d'
                                        }
                                    },
                                    grid: {
                                        color: 'rgba(131, 230, 192, 0.5)'
                                    },
                                    ticks: {
                                        color: '#83e6c0'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Price (USD)',
                                        color: '#83e6c0',
                                        font: {
                                            size: 14
                                        }
                                    },
                                    grid: {
                                        color: 'rgba(131, 230, 192, 0.5)'
                                    },
                                    ticks: {
                                        color: '#83e6c0'
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    labels: {
                                        color: '#83e6c0',
                                        font: {
                                            size: 14
                                        }
                                    }
                                }
                            }
                        }}
                    />
                </div>
            )}
        </>
    );
}

export default Chart;
