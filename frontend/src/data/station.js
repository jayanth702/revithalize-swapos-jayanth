export const stations = [
  {
    id: 1,
    name: "Station 01",
    location: "Warangal Central",
    latitude: 18.0005,
    longitude: 79.5888,
    status: "ACTIVE",

    slots: [
      { id: 1, number: 1, status: "CHARGED", battery: "BAT-1001" },
      { id: 2, number: 2, status: "CHARGED", battery: "BAT-1002" },
      { id: 3, number: 3, status: "CHARGING", battery: "BAT-1003" },
      { id: 4, number: 4, status: "CHARGED", battery: "BAT-1004" },
      { id: 5, number: 5, status: "CHARGED", battery: "BAT-1005" },
      { id: 6, number: 6, status: "CHARGED", battery: "BAT-1006" },
    ],
  },

  {
    id: 2,
    name: "Station 02",
    location: "Kazipet",
    latitude: 17.9689,
    longitude: 79.5028,
    status: "ACTIVE",

    slots: [
      { id: 7, number: 1, status: "CHARGED", battery: "BAT-1007" },
      { id: 8, number: 2, status: "EMPTY", battery: null },
      { id: 9, number: 3, status: "CHARGING", battery: "BAT-1009" },
      { id: 10, number: 4, status: "FAULT", battery: "BAT-1010" },
      { id: 11, number: 5, status: "EMPTY", battery: null },
      { id: 12, number: 6, status: "EMPTY", battery: null },
    ],
  },

  {
    id: 3,
    name: "Station 03",
    location: "Hanamkonda",
    latitude: 17.9784,
    longitude: 79.5941,
    status: "ACTIVE",

    slots: [
      { id: 13, number: 1, status: "CHARGED", battery: "BAT-1013" },
      { id: 14, number: 2, status: "CHARGED", battery: "BAT-1014" },
      { id: 15, number: 3, status: "CHARGED", battery: "BAT-1015" },
      { id: 16, number: 4, status: "CHARGED", battery: "BAT-1016" },
      { id: 17, number: 5, status: "EMPTY", battery: null },
      { id: 18, number: 6, status: "CHARGED", battery: "BAT-1018" },
    ],
  },

  {
    id: 4,
    name: "Station 04",
    location: "NIT Warangal",
    latitude: 17.9826,
    longitude: 79.5309,
    status: "ACTIVE",

    slots: [
      { id: 19, number: 1, status: "CHARGED", battery: "BAT-1019" },
      { id: 20, number: 2, status: "FAULT", battery: "BAT-1020" },
      { id: 21, number: 3, status: "CHARGING", battery: "BAT-1021" },
      { id: 22, number: 4, status: "CHARGED", battery: "BAT-1022" },
      { id: 23, number: 5, status: "CHARGED", battery: "BAT-1023" },
      { id: 24, number: 6, status: "EMPTY", battery: null },
    ],
  },

  {
    id: 5,
    name: "Station 05",
    location: "Subedari",
    latitude: 18.0045,
    longitude: 79.5668,
    status: "ACTIVE",

    slots: [
      { id: 25, number: 1, status: "CHARGED", battery: "BAT-1025" },
      { id: 26, number: 2, status: "CHARGING", battery: "BAT-1026" },
      { id: 27, number: 3, status: "EMPTY", battery: null },
      { id: 28, number: 4, status: "CHARGED", battery: "BAT-1028" },
      { id: 29, number: 5, status: "CHARGED", battery: "BAT-1029" },
      { id: 30, number: 6, status: "FAULT", battery: "BAT-1030" },
    ],
  },
];