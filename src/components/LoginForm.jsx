import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // No backend here — this just confirms the form works.
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  }

  return (
    <section className="login-section" id="login">
      <div className="container">
        <div className="login-panel">
          <h2>Sign in to VoltGrid</h2>
          <p>Access your saved vehicle, favorites and charging history.</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Sign in
            </button>
          </form>

          <p className="login-note">
            {submitted
              ? "Signed in — no account? Everything above is already using demo data."
              : "New here? Just start exploring — no account needed for the demo."}
          </p>
        </div>
      </div>
    </section>
  );
}
