import { getHistorico, getHistoricoExeDate, getPlaned, updateHistoricoExe } from "@/utils/aluno.server";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";


export const loader = async ({ request,params }: LoaderFunctionArgs) => {
 let { searchParams } = new URL(request.url);
  let register = searchParams?.get("register");
    const historic = await getHistoricoExeDate(register);
    const scheduled = await getPlaned(register)
    console.log(scheduled)
    console.log(historic)
    return json({historic, scheduled});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  
    switch (request.method) {
    case "POST": {
         const param = await request.json();
         return updateHistoricoExe(param)
        
    }
    case "PUT": {
      /* handle "PUT" */
    }
    case "PATCH": {
      /* handle "PATCH" */
    }
    case "DELETE": {
      /* handle "DELETE" */
    }
  }
};
