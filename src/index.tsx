import React from "react";
import { useState, useRef, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";

type DateTimePickerProps = {
initialDate?: Date;
onChange?: (date: Date) => void;
className?: string;
bodyColor?: string;     // Added for body color customization
textColor?: string;     // Added for text color customization
buttonColor?: string;   // Added for button color customization
mode?: "datetime" | "date" | "time"; // Mode to control component behavior
locale?: string;        // Internationalization locale
dateFormat?: Intl.DateTimeFormatOptions; // Custom date format
timeFormat?: Intl.DateTimeFormatOptions; // Custom time format
firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // First day of week (0 = Sunday, 1 = Monday, etc.)
enableRangeSelection?: boolean;     // Enable date range selection
initialEndDate?: Date;              // Initial end date for range selection
onRangeChange?: (startDate: Date, endDate: Date) => void; // Callback for range changes
disabledDates?: Date[] | ((date: Date) => boolean); // Disable specific dates
minDate?: Date;         // Minimum selectable date
maxDate?: Date;         // Maximum selectable date
timeZone?: string;      // Time zone (e.g., 'America/New_York')
showTimeZoneSelector?: boolean; // Show time zone selector
customPresets?: Array<{
  label: string;
  value: Date | (() => Date);
}>;                     // Custom date/time presets
};

function DateTimePicker({
initialDate = new Date(),
onChange,
className = "",
bodyColor = "bg-white",              // Default white background
textColor = "text-gray-700",         // Default text color
buttonColor = "bg-purple-700",       // Default purple button
mode = "datetime",                   // Default mode is datetime (both date and time)
locale = "en-US",                    // Default locale is US English
dateFormat = {                       // Default date format
  day: "numeric",
  month: "short",
  year: "numeric",
},
timeFormat = {                       // Default time format
  hour: "numeric",
  minute: "numeric",
  hour12: true,
},
firstDayOfWeek = 0,                  // Default first day is Sunday (0)
}: DateTimePickerProps) {
const [date, setDate] = useState(initialDate);
const [isOpen, setIsOpen] = useState(false);
const [activeView, setActiveView] = useState<"date" | "time">("date");
const pickerRef = useRef<HTMLDivElement>(null);

const formattedDate = new Intl.DateTimeFormat(locale, dateFormat).format(date);

const formattedTime = new Intl.DateTimeFormat(locale, timeFormat).format(date);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

useEffect(() => {
  if (onChange && date.getTime() !== initialDate.getTime()) {
    onChange(date);
  }
}, [date, onChange, initialDate]);

const handleDateChange = (newDate: Date) => {
  const updatedDate = new Date(date);
  updatedDate.setFullYear(newDate.getFullYear());
  updatedDate.setMonth(newDate.getMonth());
  updatedDate.setDate(newDate.getDate());

  if (updatedDate.getTime() !== date.getTime()) {
    setDate(updatedDate);
  }
};

const handleTimeChange = (hours: number, minutes: number) => {
  const updatedDate = new Date(date);
  updatedDate.setHours(hours);
  updatedDate.setMinutes(minutes);

  if (updatedDate.getTime() !== date.getTime()) {
    setDate(updatedDate);
  }
};

const togglePicker = (view?: "date" | "time") => {
  // If mode is restricted, override the view with the only allowed view
  const targetView = mode === "date" ? "date" : mode === "time" ? "time" : view || activeView;
  
  if (isOpen && targetView === activeView) {
    // If already open with the same view, close it
    setIsOpen(false);
  } else {
    // Open with the selected view or keep current view
    setActiveView(targetView);
    setIsOpen(true);
  }
};

useEffect(() => {
  // Set the default view based on mode
  if (mode === "date") {
    setActiveView("date");
  } else if (mode === "time") {
    setActiveView("time");
  }
}, [mode]);
const closePicker = () => {
  setIsOpen(false);
};

// Derive active tab color from buttonColor
const activeTabColor = buttonColor.startsWith("bg-") 
  ? buttonColor.replace("bg-", "text-") 
  : "text-purple-700";

// Derive active tab border color from buttonColor
const activeTabBorderColor = buttonColor.startsWith("bg-") 
  ? buttonColor.replace("bg-", "border-") 
  : "border-purple-700";

return (
  <div className="relative" ref={pickerRef}>
    <div
      className={`flex items-center border border-gray-300 rounded-md px-3 py-2 text-sm ${bodyColor} ${textColor} ${className}`}
      role="group"
      aria-label="Date and time selection"
    >
      {mode !== "time" && (
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => togglePicker("date")}
          role="button"
          tabIndex={0}
          aria-label="Select date"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              togglePicker("date");
              e.preventDefault();
            }
          }}
        >
          <Calendar size={16} />
          <span>{formattedDate}</span>
        </div>
      )}
      {mode === "datetime" && <div className="mx-2 text-gray-300">|</div>}
      {mode !== "date" && (
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => togglePicker("time")}
          role="button"
          tabIndex={0}
          aria-label="Select time"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              togglePicker("time");
              e.preventDefault();
            }
          }}
        >
          <Clock size={16} />
          <span>{formattedTime}</span>
        </div>
      )}
    </div>

    {isOpen && (
      <div
        className={`absolute mt-1 border border-gray-300 rounded-md shadow-lg z-10 w-72 h-72 overflow-y-scroll overflow-x-hidden ${bodyColor}`}
      >
        <div className="flex border-b border-gray-300">
          {mode !== "time" && (
            <button
              className={`flex-1 py-2 text-center ${
                activeView === "date"
                  ? `${activeTabColor} font-medium border-b-2 ${activeTabBorderColor}`
                  : "text-gray-500"
              }`}
              onClick={() => setActiveView("date")}
            >
              Date
            </button>
          )}
          {mode !== "date" && (
            <button
              className={`flex-1 py-2 text-center ${
                activeView === "time"
                  ? `${activeTabColor} font-medium border-b-2 ${activeTabBorderColor}`
                  : "text-gray-500"
              }`}
              onClick={() => setActiveView("time")}
            >
              Time
            </button>
          )}
        </div>

        {activeView === "date" ? (
          <DatePicker 
            date={date} 
            onChange={handleDateChange} 
            textColor={textColor} 
            buttonColor={buttonColor} 
            bodyColor={bodyColor}
          />
        ) : (
          <TimePicker 
            date={date} 
            onChange={handleTimeChange} 
            textColor={textColor} 
            bodyColor={bodyColor}
          />
        )}

        <div className="p-2 border-t border-gray-300">
          {mode !== "time" && (
            <div className="mb-3 flex flex-wrap justify-between">
              <button
                className={`py-1 px-2 text-xs rounded ${buttonColor.replace('bg-', 'bg-opacity-20 ')} ${textColor}`}
                onClick={() => {
                  const today = new Date();
                  handleDateChange(today);
                }}
              >
                Today
              </button>
              <button
                className={`py-1 px-2 text-xs rounded ${buttonColor.replace('bg-', 'bg-opacity-20 ')} ${textColor}`}
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  handleDateChange(tomorrow);
                }}
              >
                Tomorrow
              </button>
              <button
                className={`py-1 px-2 text-xs rounded ${buttonColor.replace('bg-', 'bg-opacity-20 ')} ${textColor}`}
                onClick={() => {
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  handleDateChange(nextWeek);
                }}
              >
                Next Week
              </button>
              <button
                className={`py-1 px-2 text-xs rounded ${buttonColor.replace('bg-', 'bg-opacity-20 ')} ${textColor}`}
                onClick={() => {
                  const nextMonth = new Date();
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  handleDateChange(nextMonth);
                }}
              >
                Next Month
              </button>
            </div>
          )}
          <div className="flex justify-end">
            <button
              className={`px-4 py-1 text-white rounded-md text-sm ${buttonColor}`}
              onClick={closePicker}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

