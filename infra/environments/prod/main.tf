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
    key          = "prod/terraform.tfstate"
    region       = "ap-southeast-2"
    use_lockfile = true
  }
}

provider "aws" {
  region = "ap-southeast-2"

  default_tags {
    tags = {
      Project     = "readings"
      Stage       = "prod"
      Environment = "prod"
      ManagedBy   = "terraform"
    }
  }
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "certificate_arn" {
  type = string
}

data "aws_ecr_repository" "api" {
  name = "readings-api"
}

module "environment" {
  source = "../../modules/environment"

  name                 = "prod"
  image_repository_url = data.aws_ecr_repository.api.repository_url
  certificate_arn      = var.certificate_arn
  db_password          = var.db_password
  deletion_protection  = true
  vpc_cidr             = "10.10.0.0/16"
}

output "url" {
  value = module.environment.url
}
