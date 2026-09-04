import Modal from "./Modal";
import Button from "./Button";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
}) => (
  <Modal open={open} onClose={onClose} title={title} className="max-w-md">
    {description && <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>}
    <div className="mt-6 flex justify-end gap-3">
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button variant={variant} onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmDialog;
