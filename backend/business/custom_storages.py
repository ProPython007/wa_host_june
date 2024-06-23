# from storages.backends.s3boto3 import S3Boto3Storage

# class CustomS3Boto3Storage(S3Boto3Storage):
#     def __init__(self, *args, **kwargs):
#         bucket_name = 'django-storge-app'
#         kwargs['default_acl'] = 'public-read'  # Set ACL to public-read
#         super().__init__(*args, **kwargs)