// Config JSON:
import api from './configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;


// End-Points / Rotas da API:
// LOGIN/REGISTER //
// Adiciona novo Grupo (CREATE):
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

// Edita nome do Grupo (UPDATE):
export async function GRUPO_POST_EDIT(idGrupo, newNome) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(API_URL + '/grupo/' + idGrupo, {
      "nome": newNome,
      "_method": "patch"
   },
   { 
      headers: { "Accept": "application/json" } 
   }
   );

   // console.log(response.data);
   return response.data;
}

// Deletar Grupo (DELETE):
export async function GRUPO_DELETE(idGrupo) {
   console.log('CALL FUNCTION API');

   const response = await axios.delete(API_URL + '/grupo/' + idGrupo, {
      headers: { "Accept": "application/json" } 
   }
   );

   // console.log(response.data);
   return response.data;
}
// LOGIN/REGISTER END //








// Logar usuário
export async function USER_LOGIN(email, password) {
   const response = await axios.post(API_URL + "/login", {
      "email": email,
      "password": password,
   })
   
   const token = response.data.data;
   return token; 
   //Nessa response vem o token que precisa ser salvo em localStorage ou cookies pra manter o usuário autenticado.
}

// Check Token
export async function CHECK_TOKEN(token) {

   await axios.get(API_URL + "api/checkToken", { headers: { Authorization: "Bearer " + token } })
      .then((response)=>{
         console.log(`Status da função CHECK TOKEN: ${response.status}`);
         return (response.status !== 200);
      });
}