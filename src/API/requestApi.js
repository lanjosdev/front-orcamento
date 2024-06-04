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
   console.log('CALL FUNCTION API');

   const response = await axios.get(API_URL + '/grupo', { 
      headers: { "Accept": "application/json" } 
   });

   // console.log(response.data);
   return response.data;
}

// Pega Grupo pelo ID (READ):
export async function GRUPO_GET_ID(idGrupo) {
   console.log('CALL FUNCTION API');

   const response = await axios.get(API_URL + '/grupo/' + idGrupo, { 
      headers: { "Accept": "application/json" } 
   });

   // console.log(response.data);
   return response.data;
}

// Adiciona novo Grupo (CREATE):
export async function GRUPO_POST_ADD(grupo) {
   console.log('CALL FUNCTION API');

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
// GRUPOS END //


// TAREFAS //
// Pega todos as Tarefas registradas (READ):
export async function TAREFA_GET_ALL() {
   console.log('CALL FUNCTION API');

   const response = await axios.get(API_URL + '/tarefa', { 
      headers: { "Accept": "application/json" } 
   });

   // console.log(response.data);
   return response.data;
}

// Adiciona nova Tarefa (CREATE):
export async function TAREFA_POST_ADD(tarefa, tempo, description) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(API_URL + '/tarefa', {
      "nome": tarefa,
      "tempo": tempo,
      "descricao": description
   },
   { 
      headers: { "Accept": "application/json" } 
   }
   );

   // console.log(response.data);
   return response.data;
}

// Deletar Tarefa (DELETE):
export async function TAREFA_DELETE(idTarefa) {
   console.log('CALL FUNCTION API');

   const response = await axios.delete(API_URL + '/tarefa/' + idTarefa, {
      headers: { "Accept": "application/json" } 
   }
   );

   // console.log(response.data);
   return response.data;
}
// TAREFAS END //


// TAREFAS-GRUPOS //
// Adiciona nova Tarefa-Grupo (CREATE):
export async function TAREFA_GRUPO_ADD(idGrupo, idTarefa, qtd = 1) {
   console.log('CALL FUNCTION API');

   const response = await axios.post(API_URL + '/tarefa-grupo', {
      "grupo_id": idGrupo,
      "tarefa_id": idTarefa,
      "quantidade": qtd
   },
   { 
      headers: { "Accept": "application/json" } 
   }
   );

   // console.log(response.data);
   return response.data;
}
// TAREFAS-GRUPOS END //






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