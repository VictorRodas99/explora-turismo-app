export interface CloudinaryResponse {
  total_count: number
  time: number
  resources: Resource[]
  rate_limit_allowed: number
  rate_limit_reset_at: Date
  rate_limit_remaining: number
}

export interface Resource {
  asset_id: string
  public_id: string
  asset_folder: string
  filename: string
  display_name: string
  format: 'jpg' | 'png'
  version: number
  resource_type: 'image' | 'video'
  type: string
  created_at: Date
  uploaded_at: Date
  bytes: number
  backup_bytes: number
  width: number
  height: number
  aspect_ratio: number
  pixels: number
  url: string
  secure_url: string
  status: string
  access_mode: 'public'
  access_control: null
  etag: string
  created_by: EditedByProperty
  uploaded_by: EditedByProperty
  last_updated: LastUpdated
}

export interface EditedByProperty {
  access_key: string
  custom_id: string
  external_id: string
}

export interface LastUpdated {
  context_updated_at: Date
  updated_at: Date
  tags_updated_at?: Date
}
