# r-datetime

A customizable and lightweight **React Date Time Picker** component with a smooth UI, time zone support, and flexible configuration options. Ideal for modern React applications that require date, time, or date-time inputs with advanced features.

![r-datetime Demo](/api/placeholder/800/400)

## 📦 Installation

```bash
npm install r-datetime
```

or

```bash
yarn add r-datetime
```

## 🚀 Quick Start

```jsx
import React, { useState } from 'react';
import DateTimePicker from 'r-datetime';

const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="app">
      <DateTimePicker onChange={(date) => setSelectedDate(date)} />
      {selectedDate && (
        <p>Selected: {selectedDate.toLocaleString()}</p>
      )}
    </div>
  );
};
```

## 🎨 Theming Options

### Default Theme
Clean, minimalist design that works with any application.

![Default Theme](https://drive.google.com/uc?export=view&id=1O-TvSpiPB3ZUmxpqcDMz7iPZWYuBZbJH)

```jsx
<DateTimePicker onChange={(date) => setSelectedDate(date)} />
```

### Light Theme with Custom Colors
Customize your picker with any color palette that matches your brand.

![Light Theme Custom](https://drive.google.com/uc?export=view&id=1-fJHnCFuPoBQmiOVY4OEJMW3GMEnWi6M)

```jsx
<DateTimePicker
  onChange={(date) => setSelectedDate(date)}
  bodyColor="bg-gray-100"
  textColor="text-gray-800"
  buttonColor="bg-blue-600"
  iconColor="text-blue-500"
/>
```

### Dark Theme
Perfect for dark-mode interfaces or night-time usage.

![Dark Theme](https://drive.google.com/uc?export=view&id=1-4V8b6vtBP1E6o8DqaAFpOU1KWHWCBi0)

```jsx
<DateTimePicker
  onChange={(date) => setSelectedDate(date)}
  bodyColor="bg-black"
  textColor="text-gray-100"
  buttonColor="bg-purple-600"
  iconColor="text-purple-400"
/>
```

## 📅 Different Modes

### Date-Time Mode (Default)
Select both date and time in one component.

![DateTime Mode](/api/placeholder/400/200)

```jsx
<DateTimePicker onChange={(date) => setSelectedDate(date)} />
```

### Date Only Mode
When you only need to collect a date.

![Date Only Mode](https://drive.google.com/uc?export=view&id=1DD5xfbW8Hjl7k1urOODGpdo8t0BKP8lZ)

```jsx
<DateTimePicker
  onChange={(date) => setSelectedDate(date)}
  mode="date"
  buttonColor="bg-green-600"
/>
```

### Time Only Mode
For time selection without dates.

![Time Only Mode](https://drive.google.com/uc?export=view&id=1Y46AK841Oj4Xc72VJhYzxCLFMad_y02k)

```jsx
<DateTimePicker
  onChange={(date) => setSelectedDate(date)}
  mode="time"
  buttonColor="bg-amber-600"
/>
```

## 🌍 Internationalization

Support for multiple languages and date formats to meet global user needs.

![French Locale](https://drive.google.com/file/d/150kRYcA7_zEl4onjOQmfqUycgTJI5jr0/view?usp=drive_link)

```jsx
<DateTimePicker
  onChange={(date) => setSelectedDate(date)}
  locale="fr-FR"
  dateFormat={{ day: "2-digit", month: "long", year: "numeric" }}
  timeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
  firstDayOfWeek={1} // Monday as first day
  buttonColor="bg-indigo-600"
/>
```

## 🎛️ Props

| Prop                   | Type                                     | Default       | Description                           |
| ---------------------- | ---------------------------------------- | ------------- | ------------------------------------- |
| `mode`                 | `'date' \| 'time' \| 'datetime'`         | `'datetime'`  | Choose picker mode                    |
| `onChange`             | `(date: Date) => void`                   | **required**  | Callback on date/time selection       |
| `bodyColor`            | `string`                                 | `bg-white`    | Tailwind class for body background    |
| `textColor`            | `string`                                 | `text-black`  | Tailwind class for text color         |
| `buttonColor`          | `string`                                 | `bg-blue-500` | Tailwind class for button color       |
| `iconColor`            | `string`                                 | `text-blue-500` | Tailwind class for icon color        |
| `locale`               | `string`                                 | `en-US`       | Locale for formatting                 |
| `dateFormat`           | `Intl.DateTimeFormatOptions`             | `{}`          | Custom date format                    |
| `timeFormat`           | `Intl.DateTimeFormatOptions`             | `{}`          | Custom time format                    |
| `firstDayOfWeek`       | `0 \| 1`                                 | `0` (Sunday)  | First day of the week                 |
| `enableRangeSelection` | `boolean`                                | `false`       | Enable date range selection           |
| `onRangeChange`        | `(start: Date, end: Date) => void`       | `undefined`   | Callback for range change             |
| `initialEndDate`       | `Date`                                   | `undefined`   | Preselect end date in range mode      |
| `minDate`              | `Date`                                   | `undefined`   | Minimum selectable date               |
| `maxDate`              | `Date`                                   | `undefined`   | Maximum selectable date               |
| `disabledDates`        | `Date[]`                                 | `[]`          | Dates to be disabled                  |
| `timeZone`             | `string`                                 | User's TZ     | IANA time zone (e.g., 'Europe/Paris') |
| `showTimeZoneSelector` | `boolean`                                | `false`       | Show time zone selector dropdown      |
| `customPresets`        | `{ label: string, value: () => Date }[]` | `[]`          | Predefined date presets               |

## 🧪 Development & Testing

You can test your local changes using:

```bash
npm link
npm run build
```

Then in your test project:

```bash
npm link r-datetime
```

## 📘 License

MIT License

## 📌 Author & Repository

* Author: [Piyush](https://github.com/pk3808)
* GitHub: [https://github.com/pk3808/r-datetime](https://github.com/pk3808/r-datetime)
* NPM: [https://www.npmjs.com/package/r-datetime](https://www.npmjs.com/package/r-datetime)