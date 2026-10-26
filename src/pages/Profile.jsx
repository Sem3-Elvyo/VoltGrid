import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../store/slices/profileSlice.js";
import { notify } from "../store/slices/notificationsSlice.js";
import { useForm } from "../hooks/useForm.js";
import { TextField, SelectField } from "../components/form/FormField.jsx";
import { required, email, numberBetween } from "../utils/validators.js";

const schema = {
  name: [required("Name is required.")],
  email: [required("Email is required."), email()],
  capacity: [numberBetween(10, 200, "Battery must be 10–200 kWh.")],
  maxSpeed: [numberBetween(3, 350, "Charging speed must be 3–350 kW.")],
};

export default function Profile() {
  const dispatch = useDispatch();
  const profile = useSelector((s) => s.profile);

  // Local form state (useForm) while typing; Redux is only updated on a valid Save.
  const { bind, handleSubmit } = useForm(
    {
      name: profile.name,
      email: profile.email,
      connector: profile.vehicle.connector,
      capacity: profile.vehicle.batteryCapacityKwh,
      maxSpeed: profile.vehicle.maxChargingSpeedKw,
    },
    schema
  );

  function save(f) {
    dispatch(
      updateProfile({
        name: f.name.trim(),
        email: f.email.trim(),
        vehicle: {
          connector: f.connector,
          batteryCapacityKwh: Number(f.capacity),
          maxChargingSpeedKw: Number(f.maxSpeed),
        },
      })
    );
    dispatch(notify({ type: "success", message: "Profile saved — rankings and charge times updated." }));
  }

  return (
    <div className="container" style={{ paddingBottom: 56 }}>
      <div className="page-header">
        <h1>Profile</h1>
        <p>
          {profile.vehicle.make} {profile.vehicle.model}. Changes here affect the Simulator,
          Recommendations and station pages.
        </p>
      </div>

      <form onSubmit={handleSubmit(save)} noValidate>
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="label" style={{ marginBottom: 14 }}>Account</div>
          <div className="grid grid-2">
            <TextField label="Name" {...bind("name")} />
            <TextField label="Email" type="email" {...bind("email")} />
          </div>
        </div>
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="label" style={{ marginBottom: 14 }}>Vehicle</div>
          <div className="grid grid-2">
            <SelectField label="Connector type" options={["CCS2", "CHAdeMO", "Type 2 AC", "GB/T"]} {...bind("connector")} />
            <TextField label="Battery capacity (kWh)" type="number" {...bind("capacity")} />
            <TextField label="Max charging speed (kW)" type="number" {...bind("maxSpeed")} />
          </div>
        </div>
        <button className="btn btn-primary" type="submit">Save changes</button>
      </form>
    </div>
  );
}
