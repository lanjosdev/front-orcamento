// Funcionalidades / Libs:
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import PropTypes from 'prop-types';
import { USER_LOGIN, USER_DETAILS, USER_LOGOUT } from "../API/userApi";

// Componentes:
import { toast } from "react-toastify";

// Cria o Contexto e deixe exportado:
export const UserContext = createContext();

UserProvider.propTypes = {
    children: PropTypes.array.isRequired,
}
// Provedor do contexto acima (prove os values(var, states, functions, etc) aos filhos desse provedor):
export default function UserProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState(null);

    const navigate = useNavigate();


    /// USEEFFECT ============================================================================ ///
    //Verifica se tem 'userDetails' salvo localmente(cookie) (no 1o render):
    function checkUserDetails() {
        setLoading(true);
        console.log('/// UseEffect Context');
        const userCookie = Cookies.get('userDetails');

        console.log('CookieDetails: ', userCookie || 'REMOVIDO');
        if(userCookie) {
            setUserDetails(JSON.parse(userCookie));
        }

        //setLoading(false);
    }
    useEffect(()=> checkUserDetails(), []);

    //Salva localmente(cookie) a cada alteração no state 'userDetails':
    function salvaUserDetailsCookie() {
        console.log('StateDetails ',userDetails);
        if(userDetails) {
            Cookies.set('userDetails', JSON.stringify(userDetails), { expires: 1 });  
        }
        else {
            Cookies.remove('userDetails');
        }

        setLoading(false);
    }
    useEffect(salvaUserDetailsCookie, [userDetails]);
    /// USEEFFECT-END ============================================================================ ///
    

    // (USAR NO PRIVATE ROUTE?) useEffect Check validade token > e alimenta userDetails + cookieUserDados:
    async function checkToken() {
        setLoading(true);
        console.log('Call function checkToken context...');
        const tokenCookie = Cookies.get('userToken');  

        if(tokenCookie) {
            // aqui seria bom tbm fazer um checkToken para ver se é valido oq está no cokkie (senão: remove cookie + direcionada para login)
            try {
                const response = await USER_DETAILS(JSON.parse(tokenCookie));
                //console.log(response);

                setUserDetails(response);
                //Cookies.set('userDados', JSON.stringify(response), { expires: 1 });
                //Cookies.set('userRegistros', JSON.stringify(response.registros), { expires: 1 });
            }   
            catch(erro) {
                console.log('Deu erro: ');
                console.log(erro);

                if(erro.response.status === 401) {
                    console.log('TOKEN INVALIDO');
                }
                else {
                    console.log('Algum erro ao pegar detalhes do user');
                }

                //setUserDetails(null);
            }  
            finally {
                setLoading(false);
            }
        }
        else {
            console.log('Cookie SEM token');
        }
    }
    
    // Logar usuario:
    async function logarUser(email, senha) {
        setLoading(true);    
        console.log('Call function Logar context...');

        try {
            const response = await USER_LOGIN(email, senha);
            console.log(response);

            toast.success('Login realizado com sucesso!');
            Cookies.set('userToken', JSON.stringify(response.token), { expires: 1 });
            await checkToken();
            navigate('/home');
        }
        catch(erro) {
            console.log('Deu erro: ');
            console.log(erro);

            if(erro.response.status === 401) {
                toast.error(erro.response.data.erro); //texto que chegou do erro
            }
            else {
                toast.error('Erro ao fazer login!');
            }
        }
        finally {
            setLoading(false);
        }
    }

    // Logout usuario:
    async function logoutUser() {
        setLoading(true);    
        console.log('Call function Logout context...');
        const tokenCookie = Cookies.get('userToken'); 

        if(tokenCookie) {
            try {
                const response = await USER_LOGOUT(JSON.parse(tokenCookie));
                console.log(response);
    
                toast.info('Usuário deslogado.');
            }
            catch(erro) {
                console.log('Deu erro: ');
                console.log(erro);
    
                if(erro.response.status === 401) {
                    console.log(erro.response.data.erro); //texto que chegou do erro
                }
                else {
                    console.log('Erro ao deslogar');
                }
            }
        }

        setUserDetails(null);                
        Cookies.remove('userToken');
        Cookies.remove('userDetails');

        setLoading(false);
        navigate('/');
    }

    
    return (
        <UserContext.Provider
            value={{
                logado: !!userDetails, //se for null = false OU true
                userDetails,
                loading,
                logarUser,
                logoutUser
            }}  
        >
            {children}
        </UserContext.Provider>
    )
}