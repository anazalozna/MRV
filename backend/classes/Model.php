<?php

/**
 * Created by Ana Zalozna
 * Date: 22/01/17
 * Time: 2:27 PM
 */
class Model
{
	/**
	 * PDO object
	 */
	public $pdo;

	/**
	 * Model constructor.
	 *
	 * set PDO
	 */
	function __construct(){
		$dsn = 'mysql:host='.DB_HOST.';dbname='.DB_DATABASE.';charset=utf8';
		$opt = array(
			PDO::ATTR_ERRMODE               => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE    => PDO::FETCH_ASSOC,
			//PDO::MYSQL_ATTR_INIT_COMMAND    =>"SET time_zone = 'America/Toronto'",
		);

		$this->pdo = new PDO($dsn, DB_USER, DB_PASS, $opt);

	}

	/**
	 * Do PDO query and return one row
	 *
	 * @param string $sql
	 * @param array $data
	 * @return mixed
	 */
	public function queryRow(string $sql, array $data = []){
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute($data);
		$result = $stmt->fetch();

		if(!$result){
			return [];
		}

		return $result;
	}

	/**
	 * Do PDO query and return rows
	 *
	 * @param string $sql
	 * @param array $data
	 * @return array
	 */
	public function queryRows(string $sql, array $data = []): array {
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute($data);

		$data = [];
		foreach ($stmt as $row){
			$data[] = $row;
		}
		return $data;
	}

	/**
	 * Simple insert to db
	 *
	 * Preparing and executing query with data
	 * Array must be with right keys
	 *
	 * @param string $table
	 * @param array $data
	 */
	public function insertRow(string $table, array $data){
		$columns = '';
		$values = '';

		foreach ($data as $key => $value){
			$columns .= $key.', ';
			$values .= '?, ';
		}

		$sql = "INSERT INTO $table (" .trim($columns, ', '). ")VALUES(" .trim($values, ', '). ")";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute(array_values($data));
	}
}