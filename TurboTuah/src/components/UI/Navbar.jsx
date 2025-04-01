import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav role="menu">
      <label data-role="burger"><input type="checkbox" /></label>
      <ul role="menubar">
        <li><strong>TurboTinder</strong></li>
      </ul>
      <ul role="menuitem">
        <li><Link to="/">Login</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
