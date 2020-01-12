/* eslint-disable max-len */
import dayjs from "dayjs";

export const GDQ_API_ENDPOINT = "https://api.gdqstat.us";

export const OFFLINE_MODE = true;

const LIVE_STORAGE_ENDPOINT = "https://storage.api.gdqstat.us";

// Note: Keep this up-to-date with the most recent event
export const EVENT_YEAR = 2020;
export const EVENT_SHORT_NAME = "agdq";
export const EVENT_START_DATE = dayjs("01-05-20");

const OFFLINE_STORAGE_ENDPOINT = `/data/${EVENT_YEAR}/${EVENT_SHORT_NAME}_final`;

export const GDQ_STORAGE_ENDPOINT = OFFLINE_MODE
  ? OFFLINE_STORAGE_ENDPOINT
  : LIVE_STORAGE_ENDPOINT;

export const DONATION_TRACKER_URL = `https://gamesdonequick.com/tracker/index/${EVENT_SHORT_NAME}${EVENT_YEAR}`;

export const SECONDARY_COLOR = "#F21847";
export const PRIMARY_COLOR = "#00AEEF";
export const PANEL_BACKGROUND_COLOR = "#EEEEEE";
export const LIGHT_FILL_COLOR = "#DDDDDD";
export const DARK_FILL_COLOR = "#333333";
