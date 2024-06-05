// Funcionalidades / Libs:
// import { useEffect, useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
// import PropTypes from "prop-types";

// Contexts:
import { UserContext } from "../../../contexts/userContext";

// Assets:
import Logo from '../../../assets/LOGO-BIZSYS_preto.png';
// import LogoP from '../../../assets/BIZSYS_logo_icon.png';
// import { TbLogout } from 'react-icons/tb';

// Estilo:
import './style.css';


export function Header() {
    // const [nomeUser, setNomeUser] = useState('');
    const {
        loading,
        userDetails,
        logoutUser, 
    } = useContext(UserContext);
    
    // useEffect(()=> {
    //     async function carregaDadosUser() {
    //         try {
    //             // let dados = await userDetails;
    //             setNomeUser(userDetails.name);
    //         }
    //         catch(erro) {
    //             console.log('Erru')
    //             console.log(erro);
    //         }
    //     }
    //     carregaDadosUser();
    // }, [userDetails]);

    // function closeSidbar() {
    //     let bgSidebar = document.querySelector(".side-background").style;
    //     let sidebar = document.querySelector(".sidebar").style;
    //     bgSidebar.display = 'none';
    //     sidebar.display = 'none';
    // }
    
    // function openSidebar() {
    //     let bgSidebar = document.querySelector(".side-background").style;
    //     let sidebar = document.querySelector(".sidebar").style;
    //     bgSidebar.display = 'block';
    //     sidebar.display = 'block';
    // }

    async function onLogout() {
        logoutUser();
    }


    return (
        <>
        <header className="Header">
            <div className="grid">

                <Link to='/home'>
                    <img src={Logo} alt="Logotipo" />
                    {/* <img src={LogoP} className="imgP" alt="Logotipo" /> */}
                </Link>

                {/* {userDetails.loglevel === 100 && 
                <nav className="menu-desktop">
                    <ul>
                        <li>
                            <NavLink to='/home'>Home</NavLink>
                        </li>
                        <li>
                            <NavLink to='/projetos'>Projetos</NavLink>
                        </li>
                        <li>
                            <NavLink to='/usuarios'>Usuários</NavLink>
                        </li>
                    </ul>
                </nav>}                 */}

                <nav>
                    <span>{loading ? 'carregando' : userDetails?.name}</span>

                    <button
                    className='btn-logout'
                    onClick={onLogout}
                    >
                        <span>Sair</span>
                    </button>
                </nav>

                {/* {userDetails.loglevel === 100 &&
                <button 
                className="btn-menu"
                onClick={openSidebar}
                >
                    <MdMenu size={25}/>
                </button>
                } */}

            </div>
        </header>


        {/* {userDetails.loglevel === 100 && 
        <>
        <div className="side-background" onClick={closeSidbar}></div>
        <aside className="sidebar showSidebar">
            <button 
            className="btn-closeside"
            onClick={closeSidbar}
            >
                <MdClose size={25}/>
            </button>

            <nav>
                <ul>
                    <li>
                        <NavLink to='/home'>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to='/projetos'>Projetos</NavLink>
                    </li>
                    <li>
                        <NavLink to='/usuarios'>Usuários</NavLink>
                    </li>
                </ul>
            </nav>

            <button 
            className='btn-logout'
            onClick={handleClickLogout}
            >
                <span>Sair</span><TbLogout/>
            </button>
        </aside>
        </>        
        } */}
        
        </>
    )
}