variable "name" {
  description = "Environment name, e.g. prod or a branch name for previews."
  type        = string
}

variable "image_repository_url" {
  description = "ECR repository URL for readings-api."
  type        = string
}

variable "image_tag" {
  description = "Image tag to run."
  type        = string
  default     = "latest"
}

variable "commit_sha" {
  description = "Git commit the environment was deployed from."
  type        = string
  default     = ""
}

variable "commit_timestamp" {
  description = "Commit time of commit_sha, ISO 8601."
  type        = string
  default     = ""
}

variable "deployed_by" {
  description = "GitHub user who deployed the environment."
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "ACM certificate for the HTTPS listener."
  type        = string
}

variable "desired_count" {
  type    = number
  default = 3
}

variable "task_cpu" {
  type    = number
  default = 256
}

variable "task_memory" {
  type    = number
  default = 512
}

variable "log_level" {
  type    = string
  default = "debug"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "db_instance_class" {
  type    = string
  default = "db.r6g.large"
}

variable "db_multi_az" {
  type    = bool
  default = true
}

variable "db_allocated_storage" {
  type    = number
  default = 100
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "deletion_protection" {
  type    = bool
  default = false
}
