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

-- 응시자_문제지별_제출답안지
CREATE TABLE T_ANSWER_SHEET
(
	as_id int NOT NULL AUTO_INCREMENT COMMENT '제출_답안_키값',
	tt_id int NOT NULL COMMENT '문제지별_응시자_키값',
	-- 문항_키값
	qi_id int NOT NULL COMMENT '문항_키값 : 문항_키값',
	as_answer_text varchar(1024) COMMENT '제출한_주관식_답(단답,서술)',
	as_answer_choice int COMMENT '제출한 객관식 답 ',
	-- 맞춤: 1,  틀림: 0
	as_hit_score decimal DEFAULT 0 COMMENT '정답_맞춤_점수 : 맞춤: 1,  틀림: 0',
	as_partial_score decimal DEFAULT 0 COMMENT '부분_점수',
	PRIMARY KEY (as_id)
) COMMENT = '응시자_문제지별_제출답안지';


-- 교재_목차 : 교재 분류 카테고리
-- 
-- SELECT
--  dc_id, dc_category_name
-- FROM
CREATE TABLE T_BOOK_CATEGORIES
(
	-- 키값
	dc_id int NOT NULL AUTO_INCREMENT COMMENT '교재목차_키값 : 키값',
	-- 대분류: '1',  소분류: '2'
	dc_category_type varchar(1) DEFAULT '1' NOT NULL COMMENT '목차_분류타입  : 대분류: '1',  소분류: '2',
	-- 소속된 대분류 카테고리: '1', ...
	dc_main_category varchar(10) NOT NULL COMMENT '소속_대분류 : 소속된 대분류 카테고리: '1', ...',
	-- 소속된 소분류 카테고리: '1.1' ...
	dc_sub_category varchar(10) NOT NULL COMMENT '소속_소분류 : 소속된 소분류 카테고리: '1.1' ...',
	-- 목차_내용
	dc_category_name varchar(256) NOT NULL COMMENT '목차_내용 : 목차_내용',
	-- 목차 부가 설명 
	dc_category_desc varchar(1024) COMMENT '부가_설명  : 목차 부가 설명 ',
	--  일반: '0', 문제풀이: '1'
	dc_is_quest char(1) DEFAULT '0' NOT NULL COMMENT '문제풀이_여부 :  일반: '0', 문제풀이: '1',
	-- 0:hidden 1:visible
	dc_visible char(1) DEFAULT '1' NOT NULL COMMENT '노출_여부 : 0:hidden 1:visible',
	PRIMARY KEY (dc_id)
) COMMENT = '교재_목차 : 교재 분류 카테고리

SELECT
 dc_id, dc_category_name
FROM';


-- 선다형문항_답지_내용 : 객관식 문항 옵션 정의
CREATE TABLE T_CHOICE_SET
(
	-- 객관식항목_키값
	cs_id int NOT NULL AUTO_INCREMENT COMMENT '선다형_답지_키값 : 객관식항목_키값',
	-- 문항_키값
	qi_id int NOT NULL COMMENT '문항_키값 : 문항_키값',
	cs_option_order int NOT NULL COMMENT '답지항목_순번',
	cs_option_contents varchar(1024) NOT NULL COMMENT '답지항목 내용 ',
	-- 정답: 1, 오답: 0
	cs_is_answer char(1) DEFAULT '0' NOT NULL COMMENT '정답_여부  : 정답: 1, 오답: 0',
	PRIMARY KEY (cs_id)
) COMMENT = '선다형문항_답지_내용 : 객관식 문항 옵션 정의';


-- 클래스그룹
CREATE TABLE T_CLASSES
(
	-- 키
	cl_id int NOT NULL AUTO_INCREMENT COMMENT '클래스 키값 : 키',
	cl_year varchar(4) NOT NULL COMMENT '년도',
	-- 학년
	cl_grade varchar(128) DEFAULT '' NOT NULL COMMENT '학년 : 학년',
	-- 클래스순번 
	-- 예: 1
	cl_class_order int NOT NULL COMMENT '클래스_순번 : 클래스순번 
예: 1',
	-- 반명
	cl_class_name varchar(1024) DEFAULT '' NOT NULL COMMENT '클래스명(반) : 반명',
	PRIMARY KEY (cl_id),
	CONSTRAINT UK_CLASS_OF_YEAR UNIQUE (cl_year, cl_grade, cl_class_order)
) COMMENT = '클래스그룹';


