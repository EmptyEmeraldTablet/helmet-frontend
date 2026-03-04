export type SystemConfigResponse = {
  inference_confidence: number
  max_queue_size: number
  data_retention_days: number
  alert_webhook_url: string
  alert_webhook_enabled: boolean
}

export type SystemConfigUpdate = Partial<SystemConfigResponse>
