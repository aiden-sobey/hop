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
    key          = "shared/terraform.tfstate"
    region       = "ap-southeast-2"
    use_lockfile = true
  }
}

provider "aws" {
  region = "ap-southeast-2"

  default_tags {
    tags = {
      Project   = "readings"
      Stage     = "shared"
      ManagedBy = "terraform"
    }
  }
}

module "ecr" {
  source  = "terraform-aws-modules/ecr/aws"
  version = "~> 3.0"

  repository_name                 = "readings-api"
  repository_image_tag_mutability = "MUTABLE"
  create_lifecycle_policy         = false
}

output "repository_url" {
  value = module.ecr.repository_url
}
