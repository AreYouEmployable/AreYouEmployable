output "vpc_id" {
    value = module.vpc.vpc_id

}

output "rds_endpoint" {
  value = module.rds_postgres.rds_endpoint
}

output "ec2" {
  value = module.ec2.ec2_public_ip
}

output "ecr_repository_url" {
  value = module.ecr.repository_url
}

output "ssh_private_key" {
  value = module.ec2.ssh_private_key
  sensitive = true
}