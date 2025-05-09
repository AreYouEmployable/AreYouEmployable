
resource "aws_security_group" "rds_sg" {
  vpc_id = var.vpc_id

  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags =  {
    Name = "rds_sg"
  }
}

resource "aws_db_subnet_group" "rds" {
  name = "rds-subnet-group"
  subnet_ids = var.public_subnet_ids
  tags = {
    Name = "rds-subnet-group"
  }
}

resource "aws_db_instance" "postgres" {
  identifier = "guesser-db"
  engine = "postgres"
  engine_version = 17
  instance_class = "db.t3.micro"
  allocated_storage = 20
  db_name = var.db_name
  username = var.db_username
  password = var.db_password
  db_subnet_group_name = aws_db_subnet_group.rds.name
  vpc_security_group_ids = [ aws_security_group.rds_sg.id ]
  publicly_accessible = true
  skip_final_snapshot = true
  tags = {Name = "guesser-db"}
}