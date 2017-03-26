<?php

/**
 * Created by Ana Zalozna.
 * Date: 18.03.17
 * Time: 18:29
 */
class Comment extends Controller
{
    public function actionForMovie($movie_id){
        $this->_data = $this->_db->queryRows(
            'SELECT c.name, c.message, DATE_FORMAT(c.date, "%b/%e/%Y, %r") date
            FROM comments c 
            INNER JOIN comment_video cv ON c.id = cv.comment_id
            INNER JOIN videos v ON cv.video_id = v.id
            WHERE v.id = :id
            ORDER BY c.date DESC',
            ['id' => $movie_id]
        );
        $this->render();
    }

    public function actionAddComment(){
        $data = json_decode(file_get_contents('php://input'));

        $this->_db->pdo->beginTransaction();

        try {
            $this->_db->insertRow('comments', [
                'ip' => $_SERVER['REMOTE_ADDR'],
                'name' => $data->name,
                'message' => $data->message
            ]);

            $link_table = [
                'comment_id' => $this->_db->pdo->lastInsertId(),
                'video_id' => $data->video_id
            ];

            $this->_db->insertRow('comment_video', $link_table);

            $this->_db->pdo->commit();

            $this->_data = 'success';
            $this->render();

        }catch (Exception $e){
            $this->_db->pdo->rollBack();
        }
    }
}