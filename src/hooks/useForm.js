import { useCallback, useState } from "react";
import { validate } from "../utils/validators.js";

// Reusable form hook (controlled inputs).
// Validation timing: a field is validated when the user LEAVES it (blur) and then
// live on every keystroke once it has been touched. Submit validates everything.
// schema = { fieldName: [rule, rule, ...] }
export function useForm(initialValues, schema) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const check = useCallback(
    (name, value, all) => validate(schema[name] ?? [])(value, all),
    [schema]
  );

  const setField = (name, value) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name]) setErrors((e) => ({ ...e, [name]: check(name, value, next) }));
  };

  const handleChange = (e) => setField(e.target.name, e.target.value);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((er) => ({ ...er, [name]: check(name, value, values) }));
  };

  // Returns a submit handler; onValid only runs when every field passes.
  const handleSubmit = (onValid) => (e) => {
    e.preventDefault();
    const nextErrors = {};
    Object.keys(schema).forEach((name) => {
      const msg = check(name, values[name], values);
      if (msg) nextErrors[name] = msg;
    });
    setErrors(nextErrors);
    setTouched(Object.fromEntries(Object.keys(schema).map((n) => [n, true])));
    if (Object.keys(nextErrors).length === 0) onValid(values);
  };

  const reset = () => { setValues(initialValues); setErrors({}); setTouched({}); };

  // Spread onto a field: <TextField {...bind("email")} />
  const bind = (name) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] ? errors[name] : "",
  });

  return { values, errors, bind, handleSubmit, reset, setField };
}
