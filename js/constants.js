export const GDQ_API_ENDPOINT = 'https://api.gdqstat.us'

export const OFFLINE_MODE = false

const LIVE_STORAGE_ENDPOINT = 'http://storage.api.gdqstat.us'

// TODO: Update this to most recent event
const OFFLINE_STORAGE_ENDPOINT = '/data/2018/agdq_final'

export const GDQ_STORAGE_ENDPOINT = OFFLINE_MODE ? OFFLINE_STORAGE_ENDPOINT : LIVE_STORAGE_ENDPOINT

export const SECONDARY_COLOR = '#F21847'
export const PRIMARY_COLOR = '#00AEEF'
export const PANEL_BACKGROUND_COLOR = '#EEEEEE'
export const LIGHT_FILL_COLOR = '#DDDDDD'
export const DARK_FILL_COLOR = '#333333'
