// Config JSON:
import api from './configApi.json';
// Funcionalidades / Libs:
import axios from "axios";

// Variaveis:
// Base URL: http://10.10.0.210:8000/api
export const API_URL = api.api_url;


// End-Points / Rotas da API:
// GRUPOS //
// Pega todos os Grupos registrados (READ):
export async function GRUPO_GET_ALL() {
   const response = await axios.get(API_URL + '/grupo', { 
      headers: { "Accept": "application/json" } 
   });

   // console.log(response.data);
   return response.data;
}

// Pega Grupo pelo ID (READ):
export async function GRUPO_GET_ID(idGrupo) {
   const response = await axios.get(API_URL + '/grupo/' + idGrupo, { 
      headers: { "Accept": "application/json" } 
   });

   // console.log(response.data);
   return response.data;
}

// Adiciona novo Grupo (CREATE):
export async function GRUPO_POST_ADD(grupo) {
   const response = await axios.post(API_URL + '/grupo', {
      "nome": grupo
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
// GRUPOS END //






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
  
 // Lista todos os Usuários cadastrados
 export async function USER_GET_ALL(token) {
    const response = await axios.get(API_URL + "/user", { headers: { Authorization: "Bearer " + token } })
 
    console.log(response)
 }
 
 // Encontrar usuário por string
 export async function USER_FIND_BY_STRING(text, token) {
    const response = await axios.get(API_URL + `/user/find/${text}`, { headers: { Authorization: "Bearer " + token } })
 
    console.log(response)
 }
 
 // Encontrar usuário por ID
 //CONFIRMAR COM O RENATO SE O IDENTIFICADOR É NUMBER OU STRING COMO APONTA NA DOCUMENTAÇÃO
 export async function USER_FIND_BY_ID(id, token) {
    const response = await axios.get(API_URL + `/user/find${id}`, { headers: { Authorization: "Bearer " + token } })
 
    console.log(response)
 }