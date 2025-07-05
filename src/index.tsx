import React from "react";
import { useState, useRef, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";

type DateTimePickerProps = {
  initialDate?: Date;
  onChange?: (date: Date) => void;
  className?: string;
  bodyColor?: string;
  textColor?: string;
  buttonColor?: string;
  iconColor?: string;
  mode?: "datetime" | "date" | "time";
  locale?: string;
  dateFormat?: Intl.DateTimeFormatOptions;
  timeFormat?: Intl.DateTimeFormatOptions;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  enableRangeSelection?: boolean;
  initialEndDate?: Date;
  onRangeChange?: (startDate: Date, endDate: Date) => void;
  disabledDates?: Date[] | ((date: Date) => boolean);
  minDate?: Date;
  maxDate?: Date;
  timeZone?: string;
  showTimeZoneSelector?: boolean;
  showPresets?: boolean; // New prop to control preset buttons
  customPresets?: Array<{
    label: string;
    value: Date | (() => Date);
  }>;
};

function DateTimePicker({
  initialDate = new Date(),
  onChange,
  className = "",
  bodyColor = "bg-white",
  textColor = "text-gray-700",
  buttonColor = "bg-purple-700",
  iconColor = "",
  mode = "datetime",
  locale = "en-US",
  dateFormat = {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
  timeFormat = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  },
  firstDayOfWeek = 0,
  showPresets = true, // Default to true for backward compatibility
}: DateTimePickerProps) {
  const [date, setDate] = useState(initialDate);
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<"date" | "time">("date");
  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Use iconColor if provided, otherwise default to textColor
  const actualIconColor = iconColor || textColor;

  // Position state
  const [position, setPosition] = useState<"bottom" | "top">("bottom");

  const formattedDate = new Intl.DateTimeFormat(locale, dateFormat).format(
    date
  );
  const formattedTime = new Intl.DateTimeFormat(locale, timeFormat).format(
    date
  );

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

  useEffect(() => {
    // Determine position when the picker is opened
    if (isOpen) {
      // Wait for next render cycle to ensure refs are available
      setTimeout(() => {
        if (inputRef.current && modalRef.current) {
          const inputRect = inputRef.current.getBoundingClientRect();
          const modalHeight = modalRef.current.offsetHeight;
          const viewportHeight = window.innerHeight;

          // Space available below the input
          const spaceBelow = viewportHeight - inputRect.bottom;
          // Space available above the input
          const spaceAbove = inputRect.top;

          // Check if there's enough space below, otherwise position above
          if (spaceBelow < modalHeight && spaceAbove > spaceBelow) {
            setPosition("top");
          } else {
            setPosition("bottom");
          }
        }
      }, 10);
    }
  }, [isOpen]);

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
    const targetView =
      mode === "date" ? "date" : mode === "time" ? "time" : view || activeView;

    if (isOpen && targetView === activeView) {
      setIsOpen(false);
    } else {
      setActiveView(targetView);
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (mode === "date") {
      setActiveView("date");
    } else if (mode === "time") {
      setActiveView("time");
    }
  }, [mode]);

  const closePicker = () => {
    setIsOpen(false);
  };

  const activeTabColor = buttonColor.startsWith("bg-")
    ? buttonColor.replace("bg-", "text-")
    : "text-purple-700";

  const activeTabBorderColor = buttonColor.startsWith("bg-")
    ? buttonColor.replace("bg-", "border-")
    : "border-purple-700";

  return (
    <div className="relative" ref={pickerRef}>
      <div
        ref={inputRef}
        className={`flex items-center  border border-gray-300 rounded-md px-3 py-2 text-sm ${bodyColor} ${textColor} ${className}`}
        role="group"
        aria-label="Date and time selection"
      >
        {mode !== "time" && (
          <div
            className="flex items-center w-[110px] space-x-2 cursor-pointer group"
            onClick={() => togglePicker("date")}
            role="button"
            tabIndex={0}
            aria-label="Select date"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                togglePicker("date");
                e.preventDefault();
              }
            }}
          >
            <Calendar size={16} className={actualIconColor} />
            <span>{formattedDate}</span>
          </div>
        )}
        {mode === "datetime" && (
          <div className={`mx-3 font-light ${textColor}`}>|</div>
        )}
        {mode !== "date" && (
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => togglePicker("time")}
            role="button"
            tabIndex={0}
            aria-label="Select time"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                togglePicker("time");
                e.preventDefault();
              }
            }}
          >
            <Clock size={16} className={actualIconColor} />
            <span>{formattedTime}</span>
          </div>
        )}
      </div>

      {isOpen && (
        <div
          ref={modalRef}
          className={`absolute ${
            position === "bottom" ? "mt-1" : "mb-1 bottom-full"
          } border border-gray-300 rounded-md shadow-lg z-10 w-72 ${
            // Reduced height for more compact design
            mode === "date" || mode === "datetime" ? "h-80" : "h-52"
          } overflow-hidden ${bodyColor}`}
        >
          <div className="flex border-b border-gray-300">
            {mode !== "time" && (
              <button
                className={`flex-1 py-2 text-center ${textColor} ${
                  activeView === "date"
                    ? `${activeTabColor} font-medium border-b-2 ${activeTabBorderColor}`
                    : textColor
                }`}
                onClick={() => setActiveView("date")}
              >
                Date
              </button>
            )}
            {mode !== "date" && (
              <button
                className={`flex-1 py-2 text-center ${textColor} ${
                  activeView === "time"
                    ? `${activeTabColor} font-medium border-b-2 ${activeTabBorderColor}`
                    : textColor
                }`}
                onClick={() => setActiveView("time")}
              >
                Time
              </button>
            )}
          </div>

          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
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
            </div>

            <div className="flex-shrink-0 p-2 border-t border-gray-300">
              {mode !== "time" && showPresets && (
                <div className="mb-3 flex flex-wrap justify-between">
                  <button
                    className={`py-1 w-[30%] px-2 text-xs rounded border ${buttonColor.replace(
                      "bg-",
                      "border-"
                    )} hover:${buttonColor} hover:font-bold transition-all duration-150 ${textColor}`}
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      handleDateChange(tomorrow);
                    }}
                  >
                    Tomorrow
                  </button>
                  <button
                    className={`py-1 px-2 w-[30%] text-xs rounded border ${buttonColor.replace(
                      "bg-",
                      "border-"
                    )} hover:${buttonColor} hover:font-bold transition-all duration-150 ${textColor}`}
                    onClick={() => {
                      const nextWeek = new Date();
                      nextWeek.setDate(nextWeek.getDate() + 7);
                      handleDateChange(nextWeek);
                    }}
                  >
                    Next Week
                  </button>
                  <button
                    className={`py-1 px-2 w-[35%] text-xs rounded border ${buttonColor.replace(
                      "bg-",
                      "border-"
                    )} hover:${buttonColor} hover:font-bold transition-all duration-150 ${textColor}`}
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
                  className={`px-4 py-1 rounded-md text-white text-sm ${buttonColor}`}
                  onClick={closePicker}
                >
                  Done
                </button>
              </div>
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

function DatePicker({
  date,
  onChange,
  textColor = "text-gray-700",
  buttonColor = "bg-purple-700",
  bodyColor = "bg-white",
}: DatePickerProps) {
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
  const startYear = currentYear - 100;
  const yearRange = Array.from({ length: 201 }, (_, i) => startYear + i);

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

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    );
  };

  const getPrevMonthDays = () => {
    const prevMonth = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() - 1,
      1
    );
    const daysInPrevMonth = getDaysInMonth(
      prevMonth.getFullYear(),
      prevMonth.getMonth()
    );
    const firstDayOfMonth = getFirstDayOfMonth(
      viewDate.getFullYear(),
      viewDate.getMonth()
    );

    const days: React.ReactElement[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      const day = daysInPrevMonth - firstDayOfMonth + i + 1;
      days.push(
        <div
          key={`prev-${day}`}
          className={`h-8 w-8 flex items-center justify-center rounded-full text-sm ${textColor.replace('text-', 'text-opacity-30 text-')}`}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  const getNextMonthDays = (firstDayOfMonth: number, daysInMonth: number) => {
    const totalCells = 42; // 6 rows of 7 days
    const remainingCells = totalCells - firstDayOfMonth - daysInMonth;

    const days: React.ReactElement[] = [];
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className={`h-8 w-8 flex items-center justify-center rounded-full text-sm ${textColor.replace('text-', 'text-opacity-30 text-')}`}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  const hoverColor = buttonColor.startsWith("bg-")
    ? buttonColor.replace("bg-", "hover:bg-").replace("-600", "-50")
    : "hover:bg-indigo-50";

  const renderCalendar = () => {
    const days: React.ReactElement[] = [];
    const daysInMonth = getDaysInMonth(
      viewDate.getFullYear(),
      viewDate.getMonth()
    );
    const firstDayOfMonth = getFirstDayOfMonth(
      viewDate.getFullYear(),
      viewDate.getMonth()
    );

    // Add previous month days
    days.push(...getPrevMonthDays());

    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === viewDate.getMonth() &&
        selectedDate.getFullYear() === viewDate.getFullYear();

      const todayHighlight = isToday(day) ? "ring-2 ring-indigo-100" : "";

      days.push(
        <div
          key={day}
          className={`h-8 w-8 flex items-center justify-center rounded-full cursor-pointer text-sm transition-all duration-200
            ${
              isSelected
                ? `${buttonColor} text-white`
                : `${hoverColor} ${todayHighlight} ${textColor}`
            }`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    // Add next month days to fill the grid
    days.push(...getNextMonthDays(firstDayOfMonth, daysInMonth));

    return days;
  };

  const renderYearGrid = () => {
    return (
      <div className="grid grid-cols-4 gap-2 p-2 h-48 overflow-y-auto">
        {yearRange.map((year) => (
          <div
            key={year}
            className={`h-8 flex items-center justify-center rounded cursor-pointer text-sm transition-all duration-200
              ${
                year === viewDate.getFullYear()
                  ? `${buttonColor} text-white`
                  : `${hoverColor} ${textColor}`
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
      <div className="grid grid-cols-3 gap-2 p-3 h-48 overflow-y-auto">
        {monthNamesShort.map((month, index) => (
          <div
            key={month}
            className={`h-8 flex items-center justify-center rounded cursor-pointer text-sm font-medium transition-all duration-200
              ${
                index === viewDate.getMonth()
                  ? `${buttonColor} text-white`
                  : `${hoverColor} ${textColor}`
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
          <div className={`text-center text-sm ${textColor} mb-2 font-medium p-2`}>
            Select Year
          </div>
          {renderYearGrid()}
        </div>
      );
    }

    if (showMonthSelector) {
      return (
        <div>
          <div className={`text-center text-sm ${textColor} mb-2 font-medium p-2`}>
            Select Month
          </div>
          {renderMonthGrid()}
        </div>
      );
    }

    return (
      <div className="p-3">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className={`h-8 w-8 flex items-center justify-center text-xs font-medium ${textColor}`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 max-h-48 overflow-y-auto">
          {renderCalendar()}
        </div>
      </div>
    );
  };

  const hoverTextColor = buttonColor.startsWith("bg-")
    ? buttonColor.replace("bg-", "hover:text-")
    : "hover:text-indigo-600";

  return (
    <div>
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <button
          onClick={handlePrevMonth}
          className={`${textColor} ${hoverTextColor} p-1`}
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
          className={`${textColor} ${hoverTextColor} p-1`}
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
  buttonColor?: string;
};

function TimePicker({
  date,
  onChange,
  textColor = "text-gray-100",
  bodyColor = "bg-white",
}: TimePickerProps) {
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

  const handleHourChange = (value: number) => {
    let newHours = value;
    if (period === "PM" && newHours !== 12) {
      newHours += 12;
    } else if (period === "AM" && newHours === 12) {
      newHours = 0;
    }
    setHours(newHours);
  };

  const handleMinuteChange = (value: number) => {
    setMinutes(value);
  };

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);

    if (newPeriod === "AM" && hours >= 12) {
      setHours(hours - 12);
    } else if (newPeriod === "PM" && hours < 12) {
      setHours(hours + 12);
    }
  };

  const selectClassName = `p-2 border rounded text-center appearance-none w-16 ${textColor} ${bodyColor}`;

  return (
    <div className="p-6">
      <div className="flex justify-center items-center space-x-2">
        <select
          value={displayHours}
          onChange={(e) => handleHourChange(parseInt(e.target.value))}
          className={selectClassName}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
            <option key={hour} value={hour} className={textColor}>
              {hour.toString().padStart(2, "0")}
            </option>
          ))}
        </select>

        <span className={`text-xl font-medium ${textColor}`}>:</span>

        <select
          value={minutes}
          onChange={(e) => handleMinuteChange(parseInt(e.target.value))}
          className={selectClassName}
        >
          {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
            <option key={minute} value={minute} className={textColor}>
              {minute.toString().padStart(2, "0")}
            </option>
          ))}
        </select>

        <select
          value={period}
          onChange={(e) => handlePeriodChange(e.target.value)}
          className={selectClassName}
        >
          <option value="AM" className={textColor}>AM</option>
          <option value="PM" className={textColor}>PM</option>
        </select>
      </div>
    </div>
  );
}

export default DateTimePicker;