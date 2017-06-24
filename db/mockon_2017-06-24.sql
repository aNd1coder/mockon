# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 192.168.10.10 (MySQL 5.7.16-0ubuntu0.16.04.1)
# Database: mockon
# Generation Time: 2017-06-24 15:53:17 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table t_api
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_api`;

CREATE TABLE `t_api` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT '名称',
  `description` varchar(1000) DEFAULT '' COMMENT '描述',
  `method` varchar(7) NOT NULL DEFAULT '' COMMENT '请求方法',
  `url` varchar(255) NOT NULL DEFAULT '' COMMENT '路径',
  `sort_weight` int(11) NOT NULL DEFAULT '0' COMMENT '排序权重',
  `project_id` int(11) NOT NULL COMMENT '所属项目',
  `module_id` int(11) NOT NULL COMMENT '所属模块',
  `status` char(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `backup_url` varchar(255) NOT NULL DEFAULT '' COMMENT '兜底数据连接',
  `developer` varchar(255) DEFAULT NULL COMMENT '开发人员',
  `user_id` int(11) unsigned NOT NULL COMMENT '创建者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_api` WRITE;
/*!40000 ALTER TABLE `t_api` DISABLE KEYS */;

INSERT INTO `t_api` (`id`, `name`, `description`, `method`, `url`, `sort_weight`, `project_id`, `module_id`, `status`, `backup_url`, `developer`, `user_id`, `created_at`, `modified_at`)
VALUES
	(1,'获取项目','可查询所有、部分或单个项目信息。','GET','project',0,1,1,'0','http://storage.jd.com/04b445e1f9cb5e75/6bd96bfc53.js',NULL,1,'2016-11-20 01:49:22','2017-06-08 08:00:54'),
	(2,'新增项目','创建新项目','POST','project',0,1,1,'0','',NULL,1,'2016-12-05 14:11:05','2017-06-01 09:56:56'),
	(3,'删除项目','删除项目会连同关联的模块及接口一并删除','DELETE','project',0,1,1,'0','',NULL,1,'2016-12-05 14:36:16','2017-06-01 09:56:57'),
	(4,'更新项目','更新项目信息','PUT','project',0,1,1,'0','',NULL,1,'2016-12-05 16:15:09','2017-06-01 09:56:58'),
	(5,'获取模块','','GET','module',0,1,2,'0','http://backup.mockon.jd.com/v1.0/module',NULL,1,'2016-12-05 18:45:33','2017-05-31 02:31:25'),
	(6,'新增模块','','POST','module',0,1,2,'0','',NULL,1,'2016-12-05 18:49:54','2017-06-01 09:56:59'),
	(7,'更新模块','更新模块信息','PUT','module',0,1,2,'0','',NULL,1,'2016-12-05 19:03:14','2017-06-01 09:57:00'),
	(8,'删除模块','删除模块会连同关联的响应及参数一并删除','DELETE','module',0,1,2,'0','',NULL,1,'2016-12-05 19:10:47','2017-06-01 09:57:01'),
	(9,'获取接口','获取接口信息','GET','api',0,1,3,'0','',NULL,1,'2016-12-06 09:57:13','2017-06-01 09:57:03'),
	(10,'新增接口','新增接口信息','POST','api',0,1,3,'0','',NULL,1,'2016-12-06 10:02:55','2017-06-01 09:57:02'),
	(11,'删除接口','删除接口会连同相关的响应及参数一并删除','DELETE','api',0,1,3,'0','',NULL,1,'2016-12-06 14:31:19','2017-06-01 09:57:04'),
	(12,'更新接口','更新接口信息','PUT','api',0,1,3,'0','',NULL,1,'2016-12-06 14:44:47','2017-06-01 09:57:06'),
	(13,'获取成员','可获取所有成员列表信息，或根据条件筛选成员信息，可获取单个成员信息','GET','member',0,1,4,'0','',NULL,1,'2016-12-06 16:31:34','2017-06-01 09:57:05'),
	(14,'报名','报名接口','POST','enlist/apply',0,6,7,'1','',NULL,1,'2016-12-20 18:22:36','2017-06-01 09:57:07'),
	(15,'商品列表','callback	回调函数	 \nactid	活动id	必须传,不能为空或者0\nstarttime\n起始时间','GET','test',0,6,25,'0','',NULL,1,'2017-04-18 10:45:25','2017-06-09 06:56:08'),
	(16,'测试接口','测试测试','GET','get',0,7,27,'1','http://data.jd.com/xxx.json',NULL,1,'2017-06-01 09:54:44','2017-06-12 07:44:45'),
	(17,'测试POST接口','测试POST接口','POST','post',0,7,27,'0','',NULL,1,'2017-06-09 03:35:12','2017-06-09 03:35:12'),
	(18,'测试PUT接口','测试PUT接口','PUT','put',0,7,27,'0','',NULL,1,'2017-06-09 03:38:11','2017-06-09 03:38:11'),
	(19,'查询必购码可用的商品','查询必购码可用的商品','GET','jcode/QuerySkuByJCode',0,8,30,'1','',NULL,1,'2017-06-12 02:26:32','2017-06-13 07:39:36'),
	(20,'测试DELETE接口','测试DELETE接口','DELETE','delete',0,7,27,'1','',NULL,1,'2017-06-12 06:52:19','2017-06-12 06:52:30'),
	(21,'【App】搭配精选','搭配精选栏目搭配列表相关信息展示接口','GET','bases/jingxuan/show',0,8,33,'1','',NULL,1,'2017-06-14 02:26:55','2017-06-14 02:26:55'),
	(22,'xxxxxxxxxxxx','xxxx','GET','xxxxxx',0,9,34,'0','','xxx',104048,'2017-06-20 11:32:00','2017-06-20 11:58:27'),
	(23,'xxxxx','xxx','PUT','xxx',0,9,36,'0','','xxx',104048,'2017-06-20 11:35:00','2017-06-20 11:35:00'),
	(27,'xxxxxxxxxxxx_copy','xxxx','GET','xxxxxx',0,9,34,'0','','xxx',104048,'2017-06-20 11:58:38','2017-06-20 11:58:38'),
	(28,'xxxxx','xxxx','GET','xxxx',0,9,37,'0','','xxxx',104048,'2017-06-22 06:19:57','2017-06-22 06:19:57');

