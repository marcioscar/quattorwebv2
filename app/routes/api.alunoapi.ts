import { getAluno, getAlunoGym } from "@/utils/aluno.server";

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
 
// let { searchParams } = new URL(request.url);
 
// let param = searchParams?.get("registration");
// const registration = param? parseInt(param): 0
  
 
    
// const alunoa = await getAluno(registration );
//  const aluno = alunoa[0]? alunoa[0]: '';

//  let alunoGym = [];
// 	if (aluno.membershipStatus === "Inactive") {
// 		const alunoGymtudo = await getAlunoGym(Number(registration));
// 		alunoGym = alunoGymtudo.map((a: any) => a.gympassId);
// 	}

// 	// const alunoPhoto = _.filter(aluno.memberships, { membershipStatus: "active" }).map(
// 	// 	(n) => n.photoUrl
// 	// );
// const student = {
//     photo : aluno.photoUrl,
//     name: aluno.firstName +' '+ aluno.lastName,
//     status: aluno.membershipStatus,
//     registration: aluno.idMember
// }
	

//     if (!aluno.idMember) {
// 		return {
// 			message: "Aluno não encontrado",
// 		};
// 	}
// 	if (aluno.membershipStatus === "Inactive" && alunoGym[0] === null) {
// 		return {
// 			message: "Seu plano está Inativo Favor procurar recepção",
// 		};
// 	}
//     return json({ student});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  
    switch (request.method) {
    case "POST": {
            const param = await request.json();
            const registration = param? parseInt(param.registration): 0
            
            const alunoa = await getAluno(registration );
            const aluno = alunoa[0]? alunoa[0]: '';

        let alunoGym = [];
            if (aluno.membershipStatus === "Inactive") {
                const alunoGymtudo = await getAlunoGym(Number(registration));
                alunoGym = alunoGymtudo.map((a: any) => a.gympassId);
            }

            
        const student = {
            photo : aluno.photoUrl,
            name: aluno.firstName +' '+ aluno.lastName,
            status: aluno.membershipStatus,
            registration: aluno.idMember
        }
            

            if (!aluno.idMember) {
                return {
                    message: "Aluno não encontrado",
                };
            }
            if (aluno.membershipStatus === "Inactive" && alunoGym[0] === null) {
                return {
                    message: "Seu plano está Inativo | Favor procurar recepção",
                };
            }
            return json({ student});
        
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
