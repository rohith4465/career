import React from "react";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => CURRENT_YEAR - i);

export interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  labelClassName?: string;
  name: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange, labelClassName, name }) => {
  // Parse value into month/year
  let [month, year] = value.split(" ");
  if (!MONTHS.includes(month)) month = "";
  if (!YEARS.includes(Number(year))) year = "";

  return (
    <label className={`text-base font-medium text-gray-700 ${labelClassName || ""}`}>
      {label}
      <div className="flex gap-2 mt-1">
        <select
          className="rounded border-gray-300 px-2 py-1"
          value={month}
          onChange={e => onChange(`${e.target.value} ${year}`)}
          name={name + "_month"}
        >
          <option value="">Month</option>
          {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          className="rounded border-gray-300 px-2 py-1"
          value={year}
          onChange={e => onChange(`${month} ${e.target.value}`)}
          name={name + "_year"}
        >
          <option value="">Year</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
    </label>
  );
};