/*!40000 ALTER TABLE `t_api` ENABLE KEYS */;
UNLOCK TABLES;

# Dump of table t_debug
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_debug`;

CREATE TABLE `t_debug` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `data` longtext NOT NULL COMMENT '调试数据',
  `user_id` int(11) NOT NULL COMMENT '创建者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# Dump of table t_error
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_error`;

CREATE TABLE `t_error` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `code` varchar(6) NOT NULL DEFAULT '' COMMENT '状态码',
  `name` varchar(50) DEFAULT NULL COMMENT '状态码名称',
  `description` varchar(1000) NOT NULL DEFAULT '' COMMENT '状态码描述',
  `project_id` int(11) NOT NULL COMMENT '所属项目',
  `api_id` int(11) DEFAULT NULL COMMENT '所属接口',
  `user_id` int(11) NOT NULL COMMENT '创建者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_error` WRITE;
/*!40000 ALTER TABLE `t_error` DISABLE KEYS */;

INSERT INTO `t_error` (`id`, `code`, `name`, `description`, `project_id`, `api_id`, `user_id`, `created_at`, `modified_at`)
VALUES
	(2,'401',NULL,'tid参数错误',6,0,1,'2016-12-20 17:53:54','2017-06-05 07:32:06'),
	(3,'402',NULL,'时间错误',6,0,1,'2016-12-20 17:54:37','2017-06-05 07:32:06'),
	(4,'404',NULL,'签名错误',6,0,1,'2016-12-20 17:55:02','2017-06-05 07:32:06'),
	(5,'10001',NULL,'未登录/用户未登录',6,0,1,'2016-12-20 17:55:15','2017-06-05 07:32:06');

/*!40000 ALTER TABLE `t_error` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_field
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_field`;

CREATE TABLE `t_field` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '字段编号',
  `name` varchar(255) DEFAULT NULL COMMENT '字段名称',
  `description` varchar(1000) DEFAULT NULL COMMENT '字段描述',
  `required` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否必需',
  `project_id` int(11) NOT NULL COMMENT '所属项目',
  `api_id` int(11) DEFAULT NULL COMMENT '所属接口',
  `response_id` int(11) DEFAULT NULL COMMENT '所属响应',
  `user_id` int(11) NOT NULL COMMENT '创建者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_field` WRITE;
/*!40000 ALTER TABLE `t_field` DISABLE KEYS */;

INSERT INTO `t_field` (`id`, `name`, `description`, `required`, `project_id`, `api_id`, `response_id`, `user_id`, `created_at`, `modified_at`)
VALUES
	(1,'code','响应代码',1,1,NULL,0,1,'2016-12-07 20:39:01','2016-12-08 10:04:57'),
	(2,'message','响应信息',1,1,NULL,0,1,'2016-12-07 20:40:14','2016-12-08 10:05:00'),
	(3,'data','响应数据',1,1,NULL,0,1,'2016-12-07 20:40:22','2016-12-08 10:05:02'),
	(4,'project_id','项目编号',1,1,NULL,21,1,'2016-12-07 20:41:07','2016-12-07 20:41:07'),
	(5,'user_id','用户编号',1,1,NULL,21,1,'2016-12-07 20:59:46','2016-12-08 10:03:11'),
	(6,'is_owner','是否为拥有者',1,1,NULL,0,1,'2016-12-07 20:59:47','2016-12-07 21:01:19'),
	(7,'user','用户',1,1,NULL,0,1,'2016-12-07 20:59:49','2016-12-07 21:01:25'),
	(8,'username','用户名',1,1,NULL,0,1,'2016-12-07 20:59:49','2016-12-07 21:01:26'),
	(9,'nickname','昵称',1,1,NULL,0,1,'2016-12-07 20:59:50','2016-12-07 21:01:26'),
	(10,'avatar','头像',1,1,NULL,0,1,'2016-12-07 20:59:51','2016-12-07 21:01:27'),
	(11,'email','邮箱',1,1,NULL,0,1,'2016-12-07 20:59:51','2016-12-07 21:01:28'),
	(12,'mobile','手机',1,1,NULL,0,1,'2016-12-07 20:59:52','2016-12-07 21:01:28'),
	(13,'description','描述',1,1,NULL,0,1,'2016-12-07 21:00:22','2016-12-07 21:01:29'),
	(14,'status','状态',1,1,NULL,0,1,'2016-12-07 21:00:22','2016-12-07 21:01:46'),
	(15,'status','状态码',1,6,NULL,0,1,'2016-12-21 13:01:51','2016-12-21 13:01:51'),
	(16,'message','响应信息',1,6,NULL,0,1,'2016-12-21 13:01:52','2016-12-21 13:01:52'),
	(17,'data','响应数据',1,6,NULL,0,1,'2016-12-21 13:01:52','2016-12-21 13:01:52'),
	(18,'id','编号',0,1,NULL,0,1,'2017-05-31 08:27:17','2017-06-08 03:36:32'),
	(19,'code','休闲鞋',1,7,NULL,29,1,'2017-06-06 08:52:23','2017-06-06 08:52:23'),
	(20,'message','带娃带娃大',1,7,NULL,29,1,'2017-06-06 08:52:24','2017-06-06 08:52:24'),
	(21,'data','返回数据',1,8,NULL,43,1,'2017-06-12 02:42:23','2017-06-12 02:42:23'),
	(22,'strInfo','商品列表',1,8,NULL,43,1,'2017-06-12 02:42:23','2017-06-12 02:42:23'),
	(23,'strJCode','必购码',1,8,NULL,43,1,'2017-06-12 02:42:24','2017-06-12 02:42:24'),
	(24,'retCode','返回状态码',1,8,NULL,43,1,'2017-06-12 02:42:25','2017-06-12 02:42:25'),
	(25,'sErrMsg','返回状态描述',1,8,NULL,43,1,'2017-06-12 02:42:25','2017-06-12 02:42:25');

