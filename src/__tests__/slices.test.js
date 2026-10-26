import { describe, it, expect } from "vitest";
import favorites, { toggleFavorite } from "../store/slices/favoritesSlice.js";
import bookings, { addBooking, cancelBooking } from "../store/slices/bookingsSlice.js";

describe("favoritesSlice", () => {
  it("toggles an id on and off", () => {
    const on = favorites({ ids: [] }, toggleFavorite(3));
    expect(on.ids).toEqual([3]);
    expect(favorites(on, toggleFavorite(3)).ids).toEqual([]);
  });
});

describe("bookingsSlice", () => {
  it("adds sorted bookings and cancels by id", () => {
    let s = bookings(undefined, addBooking({ date: "2026-10-30", time: "10:00" }));
    s = bookings(s, addBooking({ date: "2026-10-28", time: "09:00" }));
    expect(s.items[0].date).toBe("2026-10-28");
    s = bookings(s, cancelBooking(s.items[0].id));
    expect(s.items).toHaveLength(1);
  });
});
