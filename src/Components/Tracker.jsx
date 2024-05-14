import React, { useState, useEffect } from "react";
import axios from 'axios';


const Tracker = () => {
    const [cryptoData, setCryptoData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD', {
                    params: {
                        // CryptoCompare API-Schlüssel | https://min-api.cryptocompare.com/documentation
                        api_key: 'ccdb986ab06821f96baee562ee614f44ec55a2959324e2888ea1ed2ff3db42a2' 
                    }
                });

                // Anzeige aller verfügbaren Variablen in der Konsole
                console.log("Verfügbare Variablen der API:", Object.keys(response.data.Data[0]));

                // Extrahiere die relevanten Daten und wandele das Dictionary in ein Array um
                const data = Object.values(response.data.Data).map(item => ({
                    name: item.CoinInfo.FullName,
                    price: item.RAW.USD.PRICE,
                    marketShare: item.DISPLAY.USD.MKTCAP,
                    volume: item.RAW.USD.VOLUME24HOUR
                }));
                
                setCryptoData(data);

            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    //Ausgabe
    return (
        <div id="tracker-container">
             <h2>Tracked-Coins (Top 10)</h2>
            <table>
                <thead> 
                    <tr> 
                        <th>Name</th>
                        <th>Preis (USD)</th>
                        <th>Marktanteil</th>
                        <th>Handelsvolumen (24h)</th>
                    </tr>
                </thead>
                <tbody> 
                    {cryptoData.map((crypto, index) => (
                        <tr key={index}>
                            <td>{crypto.name}</td>
                            <td>{crypto.price}</td>
                            <td>{crypto.marketShare}</td>
                            <td>{crypto.volume}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Tracker;
