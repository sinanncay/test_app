import axios from "axios";

const host = "https://rickandmortyapi.com/api/character/";

export async function ApiFunction(url: string, data: {}, method: 'get' | 'post' | 'put' | 'delete')  {
        try {
          let response = await axios[method](host + url, data);
           return response;
        } catch (error: any) { // Read Error Function here
          debugger
          if(error.response){
            return error.response.data.error // 
          }else{
            return error.message; //Network Errors
          }
         
        }

  }