import { useQuery } from "react-query";

import { axios } from "../utils";

const buildQueryHook = (queryName, path) => {
  const fetchList = (page = 0, filters = []) =>
    axios.get(path, { params: { page, filters } }).then((res) => res.data);
  return (page, filters) => {
    const queryState = useQuery(
      [queryName, page, filters],
      () => fetchList(page, filters),
      {
        keepPreviousData: true,
      },
    );
    return queryState;
  };
};

export const useBusinessListQuery = buildQueryHook(
  "businessList",
  "businesses",
);

export const fetchEvaluationSchemes = buildQueryHook(
  "evaluationList",
  "evaluations",
);