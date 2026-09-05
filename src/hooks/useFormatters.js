import { useCallback } from "react";
import { useTranslation } from "react-i18next";

const LOCALE_MAP = { en: "en-US", hi: "hi-IN", fr: "fr-FR" };

export const useFormatters = () => {
  const { t, i18n } = useTranslation();
  const locale = LOCALE_MAP[i18n.language] || "en-US";

  const formatDate = useCallback(
    (value) => {
      if (!value) return t("common.notAvailable");
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return t("common.notAvailable");
      return date.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
    },
    [locale, t]
  );

  const formatRelativeDate = useCallback(
    (value) => {
      if (!value) return t("common.notAvailable");
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return t("common.notAvailable");

      const diffMs = Date.now() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) return t("date.today");
      if (diffDays === 1) return t("date.oneDayAgo");
      if (diffDays < 30) return t("date.daysAgo", { count: diffDays });

      return formatDate(value);
    },
    [formatDate, t]
  );

  return { formatDate, formatRelativeDate };
};
