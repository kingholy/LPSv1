SET SESSION FOREIGN_KEY_CHECKS=0;

/* Drop Tables */

DROP TABLE IF EXISTS T_ANSWER_SHEET;
DROP TABLE IF EXISTS T_QUESTION_RANGE;
DROP TABLE IF EXISTS T_TEST_SET_RANGE;
DROP TABLE IF EXISTS T_BOOK_CATEGORIES;
DROP TABLE IF EXISTS T_CHOICE_SET;
DROP TABLE IF EXISTS T_CLASS_OF_USER;
DROP TABLE IF EXISTS T_CLASSES;
DROP TABLE IF EXISTS T_QUESTION_SET;
DROP TABLE IF EXISTS T_QUESTION_ITEM;
DROP TABLE IF EXISTS T_TEST_TAKER;
DROP TABLE IF EXISTS T_TEST_SET;
DROP TABLE IF EXISTS T_USERS;




/* Create Tables */

CREATE TABLE T_ANSWER_SHEET
(
	as_id int NOT NULL AUTO_INCREMENT COMMENT '제출_답안_키값',
	tt_id int NOT NULL COMMENT '문제지별_응시자_키값',
	qi_id int NOT NULL COMMENT '문항_키값',
	as_answer_text varchar(1024) COMMENT '제출한_주관식_답(단답,서술)',
	as_answer_choice int COMMENT '제출한 객관식 답 ',
	as_hit_score decimal DEFAULT 0 COMMENT '정답_맞춤_점수',
	as_partial_score decimal DEFAULT 0 COMMENT '부분_점수',
	PRIMARY KEY (as_id)
) COMMENT = '응시자_문제지별_제출답안지';


CREATE TABLE T_BOOK_CATEGORIES
(
	dc_id int NOT NULL AUTO_INCREMENT COMMENT '교재목차_키값',
	dc_category_type varchar(1) DEFAULT '1' NOT NULL COMMENT '목차_분류타입 ',
	dc_main_category varchar(10) NOT NULL COMMENT '소속_대분류',
	dc_sub_category varchar(10) NOT NULL COMMENT '소속_소분류',
	dc_category_name varchar(256) NOT NULL COMMENT '목차_내용',
	dc_category_desc varchar(1024) COMMENT '부가_설명 ',
	dc_is_quest char(1) DEFAULT '0' NOT NULL COMMENT '문제풀이_여부',
	dc_visible char(1) DEFAULT '1' NOT NULL COMMENT '노출_여부',
	PRIMARY KEY (dc_id)
) COMMENT = '교재_목차';


CREATE TABLE T_CHOICE_SET
(
	cs_id int NOT NULL AUTO_INCREMENT COMMENT '선다형_답지_키값',
	qi_id int NOT NULL COMMENT '문항_키값',
	cs_option_order int NOT NULL COMMENT '답지항목_순번',
	cs_option_contents varchar(1024) NOT NULL COMMENT '답지항목 내용 ',
	cs_is_answer char(1) DEFAULT '0' NOT NULL COMMENT '정답_여부 ',
	PRIMARY KEY (cs_id)
) COMMENT = '선다형문항_답지_내용';


CREATE TABLE T_CLASSES
(
	cl_id int NOT NULL AUTO_INCREMENT COMMENT '클래스 키값',
	cl_year varchar(4) NOT NULL COMMENT '년도',
	cl_grade varchar(128) DEFAULT '''''' NOT NULL COMMENT '학년',
	cl_class_order int NOT NULL COMMENT '클래스_순번',
	cl_class_name varchar(1024) DEFAULT '''''' NOT NULL COMMENT '클래스명(반)',
	PRIMARY KEY (cl_id),
	CONSTRAINT UK_CLASS_OF_YEAR UNIQUE (cl_year, cl_grade, cl_class_order)
) COMMENT = '클래스그룹';


CREATE TABLE T_CLASS_OF_USER
(
	cu_id int NOT NULL AUTO_INCREMENT COMMENT '소속클래스 아이디',
	us_username varchar(256) NOT NULL COMMENT '사용자_아이디',
	cl_id int NOT NULL COMMENT '사용자 소속 클래스',
	PRIMARY KEY (cu_id)
) COMMENT = '사용자_소속_클래스';


CREATE TABLE T_QUESTION_ITEM
(
	qi_id int NOT NULL AUTO_INCREMENT COMMENT '문항_키값',
	qi_question_type varchar(2) NOT NULL COMMENT '문항_유형(선다형..)',
	qi_questionnarie varchar(1024) NOT NULL COMMENT '질문_내용',
	qi_total_choice_count int DEFAULT 0 NOT NULL COMMENT '총_선택_개수',
	qi_difficulty varchar(4) DEFAULT '60' NOT NULL COMMENT '문항 난이도',
	qi_answer varchar(1024) COMMENT '정답_내용',
	qi_answer_tip varchar(1024) COMMENT '정답_부가설명',
	qi_create datetime DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '최초_생성일',
	qi_update datetime DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '최종_수정일',
	PRIMARY KEY (qi_id)
) COMMENT = '문항';


