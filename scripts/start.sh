#!/bin/bash
cd /home/ubuntu/studeaming/server

export DATABASE_USERNAME=$(aws ssm get-parameters --region us-east-2 --names DATABASE_USERNAME --query Parameters[0].Value | sed 's/"//g')
export DATABASE_PASSWORD=$(aws ssm get-parameters --region us-east-2 --names DATABASE_PASSWORD --query Parameters[0].Value | sed 's/"//g')
export DATABASE_NAME=$(aws ssm get-parameters --region us-east-2 --names DATABASE_NAME --query Parameters[0].Value | sed 's/"//g')

export ACCESS_SECRET=$(aws ssm get-parameters --region us-east-2 --names ACCESS_SECRET --query Parameters[0].Value | sed 's/"//g')
export REFRESH_SECRET=$(aws ssm get-parameters --region us-east-2 --names REFRESH_SECRET --query Parameters[0].Value | sed 's/"//g')

export NODEMAILER_EMAIL=$(aws ssm get-parameters --region us-east-2 --names NODEMAILER_EMAIL --query Parameters[0].Value | sed 's/"//g')
export NODEMAILER_PASSWORD=$(aws ssm get-parameters --region us-east-2 --names NODEMAILER_PASSWORD --query Parameters[0].Value | sed 's/"//g')

export GOOGLE_CLIENT_ID=$(aws ssm get-parameters --region us-east-2 --names GOOGLE_CLIENT_ID --query Parameters[0].Value | sed 's/"//g')
export GOOGLE_CLIENT_SECRET=$(aws ssm get-parameters --region us-east-2 --names GOOGLE_CLIENT_SECRET --query Parameters[0].Value | sed 's/"//g')
export KAKAO_CLIENT_ID=$(aws ssm get-parameters --region us-east-2 --names KAKAO_CLIENT_ID --query Parameters[0].Value | sed 's/"//g')
export KAKAO_ADMIN_KEY=$(aws ssm get-parameters --region us-east-2 --names KAKAO_ADMIN_KEY --query Parameters[0].Value | sed 's/"//g')
export REDIRECT_URI=$(aws ssm get-parameters --region us-east-2 --names REDIRECT_URI --query Parameters[0].Value | sed 's/"//g')
export SERVER_URL=$(aws ssm get-parameters --region us-east-2 --names SERVER_URL --query Parameters[0].Value | sed 's/"//g')
export CLIENT_URL=$(aws ssm get-parameters --region us-east-2 --names CLIENT_URL --query Parameters[0].Value | sed 's/"//g')

export DATABASE_PORT=$(aws ssm get-parameters --region us-east-2 --names DATABASE_PORT --query Parameters[0].Value | sed 's/"//g')
export DATABASE_HOST=$(aws ssm get-parameters --region us-east-2 --names DATABASE_HOST --query Parameters[0].Value | sed 's/"//g')
export HTTPS_PORT=$(aws ssm get-parameters --region us-east-2 --names HTTPS_PORT --query Parameters[0].Value | sed 's/"//g')

authbind --deep pm2 start app.js


