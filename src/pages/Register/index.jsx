// Funcionalidades / Libs:
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { USER_REGISTER } from "../../API/userApi";

// Contexts:
// import { UserContext } from '../../contexts/userContext';

// Componentes:
import { toast } from "react-toastify";

// Assets:
import Logo from '../../assets/LOGO-BIZSYS_preto.png';

// // Estilo:
// import './style.css';

export default function Register() {
    const atual = new Date(); //cria uma nova instância do objeto Date 
    const anoAtual = atual.getFullYear();
    const [loading, setLoading] = useState(false);
    const [errorShow, setErrorShow] = useState(false);

    const nomeRef = useRef('');
    const emailRef = useRef('');
    const senhaRef = useRef('');
    const senhaConfirmRef = useRef('');
    const [showSenha, setShowSenha] = useState(false);

    // const {loadingAuth, logarUser} = useContext(UserContext); 
    
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


    async function handleSubmitRegister(e) {
        e.preventDefault();
        setErrorShow(false);

        const nome = nomeRef.current?.value;
        const email = emailRef.current?.value;
        const senha = senhaRef.current?.value;
        const senhaConfirm = senhaConfirmRef.current?.value;

        if(nome !== '' && email !== '' && senha !== '' && senhaConfirm !== '') {
            setLoading(true);
            
            if(senha == senhaConfirm) {
                console.log('registrando...');
                console.log(nome);
                console.log(email);
                console.log(senha);

                try {
                    const response = await USER_REGISTER(nome, email, senha);
                    console.log(response);

                    toast.success('Cadastro realizado com sucesso!');
                }
                catch(erro) {
                    console.log('Deu erro: ');
                    console.log(erro);

                    if(erro.response.status == 422) {
                        toast.error('Email já cadastrado!');
                        emailRef.current.focus();
                    }
                    else {
                        toast.error('Erro ao cadastrar!');
                    }
                }
            }
            else {
                setErrorShow(true);
                senhaRef.current.focus();
                toast.error('Confirme a senha corretamente!')
            }
        }
        else {
            toast.error('Preencha todos os campos!');
        }      
        
        setLoading(false);
    } 
  
    return (
        <>
        <main className='Login-container'>
            <div className="grid fadeIn">

            <div className="cabecalho-form">
                <div> <img src={Logo} alt="Logotipo" /> </div>
                <h1>Cadastra-se no ambiente</h1>
            </div>

            <form onSubmit={handleSubmitRegister} autoComplete="off">
                <div className="input-div">
                    <ion-icon name="person-outline"></ion-icon>
                    <input
                        type="text"
                        placeholder='Seu nome'
                        ref={nomeRef}
                        required
                    />
                </div>

                <div className="input-div">
                    <ion-icon name="at-outline"></ion-icon>
                    <input
                        type="email"
                        placeholder='Seu e-mail'
                        ref={emailRef}
                        required
                    />
                </div>

                <div className="input-div">
                    <ion-icon name="key-outline"></ion-icon>
                    <input
                        className={errorShow ? 'erro' : ''}
                        type={showSenha ? 'text' : 'password'}
                        placeholder='Senha'
                        ref={senhaRef}
                        required
                    />
                </div>

                <div className="input-div">
                    <ion-icon name="key-outline"></ion-icon>
                    <input
                        className={errorShow ? 'erro' : ''}
                        type={showSenha ? 'text' : 'password'}
                        placeholder='Confirmar senha'
                        ref={senhaConfirmRef}
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
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
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