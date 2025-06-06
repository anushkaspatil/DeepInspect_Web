echo "Switching to branch main"
git checkout main

echo "Building app...."
npm run build

echo "Deploying files to server"
scp -r build/* ak@192.168.1.50:/var/www/192.168.1.50/

echo “Done!”