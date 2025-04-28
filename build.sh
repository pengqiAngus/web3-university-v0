#!/bin/bash

if [ -z "$1" ]; then
    echo "❌ Environment parameter is required! Please use: ./build.sh [development|production|test]"
    exit 1
fi

ENV=$1
ENV_FILE=".env.$ENV"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Environment file $ENV_FILE does not exist!"
    exit 1
fi

# 清理旧的构建文件
echo "🧹 Cleaning up old build files..."
rm -rf dist/
rm -rf .aws-sam/
rm -rf layer/

# 创建必要的目录
mkdir -p dist/
mkdir -p layer/nodejs

# 使用webpack构建应用
echo "🏗️ Building application with webpack..."
yarn run build

# 设置 Lambda Layer
echo "📦 Setting up Lambda layer..."
cat > layer/nodejs/package.json << EOF
{
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",
    "@radix-ui/react-alert-dialog": "^1.1.4",
    "@radix-ui/react-avatar": "latest",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "latest",
    "@radix-ui/react-label": "latest",
    "@radix-ui/react-select": "latest",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-slot": "latest",
    "@radix-ui/react-tabs": "latest",
    "@radix-ui/react-toast": "^1.2.4",
    "@radix-ui/react-tooltip": "latest",
    "@rainbow-me/rainbowkit": "^2.2.4",
    "@tanstack/react-query": "^5.72.2",
    "autoprefixer": "^10.4.20",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "ethers": "5.7.2",
    "framer-motion": "^12.6.3",
    "lucide-react": "^0.454.0",
    "next": "15.2.4",
    "next-themes": "^0.4.4",
    "pino-pretty": "^13.0.0",
    "react": "^19",
    "react-dom": "^19",
    "react-hook-form": "^7.54.1",
    "sonner": "^2.0.3",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7",
    "viem": "2.x",
    "wagmi": "^2.14.16",
    "zod": "^3.24.1"
  }
}
EOF

# 在layer中安装依赖
cd layer/nodejs
echo "📦 Installing layer dependencies..."
yarn  

echo "📊 Final layer size:"
du -sh node_modules/
cd ../../

# 准备函数部署包
echo "📦 Preparing function package..."
cp "$ENV_FILE" "dist/.env"

# 执行 sam build 和部署
echo "🚀 Running sam build..."
sam build --skip-pull-image

if [ $? -eq 0 ]; then
    if [ "$ENV" = "production" ] || [ "$ENV" = "test" ]; then
        echo "🚀 Deploying to production..."
        sam deploy -g
    else
        echo "🌍 Starting local API..."
        sam local start-api --warm-containers EAGER
    fi
else
    echo "❌ Sam build failed!"
    exit 1
fi