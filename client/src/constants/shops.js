export const SHOPS = [
  { id: "shop-1", name: "Campus Xerox Hub", status: "OPEN", queueCount: 4 },
  { id: "shop-2", name: "Quick Print Corner", status: "OPEN", queueCount: 12 },
  { id: "shop-3", name: "Student Print Zone", status: "BUSY", queueCount: 22 },
  { id: "shop-4", name: "Library Copy Center", status: "BREAK", queueCount: 0 },
  { id: "shop-5", name: "Gate Xerox Point", status: "CLOSED", queueCount: 0 },
];

export const SHOP_STATUS_LABELS = {
  OPEN: "Open",
  BREAK: "On Break",
  CLOSED: "Closed",
  BUSY: "Busy",
};

export const SHOP_STATUS_MESSAGES = {
  OPEN: "Accepting orders",
  BREAK: "Lunch break or temporary break",
  CLOSED: "Closed for the day",
  BUSY: "Too many pending orders",
};
