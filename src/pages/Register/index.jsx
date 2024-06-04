// Funcionalidades / Libs:
import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import Cookies from "js-cookie";

// Contexts:
import { UserContext } from '../../contexts/userContext';

// Assets:
import Logo from '../../assets/LOGO-BIZSYS_preto.png';

// // Estilo:
// import './style.css';


export default function Register() {
    const atual = new Date(); //cria uma nova instância do objeto Date 
    const anoAtual = atual.getFullYear();

    const emailRef = useRef('');
    const passwordRef = useRef('');
    const passwordConfirmRef = useRef('');
    const [showSenha, setShowSenha] = useState(false);

    const {loadingAuth, logarUser} = useContext(UserContext); 
    
    const navigate = useNavigate();


    //Usar um useEffect que se tiver logado direcione para page home (chamar função no context)
    useEffect(()=> {
        function checkUserLogado() {
        const userCookie = Cookies.get('userLocal');
        if(userCookie) {
            navigate('/home'); //Será checkado a validade do token ao passar no userContenxt
        } 
        } 
        checkUserLogado();
    }, [navigate]);

    async function handleSubmitLogin(e) {
        e.preventDefault();

        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        if(email !== '' && password !== '') {
        await logarUser(email) //colocar email e password
        }        
    } 
  
    return (
        <>
        <main className='Login-container'>
            <div className="grid fadeIn">

            <div className="cabecalho-form">
                <div> <img src={Logo} alt="Logotipo" /> </div>
                <h1>Cadastra-se no ambiente</h1>
            </div>

            <form onSubmit={handleSubmitLogin} autoComplete="off">
                <div className="input-div">
                    <ion-icon name="person-outline"></ion-icon>
                    <input
                        type="email"
                        placeholder='E-mail'
                        ref={emailRef}
                        required
                    />
                </div>

                <div className="input-div">
                    <ion-icon name="key-outline"></ion-icon>
                    <input
                        type={showSenha ? 'text' : 'password'}
                        placeholder='Senha'
                        ref={passwordRef}
                        //   value={password}
                        //   onChange={(e)=> setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="input-div">
                    <ion-icon name="key-outline"></ion-icon>
                    <input
                        type={showSenha ? 'text' : 'password'}
                        placeholder='Confirmar senha'
                        ref={passwordConfirmRef}
                        //   value={password}
                        //   onChange={(e)=> setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="show-senha">
                    <input
                    type="checkbox"
                    id='showSenha'
                    onClick={()=> setShowSenha(!showSenha)}
                    />
                    <label htmlFor="showSenha">Mostrar senha</label>
                </div>

                <button className="btn-primary">
                    {loadingAuth ? 'Verificando...' : 'Cadastrar'}
                </button>
                <Link to='/'>Já tem conta? Faça o Login!</Link>
            </form>

            </div>  
        </main>

        <footer>
            <p>&copy;{anoAtual} Bizsys</p>
        </footer>
        </>
    );
}