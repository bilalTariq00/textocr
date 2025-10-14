// AWS Textract Configuration Template
// Copy this file to aws.ts and add your credentials

// Instructions:
// 1. Go to https://console.aws.amazon.com/iam/
// 2. Create an IAM user with AmazonTextractFullAccess policy
// 3. Create access keys for the user
// 4. Copy this file: cp aws.example.ts aws.ts
// 5. Replace the values below with your credentials

export const AWS_CONFIG = {
  // Your AWS region (choose closest to you)
  // Options: 'us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', etc.
  // Example: 'us-east-1'
  region: 'us-east-1',
  
  // Your AWS Access Key ID
  // Example: 'AKIAIOSFODNN7EXAMPLE'
  accessKeyId: 'your-access-key-id',
  
  // Your AWS Secret Access Key
  // Example: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
  secretAccessKey: 'your-secret-access-key',
  
  // Set to true to enable AWS Textract, false to use other OCR engines
  useAWSTextract: false
};

// ⚠️ Security Note:
// Never commit the actual aws.ts file with your real credentials!
// The .gitignore file is configured to exclude it.
//
// For production deployment:
// Use environment variables instead of hardcoding credentials

