-- Users 테이블
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(20) NOT NULL,
  nickname VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Products 테이블
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  name VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT,
  tags VARCHAR(5)[] NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Boards 테이블
CREATE TABLE boards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  image TEXT[],
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Comments 테이블
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  board_id INTEGER REFERENCES boards(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CHECK (
    (product_id IS NOT NULL AND board_id IS NULL) OR
    (product_id IS NULL AND board_id IS NOT NULL)
  ) -- 하나만 연결되도록 제약
);

-- Likes 테이블
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  board_id INTEGER NOT NULL REFERENCES boards(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, board_id) -- 중복 좋아요 방지
);

-- Favorites 테이블
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id) -- 중복 찜 방지
);

-- Notifications 테이블
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO users (id, email, password, nickname, created_at, updated_at) 
VALUES 
(1, 'brianhill@yahoo.com', '_2Mt!KuiMs', 'melissahicks', '2025-02-26 11:37:24', '2025-03-20 12:32:07'),
(2, 'rodneycopeland@hotmail.com', '*V3aJVkh@m', 'chasephyllis', '2025-01-02 04:27:37', '2025-01-11 13:16:58'),
(3, 'reedjoseph@lindsey-moore.com', ')2gMe%_uQy', 'johnsonamanda', '2025-03-28 23:03:04', '2025-03-05 12:27:01'),
(4, 'edward22@krueger.org', 'r9ZLKwt4*S', 'barkerkenneth', '2025-01-08 07:25:46', '2025-01-02 04:02:52'),
(5, 'gcooper@fernandez.org', 'N@2(nO(eys', 'troy02', '2025-03-14 15:40:15', '2025-01-11 21:51:55'),
(6, 'christine38@stout.biz', 'F#6D9ZrnjL', 'joshua47', '2025-01-18 04:00:34', '2025-03-31 02:27:43'),
(7, 'robinperez@todd.net', '&6Pws5UoZ3', 'nanderson', '2025-01-12 09:10:31', '2025-01-11 23:04:43'),
(8, 'wrightstephen@gmail.com', '+8OfV3h2bc', 'moorepaul', '2025-04-01 06:40:53', '2025-01-11 20:04:33'),
(9, 'lydiakhan@burton.net', '$^5HVxrKq!', 'sharonbrown', '2025-01-06 15:49:13', '2025-03-01 23:45:46'),
(10, 'martinbarbara@yahoo.com', '$T9T*oOIV1', 'lorivance', '2025-01-04 16:51:34', '2025-04-12 01:38:50'),
(11, 'pjohnson@hotmail.com', 'T34lANCcx+', 'johnnorris', '2025-02-11 22:33:43', '2025-03-30 05:32:57'),
(12, 'margaret59@gmail.com', '7)4FE5tm!&', 'crobles', '2025-03-20 00:58:56', '2025-01-19 14:02:10'),
(13, 'derrickdickerson@clark.com', 'v4kfaLNZ_B', 'uarmstrong', '2025-04-04 21:45:24', '2025-01-14 07:43:48'),
(14, 'jonwalker@jenkins.org', '+5%IRj)g43', 'moorecarl', '2025-03-05 16:51:39', '2025-02-04 12:43:47'),
(15, 'sherifreeman@gmail.com', 'Gv7Lql_#M#', 'dlarson', '2025-02-28 15:31:51', '2025-03-07 10:13:47'),
(16, 'ubullock@anderson.biz', '9S4D2*0v!@', 'johnsonpatricia', '2025-02-12 21:33:25', '2025-01-02 03:00:15'),
(17, 'kathryn98@gmail.com', '0!8lJJ0yPP', 'richard80', '2025-03-02 17:51:23', '2025-02-14 06:06:32'),
(18, 'eyoung@yahoo.com', '!kMVAgeri7', 'tonyzhang', '2025-01-30 02:01:52', '2025-01-16 16:33:12'),
(19, 'justinreed@garcia.net', '(%T1vCCyKv', 'myersjerome', '2025-03-06 19:54:04', '2025-02-26 23:06:25'),
(20, 'timothy06@newman.biz', 'dfNw(ZUf(5', 'jimmy59', '2025-02-17 17:48:26', '2025-01-28 07:44:51'),
(21, 'morgansanders@anderson-cervantes.net', '+jNiycZfr3', 'hannah45', '2025-04-14 07:58:54', '2025-03-29 11:11:01'),
(22, 'george87@nunez.biz', '95cH0OZg(S', 'schmittmichelle', '2025-01-11 14:47:08', '2025-01-13 01:18:29'),
(23, 'russell03@clark.org', '_^v7PSVmyk', 'sgreen', '2025-03-23 09:23:10', '2025-01-06 08:26:09'),
(24, 'crichards@hotmail.com', '*00ojXkmQU', 'tiffanyavery', '2025-01-23 11:21:38', '2025-02-13 22:41:36'),
(25, 'kennethgeorge@kelley.com', '#3GbMQSr!D', 'gfrank', '2025-02-27 14:00:49', '2025-03-21 01:08:24'),
(26, 'henrypatterson@johnson.org', 'x&H8WTkrnW', 'oliviablackwell', '2025-01-24 12:59:02', '2025-02-23 08:11:12'),
(27, 'derek30@hotmail.com', 'pDgnZpRp+0', 'brittneyfischer', '2025-03-08 07:53:58', '2025-04-01 02:41:06'),
(28, 'hillcody@diaz.com', 'H#)3UOKhPq', 'kevin53', '2025-02-02 17:52:18', '2025-01-20 16:03:28'),
(29, 'kayla82@yahoo.com', '_*9SIlmrUj', 'caldwellanthony', '2025-01-17 10:50:15', '2025-04-11 15:57:12'),
(30, 'denniswest@yahoo.com', 'f**(+&Q2#2', 'carmensmith', '2025-01-25 04:33:59', '2025-03-02 08:15:26');
 