/*!40000 ALTER TABLE `t_field` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_log
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_log`;

CREATE TABLE `t_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `description` varchar(255) DEFAULT '' COMMENT '日志描述',
  `before_data` text COMMENT '修改前版本',
  `after_data` text COMMENT '修改后版本',
  `project_id` int(11) NOT NULL COMMENT '项目编号',
  `user_id` int(11) NOT NULL COMMENT '用户编号',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_log` WRITE;
/*!40000 ALTER TABLE `t_log` DISABLE KEYS */;

INSERT INTO `t_log` (`id`, `description`, `before_data`, `after_data`, `project_id`, `user_id`, `created_at`)
VALUES
	(1,'创建项目',NULL,NULL,1,1,'2016-11-10 01:43:50'),
	(2,'修改项目',NULL,NULL,1,1,'2016-11-11 01:43:50'),
	(3,'成功登录系统',NULL,NULL,0,1,'2016-12-20 00:23:22');

/*!40000 ALTER TABLE `t_log` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_member
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_member`;

CREATE TABLE `t_member` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `project_id` int(11) NOT NULL COMMENT '项目编号',
  `user_id` int(11) NOT NULL COMMENT '成员编号',
  `is_owner` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否为拥有者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_member` WRITE;
/*!40000 ALTER TABLE `t_member` DISABLE KEYS */;

INSERT INTO `t_member` (`id`, `project_id`, `user_id`, `is_owner`, `created_at`, `modified_at`)
VALUES
	(1,1,1,1,'2016-11-19 22:51:04','2017-06-23 07:22:01'),
	(2,2,5,1,'2016-11-19 22:51:04','2017-06-08 01:38:23'),
	(3,3,6,1,'2016-11-19 22:51:04','2017-06-08 01:38:24'),
	(4,4,4,1,'2016-11-19 22:51:04','2017-06-08 01:38:25'),
	(5,5,1,1,'2016-11-19 22:51:04','2016-11-19 22:51:04'),
	(6,6,4,1,'2016-11-19 22:51:04','2017-06-08 01:39:03'),
	(7,6,1,0,'2016-11-19 22:51:04','2017-06-08 01:39:07'),
	(8,6,5,0,'2016-11-19 22:51:04','2017-06-08 01:37:42'),
	(9,6,6,0,'2016-11-19 22:51:04','2017-06-08 01:37:43'),
	(10,7,1,1,'2016-11-19 22:51:04','2016-11-19 22:51:04'),
	(11,1,4,0,'2017-05-11 07:25:04','2017-06-08 01:36:15'),
	(16,2,6,0,'2017-06-08 01:13:23','2017-06-08 01:13:23'),
	(17,2,3,0,'2017-06-08 01:13:23','2017-06-08 01:13:23'),
	(18,7,4,0,'2017-06-08 01:47:19','2017-06-08 01:47:19'),
	(19,7,6,0,'2017-06-09 03:40:11','2017-06-09 03:40:11'),
	(23,8,1,1,'2017-06-12 02:18:09','2017-06-12 02:18:09'),
	(24,8,4,0,'2017-06-12 06:39:41','2017-06-12 06:39:41'),
	(25,9,1,1,'2017-06-20 11:26:19','2017-06-20 11:26:19'),
	(27,9,4,1,'2017-06-20 11:28:55','2017-06-22 04:24:12'),
	(28,9,1,1,'2017-06-22 04:58:58','2017-06-22 04:59:28');

/*!40000 ALTER TABLE `t_member` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_module
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_module`;

CREATE TABLE `t_module` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT '名称',
  `code` varchar(10) NOT NULL DEFAULT '' COMMENT '代码',
  `description` varchar(1000) DEFAULT NULL COMMENT '描述',
  `sort_weight` int(11) NOT NULL DEFAULT '0' COMMENT '排序权重',
  `status` char(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `project_id` int(11) NOT NULL COMMENT '所属项目',
  `user_id` int(11) NOT NULL COMMENT '创建者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_module` WRITE;
/*!40000 ALTER TABLE `t_module` DISABLE KEYS */;

