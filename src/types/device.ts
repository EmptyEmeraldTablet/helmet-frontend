export type Device = {
  id: string
  name: string | null
  status: 'active' | 'disabled'
  last_seen_at: string | null
  created_at: string
}

export type DeviceCreateRequest = {
  name?: string
}

export type DeviceUpdateRequest = {
  name?: string
  status?: 'active' | 'disabled'
}

export type DeviceCreateResponse = Device & {
  api_key: string
}
