# One Terraform workspace per preview environment. The workspace name is the
# branch slug, set by .github/workflows/preview.yml.

terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  backend "s3" {
    bucket       = "acme-readings-terraform-state"
    key          = "preview/terraform.tfstate"
    region       = "ap-southeast-2"
    use_lockfile = true
  }
}

provider "aws" {
  region = "ap-southeast-2"

  default_tags {
    tags = {
      Project     = "readings"
      Stage       = "preview"
      Environment = terraform.workspace
      ManagedBy   = "terraform"
    }
  }
}

variable "image_tag" {
  type = string
}

variable "commit_sha" {
  type = string
}

variable "commit_timestamp" {
  type = string
}

variable "deployed_by" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "certificate_arn" {
  description = "Wildcard certificate for *.preview.acme-readings.example."
  type        = string
}

data "aws_ecr_repository" "api" {
  name = "readings-api"
}

module "environment" {
  source = "../../modules/environment"

  name                 = terraform.workspace
  image_repository_url = data.aws_ecr_repository.api.repository_url
  image_tag            = var.image_tag
  commit_sha           = var.commit_sha
  commit_timestamp     = var.commit_timestamp
  deployed_by          = var.deployed_by
  certificate_arn      = var.certificate_arn
  db_password          = var.db_password
}

output "url" {
  value = module.environment.url
}