INSERT INTO `t_module` (`id`, `name`, `code`, `description`, `sort_weight`, `status`, `project_id`, `user_id`, `created_at`, `modified_at`)
VALUES
	(1,'项目','project','以项目为维度，下有模块，模块下才是接口',0,'0',1,1,'2016-11-19 17:21:14','2017-06-01 09:41:35'),
	(2,'模块','module','模块作为接口的分组',0,'0',1,1,'2016-11-19 17:21:14','2016-11-29 16:05:53'),
	(3,'接口','api','接口信息',0,'0',1,1,'2016-11-19 21:19:44','2016-11-29 15:57:26'),
	(4,'成员','member','项目成员管理，只有加入项目的成员才有权限管理项目所有信息',0,'0',1,1,'2016-12-02 10:54:44','2016-12-02 10:54:44'),
	(5,'状态码','error','管理项目下所有错误码信息',0,'0',1,1,'2016-12-02 10:56:52','2017-06-09 01:12:40'),
	(6,'日志','log','记录所有用户操作日志',0,'0',1,1,'2016-12-02 11:17:03','2016-12-02 11:17:03'),
	(7,'报名活动','activity','xxx',0,'1',6,1,'2016-12-20 18:11:51','2017-04-18 15:37:21'),
	(8,'相册管理','album','',0,'1',6,1,'2016-12-20 18:14:19','2016-12-20 18:14:19'),
	(9,'评论管理','comment','',0,'1',6,1,'2016-12-20 18:14:46','2016-12-20 18:14:46'),
	(10,'动态管理','dynamic','',0,'1',6,1,'2016-12-20 18:15:28','2016-12-20 18:15:28'),
	(11,'视频管理','video','',0,'1',6,1,'2016-12-20 18:15:51','2016-12-20 18:15:51'),
	(12,'抽奖管理','lottery','',0,'1',6,1,'2016-12-20 18:16:18','2016-12-20 18:16:18'),
	(13,'文章管理','article','',0,'1',6,1,'2016-12-20 18:16:34','2016-12-20 18:16:34'),
	(14,'二维码管理','qrcode','',0,'1',6,1,'2016-12-20 18:16:45','2016-12-20 18:16:45'),
	(15,'用户管理','user','',0,'1',6,1,'2016-12-20 18:17:46','2016-12-20 18:17:46'),
	(16,'地址管理','address','',0,'1',6,1,'2016-12-20 18:17:55','2016-12-20 18:17:55'),
	(17,'推送信息','push','',0,'0',6,1,'2016-12-20 18:18:04','2016-12-20 18:18:04'),
	(18,'投票','vote','',0,'1',6,1,'2016-12-20 18:18:14','2016-12-20 18:18:14'),
	(19,'问卷调查','survey','',0,'1',6,1,'2016-12-20 18:18:37','2016-12-20 18:18:37'),
	(20,'群组管理','group','',0,'1',6,1,'2016-12-20 18:18:58','2016-12-20 18:18:58'),
	(21,'数据统计','statistic','',0,'1',6,1,'2016-12-20 18:19:45','2016-12-20 18:19:45'),
	(22,'话题管理','topic','',0,'1',6,1,'2016-12-20 18:20:02','2016-12-20 18:20:02'),
	(23,'连连看','link_game','',0,'1',6,1,'2016-12-20 18:20:53','2016-12-20 18:20:53'),
	(24,'活动直播','live','',0,'1',6,1,'2016-12-20 18:21:15','2016-12-20 18:21:15'),
	(25,'测试默认','module','',0,'0',6,1,'2017-04-18 10:44:16','2017-04-18 10:44:16'),
	(26,'ceshi','ceshi','aaaaaa',0,'1',3,1,'2017-04-19 01:53:33','2017-04-19 01:53:48'),
	(27,'测试','test','test',0,'1',7,1,'2017-06-01 09:53:54','2017-06-09 03:39:08'),
	(28,'测试分组','test','测试分组',0,'0',7,1,'2017-06-09 03:38:47','2017-06-09 03:38:47'),
	(29,'xxx','xxx','xxx',0,'0',4,1,'2017-06-09 05:04:28','2017-06-09 05:04:28'),
	(30,'必购码','jcode','必购码',0,'1',8,1,'2017-06-12 02:20:36','2017-06-12 02:20:36'),
	(31,'登录','mlogin','登录',0,'1',8,1,'2017-06-12 02:22:50','2017-06-12 02:22:50'),
	(33,'bases','bases','基础流程',0,'1',8,1,'2017-06-14 02:23:42','2017-06-14 02:23:42'),
	(34,'点点滴滴','xxx','xxx',0,'0',9,104048,'2017-06-20 11:31:10','2017-06-22 06:19:13'),
	(36,'xxxx','xxxx','xxxx',0,'0',9,104048,'2017-06-20 11:34:47','2017-06-20 11:34:47'),
	(37,'大大我','aaa','当大王大王',0,'0',9,104048,'2017-06-22 06:19:22','2017-06-22 06:19:22');

/*!40000 ALTER TABLE `t_module` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_notification
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_notification`;

CREATE TABLE `t_notification` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `author_id` int(11) NOT NULL COMMENT '操作人',
  `project_id` int(11) NOT NULL COMMENT '接受人',
  `action` varchar(255) DEFAULT NULL COMMENT '操作',
  `description` varchar(1000) NOT NULL DEFAULT '' COMMENT '操作内容',
  `has_read` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否已读，0-未读，1-已读',
  `user_id` int(11) NOT NULL COMMENT '接受人',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_notification` WRITE;
/*!40000 ALTER TABLE `t_notification` DISABLE KEYS */;

INSERT INTO `t_notification` (`id`, `author_id`, `project_id`, `action`, `description`, `has_read`, `user_id`, `created_at`)
VALUES
	(2,1,1,'发布了','Mockon V2.0 版本已经发布，诚邀各位体验',0,1,'2016-11-20 15:35:34'),
	(3,1,1,'更新了','【接口分组】项目',0,1,'2016-11-20 15:35:34');

/*!40000 ALTER TABLE `t_notification` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_param
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_param`;

CREATE TABLE `t_param` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT '名称',
  `type` varchar(18) NOT NULL DEFAULT '' COMMENT '类型',
  `location` varchar(8) DEFAULT NULL COMMENT '参数位置',
  `length` varchar(10) NOT NULL DEFAULT '' COMMENT '长度范围',
  `default_value` longtext COMMENT '默认值',
  `required` tinyint(1) NOT NULL DEFAULT '0' COMMENT '必选',
  `description` varchar(1000) DEFAULT NULL COMMENT '描述',
  `project_id` int(11) NOT NULL COMMENT '所属项目',
  `api_id` int(11) NOT NULL COMMENT '所属接口',
  `response_id` int(11) NOT NULL COMMENT '所属响应',
  `user_id` int(11) NOT NULL COMMENT '创建者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_param` WRITE;
/*!40000 ALTER TABLE `t_param` DISABLE KEYS */;

