import { Link } from "react-router-dom";

const LogNavbar = ({ setIsLoggedIn }) => {

    const handleLogout = async () => { 
        await fetch("http://localhost:5000/logout", { 
          method: "POST", 
          credentials: "include" 
        });
        setIsLoggedIn(false);
      };

  return (
    <nav role="menu">
      <label data-role="burger"><input type="checkbox" /></label>
      <ul role="menubar">
        <li><strong>TurboTinder</strong></li>
      </ul>
      <ul role="menuitem">
        <li><Link to="/home">Me & myself</Link></li>
        <li><Link to="/match">Match w noone</Link></li>
        <li><Link to="/chat">Chat</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default LogNavbar;