-- 사용자_소속_클래스
CREATE TABLE T_CLASS_OF_USER
(
	cu_id int NOT NULL AUTO_INCREMENT COMMENT '소속클래스 아이디',
	us_username varchar(256) NOT NULL COMMENT '사용자_아이디',
	-- 키
	cl_id int NOT NULL COMMENT '사용자 소속 클래스 : 키',
	PRIMARY KEY (cu_id)
) COMMENT = '사용자_소속_클래스';


-- 문항
CREATE TABLE T_QUESTION_ITEM
(
	-- 문항_키값
	qi_id int NOT NULL AUTO_INCREMENT COMMENT '문항_키값 : 문항_키값',
	-- 선다형(객관식): 'MC', 단답형: 'ST', 논술형(주관식): 'QL'
	qi_question_type varchar(2) NOT NULL COMMENT '문항_유형(선다형..) : 선다형(객관식): 'MC', 단답형: 'ST', 논술형(주관식): 'QL',
	-- 문항 질문 내용 
	qi_questionnarie varchar(1024) NOT NULL COMMENT '질문_내용 : 문항 질문 내용 ',
	qi_total_choice_count int DEFAULT 0 NOT NULL COMMENT '총_선택_개수',
	-- 90:상, 75:중, 60: 하
	qi_difficulty varchar(4) DEFAULT '60' NOT NULL COMMENT '문항 난이도 : 90:상, 75:중, 60: 하',
	-- 단답형 및 서술형에 대한 정답 기술 
	qi_answer varchar(1024) COMMENT '정답_내용 : 단답형 및 서술형에 대한 정답 기술 ',
	-- 정답에 대한 해설 
	qi_answer_tip varchar(1024) COMMENT '정답_부가설명 : 정답에 대한 해설 ',
	-- 최초 생성일 
	qi_create date DEFAULT SYSDATE NOT NULL COMMENT '최초_생성일 : 최초 생성일 ',
	qi_update date DEFAULT SYSDATE NOT NULL COMMENT '최종_수정일',
	PRIMARY KEY (qi_id)
) COMMENT = '문항';


-- 문항_출제범위_교재목차
CREATE TABLE T_QUESTION_RANGE
(
	qr_id int NOT NULL AUTO_INCREMENT COMMENT '문항별_출제범위_키값 ',
	-- 문항_키값
	qi_id int NOT NULL COMMENT '문항_키값 : 문항_키값',
	-- 키값
	dc_id int NOT NULL COMMENT '교재목차_키값 : 키값',
	PRIMARY KEY (qr_id)
) COMMENT = '문항_출제범위_교재목차';


-- 문제지별_출제된_문항들 : 문제지별 출제된 문항들
CREATE TABLE T_QUESTION_SET
(
	-- 문제지별 문항셋 키값
	qs_id int NOT NULL AUTO_INCREMENT COMMENT '문제지별_문항셋_키값 : 문제지별 문항셋 키값',
	-- 문제세트_고유키값
	ts_id int NOT NULL COMMENT '문제지_키값 : 문제세트_고유키값',
	-- 문항_키값
	qi_id int NOT NULL COMMENT '문항_키값 : 문항_키값',
	PRIMARY KEY (qs_id)
) COMMENT = '문제지별_출제된_문항들 : 문제지별 출제된 문항들';


