cd backend && mvn clean install -DskipTests
cd .. && docker build -t batool83/backend:latest -f backend/Dockerfile backend && docker build -t batool83/frontend:latest -f frontend/Dockerfile frontend
docker login -u batool83 -p BeBo@1998
docker push batool83/backend:latest && docker push batool83/frontend:latest
docker-compose -f docker-compose.yml down
sleep 10;
docker-compose -f docker-compose.yml up