INSERT INTO `t_param` (`id`, `name`, `type`, `location`, `length`, `default_value`, `required`, `description`, `project_id`, `api_id`, `response_id`, `user_id`, `created_at`, `modified_at`)
VALUES
	(1,'name','string','body','10','',1,'名称',1,2,3,1,'2016-11-19 22:21:08','2017-06-13 09:48:56'),
	(2,'description','string','body','255','',0,'描述',1,2,3,1,'2016-11-27 19:23:36','2017-06-13 09:48:56'),
	(3,'method','string','body','7','get',1,'请求方法',1,2,3,1,'2016-11-27 20:43:08','2017-06-13 09:48:56'),
	(4,'path','string','body','255','/',1,'路径',1,2,3,1,'2016-11-27 20:45:41','2017-06-13 09:48:56'),
	(6,'sort_weight','int','body','11','0',1,'排序权重',1,2,3,1,'2016-11-27 20:53:39','2017-06-13 09:48:56'),
	(7,'module_id','int','body','11','',1,'所属模块',1,2,3,1,'2016-11-28 12:53:03','2017-06-13 09:48:56'),
	(8,'status','int','body','11','',1,'状态',1,2,3,1,'2016-11-28 12:55:10','2017-06-13 09:48:56'),
	(9,'user_id','int','body','11','',1,'创建者',1,2,3,1,'2016-12-05 16:03:13','2017-06-13 09:48:56'),
	(10,'project_id','int','body','11','',1,'所属项目',1,2,3,1,'2016-12-05 18:08:17','2017-06-13 09:48:56'),
	(11,'id','int','body','11','',1,'模块编号',1,5,6,1,'2016-12-05 19:29:01','2017-06-13 09:48:56'),
	(13,'name','string','body','255','',1,'接口名称',1,10,14,1,'2016-12-06 10:03:54','2017-06-13 09:48:56'),
	(15,'id','int','body','11','',1,'接口编号',1,11,17,1,'2016-12-06 14:37:59','2017-06-13 09:48:56'),
	(16,'id','int','body','11','',1,'接口编号',1,11,18,1,'2016-12-06 14:38:32','2017-06-13 09:48:56'),
	(17,'project_id','int','body','11','',1,'所属项目',1,13,21,1,'2016-12-06 16:38:27','2017-06-13 09:48:56'),
	(18,'sort_weight','int','body','11','0',1,'排序权重',1,13,21,1,'2016-12-06 20:56:02','2017-06-13 09:48:56'),
	(19,'method','string','body','7','get',1,'请求方法',1,13,21,1,'2016-12-06 20:56:10','2017-06-13 09:48:56'),
	(20,'phone','int','body','11','',1,'手机号',6,14,22,1,'2016-12-21 13:03:05','2017-06-13 09:48:56'),
	(21,'email','string','body','50','',1,'电子邮件',6,14,22,1,'2016-12-21 13:03:40','2017-06-13 09:48:56'),
	(22,'qq','int','body','','',1,'qq号码',6,14,22,1,'2016-12-21 13:04:26','2017-06-13 09:48:56'),
	(23,'height','int','body','','',0,'身高cm',6,14,22,1,'2016-12-21 13:04:50','2017-06-13 09:48:56'),
	(24,'weight','int','body','','',0,'体重kg',6,14,22,1,'2016-12-21 13:05:10','2017-06-13 09:48:56'),
	(25,'weixin','string','body','','',0,'微信号',6,14,22,1,'2016-12-21 13:05:32','2017-06-13 09:48:56'),
	(26,'id_number','string','body','','',0,'身份证或护照号码',6,14,22,1,'2016-12-21 13:05:50','2017-06-13 09:48:56'),
	(27,'address','string','body','','',0,'住址',6,14,22,1,'2016-12-21 13:06:04','2017-06-13 09:48:56'),
	(28,'nickname','string','body','30','',0,'昵称',6,14,22,1,'2016-12-21 13:06:18','2017-06-13 09:48:56'),
	(29,'sex','int','body','','',0,'性别1 - 男 2 – 女 0 – 未知',6,14,22,1,'2016-12-21 13:06:31','2017-06-13 09:48:56'),
	(30,'web_url','string','body','','',0,'个人主页',6,14,22,1,'2016-12-21 13:06:46','2017-06-13 09:48:56'),
	(31,'declaration','string','body','','',0,'宣言',6,14,22,1,'2016-12-21 13:06:59','2017-06-13 09:48:56'),
	(32,'weibo_id','string','body','','',0,'微博或论坛id',6,14,22,1,'2016-12-21 13:07:17','2017-06-13 09:48:56'),
	(33,'header_url','string','body','','',1,'头像url',6,14,22,1,'2016-12-21 13:07:31','2017-06-13 09:48:56'),
	(34,'raid','int','body','','',1,'活动id',6,14,22,1,'2016-12-21 13:07:45','2017-06-13 09:48:56'),
	(35,'mid','int','body','','',1,'用户id',6,14,22,1,'2016-12-21 13:07:56','2017-06-13 09:48:56'),
	(36,'type','int','body','','',1,'类型:1魅友，2媒体，3嘉宾，4特别嘉宾',6,14,22,1,'2016-12-21 13:08:08','2017-06-13 09:48:56'),
	(54,'name','string','body','12','lee',0,'名字',6,15,28,1,'2017-04-19 01:39:52','2017-06-13 09:48:56'),
	(55,'age','int','body','12','17',0,'年龄',6,15,28,1,'2017-04-19 01:40:11','2017-06-13 09:48:56'),
	(56,'name','string','header','12','',0,'名字',6,15,24,1,'2017-04-19 01:40:45','2017-04-19 01:40:45'),
	(65,'test','string','body','10','test',0,'测试',7,16,29,1,'2017-06-06 11:49:13','2017-06-13 09:48:56'),
	(103,'name','string','body','10','',1,'名称',1,2,12,1,'2017-06-08 06:38:38','2017-06-13 09:48:56'),
	(104,'description','string','body','255','',0,'描述',1,2,12,1,'2017-06-08 06:41:46','2017-06-13 09:48:56'),
	(105,'method','string','body','7','get',0,'请求方法',1,2,12,1,'2017-06-08 06:43:31','2017-06-13 09:48:56'),
	(106,'path','string','body','255','/',0,'路径',1,2,12,1,'2017-06-08 06:44:39','2017-06-13 09:48:56'),
	(107,'sort_weight','int','body','11','0',1,'排序权重',1,2,12,1,'2017-06-08 06:46:56','2017-06-13 09:48:56'),
	(108,'module_id','int','body','11','',1,'所属模块',1,2,12,1,'2017-06-08 06:52:00','2017-06-13 09:48:56'),
	(109,'id','int','body','11','',1,'模块编号',1,1,2,1,'2017-06-08 07:40:10','2017-06-13 09:48:56'),
	(110,'jcode','string','query','16','2U4MNUT3OTY2CIID',1,'必购码',8,19,43,1,'2017-06-12 02:46:00','2017-06-13 07:40:00'),
	(111,'aaa','string','body','11','111',0,'111',7,16,29,1,'2017-06-12 07:27:05','2017-06-13 09:48:56'),
	(112,'bbb','string','body','11','111',0,'1111',7,16,29,1,'2017-06-12 07:47:43','2017-06-13 09:48:56'),
	(113,'tagid','string','query','','',0,'筛选指定的标签id列表，可以多个，中间用\"|\"分隔',8,21,44,1,'2017-06-14 02:49:07','2017-06-14 02:49:07'),
	(114,'day','int','query','','',0,'展示最近多少天的精选搭配，单位为天',8,21,44,1,'2017-06-14 02:49:28','2017-06-14 02:49:28'),
	(115,'paegid','int','query','','',1,'分页的页码ID，从1开始',8,21,44,1,'2017-06-14 02:49:57','2017-06-14 02:49:57'),
	(116,'pagesize','int','query','','',1,'分页的大小',8,21,44,1,'2017-06-14 02:50:15','2017-06-14 02:50:15');

