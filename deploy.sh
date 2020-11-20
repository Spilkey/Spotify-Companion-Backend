docker build -t spotify-companion-backend .
docker tag spotify-companion-backend:latest 583931493219.dkr.ecr.us-east-2.amazonaws.com/spotify-companion-backend:latest
docker push 583931493219.dkr.ecr.us-east-2.amazonaws.com/spotify-companion-backend:latest
