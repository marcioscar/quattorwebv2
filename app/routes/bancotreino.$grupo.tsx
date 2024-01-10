import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { getExercicios, updateTreino } from "~/utils/treinos.server";
import { FaSave } from "react-icons/fa";
import { useState } from "react";

export const loader: LoaderFunction = async ({ request, params }) => {
	const exercicio = await getExercicios(params.grupo);

	return exercicio;
};
export const action: ActionFunction = async ({ request, params }) => {
	const form = await request.formData();
	let values = Object.fromEntries(form);

	// await updateCadastroTreino(id, nome, repeticoes, carga, obs, execid, video);
	const treinos = await updateTreino(values);
	// return treinos;

	return redirect(`${treinos.id}`);
};

export default function Grupocadastrado() {
	const { exercicios } = useLoaderData<typeof loader>();

	const [semana, setSemana] = useState("");
	const [grupo, setGrupo] = useState("");
	return (
		<>
			<div className='flex'>
				<select
					onChange={(event) => setSemana(event.target.value)}
					id='semana'
					name='semana'
					className='rounded-md col-span-2 border-2 form-control block
                          w-full '>
					<option value='01'>01 - (31/12 a 06/01)</option>
					<option value='02'>02 - (07/01 a 13/01)</option>
					<option value='03'>03 - (14/01 a 20/01)</option>
					<option value='04'>04 - (21/01 a 27/01)</option>
					<option value='05'>05 - (28/01 a 03/02)</option>
					<option value='06'>06 - (04/02 a 10/02)</option>
					<option value='07'>07 - (11/02 a 17/02)</option>
					<option value='08'>08 - (18/02 a 24/02)</option>
					<option value='09'>09 - (25/02 a 02/03)</option>
					<option value='10'>10 - (03/03 a 09/03)</option>
					<option value='11'>11 - (10/03 a 16/03)</option>
					<option value='12'>12 - (17/03 a 23/03)</option>
					<option value='13'>13 - (24/03 a 30/03)</option>
					<option value='14'>14 - (31/03 a 06/04)</option>
					<option value='15'>15 - (07/04 a 13/04)</option>
					<option value='16'>16 - (14/04 a 20/04)</option>
					<option value='17'>17 - (21/04 a 27/04)</option>
					<option value='18'>18 - (28/04 a 04/05)</option>
					<option value='19'>19 - (05/05 a 11/05)</option>
					<option value='20'>20 - (12/05 a 18/05)</option>
					<option value='21'>21 - (19/05 a 25/05)</option>
					<option value='22'>22 - (26/05 a 01/06)</option>
					<option value='23'>23 - (02/06 a 08/06)</option>
					<option value='24'>24 - (09/06 a 15/06)</option>
					<option value='25'>25 - (16/06 a 22/06)</option>
					<option value='26'>26 - (23/06 a 29/06)</option>
					<option value='27'>27 - (30/06 a 06/07)</option>
					<option value='28'>28 - (07/07 a 13/07)</option>
					<option value='29'>29 - (14/07 a 20/07)</option>
					<option value='30'>30 - (21/07 a 27/07)</option>
					<option value='31'>31 - (28/07 a 03/08)</option>
					<option value='32'>32 - (04/08 a 10/08)</option>
					<option value='33'>33 - (11/08 a 17/08)</option>
					<option value='34'>34 - (18/08 a 24/08)</option>
					<option value='35'>35 - (25/08 a 31/08)</option>
					<option value='36'>36 - (01/09 a 07/09)</option>
					<option value='37'>37 - (08/09 a 14/09)</option>
					<option value='38'>38 - (15/09 a 21/08)</option>
					<option value='39'>39 - (22/09 a 28/08)</option>
					<option value='40'>40 - (29/09 a 05/10)</option>
					<option value='41'>41 - (06/10 a 12/10)</option>
					<option value='42'>42 - (13/10 a 19/10)</option>
					<option value='43'>43 - (20/10 a 26/10)</option>
					<option value='44'>44 - (27/10 a 02/11)</option>
					<option value='45'>45 - (03/11 a 09/11)</option>
					<option value='46'>46 - (10/11 a 16/11)</option>
					<option value='47'>47 - (17/11 a 23/11)</option>
					<option value='48'>48 - (24/11 a 30/11)</option>
					<option value='49'>49 - (01/12 a 07/12)</option>
					<option value='50'>50 - (08/12 a 14/12)</option>
					<option value='51'>51 - (15/12 a 21/12)</option>
					<option value='52'>52 - (22/12 a 28/12)</option>
					<option value='53'>53 - (29/12 a 04/01)</option>
				</select>
				<select
					onChange={(event) => setGrupo(event.target.value)}
					id='grupo'
					name='grupo'
					className='rounded-md border-2 form-control block
                          w-full col-span-2 bg-transparent  '>
					<option value=''>Selecione o grupo</option>
					<option value='PEITORAL'>PEITORAL</option>
					<option value='OMBROS'>OMBROS</option>
					<option value='MEMBROS SUPERIORES 1'>MEMBROS SUPERIORES 1</option>
					<option value='COSTAS'>COSTAS</option>
					<option value='MEMBROS SUPERIORES 2'>MEMBROS SUPERIORES 2</option>
					<option value='BICEPS'>BICEPS</option>
					<option value='TRICEPS'>TRICEPS</option>
					<option value='QUADS'>QUADS</option>
					<option value='POSTERIORES DE COXAS'>POSTERIORES DE COXAS</option>
					<option value='GLUTEOS'>GLUTEOS</option>
					<option value='PANTURRILHA'>PANTURRILHA</option>
					<option value='ABDOME'>ABDOME</option>
					<option value='MEMBROS INFERIORES GERAL'>
						MEMBROS INFERIORES GERAL
					</option>
					<option value='MEMBROS SUPERIORES GERAL'>
						MEMBROS SUPERIORES GERAL
					</option>
					<option value='INICIANTE 1'>INICIANTE 1</option>
					<option value='INICIANTE 2'>INICIANTE 2</option>
					<option value='INICIANTE 3'>INICIANTE 3</option>
					<option value='INICIANTE 4'>INICIANTE 4</option>
				</select>
			</div>
			<ul>
				<div className='grid grid-cols-12 py-2 gap-2'>
					<div className='col-span-3 font-light text-sm text-sky-500'>
						Número
					</div>
					<div className='col-span-8 font-light text-sm text-sky-500'>Nome</div>
				</div>
				{exercicios.map((exec: any, index: any) => (
					<li key={exec.execid} className='py-1  '>
						<Form method='post'>
							<input
								type='text'
								defaultValue={semana}
								hidden
								name='semana'
								id='semana'
							/>
							<input
								type='text'
								defaultValue={grupo}
								hidden
								name='grupo'
								id='grupo'
							/>
							<div className='grid grid-cols-12  gap-2'>
								<input
									className='col-span-2 bg-transparent'
									type='text'
									id='index'
									readOnly
									disabled
									defaultValue={index + 1}
								/>
								<input
									hidden
									type='text'
									id='execid'
									name='execid'
									defaultValue={exec.execid}
								/>

								<input
									type='text'
									id='nome'
									name='nome'
									readOnly
									defaultValue={exec.nome}
									className='col-span-5 bg-transparent  '
								/>

								<input
									type='text'
									id='carga'
									name='carga'
									hidden
									defaultValue={exec.carga}
									className='col-span-2 bg-stone-50 border-b-2 '
								/>

								<input
									type='text'
									id='repeticoes'
									name='repeticoes'
									hidden
									defaultValue={exec.Repeticoes}
									className='col-span-2 bg-stone-50 border-b-2'
								/>

								<input
									type='text'
									id='obs'
									name='obs'
									hidden
									defaultValue={exec.obs}
									className='col-span-3 text-sm bg-stone-50 border-b-2'
								/>
								<input
									type='text'
									id='video'
									name='video'
									hidden
									defaultValue={exec.video}
									className='col-span-3 text-sm bg-stone-50 border-b-2'
								/>

								<div className='grid justify-items-center grid-cols-1 gap2'>
									<button
										className='flex content-center text-green-500 bg-stone-100 '
										type='submit'
										name='_action'
										value='save'>
										<FaSave />
									</button>
								</div>
							</div>
						</Form>
					</li>
				))}
			</ul>

			<div className='text-center  font-semibold text-red-600 mt-6'>
				{grupo + "  "} {semana}
			</div>
			<Outlet />
		</>
	);
}