/*!40000 ALTER TABLE `t_param` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_project
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_project`;

CREATE TABLE `t_project` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `name` varchar(50) NOT NULL DEFAULT '' COMMENT '名称',
  `code` varchar(10) NOT NULL DEFAULT '' COMMENT '代码',
  `image` varchar(255) DEFAULT NULL COMMENT '图标',
  `base_url` varchar(255) NOT NULL DEFAULT '' COMMENT '基础路径',
  `description` varchar(1000) DEFAULT NULL COMMENT '描述',
  `enctype` varchar(50) NOT NULL DEFAULT '' COMMENT '编码类型',
  `private` tinyint(1) NOT NULL COMMENT '是否私有，0-否，1-是',
  `sort_weight` int(11) NOT NULL DEFAULT '0' COMMENT '排序权重',
  `status` char(1) NOT NULL DEFAULT '0' COMMENT '状态(0为正常，1为废弃)',
  `theme_id` int(11) DEFAULT '1' COMMENT '文档主题',
  `user_id` int(11) NOT NULL COMMENT '创建者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_project` WRITE;
/*!40000 ALTER TABLE `t_project` DISABLE KEYS */;

INSERT INTO `t_project` (`id`, `name`, `code`, `image`, `base_url`, `description`, `enctype`, `private`, `sort_weight`, `status`, `theme_id`, `user_id`, `created_at`, `modified_at`)
VALUES
	(1,'Mockon','mockon','20161124/icon.png','http://127.0.0.1:8360/v1.0/','接口文档管理及调试平台\n- 倡导文档驱动开发模式，设计 > 测试 > 开发\n- 兼容 [Swagger](http://swagger.io)／[RAML](http://raml.org) 规范设计接口\n- 接口数据模拟，真正达到前后端并行开发\n- 接口请求代理，彻底从跨域问题中解脱出来\n- 便捷的数据导入导出，支持全新项目或者老项目快速\n- 界面友好、操作高效，通过点击和拖拽就可以完成大部分操作\n- 基于项目，多成员协作，多版本管理，清晰的操作日志\n- 平台数据请求接口基于 [JWT](http://jwt.io) 校验，保障数据安全','application/json',1,0,'0',1,104048,'2016-11-19 17:23:42','2017-06-23 07:21:45'),
	(2,'Mcare','mcare','','http://sapi.service.meizu.com/v1.0','服务支持 v1.0 项目组','application/json',0,0,'0',1,5,'2016-11-19 17:23:42','2017-06-22 14:24:51'),
	(3,'Lighting','lighting','','http://api.lighting.meizu.com/v1.0','动画效果库，收集各种酷炫的动画效果','application/json',0,0,'0',1,6,'2016-11-19 17:23:42','2017-06-22 14:24:52'),
	(4,'Smart','smart','','http://api.smart.meizu.com/v1.0','灵活的在线排期系统1','application/json',0,0,'0',1,4,'2016-11-21 20:27:09','2017-06-22 14:24:52'),
	(5,'Example','example','','http://api.example.meizu.com/v1.0','用来演示的示例项目','application/json',0,0,'0',1,1,'2016-11-21 20:27:09','2017-06-22 14:24:53'),
	(6,'Mac','mac','20161230/logo_by_wff.png','http://mac.meizu.com/','魅族活动云','application/json',1,0,'0',1,4,'2016-11-23 11:37:07','2017-06-22 14:24:54'),
	(7,'测试项目','test','20161124/sg.png','http://api.test.com/v1.0/','这是三桂哥哥用来测试的项目','application/json',0,0,'0',1,1,'2016-11-24 18:18:05','2017-06-22 14:24:55'),
	(8,'滴滴答答哇','ssss','','http://aa.dwadw.com/','wadwadaw','application/json',0,0,'0',1,1,'2017-06-12 02:18:09','2017-06-22 14:24:56'),
	(9,'xxxxx','xxxxx','20170620/sg.jpg','http://api.xxxxx.com/v1.0/','大大我的啊点点滴滴的','application/json',0,0,'0',1,104048,'2017-06-20 11:26:19','2017-06-22 14:24:57');

