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
      <head>
        <link rel="shortcut icon" type="image/x-icon" href="favicon.svg" />
      </head>

      <ul role="menuitem">
        <li><Link to="/home">Profile</Link></li>
        <li><Link to="/match">Matches</Link></li>
        <li><Link to="/chat">Chat</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default LogNavbar;
