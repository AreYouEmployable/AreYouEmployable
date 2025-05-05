terraform {
  required_version = ">=1.5.0"
  required_providers {
  aws={
  source = "hashicorp/aws"
  version = "~> 5.0"
      }
  }
}
provider "aws" {
  region = "af-south-1"
}

terraform {
  backend "s3" {
    bucket = "state-bucket-for-guesser-c-proj"
    key    = "state-bucket-for-guesser-c-proj/terraform/terraform.tfstate"
    region = "af-south-1"
    encrypt = true
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

module "ecr" {
  source = "./modules/ecr"
  ecr_repository_name = "api-repository"
}


module "vpc" {
  source = "./modules/vpc"
  vpc_cidr = var.vpc_cidr
  public_subnets = var.public_subnet
  private_subnets = var.private_subnet
  availability_zones = data.aws_availability_zones.available.names
  project_name = "guesser"

}


module "s3_bucket" {
  source= "./modules/s3"
  bucket_name = "guessbuckbuckbucket"
}

module "rds_postgres" {
  source                  = "./modules/db"
  vpc_id = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  db_name = var.db_name
  db_username = var.db_username
  db_password = var.db_password
  depends_on = [ module.vpc ]
}

module "ec2" {
  source ="./modules/ec2"
  vpc_id = module.vpc.vpc_id
  subnet_id = module.vpc.public_subnet_ids[0]
  rds_endpoint = module.rds_postgres.rds_endpoint
  public_subnet_ids =  module.vpc.public_subnet_ids
  depends_on = [ module.vpc ]
  ecr_repository_url = module.ecr.repository_url
  container_port = 80
  aws_region ="af-south-1"
}
