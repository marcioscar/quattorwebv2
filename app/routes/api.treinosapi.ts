import { getTreinos } from "@/utils/treinos.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const treinos = await getTreinos(0o1);
  const grupos = treinos.map((t)=>t.grupo) 
    return json({ grupos });
};

