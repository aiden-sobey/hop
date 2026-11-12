output "url" {
  value = "https://${aws_lb.api.dns_name}"
}

output "cluster_name" {
  value = aws_ecs_cluster.this.name
}

output "service_name" {
  value = aws_ecs_service.api.name
}

output "exports_bucket" {
  value = module.exports_bucket.s3_bucket_id
}
