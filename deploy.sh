git pull
yarn run build
pm2 delete "6ammart-web-next-js-dev"
pm2 delete "fasta-deliveries-web"
pm2 start npm --name "fasta-deliveries-web" -- start
