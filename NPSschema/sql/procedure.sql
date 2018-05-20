

CREATE OR REPLACE PROCEDURE PROC_GET_AUTOTESTSET
  (
  	dc_id_in IN NUMBER,    -- NUMBER Ÿ���� �Է¹��� �Ķ����
    username_in IN VARCHAR2,  -- ������ 
    test_mode_in IN VARCHAR2, -- test type : ����(�ڰ�����): 'I', ����: 'Q', ����: 'O'
    ts_id_out OUT NUMBER,
    item_list OUT SYS_REFCURSOR,    -- SELECT�� ����� ���� Ŀ��(CURSOR)
    choice_list OUT SYS_REFCURSOR    -- SELECT�� ����� ���� Ŀ��(CURSOR)
  
  )
IS
  		Pts_id NUMBER;    
BEGIN
  
  
   
  -- testset Ű�� ����� 
  SELECT SEQ_T_TEST_SET_TS_ID.NEXTVAL INTO ts_id_out FROM DUAL;
  
  -- testset Ű�� �Է� 
  INSERT INTO T_TEST_SET(TS_ID, TS_TEST_TYPE, TS_MADEBY_WHO)
  VALUES (ts_id_out, test_mode_in, username_in);
  
  -- testset ������ �Է� 
  
  
  INSERT INTO T_QUESTION_SET (QS_ID, TS_ID, QI_ID)
  SELECT SEQ_T_QUESTION_SET_QS_ID.NEXTVAL, ts_id_out, QI_ID FROM (
  	SELECT QI_ID FROM T_QUESTION_ITEM  ORDER BY	DBMS_RANDOM.RANDOM
  )   WHERE rownum <= 5;
  
  
  COMMIT;
  -- row data �������� 

  OPEN item_list FOR
           	SELECT		A.QI_ID AS QI_ID, 
                        QI_QUESTION_TYPE, 
                        QI_DIFFICULTY, 
                        QI_QUESTIONNARIE, 
                        QI_TOTAL_CHOICE_COUNT 
            FROM		T_QUESTION_ITEM A 
                        LEFT JOIN	T_QUESTION_RANGE  B  
                        ON			A.qi_id=B.qi_id 
            WHERE		A.QI_ID 
            				IN (SELECT qi_id FROM T_QUESTION_SET WHERE ts_id = ts_id_out) 
            			AND B.dc_id = dc_id_in
            ORDER BY QI_QUESTION_TYPE, QI_DIFFICULTY;

 
  OPEN choice_list FOR
  			SELECT 		QI_ID, 
            			CS_OPTION_ORDER, 
                        CS_OPTION_CONTENTS
			FROM		T_CHOICE_SET
  			WHERE		QI_ID IN (SELECT qi_id FROM T_QUESTION_SET WHERE ts_id = ts_id_out) 
            ORDER BY	QI_ID, CS_OPTION_ORDER;
            
            
END;
  
   
   
/

COMMIT;
 