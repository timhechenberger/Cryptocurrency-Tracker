import axios from 'axios';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useParams } from "react-router-dom";
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

//Tutorial: Chart: https://codesandbox.io/p/devbox/reactchartjs-react-chartjs-2-default-1695r?embed=1&file=%2FApp.tsx%3A2%2C2-23%2C3 | https://react-chartjs-2.js.org/examples/line-chart |  Video: https://www.youtube.com/watch?v=uiW4tArFLkE&t=3322s

const Chart = () => {
    const { id } = useParams();
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=30&api_key=ccdb986ab06821f96baee562ee614f44ec55a2959324e2888ea1ed2ff3db42a2`);
                const data = Object.values(response.data.Data.Data).map(item => ({ x: new Date(item.time * 1000), y: item.close }));
                setChartData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [id]);

    return (
        <>
            {chartData && (
                <div style={{ width: '50%', margin: 'auto', marginTop: '2rem', borderCollapse: 'collapse', backgroundColor: 'gray' }}>
                    <Line
                        data={{
                            datasets: [{
                                label: 'Price',
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
