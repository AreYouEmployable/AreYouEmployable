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
    default = "guessapi"
}

variable "subnet_name" {
    description = "The name of the subnet"
    default = "guessApiSubnet"
}

variable "db_name" {
  default = "guesserDB"
}

variable "db_username" {
  default = "iamuser"
}

variable "db_password" {
  description = "The database password"
  type        = string
  sensitive   = true
}
 variable "vpc_cidr" {
   default = "10.1.0.0/16"
 }

 variable "public_subnet" {
   default = ["10.1.1.0/24","10.1.2.0/24"]
 }

 variable "private_subnet" {
   default = ["10.1.3.0/24","10.1.4.0/24"]
 }

variable "availability_zones" {
 default = ["af-south-1a", "af-south-1b","af-south-3c"]
}