type DatePickerProps = {
date: Date;
onChange: (date: Date) => void;
bodyColor?: string;
textColor?: string;
buttonColor?: string;
};

function DatePicker({ date, onChange, textColor = "text-gray-700", buttonColor = "bg-purple-700", bodyColor = "bg-white" }: DatePickerProps) {
const [viewDate, setViewDate] = useState(date);
const [selectedDate, setSelectedDate] = useState(date);
const [showYearSelector, setShowYearSelector] = useState(false);
const [showMonthSelector, setShowMonthSelector] = useState(false);

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthNamesShort = [
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

const currentYear = new Date().getFullYear();
const startYear = currentYear - 12;
const yearRange = Array.from({ length: 25 }, (_, i) => startYear + i);

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const handlePrevMonth = () => {
  setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
};

const handleNextMonth = () => {
  setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
};

const handleYearClick = (year: number) => {
  setViewDate(new Date(year, viewDate.getMonth(), 1));
  setShowYearSelector(false);
};

const handleMonthClick = (monthIndex: number) => {
  setViewDate(new Date(viewDate.getFullYear(), monthIndex, 1));
  setShowMonthSelector(false);
};

const handleDateClick = (day: number) => {
  const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
  setSelectedDate(newDate);
  onChange(newDate);
};

const toggleYearSelector = (e: React.MouseEvent) => {
  e.stopPropagation();
  if (showMonthSelector) setShowMonthSelector(false);
  setShowYearSelector(!showYearSelector);
};

const toggleMonthSelector = (e: React.MouseEvent) => {
  e.stopPropagation();
  if (showYearSelector) setShowYearSelector(false);
  setShowMonthSelector(!showMonthSelector);
};

// Derive hover color from buttonColor
const hoverColor = buttonColor.startsWith("bg-") 
  ? buttonColor.replace("bg-", "hover:bg-").replace("-700", "-100") 
  : "hover:bg-purple-100";

const renderCalendar = () => {
  const daysInMonth = getDaysInMonth(
    viewDate.getFullYear(),
    viewDate.getMonth()
  );
  const firstDayOfMonth = getFirstDayOfMonth(
    viewDate.getFullYear(),
    viewDate.getMonth()
  );

  const days: React.ReactElement[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected =
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewDate.getMonth() &&
      selectedDate.getFullYear() === viewDate.getFullYear();

    days.push(
      <div
        key={day}
        className={`h-8 w-8 flex items-center justify-center rounded-full cursor-pointer text-sm
          ${isSelected ? `${buttonColor} text-white` : `${hoverColor}`}`}
        onClick={() => handleDateClick(day)}
      >
        {day}
      </div>
    );
  }

  return days;
};

const renderYearGrid = () => {
  return (
    <div className="grid grid-cols-5 gap-2 p-2">
      {yearRange.map((year) => (
        <div
          key={year}
          className={`h-10 flex items-center justify-center rounded cursor-pointer text-sm
            ${
              year === viewDate.getFullYear()
                ? `${buttonColor} text-white`
                : `${hoverColor}`
            }`}
          onClick={() => handleYearClick(year)}
        >
          {year}
        </div>
      ))}
    </div>
  );
};

const renderMonthGrid = () => {
  return (
    <div className="grid grid-cols-4 gap-2 p-2">
      {monthNamesShort.map((month, index) => (
        <div
          key={month}
          className={`h-10 flex items-center justify-center rounded cursor-pointer text-sm
            ${
              index === viewDate.getMonth()
                ? `${buttonColor} text-white`
                : `${hoverColor}`
            }`}
          onClick={() => handleMonthClick(index)}
        >
          {month}
        </div>
      ))}
    </div>
  );
};

const renderSelector = () => {
  if (showYearSelector) {
    return (
      <div>
        <div className={`text-center text-sm text-gray-600 mb-2`}>
          Select Year
        </div>
        {renderYearGrid()}
      </div>
    );
  }

  if (showMonthSelector) {
    return (
      <div>
        <div className={`text-center text-sm text-gray-600 mb-2`}>
          Select Month
        </div>
        {renderMonthGrid()}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="h-8 w-8 flex items-center justify-center text-xs text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
    </>
  );
};

// Create hover color for month/year text
const hoverTextColor = buttonColor.startsWith("bg-") 
  ? buttonColor.replace("bg-", "hover:text-") 
  : "hover:text-purple-700";

return (
  <div className="p-4">
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={handlePrevMonth}
        className={`text-gray-600 ${hoverTextColor}`}
      >
        &lt;
      </button>
      <div className="flex items-center space-x-1">
        <span
          className={`font-medium cursor-pointer ${textColor} ${hoverTextColor}`}
          onClick={toggleMonthSelector}
        >
          {monthNames[viewDate.getMonth()]}
        </span>
        <span
          className={`font-medium cursor-pointer ${textColor} ${hoverTextColor}`}
          onClick={toggleYearSelector}
        >
          {viewDate.getFullYear()}
        </span>
      </div>
      <button
        onClick={handleNextMonth}
        className={`text-gray-600 ${hoverTextColor}`}
      >
        &gt;
      </button>
    </div>

    {renderSelector()}
  </div>
);
}

type TimePickerProps = {
date: Date;
onChange: (hours: number, minutes: number) => void;
textColor?: string;
bodyColor?: string;
};

function TimePicker({ date, onChange, textColor = "text-gray-700", bodyColor = "bg-white" }: TimePickerProps) {
const [hours, setHours] = useState(date.getHours());
const [minutes, setMinutes] = useState(date.getMinutes());
const [period, setPeriod] = useState(date.getHours() >= 12 ? "PM" : "AM");

const displayHours =
  period === "AM"
    ? hours === 0
      ? 12
      : hours
    : hours === 12
    ? 12
    : hours - 12;

useEffect(() => {
  const newHours =
    period === "AM"
      ? displayHours === 12
        ? 0
        : displayHours
      : displayHours === 12
      ? 12
      : displayHours + 12;

  onChange(newHours, minutes);
}, [hours, minutes, period, displayHours, onChange]);

const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  let newHours = parseInt(e.target.value);
  if (period === "PM" && newHours !== 12) {
    newHours += 12;
  } else if (period === "AM" && newHours === 12) {
    newHours = 0;
  }
  setHours(newHours);
};

const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setMinutes(parseInt(e.target.value));
};

const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const newPeriod = e.target.value;
  setPeriod(newPeriod);

  if (newPeriod === "AM" && hours >= 12) {
    setHours(hours - 12);
  } else if (newPeriod === "PM" && hours < 12) {
    setHours(hours + 12);
  }
};

return (
  <div className="p-6">
    <div className="flex justify-center items-center space-x-2">
      <select
        value={displayHours}
        onChange={handleHourChange}
        className={`p-2 border rounded text-center appearance-none w-16 ${textColor} ${bodyColor}`}
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
          <option key={hour} value={hour}>
            {hour.toString().padStart(2, "0")}
          </option>
        ))}
      </select>

      <span className={`text-xl font-medium ${textColor}`}>:</span>

      <select
        value={minutes}
        onChange={handleMinuteChange}
        className={`p-2 border rounded text-center appearance-none w-16 max-h-40 overflow-y-auto ${textColor} ${bodyColor}`}
      >
        {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
          <option key={minute} value={minute}>
            {minute.toString().padStart(2, "0")}
          </option>
        ))}
      </select>

      <select
        value={period}
        onChange={handlePeriodChange}
        className={`p-2 border rounded text-center appearance-none w-16 ${textColor} ${bodyColor}`}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  </div>
);
}

export default DateTimePicker;