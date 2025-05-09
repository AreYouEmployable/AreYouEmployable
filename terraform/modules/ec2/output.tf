output "ec2_public_ip" {
  value = aws_instance.app.public_ip
}

output "ssh_private_key" {
  value     = tls_private_key.temp_ssh_key.private_key_pem
  sensitive = true
}