INSERT INTO products (id, user_id, name, content, price, image, tags, created_at, updated_at) 
VALUES 
(1, 5, 'Side', 'Here either bill. Eye military discussion hard him. Act explain himself room statement really and.', 15287, 'https://dummyimage.com/275x265', ARRAY['desig', 'share', 'leade'], '2025-02-14 03:42:34', '2025-03-29 19:30:02'),
(2, 26, 'Rest', 'Magazine tax sit among. Instead story then safe news professor write. Yard campaign we industry.', 9249, 'https://placekitten.com/365/520', ARRAY['occur', 'focus', 'direc'], '2025-02-11 03:17:12', '2025-01-08 13:42:52'),
(3, 6, 'Necessary', 'World throw step herself. Card series voice thing. Place audience garden tax region such future.', 46356, 'https://placeimg.com/272/978/any', ARRAY['effec', 'back', 'shake'], '2025-03-02 06:21:29', '2025-04-03 04:01:07'),
(4, 10, 'According', 'Firm color for concern animal. Dog into change huge reality inside. Staff food politics protect.', 47383, 'https://dummyimage.com/485x863', ARRAY['cost', 'we', 'page'], '2025-01-08 14:40:14', '2025-02-26 05:17:52'),
(5, 1, 'Cover', 'Anyone writer really approach include fact I.', 46512, 'https://www.lorempixel.com/564/99', ARRAY['befor', 'requi', 'accep'], '2025-02-01 09:22:04', '2025-03-28 19:16:01'),
(6, 20, 'Rule', 'Cultural together whose turn event. Than occur others turn finish.', 7990, 'https://placeimg.com/123/594/any', ARRAY['prote', 'eight', 'any'], '2025-04-13 04:22:21', '2025-04-11 17:52:04'),
(7, 23, 'Choose', 'Of election word action buy. First this create leave. Only situation big personal tough forget.', 68023, 'https://dummyimage.com/643x922', ARRAY['fathe', 'manag', 'respo'], '2025-03-16 03:35:37', '2025-02-16 07:42:04'),
(8, 15, 'Important', 'Start relationship year forward eight wind. Somebody toward key similar center. Cost and hit.', 73759, 'https://placeimg.com/804/972/any', ARRAY['diffe', 'raise', 'publi'], '2025-02-03 12:23:17', '2025-02-11 08:21:05'),
(9, 9, 'Help', 'Billion off everything significant. Also a could perhaps fine edge.', 70205, 'https://dummyimage.com/405x762', ARRAY['level', 'study', 'idea'], '2025-02-27 17:22:34', '2025-03-01 11:18:55'),
(10, 12, 'Others', 'Shake involve after age operation three process. Several play forward provide some.', 19131, 'https://dummyimage.com/452x108', ARRAY['baby', 'activ', 'she'], '2025-03-10 04:47:33', '2025-02-17 07:39:00'),
(11, 8, 'Training', 'Next exactly although agent want. Claim various improve federal itself none tell.', 7527, 'https://dummyimage.com/952x571', ARRAY['west', 'resul', 'behav'], '2025-04-04 03:55:42', '2025-04-06 22:40:57'),
(12, 3, 'Adult', 'Whose modern side artist big prevent. The yes smile during.', 65119, 'https://www.lorempixel.com/648/349', ARRAY['struc', 'fish', 'movie'], '2025-03-31 11:54:30', '2025-01-25 01:59:37'),
(13, 1, 'Crime', 'Human indeed word marriage bank. Past prevent benefit whole effort.', 9613, 'https://dummyimage.com/34x177', ARRAY['struc', 'or', 'affec'], '2025-03-09 20:10:05', '2025-03-27 23:27:41'),
(14, 29, 'Activity', 'Visit science sound bill. Staff past and customer real site our.', 61267, 'https://www.lorempixel.com/489/702', ARRAY['site', 'parti', 'certa'], '2025-04-09 10:38:08', '2025-03-17 23:12:12'),
(15, 26, 'Great', 'Something prevent ball increase my.', 16710, 'https://placekitten.com/55/621', ARRAY['moder', 'worke', 'devel'], '2025-01-28 19:18:31', '2025-03-18 15:18:10'),
(16, 1, 'City', 'Individual they activity will may spend TV. Activity large measure spring.', 73551, 'https://www.lorempixel.com/438/292', ARRAY['but', 'bag', 'expla'], '2025-01-09 11:53:19', '2025-02-06 05:09:24'),
(17, 13, 'Why', 'Home employee school imagine. Sell beat always.', 57134, 'https://dummyimage.com/859x194', ARRAY['if', 'memor', 'itsel'], '2025-02-13 03:15:57', '2025-04-12 19:14:44'),
(18, 23, 'Hold', 'Suggest floor nature. Husband claim long everybody.', 39765, 'https://dummyimage.com/347x710', ARRAY['know', 'every', 'money'], '2025-01-10 21:16:44', '2025-01-25 21:49:40'),
(19, 1, 'Purpose', 'Hear leg including subject sea door. When popular explain or.', 88281, 'https://dummyimage.com/1x958', ARRAY['in', 'bag', 'addre'], '2025-02-22 09:27:01', '2025-03-23 18:36:32'),
(20, 15, 'Education', 'Money establish popular fund force. Risk draw field full practice stand.', 63924, 'https://placekitten.com/331/129', ARRAY['Ameri', 'poor', 'some'], '2025-02-21 11:46:05', '2025-04-10 23:12:07'),
(21, 16, 'Option', 'Animal message sort boy. Foot community grow identify expert kind. Then prevent relate.', 59366, 'https://www.lorempixel.com/594/148', ARRAY['yours', 'find', 'Ameri'], '2025-02-12 21:53:31', '2025-02-23 01:49:13'),
(22, 1, 'Speak', 'View view table. Evidence may establish her much. Meet over according his pull majority staff.', 52358, 'https://placekitten.com/284/834', ARRAY['deep', 'arriv', 'dog'], '2025-04-12 12:07:18', '2025-02-05 20:01:25'),
(23, 9, 'Friend', 'Own amount safe human wish total young. Entire artist may old every huge door look.', 38159, 'https://dummyimage.com/527x467', ARRAY['audie', 'lay', 'we'], '2025-01-17 05:09:21', '2025-02-04 16:59:53'),
(24, 5, 'Visit', 'Reality cause test. Guy concern work.
Need stage party do bed simply worry fund. Economy I team.', 66196, 'https://dummyimage.com/526x863', ARRAY['regio', 'fear', 'posit'], '2025-01-30 20:50:19', '2025-02-21 18:15:24'),
(25, 18, 'Tonight', 'No institution anyone some offer everyone. Attack try although morning expect stand believe.', 33369, 'https://placeimg.com/776/220/any', ARRAY['respo', 'than', 'month'], '2025-02-03 23:56:01', '2025-03-11 09:49:16'),
(26, 6, 'Gas', 'Tough easy wife writer serious. Hundred pattern position cold student seven ability.', 37214, 'https://placeimg.com/438/111/any', ARRAY['finan', 'discu', 'assum'], '2025-03-24 07:02:04', '2025-03-17 00:12:56'),
(27, 13, 'Fact', 'Best look around father threat offer continue.', 72303, 'https://www.lorempixel.com/408/594', ARRAY['feder', 'oil', 'try'], '2025-01-27 21:07:23', '2025-02-23 02:28:21'),
(28, 27, 'Purpose', 'Beautiful industry bar arm or.', 14278, 'https://dummyimage.com/735x755', ARRAY['inclu', 'town', 'compu'], '2025-01-19 05:42:55', '2025-01-29 08:42:19'),
(29, 17, 'Mind', 'Talk significant then family. Other else fly fast evidence fear this.', 97785, 'https://www.lorempixel.com/899/598', ARRAY['perso', 'kind', 'seek'], '2025-02-10 18:13:37', '2025-01-05 02:46:40'),
(30, 7, 'In', 'Today especially adult member manager probably when. Treatment management detail part.', 97181, 'https://placeimg.com/719/813/any', ARRAY['whole', 'tell', 'south'], '2025-01-18 01:57:41', '2025-01-19 16:55:44');

INSERT INTO boards (id, user_id, title, content, image, created_at, updated_at) 
VALUES 
(1, 18, 'Station activity road.', 'Hard rock wish south. Meet he itself room board.
Indicate turn term plant build guy development. Station range around visit.', ARRAY['https://placeimg.com/7/361/any', 'https://www.lorempixel.com/758/155'], '2025-01-05 03:11:35', '2025-03-01 01:37:48'),
(2, 1, 'Result again arrive.', 'Career chair including like agree. Yourself situation start decision bit.
Necessary never middle. Hotel report first can.', ARRAY['https://www.lorempixel.com/539/727', 'https://dummyimage.com/998x342'], '2025-01-27 19:57:15', '2025-02-08 12:52:44'),
(3, 3, 'Relate child.', 'Soldier activity friend ten best age. Nor history brother education phone. Sit would area total.', ARRAY['https://www.lorempixel.com/493/348', 'https://placeimg.com/608/826/any'], '2025-03-17 03:14:55', '2025-03-04 17:32:26'),
(4, 25, 'Item like billion however.', 'Out thus you mother lay out form. Pay identify answer no. Natural energy later lose himself education.
Section high industry.', ARRAY['https://dummyimage.com/237x611', 'https://placeimg.com/531/581/any'], '2025-03-22 01:12:16', '2025-02-11 03:03:02'),
(5, 1, 'Product fight brother.', 'Two ready yard. Mind center memory institution spend environment hit. Compare threat change data. Evening operation they painting.', ARRAY['https://placeimg.com/553/455/any', 'https://placekitten.com/85/167'], '2025-02-01 02:05:30', '2025-01-26 12:43:57'),
(6, 29, 'Resource usually hard chance role.', 'Item next pass under. Air most mention modern claim. Anyone himself position keep best that political.', ARRAY['https://dummyimage.com/668x617', 'https://www.lorempixel.com/795/862'], '2025-03-17 12:50:48', '2025-04-11 04:04:18'),
(7, 20, 'Thought drug management.', 'Sell any bank ok whether. Air film trouble maintain loss. Single nor its per chance more. Themselves away challenge month scene.', ARRAY['https://dummyimage.com/641x564', 'https://placeimg.com/626/872/any'], '2025-01-10 13:30:21', '2025-01-24 08:25:26'),
(8, 1, 'Behavior nor call candidate.', 'Head city never defense while these. Defense some away during.
Investment do involve son truth. Above choose by action though cultural.', ARRAY['https://www.lorempixel.com/505/304', 'https://placekitten.com/275/102'], '2025-01-28 18:54:23', '2025-02-10 10:08:04'),
(9, 25, 'Impact drug court ten.', 'Television dream two physical. Positive at far recognize radio head.', ARRAY['https://www.lorempixel.com/1017/175', 'https://placekitten.com/270/549'], '2025-02-22 08:59:10', '2025-04-09 14:06:41'),
(10, 24, 'Civil nor seek according.', 'Practice car design American movement series quality. Protect perform surface adult price. Western artist peace.', ARRAY['https://placekitten.com/941/309', 'https://www.lorempixel.com/242/477'], '2025-02-09 17:01:18', '2025-03-09 21:42:57'),
(11, 14, 'Without available.', 'General speak hope example. Me road management run board camera single. Respond on yourself option relationship.', ARRAY['https://placeimg.com/229/46/any', 'https://placeimg.com/903/787/any'], '2025-03-22 01:49:32', '2025-01-11 22:49:48'),
(12, 19, 'Stop office sell assume.', 'Plan training letter another measure wish inside. Address forward himself soldier.', ARRAY['https://dummyimage.com/447x382', 'https://www.lorempixel.com/746/301'], '2025-02-15 12:28:18', '2025-04-13 18:37:09'),
(13, 16, 'Laugh art.', 'Soon inside road one finally understand. Market pretty prepare see day create church take.', ARRAY['https://placekitten.com/736/798', 'https://placeimg.com/410/971/any'], '2025-01-11 05:32:30', '2025-01-26 11:33:02'),
(14, 3, 'Break foot.', 'West home church decision career. Resource ground people hope.', ARRAY['https://www.lorempixel.com/281/964', 'https://placekitten.com/25/288'], '2025-01-23 16:16:41', '2025-03-27 14:22:46'),
(15, 1, 'Challenge quite woman inside.', 'Business during the human consider. Right rock member method.', ARRAY['https://www.lorempixel.com/371/751', 'https://placekitten.com/593/468'], '2025-03-08 00:35:01', '2025-01-19 11:45:21'),
(16, 12, 'Business attention any water.', 'Dinner Mr him here. Country action during report stage available contain.', ARRAY['https://dummyimage.com/812x164', 'https://www.lorempixel.com/262/448'], '2025-01-23 08:36:40', '2025-04-03 09:43:53'),
(17, 4, 'Small enter high stock.', 'Simply too allow whole. Notice like radio culture management describe positive cover. Near star second rich former hard value.', ARRAY['https://dummyimage.com/324x939', 'https://dummyimage.com/290x630'], '2025-02-16 09:22:14', '2025-04-09 18:36:45'),
(18, 9, 'Hair and certain.', 'Six bar interview season.
Adult present tax fill. Happy size measure tend officer actually join. Race our fund report.', ARRAY['https://placekitten.com/838/974', 'https://dummyimage.com/382x430'], '2025-02-22 17:00:25', '2025-01-13 23:10:48'),
(19, 16, 'Quality evidence reveal.', 'Try future couple set provide son poor one. That edge score more list tend improve.
Professional paper size check.', ARRAY['https://placekitten.com/846/574', 'https://placeimg.com/95/645/any'], '2025-03-24 00:35:42', '2025-02-19 05:32:24'),
(20, 6, 'Relate international.', 'Exist station clear type out. Next believe today case. Identify movement agent response alone name region.', ARRAY['https://placekitten.com/803/561', 'https://placeimg.com/434/558/any'], '2025-01-25 21:56:50', '2025-02-21 21:23:09'),
(21, 15, 'Black care health.', 'Against hand ten my. Position draw find local necessary attack strong break.', ARRAY['https://dummyimage.com/536x57', 'https://placeimg.com/1012/973/any'], '2025-04-09 14:47:17', '2025-02-02 05:32:27'),
(22, 5, 'Plant player front may.', 'Sense rather along raise ball believe great. Main production start almost amount.', ARRAY['https://www.lorempixel.com/635/816', 'https://dummyimage.com/405x116'], '2025-03-05 20:36:56', '2025-01-05 11:04:26'),
(23, 23, 'Mr individual well.', 'House when time it similar. Rather institution do perhaps body. Conference bit trip where once television. Board population clear chair.', ARRAY['https://dummyimage.com/572x60', 'https://www.lorempixel.com/1009/213'], '2025-03-15 04:41:54', '2025-01-22 00:54:49'),
(24, 5, 'Candidate score reveal.', 'Eat or road side control buy wall detail. Vote practice rather still she raise two. But eye month whether six.', ARRAY['https://placekitten.com/0/237', 'https://placekitten.com/982/787'], '2025-03-03 18:15:47', '2025-02-03 14:42:41'),
(25, 8, 'What book about.', 'Yet PM economic everybody like. Hand high though while mention north who your. Fire either able feel hit. Physical ask effect.', ARRAY['https://placeimg.com/469/939/any', 'https://dummyimage.com/717x429'], '2025-02-03 03:01:34', '2025-03-31 00:52:22'),
(26, 22, 'Some almost.', 'Others study trial. Across agreement relate same article ago. Author paper real serve event.', ARRAY['https://placekitten.com/442/417', 'https://www.lorempixel.com/304/171'], '2025-01-22 12:20:22', '2025-04-08 03:48:09'),
(27, 16, 'Try fire.', 'Threat movie my general. Home technology out prevent will couple hear.
Summer TV hand above. Company far religious try want.', ARRAY['https://placeimg.com/560/466/any', 'https://placeimg.com/724/660/any'], '2025-02-25 21:10:16', '2025-02-12 19:26:40'),
(28, 5, 'Someone so half official no.', 'Win trade seek think police walk enjoy. Daughter foot eat public fine than note. Eight themselves perform opportunity light relate.', ARRAY['https://www.lorempixel.com/848/610', 'https://placeimg.com/612/199/any'], '2025-01-10 17:45:11', '2025-01-01 08:31:38'),
(29, 9, 'Give interest wait shoulder.', 'Time pull year health believe future we. Whole moment three list indeed time laugh. Make enough consumer trouble catch.', ARRAY['https://placekitten.com/543/214', 'https://www.lorempixel.com/844/574'], '2025-04-08 17:19:35', '2025-02-16 20:03:22'),
(30, 1, 'Anyone remain and protect sister.', 'Another six would. He protect allow choice. Consider movement husband party.', ARRAY['https://www.lorempixel.com/948/762', 'https://placeimg.com/315/388/any'], '2025-04-10 16:26:40', '2025-02-08 06:09:39');

INSERT INTO comments (id, user_id, product_id, board_id, content, created_at, updated_at) 
VALUES 
(1, 18, NULL, 8, 'First it prevent approach election look paper. Cup mouth yard scene other.', '2025-03-13 02:51:22', '2025-01-27 16:41:44'),
(2, 24, NULL, 26, 'Cost put commercial again simple. Prove soon speak professor.', '2025-02-13 07:48:27', '2025-03-12 17:36:13'),
(3, 1, 6, NULL, 'Mrs sea whether chance environmental wait become its. Risk finish these church.', '2025-01-29 09:30:59', '2025-03-17 18:25:23'),
(4, 19, 10, NULL, 'Behind or be but. Good home camera approach.', '2025-03-09 09:51:59', '2025-01-13 15:29:47'),
(5, 14, 14, NULL, 'Agent if task growth life TV. Much similar three politics. Student why left ok.', '2025-03-12 22:44:46', '2025-02-21 14:11:30'),
(6, 11, NULL, 25, 'Reflect could under professor moment cell tell. Special similar product.', '2025-04-07 12:18:23', '2025-02-09 19:45:37'),
(7, 18, 26, NULL, 'Possible call common human. Heavy player expert even technology order similar.', '2025-03-20 11:38:53', '2025-03-04 04:36:15'),
(8, 24, 22, NULL, 'Term term seem clear production. Similar I will staff marriage summer watch.', '2025-04-02 11:13:15', '2025-03-07 17:04:38'),
(9, 1, 1, NULL, 'Almost thank car from but weight bank. Mean girl leave wait guess painting.', '2025-03-04 01:56:06', '2025-01-06 18:44:12'),
(10, 9, NULL, 24, 'What father daughter future these side education.', '2025-02-02 07:50:27', '2025-02-15 03:35:37'),
(11, 6, NULL, 15, 'Because rich development I. Part economic then partner thousand up blood.', '2025-01-10 05:30:45', '2025-01-14 08:25:18'),
(12, 7, 11, NULL, 'Find too letter five. Smile full add trip money light population.', '2025-01-10 06:22:04', '2025-02-13 22:33:18'),
(13, 18, NULL, 11, 'Central maybe country. My range issue never ball just left. If sound out role.', '2025-02-23 22:34:02', '2025-04-09 22:31:02'),
(14, 30, 6, NULL, 'Trade close more call according. Land peace begin beyond then wrong letter.', '2025-01-15 05:15:53', '2025-03-24 09:04:27'),
(15, 14, 23, NULL, 'Individual be close skin. Light first common popular industry discover line.', '2025-01-25 19:15:41', '2025-01-12 15:11:49'),
(16, 4, 8, NULL, 'Wait shoulder final interesting interesting. Smile forget look allow open.', '2025-03-15 17:26:11', '2025-01-31 00:40:09'),
(17, 27, 10, NULL, 'Behind bank cold. Week mission color big deal we west.', '2025-03-31 18:07:15', '2025-02-11 11:06:21'),
(18, 12, 24, NULL, 'Recently under assume bank smile onto it.', '2025-02-27 22:52:14', '2025-03-24 01:53:06'),
(19, 28, 15, NULL, 'Among parent affect professional might. Notice town over manager season hot.', '2025-01-13 01:41:55', '2025-03-20 21:32:42'),
(20, 1, NULL, 28, 'Ok debate special ball. Government brother do customer.', '2025-04-13 06:41:26', '2025-03-30 11:57:52'),
(21, 28, NULL, 1, 'As find environment own out science. Up however view design.', '2025-02-23 12:38:17', '2025-01-24 14:49:17'),
(22, 27, NULL, 24, 'Model keep case happen too. Give admit task participant forget develop.', '2025-03-09 09:06:03', '2025-02-17 15:42:53'),
(23, 27, 9, NULL, 'It edge ask news. Tell before war career. Certain sure none property.', '2025-02-14 10:49:37', '2025-02-23 19:24:03'),
(24, 17, NULL, 21, 'Hope pick do quickly indicate. West land politics pressure talk.', '2025-01-24 18:53:20', '2025-02-08 20:38:38'),
(25, 25, NULL, 3, 'Look feeling agency. Local enough cost. Lot again world quickly.', '2025-01-12 10:57:24', '2025-03-17 22:13:32'),
(26, 6, NULL, 15, 'Later east than environmental window room candidate.', '2025-01-21 18:05:00', '2025-04-05 14:09:10'),
(27, 23, 30, NULL, 'Defense economic represent science play medical.', '2025-01-07 19:50:09', '2025-01-01 04:12:14'),
(28, 3, NULL, 23, 'Seven bar medical return enter describe. Development seven source left.', '2025-02-19 23:40:37', '2025-01-26 13:04:52'),
(29, 7, 26, NULL, 'Medical hold job strategy. Minute manager central better herself clearly.', '2025-01-07 05:02:40', '2025-01-26 05:51:27'),
(30, 2, NULL, 9, 'Physical paper but could best soldier travel. Down significant watch buy at.', '2025-01-15 22:05:20', '2025-01-12 09:26:25');

INSERT INTO likes (id, user_id, board_id, created_at, updated_at) 
VALUES 
(1, 1, 26, '2025-03-20 13:36:32', '2025-04-08 15:57:42'),
(2, 1, 7, '2025-01-02 11:59:49', '2025-03-01 12:02:03'),
(3, 5, 5, '2025-03-26 04:24:21', '2025-03-04 13:47:28'),
(4, 3, 22, '2025-02-14 14:13:12', '2025-01-12 12:25:00'),
(5, 10, 23, '2025-03-05 10:31:34', '2025-02-04 07:25:03');

INSERT INTO favorites (id, user_id, product_id, created_at, updated_at) 
VALUES 
(1, 1, 25, '2025-04-14 07:04:55', '2025-02-06 09:34:36'),
(2, 1, 20, '2025-02-22 14:31:52', '2025-01-11 20:20:55'),
(3, 1, 11, '2025-03-02 12:15:43', '2025-04-14 09:29:47'),
(4, 14, 22, '2025-02-12 20:33:32', '2025-03-06 01:51:08'),
(5, 8, 10, '2025-01-29 23:40:39', '2025-01-04 14:01:47');

INSERT INTO notifications (id, user_id, product_id, content, is_read, created_at, updated_at) 
VALUES 
(1, 5, 30, 'Some exactly serve if.', TRUE, '2025-04-01 18:25:18', '2025-01-07 19:42:39'),
(2, 1, 11, 'Pressure herself gas and.', FALSE, '2025-01-08 09:05:24', '2025-03-10 06:06:35'),
(3, 1, 6, 'These thing responsibility cell medical wife.', TRUE, '2025-02-08 14:36:28', '2025-01-09 15:53:16'),
(4, 29, 23, 'Foot institution money court.', FALSE, '2025-02-26 06:35:12', '2025-03-30 13:11:06'),
(5, 8, 15, 'Particular explain without type power work term card.', FALSE, '2025-01-09 07:36:19', '2025-04-05 09:45:50');