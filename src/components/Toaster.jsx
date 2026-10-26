import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { dismiss } from "../store/slices/notificationsSlice.js";

const icons = { success: CircleCheck, info: Info, warning: TriangleAlert, error: TriangleAlert };

function Toast({ item }) {
  const dispatch = useDispatch();
  const Icon = icons[item.type] ?? Info;

  useEffect(() => {
    const id = setTimeout(() => dispatch(dismiss(item.id)), 4500);
    return () => clearTimeout(id);
  }, [item.id, dispatch]);

  return (
    <div className={`toast toast-${item.type}`} role="status">
      <Icon size={16} />
      <span>{item.message}</span>
      <button aria-label="Dismiss" onClick={() => dispatch(dismiss(item.id))}>
        <X size={14} />
      </button>
    </div>
  );
}

export default function Toaster() {
  const items = useSelector((s) => s.notifications.items);
  return (
    <div className="toaster" aria-live="polite">
      {items.map((item) => (
        <Toast key={item.id} item={item} />
      ))}
    </div>
  );
}
