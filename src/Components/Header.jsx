import logo_tracker from '../logo-tracker.jpg' // Generiert von Copilot

const Header = () => {
    return (
        <>
           <div id="header">
                <h1>Cryptocurrency-Tracker</h1>
                <img src={logo_tracker} alt="Crypto Logo"/>
           </div>
        </>
    )
}

export default Header