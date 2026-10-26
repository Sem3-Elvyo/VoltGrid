import { useState } from "react";
import { useDispatch } from "react-redux";
import { CheckCircle2 } from "lucide-react";
import { notify } from "../store/slices/notificationsSlice.js";
import { useForm } from "../hooks/useForm.js";
import { TextField, SelectField } from "../components/form/FormField.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import { required, email, minLength } from "../utils/validators.js";

const schema = {
  name: [required("Please tell us your name.")],
  email: [required("Email is required."), email()],
  message: [required("Write a short message."), minLength(10, "Message should be at least 10 characters.")],
};
const topics = ["General question", "Report a problem", "Feedback", "Station suggestion"];

export default function Contact() {
  const dispatch = useDispatch();
  const [sent, setSent] = useState(null);
  const { bind, handleSubmit, reset } = useForm({ name: "", email: "", topic: topics[0], message: "" }, schema);

  function submit(f) { // demo only: nothing is sent anywhere
    setSent(f.name.trim());
    dispatch(notify({ type: "success", message: "Message sent. Thanks for reaching out!" }));
    reset();
  }

  return (
    <div className="container narrow" style={{ paddingBottom: 56 }}>
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Contact us" }]} />
      <div className="page-header" style={{ marginTop: 10 }}>
        <h1>Contact us</h1><p>Questions or feedback about VoltGrid? Send us a note.</p>
      </div>
      {sent ? (
        <div className="card error-card">
          <CheckCircle2 size={36} color="var(--primary)" />
          <h2>Thanks, {sent}!</h2>
          <p>We&apos;ve received your message (demo: it stays in your browser).</p>
          <button className="btn btn-outline" onClick={() => setSent(null)}>Send another</button>
        </div>
      ) : (
        <form className="card" onSubmit={handleSubmit(submit)} noValidate>
          <div className="grid grid-2">
            <TextField label="Name" {...bind("name")} />
            <TextField label="Email" type="email" {...bind("email")} />
          </div>
          <SelectField label="Topic" options={topics} {...bind("topic")} />
          <div className="field">
            <MessageBox {...bind("message")} />
          </div>
          <button className="btn btn-primary" type="submit">Send message</button>
        </form>
      )}
    </div>
  );
}

function MessageBox({ error, ...props }) {
  return (
    <>
      <label htmlFor="msg">Message</label>
      <textarea id="msg" rows={5} aria-invalid={!!error} {...props} />
      {error && <div className="form-error" role="alert">{error}</div>}
    </>
  );
}
