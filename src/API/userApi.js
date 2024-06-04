// Config JSON:
import api from './configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;


// End-Points / Rotas da API:
// LOGIN/REGISTER //
// Adiciona novo usuario (CREATE):
export async function USER_REGISTER(nome, email, senha) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(API_URL + '/register', {
      "name": nome,
      "email": email,
      "password": senha
   },
   { 
      headers: { "Accept": "application/json" } 
   }
   );

   // console.log(response.data);
   return response.data;
}

// Logar usuario:
export async function USER_LOGIN(email, senha) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(API_URL + '/login', {
      "email": email,
      "password": senha
   },
   { 
      headers: { "Accept": "application/json" } 
   }
   );

   // console.log(response.data);
   return response.data;
}

// Pega detalhes do usuario:
export async function USER_DETAILS(token) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(API_URL + '/me', { 
      headers: { "Accept": "application/json", Authorization: "Bearer " + token } 
   });

   // console.log(response.data);
   return response.data;
}
// LOGIN/REGISTER END //