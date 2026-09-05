import { useMemo } from "react";
import { useSelector } from "react-redux";

// Backend master-data items are { code, name, label }. `name` is the exact
// string the backend validates against and must be submitted as the value;
// `label` is display text; `code` is a stable id usable as a React key.
const toOptions = (items) => (items || []).map((item) => ({ value: item.name, label: item.label, code: item.code }));

const useMasterDataList = (key) => useSelector((state) => state.masterData[key]);

export const useMasterDataOptions = (key) => {
  const items = useMasterDataList(key);
  return useMemo(() => toOptions(items), [items]);
};

export const useRoleMasterOptions = () => useMasterDataOptions("roles");
export const useJobTypeMasterOptions = () => useMasterDataOptions("jobTypes");
export const useWorkModeMasterOptions = () => useMasterDataOptions("workModes");
export const useJobStatusMasterOptions = () => useMasterDataOptions("jobStatuses");
export const useApplicationStatusMasterOptions = () => useMasterDataOptions("applicationStatuses");
export const useCategoryMasterOptions = () => useMasterDataOptions("categories");
export const useExperienceMasterOptions = () => useMasterDataOptions("experienceLevels");
