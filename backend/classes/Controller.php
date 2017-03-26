<?php

/**
 * Created by Ana Zalozna.
 * Date: 15.03.17
 * Time: 17:12
 */
abstract class Controller
{
	/**
	 * Rendering data
	 *
	 * @var array
	 */
	protected $_data = [];


	/**
	 * Model object
	 *
	 * @var Model
	 */
	protected $_db;

	public function __construct(){
		$this->_db = new Model();
	}

	/**
	 * Generate Json data
	 *
	 */
	protected function render(){
		header('Access-Control-Allow-Origin: http://' . FRONTEND_HOST);
		header('Content-Type: application/json');
		echo json_encode($this->_data);
	}
}