CREATE TABLE T_QUESTION_RANGE
(
	qr_id int NOT NULL AUTO_INCREMENT COMMENT '문항별_출제범위_키값 ',
	qi_id int NOT NULL COMMENT '문항_키값',
	dc_id int NOT NULL COMMENT '교재목차_키값',
	PRIMARY KEY (qr_id)
) COMMENT = '문항_출제범위_교재목차';


CREATE TABLE T_QUESTION_SET
(
	qs_id int NOT NULL AUTO_INCREMENT COMMENT '문제지별_문항셋_키값',
	ts_id int NOT NULL COMMENT '문제지_키값',
	qi_id int NOT NULL COMMENT '문항_키값',
	PRIMARY KEY (qs_id)
) COMMENT = '문제지별_출제된_문항들';


CREATE TABLE T_TEST_SET
(
	ts_id int NOT NULL AUTO_INCREMENT COMMENT '문제지_키값',
	ts_test_type varchar(2) DEFAULT 'I' NOT NULL COMMENT '시험_유형',
	ts_madeby_who varchar(256) NOT NULL COMMENT '출제자(만든이)',
	ts_time_limit int DEFAULT 0 NOT NULL COMMENT '제한시간(분)',
	create_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '생성_시점',
	update_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '업데이트_시점',
	PRIMARY KEY (ts_id)
) COMMENT = '문제셋(시험지)';


CREATE TABLE T_TEST_SET_RANGE
(
	tr_id int NOT NULL AUTO_INCREMENT COMMENT '문제지별_출제범위_키값',
	ts_id int NOT NULL COMMENT '문제지_키값',
	dc_id int NOT NULL COMMENT '교재목차_키값',
	PRIMARY KEY (tr_id)
) COMMENT = '문제지 출제범위';


CREATE TABLE T_TEST_TAKER
(
	tt_id int NOT NULL AUTO_INCREMENT COMMENT '문제지별_응시자_키값',
	ts_id int NOT NULL COMMENT '문제지_키값',
	us_username varchar(256) NOT NULL COMMENT '응시자_아이디',
	take_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '응시일자',
	tt_is_solved char(1) DEFAULT '0' NOT NULL COMMENT '답안제출_여부',
	tt_solved_at datetime DEFAULT CURRENT_TIMESTAMP COMMENT '답안제출_일시',
	PRIMARY KEY (tt_id)
) COMMENT = '문제지별_응시자_리스트';


CREATE TABLE T_USERS
(
	us_username varchar(256) NOT NULL COMMENT '사용자_아이디',
	us_password varchar(255) NOT NULL COMMENT '사용자_비밀번호',
	us_user_privileges char(1) DEFAULT 'S' NOT NULL COMMENT '사용자_권한',
	us_first_name varchar(255) COMMENT '사용자_이름',
	us_last_name varchar(128) COMMENT '사용자_성',
	us_email varchar(255) COMMENT '사용자_이메일주소',
	us_phone varchar(255) COMMENT '사용자_연락처',
	us_last_login_attempt_time datetime DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '최근_로그인_시점 ',
	create_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '계정생성_시점',
	update_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '업데이트_시점',
	us_consecutive_failed_logins datetime DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '로그인_실패시점',
	PRIMARY KEY (us_username)
) COMMENT = '사용자 정보';



/* Create Foreign Keys */

ALTER TABLE T_QUESTION_RANGE
	ADD FOREIGN KEY (dc_id)
	REFERENCES T_BOOK_CATEGORIES (dc_id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE T_TEST_SET_RANGE
	ADD FOREIGN KEY (dc_id)
	REFERENCES T_BOOK_CATEGORIES (dc_id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE T_CLASS_OF_USER
	ADD FOREIGN KEY (cl_id)
	REFERENCES T_CLASSES (cl_id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE T_ANSWER_SHEET
	ADD FOREIGN KEY (qi_id)
	REFERENCES T_QUESTION_ITEM (qi_id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE T_CHOICE_SET
	ADD FOREIGN KEY (qi_id)
	REFERENCES T_QUESTION_ITEM (qi_id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE T_QUESTION_RANGE
	ADD FOREIGN KEY (qi_id)
	REFERENCES T_QUESTION_ITEM (qi_id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE T_QUESTION_SET
	ADD FOREIGN KEY (qi_id)
	REFERENCES T_QUESTION_ITEM (qi_id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE T_QUESTION_SET
	ADD FOREIGN KEY (ts_id)
	REFERENCES T_TEST_SET (ts_id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE T_TEST_SET_RANGE
	ADD FOREIGN KEY (ts_id)
	REFERENCES T_TEST_SET (ts_id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE T_TEST_TAKER
	ADD FOREIGN KEY (ts_id)
	REFERENCES T_TEST_SET (ts_id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE T_ANSWER_SHEET
	ADD FOREIGN KEY (tt_id)
	REFERENCES T_TEST_TAKER (tt_id)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE T_CLASS_OF_USER
	ADD FOREIGN KEY (us_username)
	REFERENCES T_USERS (us_username)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE T_TEST_SET
	ADD FOREIGN KEY (ts_madeby_who)
	REFERENCES T_USERS (us_username)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;


ALTER TABLE T_TEST_TAKER
	ADD FOREIGN KEY (us_username)
	REFERENCES T_USERS (us_username)
	ON UPDATE RESTRICT
	ON DELETE RESTRICT
;



