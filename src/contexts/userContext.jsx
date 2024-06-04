// Funcionalidades / Libs:
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import PropTypes from 'prop-types';
import { USER_LOGIN, USER_DETAILS } from "../API/userApi";

// Componentes:
import { toast } from "react-toastify";

// Cria o Contexto e deixe exportado:
export const UserContext = createContext();

UserProvider.propTypes = {
    children: PropTypes.array.isRequired,
}
// Provedor do contexto acima (prove os values(var, states, functions, etc) aos filhos desse provedor):
export default function UserProvider({ children }) {
    const [loading ,setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState(null);

    const navigate = useNavigate();

    // useEffect Carrega dados do Cookies + Check validade token:
    async function checkToken() {
        const tokenCookie = Cookies.get('userToken');  

        if(tokenCookie) {
            // aqui seria bom tbm fazer um checkToken para ver se é valido oq está no cokkie (senão: remove cookie + direcionada para login)
            try {
                const response = await USER_DETAILS(JSON.parse(tokenCookie));
                console.log(response);

                //setUserDetails(JSON.parse(userCookie));
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
            }  
        }
        else {
            console.log('Cookie SEM token');
        }
    }
    useEffect(()=> {
        checkToken();
    }, []);
    

    // Logar usuario:
    async function logarUser(email, senha) {
        setLoading(true);    

        try {
            const response = await USER_LOGIN(email, senha);
            console.log(response);

            toast.success('Login realizado com sucesso!');
            // setUserDetails(response);
            Cookies.set('userToken', JSON.stringify(response.token), { expires: 1 });
            // navigate('/home');
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
    function logoutUser() {
        Cookies.remove('userLocal');
        setUserDetails(null);                
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