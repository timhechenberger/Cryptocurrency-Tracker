import logo_main from '../logo-tracker.jpg'

const Header = () => {
    return (
        <>
           <div id="header">
                <h1>Cryptocurrency-Tracker</h1>
                <img src={logo_main} alt="Crypto Logo"/>
           </div>
        </>
    )
}

export default Header