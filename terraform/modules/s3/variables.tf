variable "bucket_name" {
    description = "The name of the s3 bucket"
    type = string
    default = "mybuckbuckbucket"
}

variable "region" {
  description = "The AWS region to create the bucket in"
  type        = string
  default = "eu-west-1a"
}

variable "versioning_enabled" {
  description = "Enable or disable versioning on the bucket"
  type        = bool
  default     = true
}

variable "encryption_algorithm" {
  description = "The encryption algorithm for server-side encryption"
  type        = string
  default     = "AES256"
}