-- 문제셋(시험지) : 한번에 시험을 보는 문제지 (문항들 집합)
CREATE TABLE T_TEST_SET
(
	-- 문제세트_고유키값
	ts_id int NOT NULL AUTO_INCREMENT COMMENT '문제지_키값 : 문제세트_고유키값',
	-- 임의(자가시험): 'I', 퀴즈: 'Q', 정규: 'O'
	ts_test_type varchar(2) DEFAULT 'I' NOT NULL COMMENT '시험_유형 : 임의(자가시험): 'I', 퀴즈: 'Q', 정규: 'O',
	ts_madeby_who varchar(256) NOT NULL COMMENT '출제자(만든이)',
	ts_time_limit int DEFAULT 0 NOT NULL COMMENT '제한시간(분)',
	create_at date DEFAULT SYSDATE NOT NULL COMMENT '생성_시점',
	update_at date DEFAULT SYSDATE NOT NULL COMMENT '업데이트_시점',
	PRIMARY KEY (ts_id)
) COMMENT = '문제셋(시험지) : 한번에 시험을 보는 문제지 (문항들 집합)';


-- 문제지 출제범위
CREATE TABLE T_TEST_SET_RANGE
(
	tr_id int NOT NULL AUTO_INCREMENT COMMENT '문제지별_출제범위_키값',
	-- 문제세트_고유키값
	ts_id int NOT NULL COMMENT '문제지_키값 : 문제세트_고유키값',
	-- 키값
	dc_id int NOT NULL COMMENT '교재목차_키값 : 키값',
	PRIMARY KEY (tr_id)
) COMMENT = '문제지 출제범위';


-- 문제지별_응시자_리스트 : 문제지별 응시자리스트
CREATE TABLE T_TEST_TAKER
(
	tt_id int NOT NULL AUTO_INCREMENT COMMENT '문제지별_응시자_키값',
	-- 문제세트_고유키값
	ts_id int NOT NULL COMMENT '문제지_키값 : 문제세트_고유키값',
	us_username varchar(256) NOT NULL COMMENT '응시자_아이디',
	take_at date DEFAULT SYSDATE NOT NULL COMMENT '응시일자',
	-- 제출: 1, 미제출: 0
	tt_is_solved char(1) DEFAULT '0' NOT NULL COMMENT '답안제출_여부 : 제출: 1, 미제출: 0',
	tt_solved_at date DEFAULT SYSDATE COMMENT '답안제출_일시',
	PRIMARY KEY (tt_id)
) COMMENT = '문제지별_응시자_리스트 : 문제지별 응시자리스트';


-- 사용자 정보 : SELECT
--  us_user_privileges 
-- FROM T_USERS
-- WHERE
-- 
CREATE TABLE T_USERS
(
	us_username varchar(256) NOT NULL COMMENT '사용자_아이디',
	us_password varchar(255) NOT NULL COMMENT '사용자_비밀번호',
	-- 학생: 'S' , 교사: 'T', 관리자: 'A'
	us_user_privileges char(1) DEFAULT 'S' NOT NULL COMMENT '사용자_권한 : 학생: 'S' , 교사: 'T', 관리자: 'A',
	-- 사용자_이름
	us_first_name varchar(255) COMMENT '사용자_이름 : 사용자_이름',
	us_last_name varchar(128) COMMENT '사용자_성',
	-- 사용자_이메일주소
	us_email varchar(255) COMMENT '사용자_이메일주소 : 사용자_이메일주소',
	-- 사용자_연락처
	us_phone varchar(255) COMMENT '사용자_연락처 : 사용자_연락처',
	-- 최근로그인_시점 
	us_last_login_attempt_time date DEFAULT SYSDATE NOT NULL COMMENT '최근_로그인_시점  : 최근로그인_시점 ',
	-- 계정생성_시점
	create_at date DEFAULT SYSDATE NOT NULL COMMENT '계정생성_시점 : 계정생성_시점',
	-- 업데이트_시점
	update_at date DEFAULT SYSDATE NOT NULL COMMENT '업데이트_시점 : 업데이트_시점',
	-- 로그인_실패시점
	us_consecutive_failed_logins date DEFAULT SYSDATE NOT NULL COMMENT '로그인_실패시점 : 로그인_실패시점',
	PRIMARY KEY (us_username)
) COMMENT = '사용자 정보 : SELECT
 us_user_privileges 
FROM T_USERS
WHERE
';



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



