#!/bin/bash

# Di chuyển vào thư mục server
cd server || { echo "Thư mục 'client' không tồn tại."; exit 1; }

# Chạy npm run dev
npm run dev