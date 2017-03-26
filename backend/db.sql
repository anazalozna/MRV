-- Adminer 4.2.5 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `message` text NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `comments` (`id`, `name`, `message`, `date`, `ip`) VALUES
(1,	'Ana',	'This seems as an interesting movie. I think I might go to see it.',	'2017-03-26 16:06:11',	'127.0.0.1'),
(2,	'Alex',	'This is a crazy movie (in a good way)!',	'2017-03-26 17:27:34',	'127.0.0.1');

DROP TABLE IF EXISTS `comment_video`;
CREATE TABLE `comment_video` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comment_id` int(11) DEFAULT NULL,
  `video_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comment_video_comments_id_fk` (`comment_id`),
  KEY `comment_video_videos_id_fk` (`video_id`),
  CONSTRAINT `comment_video_comments_id_fk` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`),
  CONSTRAINT `comment_video_videos_id_fk` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `comment_video` (`id`, `comment_id`, `video_id`) VALUES
(1,	1,	20),
(2,	2,	19);

DROP TABLE IF EXISTS `genres`;
CREATE TABLE `genres` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `genres_name_uindex` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `genres` (`id`, `name`, `order`) VALUES
(1,	'Science fiction',	100),
(2,	'Thriller',	100),
(3,	'Crime',	100),
(4,	'Fantasy',	100),
(5,	'Romance',	100),
(6,	'Drama',	100),
(7,	'Action',	100),
(8,	'Documentary ',	100),
(9,	'Music',	100),
(10,	'Comedy',	100),
(11,	'Animation',	100),
(12,	'All',	0);

DROP TABLE IF EXISTS `genre_video`;
CREATE TABLE `genre_video` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `genre_id` int(11) DEFAULT NULL,
  `video_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `genre_video_genres_id_fk` (`genre_id`),
  KEY `genre_video_videos_id_fk` (`video_id`),
  CONSTRAINT `genre_video_genres_id_fk` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`),
  CONSTRAINT `genre_video_videos_id_fk` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `genre_video` (`id`, `genre_id`, `video_id`) VALUES
(1,	1,	19),
(2,	2,	19),
(3,	3,	20),
(4,	2,	20),
(5,	4,	21),
(6,	5,	21),
(7,	4,	22),
(8,	1,	22),
(9,	4,	23),
(10,	6,	23),
(11,	1,	24),
(12,	6,	24),
(13,	4,	25),
(14,	7,	25),
(15,	8,	26),
(16,	9,	26),
(17,	10,	27),
(18,	11,	27),
(19,	1,	28),
(20,	6,	28),
(21,	12,	19),
(22,	12,	20),
(23,	12,	21),
(24,	12,	22),
(25,	12,	23),
(26,	12,	24),
(27,	12,	25),
(28,	12,	26),
(29,	12,	27),
(30,	12,	28);

