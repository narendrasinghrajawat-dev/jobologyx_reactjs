import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  JOB_TYPE_VALUES,
  WORK_MODE_VALUES,
  JOB_STATUS_VALUES,
  APPLICATION_STATUS_VALUES,
  SORT_VALUES,
  ROLE_VALUES,
} from "../utils/constants";

const buildOptions = (t, namespace, values) =>
  values.map((value) => ({ value, label: t(`options.${namespace}.${value}`) }));

export const useJobTypeOptions = () => {
  const { t, i18n } = useTranslation();
  return useMemo(() => buildOptions(t, "jobType", JOB_TYPE_VALUES), [t, i18n.language]);
};

export const useWorkModeOptions = () => {
  const { t, i18n } = useTranslation();
  return useMemo(() => buildOptions(t, "workMode", WORK_MODE_VALUES), [t, i18n.language]);
};

export const useJobStatusOptions = () => {
  const { t, i18n } = useTranslation();
  return useMemo(() => JOB_STATUS_VALUES.map((value) => ({ value, label: t(`status.job.${value}`) })), [t, i18n.language]);
};

export const useApplicationStatusOptions = () => {
  const { t, i18n } = useTranslation();
  return useMemo(
    () => APPLICATION_STATUS_VALUES.map((value) => ({ value, label: t(`status.application.${value}`) })),
    [t, i18n.language]
  );
};

export const useSortOptions = () => {
  const { t, i18n } = useTranslation();
  return useMemo(() => buildOptions(t, "sort", SORT_VALUES), [t, i18n.language]);
};

export const useRoleOptions = () => {
  const { t, i18n } = useTranslation();
  return useMemo(() => buildOptions(t, "role", ROLE_VALUES), [t, i18n.language]);
};
