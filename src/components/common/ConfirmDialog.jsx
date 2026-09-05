import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import Button from "./Button";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = "danger",
  loading = false,
}) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose} title={title ?? t("common.areYouSure")} className="max-w-md">
      {description && <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel ?? t("common.cancel")}
        </Button>
        <Button variant={variant} onClick={onConfirm} loading={loading}>
          {confirmLabel ?? t("common.confirm")}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
