// Funcionalidades / Libs:
import { useContext, useState, useRef } from "react";
import { Link } from "react-router-dom";
// import Cookies from "js-cookie";

// Contexts:
import { UserContext } from '../../contexts/userContext';

// Assets:
import Logo from '../../assets/LOGO-BIZSYS_preto.png';

// Estilo:
import './style.css';


export default function Login() {
    const atual = new Date(); //cria uma nova instância do objeto Date 
    const anoAtual = atual.getFullYear();

    const emailRef = useRef('');
    const passwordRef = useRef('');
    const [showSenha, setShowSenha] = useState(false);

    const { loading, logarUser } = useContext(UserContext);
    // const navigate = useNavigate();


    //Usar um useEffect que se tiver logado direcione para page home (chamar função no context)
    // useEffect(()=> {
    //     function checkUserLogado() {
    //     const userCookie = Cookies.get('userLocal');
    //     if(userCookie) {
    //         navigate('/home'); //Será checkado a validade do token ao passar no userContenxt
    //     } 
    //     } 
    //     checkUserLogado();
    // }, [navigate]);

    async function onSubmitLogin(e) {
        e.preventDefault();

        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        if(email !== '' && password !== '') {
            logarUser(email, password);
        }        
    } 
  
    return (
        <>
        <main className='Login-container'>
            <div className="grid fadeIn">

            <div className="cabecalho-form">
                <div> <img src={Logo} alt="Logotipo" /> </div>
                <h1>Faça seu login no ambiente</h1>
            </div>

            <form onSubmit={onSubmitLogin} autoComplete="off">
                <div className="input-div">
                    <ion-icon name="person-outline"></ion-icon>
                    <input
                        type="email"
                        placeholder='Usuário'
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
                    {loading ? 'Verificando...' : 'Entrar'}
                </button>
                <Link to='/register'>Ainda não tem conta? Cadastra-se!</Link>
            </form>

            </div>  
        </main>

        <footer>
            <p>&copy;{anoAtual} Bizsys</p>
        </footer>
        </>
    );
}