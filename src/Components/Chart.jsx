import axios from 'axios';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import 'chartjs-adapter-date-fns';
import Header from './Header';
import { Link } from "react-router-dom";

//Cart components
ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

//https://react-chartjs-2.js.org/components/line -> chart.js
//https://legacy.reactjs.org/docs/hooks-intro.html -> Hooks
//https://www.youtube.com/watch?v=uiW4tArFLkE | https://www.youtube.com/watch?v=5alEc5KuyKg -> Tutorials

const Chart = () => {
    //State variables 
    const [coinList, setCoinList] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState('');
    const [chartData, setChartData] = useState(null);

    // Effect hook to fetch the list of coins on component mount
    useEffect(() => {
        const fetchCoinList = async () => {
            try {
                // CryptoCompare API-Schlüssel | https://min-api.cryptocompare.com/documentation
                const response = await axios.get('https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD&api_key=ccdb986ab06821f96baee562ee614f44ec55a2959324e2888ea1ed2ff3db42a2');
                //Extrahiere daten
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

    // Effect hook to fetch chart data when selected coin changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selectedCoin) {
                    const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${selectedCoin}&tsym=USD&limit=30&api_key=ccdb986ab06821f96baee562ee614f44ec55a2959324e2888ea1ed2ff3db42a2`);
                    // Extracting relevant data for chart visualization
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

    // render component
    return (
        <>  
        <Header/>
            <div style={{ width: '20%' ,margin: 'auto', marginTop: '1.5rem', textAlign: 'center', backgroundColor: 'gray' }}>
                <label style={{ margin: '1rem', fontFamily: 'sans-serif', fontWeight: 'bold'}}>Select a coin:</label>
                <select id="coin-select" value={selectedCoin} onChange={handleCoinChange}>
                    {coinList.map(coin => (
                        <option key={coin.symbol} value={coin.symbol}>{coin.name}</option>
                    ))}
                </select>
            </div>
            {chartData && ( //Chart visualiziation
                <div style={{ width: '50%', margin: 'auto', marginTop: '2rem',  marginBottom: '3.5rem' ,borderCollapse: 'collapse', backgroundColor: 'gray', }}>
                    <Line
                        data={{
                            datasets: [{
                                label: `(${selectedCoin})`,
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

            <div id="LinkChart">
                  <Link to="/">Zurück zur Startseite</Link>
            </div>
        </>

    );
}

export default Chart;