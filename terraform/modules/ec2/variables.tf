variable "instance_type" {
    description = "They type of instance to create"
    default = "t3.micro"
}

variable "ami_id" {
    description = "The AMI ID for the instance"
    default = "ami-080b2e8ce472c5091"
}

variable "instance_name" {
    description = "The name of the instance"
    default = "my-instance"
}

variable "security_group_ids" {
  description = "Security group IDs to associate with the instance"
  type        = list(string)
  default     = []
}

variable "subnet_id" {
  # description = "The subnet ID where the instance will be launched"
  # type        = list(string)
}

variable "public_subnet_ids" {
  
}

variable "rds_endpoint" {
  
}

variable "vpc_id" {
  
}

variable "aws_region" {
  
}

variable "ecr_repository_url" {
  
}

variable "container_port" {
  
}
