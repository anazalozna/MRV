<?php

/**
 * Created by Ana Zalozna.
 * Date: 15.03.17
 * Time: 17:14
 */
class Movie extends Controller
{

	public function actionIndex(){
		$this->_data = $this->_db->queryRows('SELECT id, title, thumb, description, year FROM videos');
		$this->render();
	}

    public function actionSingle($id){
        $this->_data = $this->_db->queryRow(
            'SELECT title, description, year, link
            FROM videos 
            WHERE id = :id',
            ['id' => $id]
        );
        $this->render();
    }

    public function actionGenres(){
        $this->_data = $this->_db->queryRows('SELECT id, name FROM genres ORDER BY `order`, name');
        $this->render();
    }

    public function actionGenreMovie($genre_id){
        $this->_data = $this->_db->queryRows(
            'SELECT v.id, v.title, v.description, v.year, v.link, v.thumb
            FROM videos v
            INNER JOIN genre_video gv ON v.id = gv.video_id
            INNER JOIN genres g ON gv.genre_id = g.id
            WHERE g.id = :id',
            ['id' => $genre_id]
        );
        $this->render();
    }

    public function actionFilter(){
        $search = json_decode(file_get_contents('php://input'))->search;
        $this->_data = $this->_db->queryRows(
            'SELECT id, title, thumb, description, year 
            FROM videos
            WHERE title LIKE :search
            OR description LIKE :search',
            ['search' => "%$search%"]
        );

        $this->render();
    }
}