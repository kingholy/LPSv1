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

