// Validation strategy: each rule is a tiny function (value, allValues) => error string | "".
// `validate(rules)(value, values)` runs them in order and returns the FIRST error.
// Rules are reusable across every form (login, profile, booking).
export const required = (msg = "This field is required.") => (v) =>
  String(v ?? "").trim() ? "" : msg;

export const email = (msg = "Enter a valid email address.") => (v) =>
  /^\S+@\S+\.\S+$/.test(String(v).trim()) ? "" : msg;

export const minLength = (n, msg) => (v) =>
  String(v).length >= n ? "" : msg ?? `Must be at least ${n} characters.`;

export const numberBetween = (min, max, msg) => (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= min && n <= max ? "" : msg ?? `Enter a number from ${min} to ${max}.`;
};

export const pattern = (regex, msg) => (v) => (regex.test(String(v).trim().toUpperCase()) ? "" : msg);

// Indian number plate, e.g. HR26AB1234 (spaces/dashes ignored by the caller).
export const vehiclePlate = () =>
  pattern(/^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{4}$/, "Use a valid plate, e.g. HR26AB1234.");

export const futureDate = (maxDaysAhead = 7) => (v) => {
  if (!v) return "";
  const picked = new Date(v + "T00:00:00");
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const limit = new Date(today); limit.setDate(limit.getDate() + maxDaysAhead);
  if (picked < today) return "Date can't be in the past.";
  if (picked > limit) return `You can book up to ${maxDaysAhead} days ahead.`;
  return "";
};

// Cross-field rule: needs ALL form values, e.g. "slot must end before midnight".
export const custom = (fn) => fn;

export const validate = (rules) => (value, values) => {
  for (const rule of rules) {
    const error = rule(value, values);
    if (error) return error;
  }
  return "";
};

export const passwordStrength = (pw) => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return ["Too short", "Weak", "Okay", "Good", "Strong"][score] ?? "Too short";
};
