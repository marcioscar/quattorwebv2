import format from "date-fns/format";
import _ from "lodash";

export default function Feitos(historicoExercicios: any, grupo: String) {
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

  return <div>teste</div>;
}
