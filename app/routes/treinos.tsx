import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getTreinos } from "~/utils/treinos.server";
import { getWeek } from "date-fns";
import { useFetcher, useLoaderData, Outlet, Link } from "@remix-run/react";
import { FaListAlt, FaPrint } from "react-icons/fa";

export const loader: LoaderFunction = async ({ request }) => {
	const url = new URL(request.url);

	const par = url.searchParams.get("semana_query");
	const parametro = par ? parseInt(par) : getWeek(new Date());
	// const treinos = await getTreinos(getWeek(new Date()));
	const treinos = await getTreinos(parametro);

	return json({ treinos });
};

export default function Treino() {
	const semana = useFetcher();
	const { treinos } = useLoaderData<typeof loader>();
	const treinoSemana = semana.data?.treinos ? semana.data.treinos : treinos;
	return (
		<div className='w-full bg-stone-100 font-Roboto '>
			<div className='flex items-center flex-col space-x-4'>
				<h2 className='text-2xl font-extrabold text-slate-700'>
					Lista de Treinos
				</h2>

				<semana.Form method='get' action='.'>
					<select
						name='semana_query'
						onChange={(event) => semana.submit(event.target.form)}
						className='rounded-md border-2 form-control block'>
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
				</semana.Form>
			</div>
			<div className='container mx-auto content-center  py-6 px-2 md:px-0 md:grid md:gap-x-6  md:gap-y-4 md:grid-cols-3'>
				<div className='overflow-x-auto relative'>
					<table className='w-full  text-sm text-left text-gray-500 dark:text-gray-400'>
						<thead className='text-xs  text-gray-700 uppercase bg-stone-100 dark:bg-gray-700 dark:text-gray-400'>
							<tr className='rounded-lg'>
								<th scope='col' className=' '>
									Grupo
								</th>
								<th scope='col' className='text-center '>
									Semana
								</th>

								{/* <th className="text-right px-2 text-green-600 text-lg ">
                  <FaTasks />
                </th> */}
							</tr>
						</thead>
						<tbody>
							{treinoSemana.map((treino: any) => (
								<tr key={treino.id} className=' dark:bg-gray-800'>
									<th className='py-1 flex gap-x-2 items-center font-medium text-gray-900 whitespace-nowrap dark:text-white'>
										{treino.grupo}
									</th>
									<td className=' text-center'>{treino.semana}</td>
									<td className='  '>
										<Link to={`${treino.id}`} className='text-sky-600 text-lg '>
											{/* Exercícios */}
											<FaListAlt />
										</Link>
									</td>
									<td className='  '>
										<Link
											to={`/print/${treino.id}`}
											className='text-orange-400 text-lg '>
											<FaPrint />
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className='col-span-2'>
					<h2 className=' font-semibold text-center text-slate-700'>
						Lista de Exercícios
					</h2>
					<Outlet />
				</div>
			</div>
		</div>
	);
}
