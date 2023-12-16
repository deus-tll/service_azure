import { NavLink } from "react-router-dom";

export const MainNavigation = () => {
    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <ul className="navbar-nav ps-5">
                <li className="nav-item">
                    <NavLink className="nav-link" to="/">
                        Home
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link" to="/login">
                        Login
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className="nav-link" to="/register">
                        Register
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};