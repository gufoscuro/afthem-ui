sudo docker cp afthem-dashboard.sql mariadb:afthem-dashboard.sql
sudo docker cp mysql.ini mariadb:mysql.ini
sudo docker exec mariadb sh -c 'mysql --defaults-extra-file=mysql.ini afthem-dashboard < afthem-dashboard.sql'