/*!40000 ALTER TABLE `t_project` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_response
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_response`;

CREATE TABLE `t_response` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '响应编号',
  `type` varchar(10) NOT NULL DEFAULT '0' COMMENT '响应类型（0为成功，1为失败）',
  `description` varchar(1000) DEFAULT '' COMMENT '响应描述',
  `enctype` varchar(50) NOT NULL DEFAULT '' COMMENT '编码类型',
  `jsonp_callback` varchar(255) DEFAULT '' COMMENT 'jsonp 回调函数名',
  `is_mockjs` tinyint(1) DEFAULT '0' COMMENT '是否为 mockjs 模型（0为否，1为是）',
  `body` longtext COMMENT '响应体',
  `project_id` int(11) NOT NULL COMMENT '所属项目',
  `api_id` int(11) NOT NULL COMMENT '所属接口',
  `user_id` int(11) NOT NULL COMMENT '创建者',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_response` WRITE;
/*!40000 ALTER TABLE `t_response` DISABLE KEYS */;

INSERT INTO `t_response` (`id`, `type`, `description`, `enctype`, `jsonp_callback`, `is_mockjs`, `body`, `project_id`, `api_id`, `user_id`, `created_at`, `modified_at`)
VALUES
	(1,'success','获取所有项目','application/json','',0,'{}',1,1,1,'2016-12-02 12:44:29','2017-06-15 09:44:10'),
	(2,'success','获取单个项目信息','application/json','',0,'{}',1,1,1,'2016-12-05 16:04:58','2017-06-15 09:44:15'),
	(3,'success','新增项目成功','application/json','',0,'{\n  \"code\": 0,\n  \"data\": {\n    \"id\": 10\n  },\n  \"message\": \"添加成功\"\n}',1,2,1,'2016-12-05 16:10:33','2017-06-08 03:34:21'),
	(5,'success','获取所有模块','application/json','',0,'{}',1,5,1,'2016-12-05 19:22:06','2016-12-06 20:57:27'),
	(6,'success','获取单个模块','application/json','',0,'{}',1,5,1,'2016-12-05 19:26:54','2016-12-06 20:57:24'),
	(7,'success','更新模块信息成功','application/json','',0,'{}',1,7,1,'2016-12-05 19:38:34','2016-12-06 20:57:21'),
	(8,'error','更新模块信息失败','application/json','',0,'{}',1,7,1,'2016-12-05 19:43:15','2017-05-31 08:39:31'),
	(10,'success','新增模块成功','application/json','',0,'{}',1,6,1,'2016-12-05 19:52:38','2016-12-06 20:57:00'),
	(11,'success','新增模块失败','application/json','',0,'{}',1,6,1,'2016-12-05 19:53:54','2016-12-06 20:57:11'),
	(12,'success','新增项目失败','application/json','',0,'{\n  \"code\": 101,\n  \"message\": \"参数缺失\"\n}',1,2,1,'2016-12-05 20:47:07','2017-06-08 02:43:55'),
	(13,'success','获取所有接口','application/json','',0,'{}',1,9,1,'2016-12-06 09:57:40','2016-12-06 10:00:18'),
	(14,'success','新增接口成功','application/json','',0,'{}',1,10,1,'2016-12-06 10:03:11','2016-12-06 14:03:33'),
	(17,'success','删除接口成功','application/json','',0,'{}',1,11,1,'2016-12-06 14:32:05','2016-12-06 20:57:07'),
	(18,'success','删除接口失败','application/json','',0,'{}',1,11,1,'2016-12-06 14:38:32','2016-12-06 20:56:55'),
	(19,'success','更新接口信息成功','application/json','',0,'{}',1,12,1,'2016-12-06 14:45:32','2016-12-06 14:45:32'),
	(20,'error','更新接口信息失败','application/json','',0,'{}',1,12,1,'2016-12-06 14:45:37','2016-12-06 14:45:45'),
	(21,'success','获取项目成员列表1','application/json','',0,'{\n  \"code\": 0,\n  \"message\": \"获取成功\",\n  \"data\": [\n    {\n      \"id\": 1,\n      \"project_id\": 1,\n      \"user_id\": 1,\n      \"is_owner\": 1,\n      \"user\": {\n        \"id\": 1,\n        \"username\": \"samgui\",\n        \"nickname\": \"三桂\",\n        \"avatar\": \"20161124/sg.png\",\n        \"email\": \"and1coder@gmail.com\",\n        \"mobile\": \"13302961259\",\n        \"description\": \"三桂哥哥\",\n        \"status\": \"0\"\n      }\n    }\n  ]\n}',1,13,1,'2016-12-06 16:34:20','2017-06-09 01:15:18'),
	(22,'success','报名成功','application/json','',0,'{\n  \"status\": 200,\n  \"message\": \"报名成功\",\n  \"data\": \"\"\n}',6,14,1,'2016-12-20 18:24:40','2016-12-21 13:00:59'),
	(24,'success','set','application/json','',0,'{\n  \"type\": 1\n}',6,15,1,'2017-04-18 10:47:13','2017-04-19 01:38:44'),
	(27,'success','add','application/json','',0,'{}',6,15,1,'2017-04-19 01:38:29','2017-04-19 01:38:29'),
	(28,'success','update','application/json','',0,'{}',6,15,1,'2017-04-19 01:39:16','2017-04-19 01:44:22'),
	(29,'success','测试响应体','application/json','jsonpCallback',1,'{\n  \"code\": 0,\n  \"message\": \"嘿嘿~\",\n  \"data\": {\n    \"id\": \"@id\",\n    \"name\": \"@name\",\n    \"cname\": \"@cname\",\n    \"ctitle\": \"@ctitle\'\",\n    \"cparagraph\": \"@cparagraph\",\n    \"guid\": \"@guid\",\n    \"url\": \"@url\",\n    \"domain\": \"@domain\",\n    \"email\": \"@email\",\n    \"ip\": \"@ip\",\n    \"region\": \"@region\",\n    \"province\": \"@province\",\n    \"city\": \"@city\",\n    \"county\": \"@county\",\n    \"zip\": \"@zip\"\n  }\n}',7,16,1,'2017-06-06 08:28:20','2017-06-15 09:07:01'),
	(43,'success','查询成功','application/json','',0,'{\n  \"data\": {\n    \"strInfo\": \"{\\\"yuyue\\\":\\\"11933667719,11933667729\\\"}\",\n    \"strJCode\": \"2U4MNUT3OTY2CIID\"\n  },\n  \"retCode\": 0,\n  \"sErrMsg\": \"\"\n}',8,19,1,'2017-06-12 02:29:15','2017-06-15 09:06:40'),
	(44,'success','请求成功','application/json','',0,'{\n  \"errCode\": \"\",\n  \"retCode\": \"\",\n  \"msg\": \"\",\n  \"end\": \"\",\n  \"data\": {\n    \"dapei\": [\n      {\n        \"dapei_id\": \"\",\n        \"daren_id\": \"\",\n        \"mainlogo\": \"\",\n        \"title\": \"\",\n        \"create_time\": \"\",\n        \"tag\": [\n          {\n            \"tagId\": \"8824\",\n            \"categoryId\": \"1\",\n            \"tagName\": \"T恤\"\n          },\n          {\n            \"tagId\": \"8757\",\n            \"categoryId\": \"1\",\n            \"tagName\": \"风衣\"\n          }\n        ]\n      }\n    ],\n    \"daren\": [\n      {\n        \"daren_id\": \"\",\n        \"daren_logo\": \"\",\n        \"daren_nick\": \"\"\n      }\n    ],\n    \"pv\": [\n      {\n        \"dapei_id\": \"\",\n        \"pv\": \"\"\n      }\n    ]\n  }\n}',8,21,1,'2017-06-14 02:48:16','2017-06-14 02:48:16'),
	(47,'success','xxx','application/json','xxx',0,'{\n  \"code\": 0\n}',9,22,104048,'2017-06-20 11:54:39','2017-06-22 06:28:41'),
	(48,'success','xxx','application/json','xxx',0,'{}',9,27,104048,'2017-06-20 11:58:38','2017-06-20 11:58:38'),
	(49,'success','xxxx','application/json','xxxx',0,'{}',9,28,104048,'2017-06-22 06:21:37','2017-06-22 06:21:37'),
	(52,'success','xxx','application/json','',0,'{}',1,8,104048,'2017-06-24 12:22:47','2017-06-24 12:22:47');

