import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { json, redirect } from "@remix-run/node";
import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import {
  getAluno,
  getHistorico,
  getHistoricoExe,
  getTreinos,
  updateHistoricoExe,
  deleteHistoricoExe,
} from "~/utils/aluno.server";
import { getWeek } from "date-fns";
import format from "date-fns/format";
import ptBR from "date-fns/locale/pt-BR";
import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { FaSyncAlt, FaExclamationCircle, FaDumbbell } from "react-icons/fa";

import { MdDone, MdOutlineRemove } from "react-icons/md";

import { FiVideo } from "react-icons/fi";
import { TbHandClick } from "react-icons/tb";
import { commitSession, getSession } from "~/session.server";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

type grupo = {
  grupo: string;
  id: string;
  exercicios: [];
  semana: number;
};
//Loader dos dados dos alunos e  treinos da semana atual
export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const alId = session.get("aluno")?.id;
  if (!alId) {
    session.set("aluno", {
      red: "/aluno",
    });
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const alunoa = await getAluno(session.get("aluno")?.id);
  const aluno = alunoa[0];

  const treinosGrupo = await getTreinos(getWeek(new Date()));

  // const historicoTreinos = await getHistorico(4);
  const historicoTreinos = await getHistorico(Number(session.get("aluno").id));
  const historicoExercicios = await getHistoricoExe(
    Number(session.get("aluno").id)
  );

  return json({ aluno, treinosGrupo, historicoTreinos, historicoExercicios });
};
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  let values = Object.fromEntries(form);
  const _action = form.get("_action");
  if (_action === "done") {
    await updateHistoricoExe(values);
    return values;
  }
  if (_action === "undone") {
    await deleteHistoricoExe(values);
    return values;
  }
};

