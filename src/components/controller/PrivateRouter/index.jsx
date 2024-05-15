// Funcionalidades / Libs:
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from "js-cookie";
import PropTypes from 'prop-types';




export default function PrivateRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [jogou, setJogou] = useState(false);

    useEffect(()=> {
        function verificaCookie() {
            const hasCookie = Cookies.get('FantaKey');

            if(hasCookie) {
                setJogou(true);
            }

            setLoading(false);            
        }
        verificaCookie();
    }, []);
    

    return (
        <>
        {loading ? (
            <h1 className='title-loading'>Carregando...</h1>
        ) : (
            
            !jogou ? (
                children
            ) : (
                <Navigate to='/blocked' />
            )
        
        )}
        </>
    )        
}

PrivateRoute.propTypes = {
    children: PropTypes.array.isRequired,
}