/*!40000 ALTER TABLE `t_response` ENABLE KEYS */;
UNLOCK TABLES;

# Dump of table t_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_user`;

CREATE TABLE `t_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `username` varchar(20) DEFAULT '' COMMENT '账户名',
  `fullname` varchar(20) DEFAULT NULL COMMENT '姓名',
  `org_id` varchar(8) DEFAULT NULL COMMENT '组织编号',
  `org_name` varchar(50) DEFAULT NULL COMMENT '组织名称',
  `avatar` varchar(50) DEFAULT NULL COMMENT '头像',
  `email` varchar(50) NOT NULL DEFAULT '' COMMENT '邮箱',
  `mobile` varchar(11) DEFAULT NULL COMMENT '手机',
  `description` varchar(1000) DEFAULT NULL COMMENT '描述',
  `status` char(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_user` WRITE;
/*!40000 ALTER TABLE `t_user` DISABLE KEYS */;

INSERT INTO `t_user` (`id`, `username`, `fullname`, `org_id`, `org_name`, `avatar`, `email`, `mobile`, `description`, `status`, `created_at`, `modified_at`)
VALUES
	(1,'samgui','三桂',NULL,NULL,'20161124/sg.png','and1coder@gmail.com','13302961259','三桂哥哥的个人主页','0','2016-11-24 16:50:06','2017-06-09 14:06:21'),
	(2,'and1coder',NULL,NULL,NULL,NULL,'samgui.vip@qq.com',NULL,NULL,'0','2016-11-26 01:10:29','2016-11-28 16:44:40'),
	(3,'samguivip',NULL,NULL,NULL,NULL,'samgui.vip@163.com',NULL,NULL,'0','2016-11-26 01:31:50','2016-11-28 16:44:44'),
	(4,'kaiye','猫哥',NULL,NULL,'https://avatars2.githubusercontent.com/u/344283','catgecn@gmail.com',NULL,'猫哥','0','2016-11-26 01:31:50','2017-01-09 14:10:30'),
	(5,'heaven','如峰',NULL,NULL,'https://avatars0.githubusercontent.com/u/8489343','617106268@qq.com',NULL,'如峰','0','2016-11-26 01:31:50','2017-01-09 14:10:32'),
	(6,'zhzhchwin','阿创',NULL,NULL,'https://avatars1.githubusercontent.com/u/10112498','617106268@qq.com',NULL,'阿创','0','2016-11-26 01:31:50','2017-01-09 14:10:33'),
	(7,'044aa',NULL,NULL,NULL,NULL,'liweiliang@jd.com',NULL,NULL,'0','2017-04-18 10:41:19','2017-04-18 10:41:19'),
	(10,'test',NULL,NULL,NULL,NULL,'test@qq.com',NULL,NULL,'0','2017-06-20 04:52:13','2017-06-20 04:52:13');

/*!40000 ALTER TABLE `t_user` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
