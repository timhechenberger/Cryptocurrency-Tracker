import { Link } from "react-router-dom";
import Header from "../Components/Header";
import stonks from "../Stonks.png" //https://knowyourmeme.com/memes/stonks

const Layout = () => {
    return (
        <div id="layout-container">
                <Header/> 
                <div id="content-container">
                   <Link to="../Components/Tracker">Tracker</Link>
                   <Link to="../Components/Chart">Chart</Link>
                   <img src={stonks} alt="Stonks-Pic" />
                </div>
        </div>  
    )
  };
  
  export default Layout;