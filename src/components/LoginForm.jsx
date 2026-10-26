import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { loginUser, clearAuthError } from "../store/slices/authSlice.js";
import { notify } from "../store/slices/notificationsSlice.js";
import { useForm } from "../hooks/useForm.js";
import { TextField, PasswordField } from "./form/FormField.jsx";
import { required, email, minLength, passwordStrength } from "../utils/validators.js";

const schema = {
  email: [required("Email is required."), email()],
  password: [required("Password is required."), minLength(6, "Password must be at least 6 characters.")],
};

export default function LoginForm({ onSuccess }) {
  const dispatch = useDispatch();
  const status = useSelector((s) => s.auth.status);
  const error = useSelector((s) => s.auth.error);
  const loading = status === "loading";
  const { values, bind, handleSubmit } = useForm({ email: "", password: "" }, schema);

  async function submit({ email, password }) {
    dispatch(clearAuthError());
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      dispatch(notify({ type: "success", message: `Signed in as ${result.payload.email}` }));
      onSuccess?.();
    }
  }

  return (
    <section className="login-section" id="login">
      <div className="container">
        <div className="login-panel">
          <h2>Sign in to VoltGrid</h2>
          <p>Access your saved vehicle, favorites and charging history.</p>

          <form onSubmit={handleSubmit(submit)} noValidate>
            <TextField label="Email" type="email" placeholder="you@example.com" autoComplete="email" {...bind("email")} />
            <PasswordField
              label="Password"
              placeholder="••••••••"
              autoComplete="current-password"
              hint={values.password ? `Strength: ${passwordStrength(values.password)}` : undefined}
              {...bind("password")}
            />
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
              {loading ? <Loader2 size={16} className="spin" /> : null}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="login-note">Demo login: any valid email and a password of 6+ characters.</p>
        </div>
      </div>
    </section>
  );
}
