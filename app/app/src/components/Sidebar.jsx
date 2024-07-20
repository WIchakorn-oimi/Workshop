import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import config from "../config";
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
    const [user, setUser] = useState({});
    const navaigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/user/info', config.headers());

            if (res.data.result !== undefined) {
                setUser(res.data.result);
            }

        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const hendleSingOut = async () => {
        try {
            const button = await Swal.fire({
                title: 'Singout',
                text: 'OK',
                icon: 'question',
                showCancelButton: 'true',
                showConfirmButton: 'true'
            })

            if (button.isConfirmed) {
                localStorage.removeItem('token');
                navaigate('/')
            }


        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    return <>
        <aside className="main-sidebar sidebar-dark-primary elevation-4">

            <Link to="/home" className="brand-link">
                <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: ".8" }} />
                <span className="brand-text font-weight-light">BackOffice</span>
            </Link>


            <div className="sidebar">
                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div className="image">
                        <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
                    </div>
                    <div className="info">
                        <Link to="#" className="d-block">
                            {user.name}
                        </Link>
                        <button className="btn btn-danger" onClick={hendleSingOut}>
                            <i className="fa fa-times mr-2"></i>Sing Out
                        </button>
                    </div>
                </div>

                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

                        <li className="nav-header">
                            Menu
                        </li>
                        <li className="nav-item">
                            <Link to="/dashboard" className="nav-link">
                                <i className="nav-icon fas fa-columns"></i>
                                <p>
                                    DashBoard
                                </p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/product" className="nav-link">
                                <i className="nav-icon far fa-box"></i>
                                <p>
                                    Product
                                    <span className="badge badge-info right">2</span>
                                </p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/billSale" className="nav-link">
                                <i className="nav-icon far fa-list"></i>
                                <p>
                                    Sales report
                                </p>
                            </Link>
                        </li>
  
                    </ul>
                </nav>
            </div>
        </aside>
    </>
}

export default Sidebar;