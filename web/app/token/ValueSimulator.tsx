"use client";

import { useState } from "react";

export function ValueSimulator() {
  const [simAge, setSimAge] = useState(35);
  const [simMonth, setSimMonth] = useState(7);

  const poolMean = simAge * 365.25 * 24 * 3600 * 0.85;
  const monthMean =
    simAge * 365.25 * 24 * 3600 * 0.78 + simMonth * 30 * 24 * 3600 * 0.12;
  const dayMean = simAge * 365.25 * 24 * 3600 * 0.72;
  const compositeSeconds = poolMean * 0.6 + monthMean * 0.3 + dayMean * 0.1;
  const displayValue = (compositeSeconds / 1e9).toFixed(4);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="sim-panel">
      <div className="sim-controls">
        <div>
          <label className="sim-label">
            Your age:{" "}
            <span className="sim-label__value">{simAge} years old</span>
          </label>
          <input
            type="range"
            min={18}
            max={80}
            value={simAge}
            onChange={(e) => setSimAge(+e.target.value)}
            className="sim-slider"
          />
          <div className="sim-range-labels">
            <span>18</span>
            <span>80</span>
          </div>
        </div>
        <div>
          <label className="sim-label">
            Birth month:{" "}
            <span className="sim-label__value--cobalt">
              {months[simMonth - 1]}
            </span>
          </label>
          <input
            type="range"
            min={1}
            max={12}
            value={simMonth}
            onChange={(e) => setSimMonth(+e.target.value)}
            className="sim-slider sim-slider--cobalt"
          />
          <div className="sim-range-labels">
            <span>Jan</span>
            <span>Dec</span>
          </div>
        </div>
      </div>

      {/* Pool breakdown */}
      <div className="sim-pools">
        <div className="sim-pool">
          <div className="sim-pool__name sim-pool__name--year">Year Pool</div>
          <div className="sim-pool__meta">
            Weight: 60% &middot; ~{simAge}yr cohort
          </div>
          <div className="sim-pool__value">
            {(poolMean / 1e9).toFixed(3)}
          </div>
          <div className="sim-pool__unit">&times;10&sup9; seconds</div>
        </div>
        <div className="sim-pool">
          <div className="sim-pool__name sim-pool__name--month">
            Month Pool
          </div>
          <div className="sim-pool__meta">
            Weight: 30% &middot; {months[simMonth - 1]} all years
          </div>
          <div className="sim-pool__value">
            {(monthMean / 1e9).toFixed(3)}
          </div>
          <div className="sim-pool__unit">&times;10&sup9; seconds</div>
        </div>
        <div className="sim-pool">
          <div className="sim-pool__name sim-pool__name--day">Day Pool</div>
          <div className="sim-pool__meta">
            Weight: 10% &middot; Cross-year, same day
          </div>
          <div className="sim-pool__value">
            {(dayMean / 1e9).toFixed(3)}
          </div>
          <div className="sim-pool__unit">&times;10&sup9; seconds</div>
        </div>
      </div>

      <div className="sim-result">
        <div>
          <div className="sim-result__label">Composite MIT Value</div>
          <div className="sim-result__formula">
            = 0.60 &times; Year + 0.30 &times; Month + 0.10 &times; Day
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="sim-result__number">{displayValue}</div>
          <div className="sim-result__unit">
            &times;10&sup9; seconds &middot; rising every second
          </div>
        </div>
      </div>
    </div>
  );
}