export default function Treino() {
  const fetcher = useFetcher();
  const isSaving = fetcher.state !== "idle";

  const { aluno, treinosGrupo, historicoTreinos, historicoExercicios } =
    useLoaderData();

  const data = fetcher.data;

  const [grupo, setGrupo] = useState("");

  const [dt, setDt] = useState(Date);

  const [tipoTreinoGrupo, SetTipoTreinoGRupo] = useState(
    treinosGrupo.filter((el: any) => el.grupo.includes(""))
  );

  const [treino, setTreino] = useState();
  const [checked, setChecked] = useState([]);
  const transition = useNavigation();

  // console.log(historicoTreinos.treinos);
  const hitTreino = _.mapValues(historicoTreinos?.treinos, function (o) {
    const data = format(new Date(o.data), "EEEEEE - dd/MM", {
      locale: ptBR,
    });
    return { treino: o.treino, data };
  });

  const grupotreino = _.map(_.groupBy(hitTreino, "data"), (data, idx) => {
    return { data: idx, treino: data };
  });

  const PlaneTreino = _.mapValues(historicoTreinos?.planejados, function (o) {
    return { treino: o.treinoP, dia: o.dia };
  });

  const plano = _.map(PlaneTreino, (treino: any) => {
    return treino;
  });

  const HistoricoExercicios = _.map(
    _.mapValues(historicoExercicios?.histexe, function (o) {
      return {
        treino: o.nome,
        carga: o.carga,
        grupo: o.grupo,
        obs: o.obs,
        data: format(new Date(o.data), "dd/MM/yy"),
      };
    })
  );

  const TRICEPS = _.takeRight(
    HistoricoExercicios.filter((o) => o.grupo?.includes("TRICEPS")),
    7
  );
  const ABDOME = _.takeRight(
    HistoricoExercicios.filter((o) => o.grupo?.includes("ABDOME")),
    7
  );

  const BICEPS = _.takeRight(
    HistoricoExercicios.filter((o) => o.grupo?.includes("BICEPS")),
    7
  );
  const COSTAS = _.takeRight(
    HistoricoExercicios.filter((o) => o.grupo?.includes("COSTAS")),
    7
  );
  const GLUTEOS = _.takeRight(
    HistoricoExercicios.filter((o) => o.grupo?.includes("GLUTEOS")),
    7
  );
  const MEMBROS_INFERIORES_GERAL = _.takeRight(
    HistoricoExercicios.filter((o) =>
      o.grupo?.includes("MEMBROS INFERIORES GERAL")
    ),
    7
  );

  const MEMBROS_SUPERIORES_GERAL = _.takeRight(
    HistoricoExercicios.filter((o) =>
      o.grupo?.includes("MEMBROS SUPERIORES GERAL")
    ),
    7
  );

  const MEMBROS_SUPERIORES_1 = _.takeRight(
    HistoricoExercicios.filter((o) =>
      o.grupo?.includes("MEMBROS SUPERIORES 1")
    ),
    7
  );

  const MEMBROS_SUPERIORES_2 = _.takeRight(
    HistoricoExercicios.filter((o) =>
      o.grupo?.includes("MEMBROS SUPERIORES 2")
    ),
    7
  );
  const OMBROS = _.takeRight(
    HistoricoExercicios.filter((o) => o.grupo?.includes("OMBROS")),
    7
  );

  const PANTURRILHA = _.takeRight(
    HistoricoExercicios.filter((o) => o.grupo?.includes("PANTURRILHA")),
    7
  );
  const PEITORAL = _.takeRight(
    HistoricoExercicios.filter((o) => o.grupo?.includes("PEITORAL")),
    7
  );
  const POSTERIORES_DE_COXAS = _.takeRight(
    HistoricoExercicios.filter((o) =>
      o.grupo?.includes("POSTERIORES DE COXAS")
    ),
    7
  );

  const QUADS = _.takeRight(
    HistoricoExercicios.filter((o) => o.grupo?.includes("QUADS")),
    7
  );

  const grupotreinoPlan = _.map(
    _.groupBy(PlaneTreino, "data"),
    (data: any, idx: any, dt: any, feito: any) => {
      return { data: idx, treino: data, dt: dt, feito: feito };
    }
  );

  const ultimosPlan = _.takeRight(grupotreinoPlan, 7);

  // console.log(
  //   format(new Date("2023-06-19T18:51:00.011Z"), "dd/MM", {
  //     locale: ptBR,
  //   })
  // );

  const ultimos = _.takeRight(grupotreino, 3);

  const ultimosTreinos = _.takeRight(historicoTreinos?.treinos, 3);

  const handleGrupo = (event: any) => {
    setGrupo("setGrupo");
    setGrupo(event.target.value.split(",")[0]);
    setDt(event.target.value.split(",")[1]);

    // setChecked([]);
    var inputs = document.querySelectorAll("[id=done]");
    for (var i = 0; i < inputs.length; i++) {
      // @ts-ignore
      inputs[i].checked = false;
    }
  };

  // const handleCheck = (exercicio: any) => {
  //   var updatedList = [...checked];

  //   // @ts-ignore
  //   updatedList = [...checked, data];

  //   setChecked(updatedList);
  // };
  // const handleCheck = (event: any) => {
  //   var updatedList = [...checked];
  //   if (event.target.checked) {
  //     // @ts-ignore
  //     updatedList = [...checked, event.target.value];
  //   } else {
  //     // @ts-ignore
  //     updatedList.splice(checked.indexOf(event.target.value), 1);
  //   }

  //   setChecked(updatedList);
  //   console.log(_action);
  // };

  var isChecked = (item: any) =>
    // @ts-ignore
    checked.includes(item)
      ? "bg-white mb-2 text-stone-300 font-light  p-2 rounded-lg  shadow"
      : "bg-stone-100 mb-2  font-light  p-2 rounded-lg  ";

  var isCheckedTitle = (item: any) =>
    // @ts-ignore
    checked.includes(item)
      ? "text-decoration-line: line-through"
      : "text font-medium text-stone-700";

  var isCheckedButtonDone = (item: any) =>
    // @ts-ignore
    checked.includes(item) ? (
      <Button
        disabled
        className={`flex text-lg  content-center h-6 py-1 px-1 text-white font-bold   bg-stone-500  ${
          isSaving ? "bg-stone-200" : "enabled"
        } `}
        type="submit"
        name="_action"
        value="done">
        <MdDone />
      </Button>
    ) : (
      <button
        className={`flex text-lg  content-center h-6 py-1 px-1 text-white font-bold   bg-orange-500  ${
          isSaving ? "bg-stone-200" : "enabled"
        } `}
        type="submit"
        name="_action"
        value="done">
        <MdDone />
      </button>
    );
  var isCheckedButtonUndone = (item: any) =>
    // @ts-ignore
    checked.includes(item) ? (
      <Button
        className={`flex text-lg content-center h-6 py-1 px-1 text-white font-bold  bg-orange-500  ${
          isSaving ? "bg-stone-200 disabled" : "enabled"
        } `}
        type="submit"
        name="_action"
        value="undone">
        <MdOutlineRemove />
      </Button>
    ) : (
      <Button
        disabled
        className={`flex text-lg content-center h-6 py-1 px-1 text-white font-bold  bg-stone-500  ${
          isSaving ? "bg-stone-200 disabled" : "enabled"
        } `}
        type="submit"
        name="_action"
        value="undone">
        <MdOutlineRemove />
      </Button>
    );

  useEffect(() => {
    setTreino(
      // @ts-ignore
      _.filter(tipoTreinoGrupo, ["grupo", grupo])
    );
  }, [grupo, tipoTreinoGrupo]);
  const textInput = useRef(null);

  useEffect(() => {
    var updatedList = [...checked];
    data?._action === "done"
      ? (updatedList = [...checked, data?.exenome])
      : updatedList.splice(checked.indexOf(data?.exenome), 1);

    setChecked(updatedList);
  }, [data]);

  const planoAluno = _.filter(aluno.memberships, {
    membershipStatus: "active",
  })
    .map((n) => n.name)
    .toString();
  return (
    <>
      {/* <Outlet /> */}

      <div className=" px-2 mx-auto ">
        <div className="text-center">
          <img
            src={aluno?.photoUrl ? aluno?.photoUrl : "/user.png"}
            className="rounded-full shadow-lg w-24 h-24 m-4 mx-auto"
            alt="Avatar"
          />
          <h5 className="text-xl  leading-tight mb-2">
            {aluno?.firstName} {aluno?.lastName} -{" "}
            <span className="font-mono text-gray-400"> {aluno?.idMember}</span>
          </h5>

          {/* {ultimosTreinos && (
            <>
              <h2 className="  text-blue-600 rounded-md  text-md mt-4">
                PLANEJAMENTO
              </h2>
              <div className="text-gray-500 grid  gap-2 grid-cols-3">
                {ultimos.map((u: any, index) => (
                  <div key={index} className="">
                    <div className="mt-1 mb-4  py-2 px-2 rounded-md my-4">
                      <div>{u.data}</div>
                      <div className="font-semibold text-blue-600">
                        {u.treino.map((t: any, index: any) => (
                          <div key={index}>{t.treino}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )} */}
          <div className="">
            {plano && (
              <>
                <div className=" bg-stone-100  rounded-md mb-2 items-center place-content-center gap-2 text-center flex text-stone-600 font-light ">
                  <TbHandClick className="text-stone-600 text-xl" />
                  <div>no treino para ver os exercícios</div>
                </div>
                <div>
                  <h2 className="  text-stone-500 font-medium mb-2 text-center mt-2">
                    Treinos Planejados
                  </h2>
                </div>

                <div className="text-stone-600 text-center place-content-center gap-2  mx-auto grid grid-cols-2 md:gap-2 md:grid-cols-4 lg:grid-cols-7 lg:container-2xl">
                  <Card>
                    <CardHeader>
                      <CardTitle>Segunda</CardTitle>
                      <CardDescription>
                        {plano
                          .filter((o) => o.dia?.includes("segunda"))
                          .map((s, index) => (
                            <div key={index}>
                              <button
                                key={index}
                                value={s.treino}
                                onClick={handleGrupo}
                                name="treino">
                                {s.treino}
                              </button>
                            </div>
                          ))}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Terça</CardTitle>
                      <CardDescription className="">
                        {plano
                          .filter((o) => o.dia?.includes("terca"))
                          .map((s, index) => (
                            <div key={index}>
                              <button
                                value={s.treino}
                                onClick={handleGrupo}
                                name="treino">
                                {s.treino}
                              </button>
                            </div>
                          ))}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="">
                    <CardHeader>
                      <CardTitle>Quarta</CardTitle>
                      <CardDescription>
                        {plano
                          .filter((o) => o.dia?.includes("quarta"))
                          .map((s, index) => (
                            <div key={index}>
                              <button
                                key={index}
                                value={s.treino}
                                onClick={handleGrupo}
                                name="treino">
                                {s.treino}
                              </button>
                            </div>
                          ))}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="">
                    <CardHeader>
                      <CardTitle>Quinta</CardTitle>
                      <CardDescription>
                        {plano
                          .filter((o) => o.dia?.includes("quinta"))
                          .map((s, index) => (
                            <div key={index}>
                              <button
                                key={index}
                                value={s.treino}
                                onClick={handleGrupo}
                                name="treino">
                                {s.treino}
                              </button>
                            </div>
                          ))}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="">
                    <CardHeader>
                      <CardTitle>Sexta</CardTitle>
                      <CardDescription>
                        {plano
                          .filter((o) => o.dia?.includes("sexta"))
                          .map((s, index) => (
                            <div key={index}>
                              <button
                                key={index}
                                value={s.treino}
                                onClick={handleGrupo}
                                name="treino">
                                {s.treino}
                              </button>
                            </div>
                          ))}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="">
                    <CardHeader>
                      <CardTitle>Sábado</CardTitle>
                      <CardDescription className=" ">
                        {plano
                          .filter((o) => o.dia?.includes("sabado"))
                          .map((s, index) => (
                            <div key={index}>
                              <button
                                key={index}
                                value={s.treino}
                                onClick={handleGrupo}
                                name="treino">
                                {s.treino}
                              </button>
                            </div>
                          ))}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="">
                    <CardHeader>
                      <CardTitle>Domingo</CardTitle>
                      <CardDescription>
                        {plano
                          .filter((o) => o.dia?.includes("domingo"))
                          .map((s, index) => (
                            <div key={index}>
                              <button
                                key={index}
                                value={s.treino}
                                onClick={handleGrupo}
                                name="treino">
                                {s.treino}
                              </button>
                            </div>
                          ))}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </>
            )}
          </div>
          <h2 className="  text-stone-500 font-medium mb-2 text-center mt-2">
            Treinos Feitos
          </h2>
          <div className="text-stone-600 text-center place-content-center gap-2  mx-auto grid grid-cols-1 md:gap-2 md:grid-cols-4 lg:grid-cols-4 lg:container-2xl">
            {ABDOME.length > 0 && (
              <Card className=" border-0">
                <CardHeader>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <CardTitle>Abdome</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardDescription>
                          {ABDOME.map((s, index) => (
                            <div key={index} className=" ">
                              <div className=" text-sm  text-stone-700 font-semibold">
                                {s.treino}{" "}
                              </div>
                              <div className=" grid grid-cols-3 place-content-around  gap-3 ">
                                <div className="text-orange-400 mb-3 ">
                                  {s.carga}
                                </div>
                                <div>{s.obs ? s.obs : ""}</div>
                                <div>{s.data}</div>
                              </div>
                            </div>
                          ))}
                        </CardDescription>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardHeader>
              </Card>
            )}

            {BICEPS.length > 0 && (
              <Card className=" border-0">
                <CardHeader>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <CardTitle>Biceps</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardDescription>
                          {BICEPS.map((s, index) => (
                            <div key={index} className=" ">
                              <div className=" text-sm  text-stone-700 font-semibold">
                                {s.treino}{" "}
                              </div>
                              <div className=" grid grid-cols-3 place-content-around  gap-3 ">
                                <div className="text-orange-400 mb-3 ">
                                  {s.carga}
                                </div>
                                <div>{s.obs ? s.obs : ""}</div>
                                <div>{s.data}</div>
                              </div>
                            </div>
                          ))}
                        </CardDescription>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardHeader>
              </Card>
            )}

            {COSTAS.length > 0 && (
              <Card className=" border-0">
                <CardHeader>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <CardTitle>Costas</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardDescription>
                          {COSTAS.map((s, index) => (
                            <div key={index} className=" ">
                              <div className=" text-sm  text-stone-700 font-semibold">
                                {s.treino}{" "}
                              </div>
                              <div className=" grid grid-cols-3 place-content-around  gap-3 ">
                                <div className="text-orange-400 mb-3 ">
                                  {s.carga}
                                </div>
                                <div>{s.obs ? s.obs : ""}</div>
                                <div>{s.data}</div>
                              </div>
                            </div>
                          ))}
                        </CardDescription>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardHeader>
              </Card>
            )}

            {GLUTEOS.length > 0 && (
              <Card className=" border-0">
                <CardHeader>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <CardTitle>Glúteos</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardDescription>
                          {GLUTEOS.map((s, index) => (
                            <div key={index} className=" ">
                              <div className=" text-sm  text-stone-700 font-semibold">
                                {s.treino}{" "}
                              </div>
                              <div className=" grid grid-cols-3 place-content-around  gap-3 ">
                                <div className="text-orange-400 mb-3 ">
                                  {s.carga}
                                </div>
                                <div>{s.obs ? s.obs : ""}</div>
                                <div>{s.data}</div>
                              </div>
                            </div>
                          ))}
                        </CardDescription>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardHeader>
              </Card>
            )}

            {MEMBROS_INFERIORES_GERAL.length > 0 && (
              <Card className=" border-0">
                <CardHeader>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <CardTitle>Inferior Geral</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardDescription>
                          {MEMBROS_INFERIORES_GERAL.map((s, index) => (
                            <div key={index} className=" ">
                              <div className=" text-sm  text-stone-700 font-semibold">
                                {s.treino}{" "}
                              </div>
                              <div className=" grid grid-cols-3 place-content-around  gap-3 ">
                                <div className="text-orange-400 mb-3 ">
                                  {s.carga}
                                </div>
                                <div>{s.obs ? s.obs : ""}</div>
                                <div>{s.data}</div>
                              </div>
                            </div>
                          ))}
                        </CardDescription>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardHeader>
              </Card>
            )}
            {MEMBROS_SUPERIORES_GERAL.length > 0 && (
              <Card className=" border-0">
                <CardHeader>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <CardTitle>Superior Geral</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardDescription>
                          {MEMBROS_SUPERIORES_GERAL.map((s, index) => (
                            <div key={index} className=" ">
                              <div className=" text-sm  text-stone-700 font-semibold">
                                {s.treino}{" "}
                              </div>
                              <div className=" grid grid-cols-3 place-content-around  gap-3 ">
                                <div className="text-orange-400 mb-3 ">
                                  {s.carga}
                                </div>
                                <div>{s.obs ? s.obs : ""}</div>
                                <div>{s.data}</div>
                              </div>
                            </div>
                          ))}
                        </CardDescription>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardHeader>
              </Card>
            )}
            {MEMBROS_SUPERIORES_1.length > 0 && (
              <Card className=" border-0">
                <CardHeader>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <CardTitle>Superior 1</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardDescription>
                          {MEMBROS_SUPERIORES_1.map((s, index) => (
                            <div key={index} className=" ">
                              <div className=" text-sm  text-stone-700 font-semibold">
                                {s.treino}{" "}
                              </div>
                              <div className=" grid grid-cols-3 place-content-around  gap-3 ">
                                <div className="text-orange-400 mb-3 ">
                                  {s.carga}
                                </div>
                                <div>{s.obs ? s.obs : ""}</div>
                                <div>{s.data}</div>
                              </div>
                            </div>
                          ))}
                        </CardDescription>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardHeader>
              </Card>
            )}
            {MEMBROS_SUPERIORES_2.length > 0 && (
              <Card className=" border-0">
                <CardHeader>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <CardTitle>Superior 2</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardDescription>
                          {MEMBROS_SUPERIORES_2.map((s, index) => (
                            <div key={index} className=" ">
                              <div className=" text-sm  text-stone-700 font-semibold">
                                {s.treino}{" "}
                              </div>
                              <div className=" grid grid-cols-3 place-content-around  gap-3 ">
                                <div className="text-orange-400 mb-3 ">
                                  {s.carga}
                                </div>
                                <div>{s.obs ? s.obs : ""}</div>
                                <div>{s.data}</div>
                              </div>
                            </div>
                          ))}
                        </CardDescription>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardHeader>
              </Card>
            )}

            {OMBROS.length > 0 && (
              <Card className=" border-0">
                <CardHeader>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <CardTitle>Ombros</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardDescription>
                          {OMBROS.map((s, index) => (
                            <div key={index} className=" ">
                              <div className=" text-sm  text-stone-700 font-semibold">
                                {s.treino}{" "}
                              </div>
                              <div className=" grid grid-cols-3 place-content-around  gap-3 ">
                                <div className="text-orange-400 mb-3 ">
                                  {s.carga}
                                </div>
                                <div>{s.obs ? s.obs : ""}</div>
                                <div>{s.data}</div>
                              </div>
                            </div>
                          ))}
                        </CardDescription>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardHeader>
              </Card>
            )}
            {PANTURRILHA.length > 0 && (
              <Card className=" border-0">
                <CardHeader>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <CardTitle>Panturrilha</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardDescription>
                          {PANTURRILHA.map((s, index) => (
                            <div key={index} className=" ">
                              <div className=" text-sm  text-stone-700 font-semibold">
                                {s.treino}{" "}
                              </div>
                              <div className=" grid grid-cols-3 place-content-around  gap-3 ">
                                <div className="text-orange-400 mb-3 ">
                                  {s.carga}
                                </div>
                                <div>{s.obs ? s.obs : ""}</div>
                                <div>{s.data}</div>
                              </div>
                            </div>
                          ))}
                        </CardDescription>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardHeader>
              </Card>
            )}

            {PEITORAL.length > 0 && (
              <Card className=" border-0">
                <CardHeader>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <CardTitle>Peitoral</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardDescription>
                          {PEITORAL.map((s, index) => (
                            <div key={index} className=" ">
                              <div className=" text-sm  text-stone-700 font-semibold">
                                {s.treino}{" "}
                              </div>
                              <div className=" grid grid-cols-3 place-content-around  gap-3 ">
                                <div className="text-orange-400 mb-3 ">
                                  {s.carga}
                                </div>
                                <div>{s.obs ? s.obs : ""}</div>
                                <div>{s.data}</div>
                              </div>
                            </div>
                          ))}
                        </CardDescription>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardHeader>
              </Card>
            )}
            {POSTERIORES_DE_COXAS.length > 0 && (
              <Card className=" border-0">
                <CardHeader>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <CardTitle>Posteriores de Coxas</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardDescription>
                          {POSTERIORES_DE_COXAS.map((s, index) => (
                            <div key={index} className=" ">
                              <div className=" text-sm  text-stone-700 font-semibold">
                                {s.treino}{" "}
                              </div>
                              <div className=" grid grid-cols-3 place-content-around  gap-3 ">
                                <div className="text-orange-400 mb-3 ">
                                  {s.carga}
                                </div>
                                <div>{s.obs ? s.obs : ""}</div>
                                <div>{s.data}</div>
                              </div>
                            </div>
                          ))}
                        </CardDescription>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardHeader>
              </Card>
            )}
            {QUADS.length > 0 && (
              <Card className=" border-0">
                <CardHeader>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <CardTitle>Quadríceps</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardDescription>
                          {QUADS.map((s, index) => (
                            <div key={index} className=" ">
                              <div className=" text-sm  text-stone-700 font-semibold">
                                {s.treino}{" "}
                              </div>
                              <div className=" grid grid-cols-3 place-content-around  gap-3 ">
                                <div className="text-orange-400 mb-3 ">
                                  {s.carga}
                                </div>
                                <div>{s.obs ? s.obs : ""}</div>
                                <div>{s.data}</div>
                              </div>
                            </div>
                          ))}
                        </CardDescription>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardHeader>
              </Card>
            )}
            {TRICEPS.length > 0 && (
              <Card className=" border-0">
                <CardHeader>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <CardTitle>Tríceps</CardTitle>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardDescription>
                          {TRICEPS.map((s, index) => (
                            <div key={index} className=" ">
                              <div className=" text-sm  text-stone-700 font-semibold">
                                {s.treino}{" "}
                              </div>
                              <div className=" grid grid-cols-3 place-content-around  gap-3 ">
                                <div className="text-orange-400 mb-3 ">
                                  {s.carga}
                                </div>
                                <div>{s.obs ? s.obs : ""}</div>
                                <div>{s.data}</div>
                              </div>
                            </div>
                          ))}
                        </CardDescription>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardHeader>
              </Card>
            )}
          </div>

          {/* {ultimosTreinos.length > 0 && (
            <>
              <h2 className="  text-stone-500 font-medium mb-1 text-center mt-2">
                ÚLTIMOS TREINOS
              </h2>
              <div className="text-gray-500 grid  gap-2 grid-cols-3">
                {ultimos.map((u: any, index) => (
                  <div key={index} className="">
                    <Card className=" h-full ">
                      <CardHeader>
                        <CardTitle>{u.data}</CardTitle>
                        {u.treino.map((t: any, index: any) => (
                          <CardDescription key={index}>
                            {t.treino}
                          </CardDescription>
                        ))}
                      </CardHeader>
                    </Card>
                  </div>
                ))}
              </div>
            </>
          )} */}
        </div>

        <div className=" max-w-lg mt-2 flex mx-auto ">
          <select
            className="form-select block  justify-center w-full px-3 py-1.5 font-light text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded focus:text-gray-700 focus:bg-white focus:border-orange-600 focus:outline-none"
            aria-label="Selecione o treino"
            defaultValue="Selecione o Treino"
            value={grupo}
            // @ts-ignore
            onChange={handleGrupo}>
            <option>Selecione o Treino</option>
            {tipoTreinoGrupo?.map((grupo: grupo) => (
              <option key={grupo.grupo} value={grupo.grupo}>
                {grupo.grupo}
              </option>
            ))}
          </select>
        </div>

        {
          grupo &&
            // <Form method="post">
            //   <input readOnly hidden type="text" name="treino" value={grupo} />
            //   <input readOnly hidden type="text" name="data" value={dt} />
            //   <input
            //     hidden
            //     type="number"
            //     name="aluno"
            //     readOnly
            //     defaultValue={aluno.idMember}
            //   />

            // {grupo !== "Selecione o Treino" &&
            //   planoAluno !== "MEDIDA CERTA - 2023" && (
            //     <div className=" block justify-center mx-auto max-w-xl ">
            //       <div className="flex flex-row  justify-evenly  font-bold text-orange-500 items-center m-2 text-xl">
            //         {grupo}
            //         <button
            //           name="_action"
            //           value="feito"
            //           className="bg-blue-500   inline-flex gap-3 items-center px-3 py-2 text-sm shadow-sm font-medium tracking-wider border text-white rounded-md  hover:shadow-lg hover:bg-green-800">
            //           <FaCheck />
            //           {transition.state === "submitting"
            //             ? "Atualizando..."
            //             : "Feito"}
            //         </button>
            //       </div>
            //     </div>
            //   )}

            // {
            // @ts-ignore
            treino?.map((e: any, index: any) => (
              <div
                className=" grid mt-4 text-stone-600  gap-2 sm:grid-cols-2 lg:grid-cols-3  "
                key={index}>
                {e.exercicios.map((exe: any, index: any) => (
                  <div className={isChecked(exe.nome)} key={index}>
                    <fetcher.Form method="post">
                      {/* <Form method="post"> */}
                      <input
                        readOnly
                        hidden
                        type="text"
                        name="treino"
                        value={grupo}
                      />
                      <input
                        hidden
                        type="number"
                        name="aluno"
                        readOnly
                        defaultValue={aluno.idMember}
                      />
                      <input
                        hidden
                        type="text"
                        name="exenome"
                        readOnly
                        value={exe.nome}
                      />
                      <div className="flex mb-2 flex-row justify-between ">
                        <div className={isCheckedTitle(exe.nome)}>
                          {exe.nome}
                          {isSaving ? (
                            <span className="ml-3">
                              <svg
                                role="status"
                                className="inline h-4 w-4 animate-spin mr-2 text-gray-200 dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentFill"
                                />
                              </svg>
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {isCheckedButtonDone(exe.nome)}
                          {/* <button
                            className={`flex text-lg disabled content-center h-6 py-1 px-1 text-white font-bold   bg-orange-500  ${
                              isSaving ? "bg-stone-200" : "enabled"
                            } `}
                            type="submit"
                            name="_action"
                            value="done">
                            <MdDone />
                          </button> */}
                          {isCheckedButtonUndone(exe.nome)}
                          {/* <Button
                            className={`flex text-lg content-center h-6 py-1 px-1 text-white font-bold  bg-stone-500  ${
                              isSaving ? "bg-stone-200 disabled" : "enabled"
                            } `}
                            type="submit"
                            name="_action"
                            value="undone">
                            <MdOutlineRemove />
                          </Button> */}

                          {/* <div
                            className="w-4 h-4 rounded-full animate-spin
                    border-4 border-solid border-green-500 border-t-transparent"></div> */}
                        </div>

                        {/* <input
                          className=" w-6 h-6 accent-green-500 mr-4"
                          value={exe.nome}
                          type="checkbox"
                          onChange={handleCheck}
                          id="done"
                          name="done"
                          ref={textInput}
                        /> */}
                      </div>
                      <div className="flex mb-2 shrink-0 items-center content-around  ">
                        <FaSyncAlt className="shrink-0 mr-3 " />
                        {exe.Repeticoes}
                      </div>
                      <div className="flex   items-center space-x-3">
                        <FaDumbbell className=" shrink-0 mr-3" />
                        <input
                          placeholder="Carga treinada"
                          // defaultValue={exe.carga}
                          name="carga"
                          id="carga"
                          className="flex  pl-1 mb-2  items-center content-around lowercase"></input>
                      </div>
                      <div className="flex   items-center space-x-3">
                        <FaExclamationCircle className="shrink-0 mr-3" />
                        <input
                          name="obs"
                          id="obs"
                          placeholder="Observações"
                          className="flex mb-2 pl-1  shrink-0 items-center content-around lowercase "
                          defaultValue={exe.obs}></input>
                      </div>
                      {exe.video !== "" && (
                        <>
                          <div className=" flex justify-end  text-l mr-2 text-stone-700 ">
                            <Link
                              className="bg-stone-300 rounded-lg px-4 p-2 "
                              to={`${exe.video}`}>
                              <FiVideo />
                            </Link>
                          </div>
                        </>
                      )}
                    </fetcher.Form>
                    {/* </Form> */}
                  </div>
                ))}
              </div>
            ))
          // }
          // </Form>
        }
      </div>
    </>
  );
}
