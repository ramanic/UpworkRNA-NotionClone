import axios from "axios";
import {env} from "@/env.mjs";
import {getCookie} from "@clerk/nextjs/dist/types/server/utils";
export async function getUser(token?:string) {
    console.log('Token',token)
    if(!token){
        return null;
    }
    try{
    const user= await axios.get(process.env.NEXT_PUBLIC_AUTH_FRONTEND!+'/api/profile',{
        params:{
            token:token
        },

    });
    console.log(user)
        return user.data;
    }catch (e){
        console.log(e);
        return null;
    }
}