import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { fetchStationsApi } from "../../api/stationsApi.js";

// Entity adapter = normalised state ({ ids: [], entities: {} }) + ready-made selectors.
const stationsAdapter = createEntityAdapter();

export const fetchStations = createAsyncThunk(
  "stations/fetch",
  async (options = {}, { rejectWithValue }) => {
    try {
      return await fetchStationsApi(options);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
  {
    // Skip the request if one is already running (e.g. React StrictMode double effect).
    condition: (_, { getState }) => getState().stations.status !== "loading",
  }
);

const stationsSlice = createSlice({
  name: "stations",
  initialState: stationsAdapter.getInitialState({
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    live: true,
  }),
  reducers: {
    liveStatusUpdated(state, action) {
      const { id, available, queue } = action.payload;
      stationsAdapter.updateOne(state, { id, changes: { available, queue } });
    },
    setLive(state, action) {
      state.live = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.status = "succeeded";
        stationsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchStations.rejected, (state, action) => {
        if (action.meta.condition) return; // thunk was skipped, not a real failure
        state.status = "failed";
        state.error = action.payload ?? action.error.message;
      });
  },
});

export const { liveStatusUpdated, setLive } = stationsSlice.actions;

export const {
  selectAll: selectAllStations,
  selectById: selectStationById,
  selectIds: selectStationIds,
} = stationsAdapter.getSelectors((state) => state.stations);

export default stationsSlice.reducer;