DROP TABLE IF EXISTS `videos`;
CREATE TABLE `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(80) DEFAULT NULL,
  `link` varchar(250) DEFAULT NULL,
  `description` text,
  `thumb` varchar(100) DEFAULT NULL,
  `year` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `videos_title_uindex` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `videos` (`id`, `title`, `link`, `description`, `thumb`, `year`) VALUES
(19,	'Alien: Covenant',	'static/videos/Alien- Covenant - Official Trailer [HD] - 20th Century FOX.mp4',	'Bound for a remote planet on the far side of the galaxy, members (Katherine Waterston, Billy Crudup) of the colony ship Covenant discover what they think to be an uncharted paradise. While there, they meet David (Michael Fassbender), the synthetic survivor of the doomed Prometheus expedition. The mysterious world soon turns dark and dangerous when a hostile alien life-form forces the crew into a deadly fight for survival.',	'static/thumbs/alien.jpg',	2017),
(20,	'Baby Driver',	'static/videos/BABY DRIVER - Official International Trailer (HD).mp4',	'Talented getaway driver Baby (Ansel Elgort) relies on the beat of his personal soundtrack to be the best in the game. After meeting the woman (Lily James) of his dreams, he sees a chance to ditch his criminal lifestyle and make a clean break. Coerced into working for a mob boss (Kevin Spacey), Baby must face the music as a doomed heist threatens his life, love and freedom.',	'static/thumbs/baby_driver.jpg',	2017),
(21,	'Beauty and the Beast',	'static/videos/Beauty and the Beast – US Official Final Trailer.mp4',	'The fantastic journey of Belle, a bright, beautiful and independent young woman who is taken prisoner by a beast in his castle. Despite her fears, she befriends the castle\'s enchanted staff and learns to look beyond the Beast\'s hideous exterior and realize the kind heart and soul of the true Prince within.',	'static/thumbs/beauty_and_beast.jpg',	2017),
(22,	'Justice League',	'static/videos/Justice League Official Comic-Con Trailer (2017) - Ben Affleck Movie.mp4',	'Fueled by his restored faith in humanity and inspired by Superman\'s (Henry Cavill) selfless act, Bruce Wayne (Ben Affleck) enlists newfound ally Diana Prince to face an even greater threat. Together, Batman and Wonder Woman work quickly to recruit a team to stand against this newly awakened enemy. Despite the formation of an unprecedented league of heroes -- Batman, Wonder Woman, Aquaman, Cyborg and the Flash -- it may be too late to save the planet from an assault of catastrophic proportions.',	'static/thumbs/justice_league.jpg',	2017),
(23,	'King Arthur: Legend of the Sword',	'static/videos/King Arthur- Legend of the Sword - Official Trailer [HD].mp4',	'When the child Arthur\'s father is murdered, Vortigern (Jude Law), Arthur\'s uncle, seizes the crown. Robbed of his birthright and with no idea who he truly is, Arthur comes up the hard way in the back alleys of the city. But once he pulls the sword from the stone, his life is turned upside down and he is forced to acknowledge his true legacy whether he likes it or not.',	'static/thumbs/king_artur.jpg',	2017),
(24,	'Logan',	'static/videos/Logan - Official Trailer [HD] - 20th Century FOX.mp4',	'In the near future, a weary Logan (Hugh Jackman) cares for an ailing Professor X (Patrick Stewart) at a remote outpost on the Mexican border. His plan to hide from the outside world gets upended when he meets a young mutant (Dafne Keen) who is very much like him. Logan must now protect the girl and battle the dark forces that want to capture her.',	'static/thumbs/logan.jpg',	2017),
(25,	'Pirates of the Caribbean: Dead Men Tell No Tales',	'static/videos/Pirates of the Caribbean- Dead Men Tell No Tales Official Teaser Trailer (2017) Movie HD.mp4',	'Pirates of the Caribbean: Dead Men Tell No Tales is an upcoming American fantasy swashbuckler film, and the fifth installment in the Pirates of the Caribbean film series.',	'static/thumbs/pirates.jpg',	2017),
(26,	'RAMMSTEIN: PARIS',	'static/videos/Rammstein- Paris - Official Trailer.mp4',	'RAMMSTEIN: PARIS, a concert-film by Jonas Åkerlund, will screen in selected cinemas across the world on 23rd March 2017! Screening dates for Germany, Austria, Switzerland are March 23, 24 and 29, 2017.',	'static/thumbs/rammstein.jpg',	2017),
(27,	'The Boss Baby',	'static/videos/The Boss Baby Official Trailer 1 (2017) - Alec Baldwin Movie.mp4',	'A wildly imaginative 7-year-old (Miles Bakshi) clashes with his demanding newborn brother (Alec Baldwin).',	'static/thumbs/baby_boss.jpg',	2017),
(28,	'War for the Planet of the Apes',	'static/videos/War for the Planet of the Apes - Official Trailer [HD] - 20th Century FOX.mp4',	'In War for the Planet of the Apes, the third chapter of the critically acclaimed blockbuster franchise, Caesar and his apes are forced into a deadly conflict with an army of humans led by a ruthless Colonel. After the apes suffer unimaginable losses, Caesar wrestles with his darker instincts and begins his own mythic quest to avenge his kind. As the journey finally brings them face to face, Caesar and the Colonel are pitted against each other in an epic battle that will determine the fate of both their species and the future of the planet.',	'static/thumbs/apes.jpg',	2017);

-- 2017-03-26 21:37:32
