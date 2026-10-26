import { useDispatch } from "react-redux";
import { CalendarClock } from "lucide-react";
import { addBooking } from "../store/slices/bookingsSlice.js";
import { notify } from "../store/slices/notificationsSlice.js";
import { useForm } from "../hooks/useForm.js";
import { TextField, SelectField } from "./form/FormField.jsx";
import { required, futureDate, vehiclePlate, custom } from "../utils/validators.js";

const toISO = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const durations = [{ value: "30", label: "30 minutes" }, { value: "60", label: "1 hour" }, { value: "90", label: "1.5 hours" }];

// Cross-field validation: a slot can't run past midnight, and today's slot can't be in the past.
const timeRule = custom((time, v) => {
  if (!time) return "Pick a start time.";
  const [h, m] = time.split(":").map(Number);
  if (h * 60 + m + Number(v.duration) > 24 * 60) return "Slot must finish before midnight.";
  if (v.date === toISO(new Date())) {
    const now = new Date();
    if (h * 60 + m <= now.getHours() * 60 + now.getMinutes()) return "That time has already passed today.";
  }
  return "";
});

const schema = {
  date: [required("Pick a date."), futureDate(7)],
  time: [timeRule],
  plate: [required("Vehicle number is required."), vehiclePlate()],
};

export default function BookingForm({ station }) {
  const dispatch = useDispatch();
  const { bind, handleSubmit, reset } = useForm(
    { date: toISO(new Date()), time: "", duration: "60", plate: "" },
    schema
  );

  function submit(f) {
    dispatch(addBooking({ stationId: station.id, station: station.name, date: f.date, time: f.time, duration: Number(f.duration), plate: f.plate.trim().toUpperCase() }));
    dispatch(notify({ type: "success", message: `Slot reserved at ${station.name} on ${f.date}, ${f.time}.` }));
    reset();
  }

  return (
    <form className="card" onSubmit={handleSubmit(submit)} noValidate style={{ marginBottom: 24 }}>
      <div className="label" style={{ marginBottom: 14 }}><CalendarClock size={12} /> Reserve a slot</div>
      <div className="grid grid-2">
        <TextField label="Date" type="date" min={toISO(new Date())} {...bind("date")} />
        <TextField label="Start time" type="time" {...bind("time")} />
        <SelectField label="Duration" options={durations} {...bind("duration")} />
        <TextField label="Vehicle number" placeholder="HR26AB1234" hint="Used by the station to match your booking." {...bind("plate")} />
      </div>
      <button className="btn btn-primary" type="submit">Reserve slot</button>
    </form>
  );
}
