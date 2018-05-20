 

CREATE USER 'lpsuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mylps';
flush privileges;
show grants for 'lpsuser'@'localhost';
grant all privileges on *.* to 'lpsuser'@'localhost' with grant option;
