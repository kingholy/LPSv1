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

   insert into t_users 
(us_username, us_password, us_last_login_attempt_time, us_user_privileges, 
us_first_name, us_last_name, create_at, update_at) 
values ('manyGift', '1111', CURRENT_TIMESTAMP, 'S', '다현', '이',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ;


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
RETURNS TIMESTAMP
BEGIN
    declare q TIMESTAMP  ;
    set q = (select count(qi_id) from t_question_set where ts_id = inputdata);
    RETURN(q);
END
$$ delimiter ;





 delimiter $$
CREATE FUNCTION getScoreTT( inputdata INT  )
RETURNS INT
BEGIN
    declare q INT  ;
    set q = (select sum(nScores)/count(nScores) FROM (select (ifnull(as_hit_score,0)+replace( ifnull(as_partial_score,0),-1,0 )) AS nScores from t_answer_sheet A LEFT JOIN t_test_taker B ON A.tt_id = B.tt_id where tt_id = inputdata  ) A );
    RETURN(q);
END
$$ delimiter ;

 delimiter $$
CREATE FUNCTION getScore( inputdata INT, inputUser varchar(256) )
RETURNS INT
BEGIN
    declare q INT  ;
    set q = (select sum(nScores)/count(nScores) FROM (select (ifnull(as_hit_score,0)+replace( ifnull(as_partial_score,0),-1,0 )) as nScores   from t_answer_sheet A LEFT JOIN t_test_taker B ON A.tt_id = B.tt_id where ts_id = inputdata AND us_username = inputUser ) A);
    RETURN(q);
END
$$ delimiter ;



delimiter $$
CREATE FUNCTION getNormalTestSet( inputdata INT)
RETURNS INT
BEGIN
    declare q INT  ;
    set q = (select count(tt_id) from t_question_set where ts_id = inputdata AND us_username = inputUser AND tt_is_solved = '1');
    RETURN(q);
END
$$ delimiter ;



delimiter $$
CREATE FUNCTION getRemainTT( inputdata INT )
RETURNS INT
BEGIN
    declare q INT  ;
    set q = (select count(as_id) from t_answer_sheet where tt_id = inputdata AND as_partial_score = -1);
    RETURN(q);
END
$$ delimiter ;

///////////////////////////



drop FUNCTION getSolved;

delimiter $$
CREATE FUNCTION getSolved( inputdata INT, inputUser varchar(256) )
RETURNS INT
BEGIN
    declare q INT  ;
    set q = (select count(tt_id) from t_test_taker where ts_id = inputdata AND us_username = inputUser AND tt_is_solved = '1');
    RETURN(q);
END



$$ delimiter ;


delimiter $$
CREATE FUNCTION getSolvedTT( inputdata INT )
RETURNS INT
BEGIN
    declare q INT  ;
    set q = (select count(tt_id) from t_test_taker where ts_id = inputdata AND us_username = inputUser AND tt_is_solved = '1');
    RETURN(q);
END
$$ delimiter ;

drop FUNCTION getScore;
 

delimiter $$
CREATE FUNCTION getRemainTT( inputdata INT )
RETURNS INT
BEGIN
    declare q INT  ;
    set q = (select count(as_id) from t_answer_sheet where tt_id = inputdata AND as_partial_score = -1);
    RETURN(q);
END
$$ delimiter ;

drop FUNCTION getScore;

///////////////////////////////


/*******************************************************/

-- drop FUNCTION getScoreTT;
 delimiter $$
CREATE FUNCTION getScoreTT( inputdata INT  )
RETURNS INT
BEGIN
    declare q INT  ;
    set q = (select sum(nScores)/count(nScores) FROM (select (ifnull(as_hit_score,0)+replace( ifnull(as_partial_score,0),-1,0 )) AS nScores from t_answer_sheet A LEFT JOIN t_test_taker B ON A.tt_id = B.tt_id where A.tt_id = inputdata  ) A );
    RETURN(q);
END
$$ delimiter ;

/*******************************************************/
 
delimiter $$
CREATE FUNCTION getScore( inputdata INT, inputUser varchar(256) )
RETURNS INT
BEGIN
    declare q INT  ;
    set q = (select sum(nScores)/count(nScores) FROM (select (ifnull(as_hit_score,0)+replace( ifnull(as_partial_score,0),-1,0 )) as nScores   from t_answer_sheet A LEFT JOIN t_test_taker B ON A.tt_id = B.tt_id where ts_id = inputdata AND us_username = inputUser ) A);
    RETURN(q);
END
$$ delimiter ;


/*******************************************************/
 
/*******************************************************/
 delimiter $$
 -- 가장 최근에 학습한 단원 
CREATE FUNCTION getLastDcNameByUser( inputUser varchar(256) )
RETURNS varchar(256)
BEGIN
    declare q varchar(256);
    set q = (select dc_category_name  from  (select dc_id FROM (select A.ts_id from T_TEST_TAKER A LEFT JOIN  T_TEST_SET B ON A.ts_id = B.ts_id  where us_username = inputUser and ts_test_type = 'I' order by take_at desc limit 1) A LEFT JOIN T_TEST_SET_RANGE B ON A.ts_id = B.ts_id limit 1 ) C LEFT JOIN t_book_categories D ON C.dc_id = D.dc_id);
    RETURN(q);
END
$$ delimiter ;

/*******************************************************/
 delimiter $$
 -- 가장 최근 문제풀이 결과 총점
CREATE FUNCTION getLastTestScoreByUser( inputUser varchar(256) )
RETURNS DECIMAL(6,2)
BEGIN
    declare q DECIMAL(6,2);
    set q = (select sum(as_hit_score)/count(qi_id) as nCnt FROM (select A.tt_id from T_TEST_TAKER A LEFT JOIN  T_TEST_SET B ON A.ts_id = B.ts_id  where us_username = inputUser and ts_test_type = 'I' order by take_at desc limit 1) A LEFT JOIN T_ANSWER_SHEET B ON A.tt_id = B.tt_id group by B.tt_id);
    RETURN(q);
END
$$ delimiter ;


/*******************************************************/
 delimiter $$
 -- 단원별 학습 상태
CREATE FUNCTION getLastTestIByDcId( inputUser varchar(256), inputDcId int )
RETURNS INT
BEGIN
    declare q INT;
    set q = (select count(dc_id) FROM (select A.ts_id from T_TEST_TAKER A LEFT JOIN  T_TEST_SET B ON A.ts_id = B.ts_id  where us_username = inputUser and ts_test_type = 'I') A LEFT JOIN T_TEST_SET_RANGE B ON A.ts_id = B.ts_id where dc_id = inputDcId group by dc_id);
    RETURN(q);
END
$$ delimiter ;


/*******************************************************/
 delimiter $$
 -- 단원별 문제풀이 총점 
CREATE FUNCTION getLastTestScoreByDcId( inputUser varchar(256), inputDcId int )
RETURNS DECIMAL(6,2)
BEGIN
    declare q DECIMAL(6,2);
    set q = (
    select sum(as_hit_score)/count(qi_id) as nCnt FROM 
	( select A.tt_id  FROM (select A.ts_id, A.tt_id, A.take_at from T_TEST_TAKER A LEFT JOIN  T_TEST_SET B ON A.ts_id = B.ts_id  where us_username = inputUser and ts_test_type = 'I') A LEFT JOIN T_TEST_SET_RANGE B ON A.ts_id = B.ts_id where dc_id = inputDcId order by take_at desc limit 1)
	A LEFT JOIN T_ANSWER_SHEET B ON A.tt_id = B.tt_id group by B.tt_id  
    );
    RETURN(q);
END
$$ delimiter ;


///////////////////////////////



set sql_safe_updates=0;

SET Global log_bin_trust_function_creators = 'ON';