import { useEffect, useMemo, useState } from "react";
import "../styles/booking-week-calendar.css";
import { useRef } from "react";

const dayNames = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];

function getBestSlot(slots) {
  const now = new Date();

  const futureSlots = slots.filter(
    (s) => new Date(s.start) > now && s.status !== "busy"
  );

  if (!futureSlots.length) return null;

  return futureSlots.sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  )[0];
}

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);

  return d;
}

function formatDate(date) {
  return date.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
  });
}
function isSlotRecent(slot) {
  const value = `recent-${slot.date}-${slot.time}`;
  let sum = 0;

  for (let i = 0; i < value.length; i++) {
    sum += value.charCodeAt(i);
  }

  return sum % 7 === 0;
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;

  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function formatKey(date) {
  return date.toLocaleDateString("sv-SE");
}

function normalizeDateKey(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("sv-SE");
}

function formatWeekRange(days) {
  const first = days[0];
  const last = days[6];

  return `${first.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
  })} – ${last.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

function isSlotRecommended(slot) {
  const now = new Date();
  const slotDateTime = new Date(slot.start);

  return (
    slotDateTime > now &&
    slotDateTime - now < 1000 * 60 * 60 * 48
  );
}

function isSlotPopular(slot) {
  const value = `${slot.date}-${slot.time}`;
  let sum = 0;

  for (let i = 0; i < value.length; i++) {
    sum += value.charCodeAt(i);
  }

  return sum % 5 === 0;
}

export default function BookingWeekCalendar({
  slots = [],
  isApprovalMode,
  selectedSlot,
  selectedSlots = [],
  onSelectSlot,
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const bestSlot = useMemo(() => getBestSlot(slots), [slots]);
  const dayRefs = useRef({});

  useEffect(() => {
    if (!bestSlot) return;

    const bestDate = bestSlot.date;

    const el = dayRefs.current[bestDate];

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [bestSlot]);

  const days = useMemo(() => {
    const start = getStartOfWeek(new Date());
    start.setDate(start.getDate() + weekOffset * 7);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [weekOffset]);

  const slotsByDate = useMemo(() => {
    const map = {};

    for (const slot of slots) {
      const key = normalizeDateKey(slot.date);

      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(slot);
    }

    return map;
  }, [slots]);

  return (
    <div className="booking-calendar">
      <div className="booking-calendar-header">
        <button type="button" onClick={() => setWeekOffset(weekOffset - 1)}>
          ← Föregående
        </button>

        <div className="booking-calendar-title">
          <div className="week-pill">Vecka {getWeekNumber(days[0])}</div>

          <h3>{isApprovalMode ? "Välj upp till 3 tider" : "Välj en tid"}</h3>

          <span>{formatWeekRange(days)}</span>

          {bestSlot && (
            <button
              type="button"
              className="best-slot-button"
              onClick={() => onSelectSlot(bestSlot)}
            >
              Välj rekommenderad tid: {bestSlot.time}
            </button>
          )}
        </div>

        <div className="booking-calendar-actions">
          <button type="button" onClick={() => setWeekOffset(0)}>
            Idag
          </button>

          <button type="button" onClick={() => setWeekOffset(weekOffset + 1)}>
            Nästa →
          </button>
        </div>
      </div>

      <div className="booking-week-grid">
        {days.map((day, index) => {
          const dateKey = formatKey(day);
          const daySlots = slotsByDate[dateKey] || [];

          return (
            <div
              className="booking-day-column"
              key={dateKey}
              ref={(el) => (dayRefs.current[dateKey] = el)}
            >
              <div className="booking-day-header">
                <strong>{dayNames[index]}</strong>
                <span>{formatDate(day)}</span>
              </div>

              <div className="booking-slots">
                {daySlots.length > 0 ? (
                  daySlots.map((slot) => {
                    const isSelected = isApprovalMode
                      ? selectedSlots.some((s) => s.start === slot.start)
                      : selectedSlot?.start === slot.start;

                    const isPast = new Date(slot.start) < new Date();
                    const isBusy = slot.status === "busy";
                    const recommended = !isBusy && isSlotRecommended(slot);
                    const popular = !isBusy && isSlotPopular(slot);
                    const isRecent = !isBusy && isSlotRecent(slot);
                    const isBest = bestSlot && slot.start === bestSlot.start;

                    return (
                      <button
                        key={slot.start}
                        type="button"
                        disabled={isPast || isBusy}
                        className={`booking-slot ${
                          isSelected ? "selected" : ""
                        } ${recommended ? "recommended" : ""} ${
                          isPast ? "past" : ""
                        } ${isBusy ? "busy" : ""} ${isBest ? "best" : ""}`}
                        onClick={() => onSelectSlot(slot)}
                      >
                        <span>{slot.time}</span>
                        {isBest && (
                          <small className="slot-tag best-tag">
                            Rekommenderad
                          </small>
                        )}

                        {!isBest && !isBusy && !isPast && recommended && (
                          <small className="slot-tag recommended-tag">
                            Snart
                          </small>
                        )}

                        {!isBest && !recommended && !isBusy && !isPast && popular && (
                          <small className="slot-tag popular-tag">
                            Populär
                          </small>
                        )}

                        {!isBest && !recommended && !popular && !isBusy && !isPast && isRecent && (
                          <small className="slot-tag recent-tag">
                            Bokad nyligen
                          </small>
                        )}

                        {isBusy && (
                          <small className="slot-tag busy-tag">
                            Upptagen
                          </small>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <p className="no-slots">Inga tider</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}