# 앱 실행
pm2 start dist/app.js

# 설정 파일로 앱 실행
pm2 start ecosystem.config.js --env production

# 현재 실행 상태 확인
pm2 list

# 앱 로그 보기
pm2 logs

# 앱 중지
pm2 stop my-app

# 앱 내리기
pm2 kill

# OS 부팅 시 PM2 데몬 자동 실행 설정
pm2 startup 

# 현재 실행 중인 앱 목록을 저장 (복원 대상 등록)
pm2 save