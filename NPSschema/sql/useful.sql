-- 사용자 만들기 
insert into t_users 
(us_username, us_password, us_last_login_attempt_time, us_user_privileges, 
us_first_name, us_last_name, create_at, update_at) 
values ('admin', '1111', CURRENT_TIMESTAMP, 'A', '', '',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ;

insert into t_users 
(us_username, us_password, us_last_login_attempt_time, us_user_privileges, 
us_first_name, us_last_name, create_at, update_at) 
values ('sarah', '1111', CURRENT_TIMESTAMP, 'S', '', '',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ;

insert into t_users 
(us_username, us_password, us_last_login_attempt_time, us_user_privileges, 
us_first_name, us_last_name, create_at, update_at) 
values ('Cho', '1111', CURRENT_TIMESTAMP, 'T', '', '',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ;



SELECT 
  CHR(39) || DC_CATEGORY_TYPE || CHR(39) || CHR(44) ||  CHR(32) ||  
  CHR(39) || DC_MAIN_CATEGORY || CHR(39) ||  CHR(44) || CHR(32) ||  
  CHR(39) || DC_SUB_CATEGORY || CHR(39) ||  CHR(44) || CHR(32) ||  
  CHR(39) || DC_CATEGORY_NAME || CHR(39) ||  CHR(44) || CHR(32) ||   CHR(32) || 
  CHR(39) || DC_CATEGORY_DESC || CHR(39) ||  CHR(44) || CHR(32) ||   CHR(32) || 
  CHR(39) || DC_VISIBLE || CHR(39) ||  CHR(44) || CHR(32) ||  
  CHR(39) || DC_IS_QUEST || CHR(39) 
 FROM T_BOOK_CATEGORIES

=> '1', '010', '010000', '1. 기초',  ' ',  '1', '0'
////////////////////////////////

UPDATE mysql.user SET plugin = 'mysql_native_password'
WHERE User = 'lmsuser' AND Host = '%' ;

FLUSH PRIVILEGES;
////////////////////////////////
use mysql; 
update mysql.user  set plugin='mysql_native_password' where user='root'; 
FLUSH PRIVILEGES;

SELECT plugin FROM mysql.user WHERE User = 'lmsuser';

GRANT ALL PRIVILEGES ON *.* TO 'lpsuser'@'localhost' IDENTIFIED BY PASSWORD 'mylps' WITH GRANT OPTION;

////////////////////////////////

show global variables like 'log_bin_trust_function_creators';
SET GLOBAL log_bin_trust_function_creators='ON';

////////////////////////////////

 delimiter $$
CREATE FUNCTION getRowCount( inputdata varchar(2048) )
RETURNS INT
BEGIN
    declare q INT  ;
    set q = (length(inputdata) - length(replace(inputdata,'\r\n','')))/length('\r\n');
    RETURN(q+1);
END
$$ delimiter ;


/////////////////////////////////

 delimiter $$
CREATE FUNCTION getTakeAt( inputdata INT )
RETURNS TIMESTAMP
BEGIN
    declare q TIMESTAMP  ;
    set q = (select create_at from t_test_set where ts_id = inputdata);
    RETURN(q);
END
$$ delimiter ;



 delimiter $$
CREATE FUNCTION getCountItem( inputdata INT )
RETURNS INT
BEGIN
    declare q INT  ;
    set q = (select count(tt_id) from t_test_taker where ts_id = inputdata AND us_username = inputUser AND tt_is_solved = '1');
    RETURN(q);
END
$$ delimiter ;



 delimiter $$
CREATE FUNCTION getScore( inputdata INT, inputUser varchar(256) )
RETURNS INT
BEGIN
    declare q INT  ;
    set q = (select (as_hit_score+as_partial_score) as score from t_answer_sheet A LEFT JOIN t_test_taker B ON A.tt_id = B.tt_id where ts_id = inputdata AND us_username = inputUser);
    RETURN(q);
END
$$ delimiter ;



