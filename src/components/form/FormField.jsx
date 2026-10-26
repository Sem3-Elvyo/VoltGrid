import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Reusable input components: one place for label, hint, error text and ARIA wiring.
function FieldShell({ id, label, error, hint, children }) {
  return (
    <div className={"field" + (error ? " has-error" : "")}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <div className="hint">{hint}</div>}
      {error && <div className="form-error" id={id + "-err"} role="alert">{error}</div>}
    </div>
  );
}

export function TextField({ label, error, hint, type = "text", ...props }) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <input id={id} type={type} aria-invalid={!!error} aria-describedby={error ? id + "-err" : undefined} {...props} />
    </FieldShell>
  );
}

export function PasswordField({ label, error, hint, ...props }) {
  const id = useId();
  const [show, setShow] = useState(false);
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <div className="input-with-btn">
        <input id={id} type={show ? "text" : "password"} aria-invalid={!!error} {...props} />
        <button type="button" className="input-btn" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </FieldShell>
  );
}

export function SelectField({ label, error, hint, options, ...props }) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <select id={id} aria-invalid={!!error} {...props}>
        {options.map((o) => {
          const opt = typeof o === "object" ? o : { value: o, label: o };
          return <option key={opt.value} value={opt.value}>{opt.label}</option>;
        })}
      </select>
    </FieldShell>
  );
}
