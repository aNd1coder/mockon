# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 192.168.10.10 (MySQL 5.7.12)
# Database: mockon
# Generation Time: 2017-01-17 02:25:02 +0000
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
  `path` varchar(255) NOT NULL DEFAULT '' COMMENT '路径',
  `sort_weight` int(11) NOT NULL DEFAULT '0' COMMENT '排序权重',
  `project_id` int(11) NOT NULL COMMENT '所属项目',
  `module_id` int(11) NOT NULL COMMENT '所属模块',
  `status` char(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `user_id` int(11) unsigned NOT NULL COMMENT '创建者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_api` WRITE;
/*!40000 ALTER TABLE `t_api` DISABLE KEYS */;

INSERT INTO `t_api` (`id`, `name`, `description`, `method`, `path`, `sort_weight`, `project_id`, `module_id`, `status`, `user_id`, `created_at`, `modified_at`)
VALUES
	(1,'获取项目','可查询所有、部分或单个项目信息。','get','/project',0,1,1,'0',1,'2016-11-20 01:49:22','2016-12-05 14:27:40'),
	(2,'新增项目','创建新项目','post','/project',0,1,1,'0',1,'2016-12-05 14:11:05','2016-12-05 17:53:33'),
	(3,'删除项目','删除项目会连同关联的模块及接口一并删除','delete','/project',0,1,1,'0',1,'2016-12-05 14:36:16','2016-12-05 14:36:16'),
	(4,'更新项目','更新项目信息','put','/project',0,1,1,'0',1,'2016-12-05 16:15:09','2016-12-05 16:15:09'),
	(5,'获取模块','','get','/module',0,1,2,'0',1,'2016-12-05 18:45:33','2016-12-05 18:45:33'),
	(6,'新增模块','','post','/module',0,1,2,'0',1,'2016-12-05 18:49:54','2016-12-05 18:49:54'),
	(7,'更新模块','更新模块信息','put','/module',0,1,2,'0',1,'2016-12-05 19:03:14','2016-12-05 19:07:30'),
	(8,'删除模块','删除模块会连同关联的响应及参数一并删除','delete','/module',0,1,2,'0',1,'2016-12-05 19:10:47','2016-12-05 19:10:47'),
	(9,'获取接口','获取接口信息','get','/api',0,1,3,'0',1,'2016-12-06 09:57:13','2016-12-06 09:57:13'),
	(10,'新增接口','新增接口信息','post','/api',0,1,3,'0',1,'2016-12-06 10:02:55','2016-12-06 10:02:55'),
	(11,'删除接口','删除接口会连同相关的响应及参数一并删除','delete','/api',0,1,3,'0',1,'2016-12-06 14:31:19','2016-12-06 14:31:19'),
	(12,'更新接口','更新接口信息','put','/api',0,1,3,'0',1,'2016-12-06 14:44:47','2016-12-06 14:44:47'),
	(13,'获取成员','可获取所有成员列表信息，或根据条件筛选成员信息，可获取单个成员信息','get','/member',0,1,4,'0',1,'2016-12-06 16:31:34','2016-12-12 11:36:16'),
	(14,'报名','报名接口','post','enlist/apply',0,6,7,'1',1,'2016-12-20 18:22:36','2016-12-20 18:22:36');

/*!40000 ALTER TABLE `t_api` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_component
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_component`;

CREATE TABLE `t_component` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT '名称',
  `code` varchar(10) NOT NULL COMMENT '代号',
  `image` varchar(50) DEFAULT NULL COMMENT '图片',
  `description` varchar(1000) DEFAULT NULL COMMENT '描述',
  `template` varchar(1000) NOT NULL DEFAULT '' COMMENT '模版',
  `status` char(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `user_id` int(11) NOT NULL COMMENT '创建者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_component` WRITE;
/*!40000 ALTER TABLE `t_component` DISABLE KEYS */;

INSERT INTO `t_component` (`id`, `name`, `code`, `image`, `description`, `template`, `status`, `user_id`, `created_at`, `modified_at`)
VALUES
	(1,'文本块','text',NULL,'带标题和描述的文本块','','0',1,'2016-11-20 01:47:52','2016-11-20 01:48:02');

/*!40000 ALTER TABLE `t_component` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_database
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_database`;

CREATE TABLE `t_database` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT '名称',
  `description` varchar(1000) DEFAULT NULL COMMENT '描述',
  `datasource` varchar(10) NOT NULL DEFAULT '' COMMENT '数据源',
  `status` char(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `project_id` int(11) NOT NULL COMMENT '所属项目',
  `user_id` int(11) NOT NULL COMMENT '创建者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_database` WRITE;
/*!40000 ALTER TABLE `t_database` DISABLE KEYS */;

INSERT INTO `t_database` (`id`, `name`, `description`, `datasource`, `status`, `project_id`, `user_id`, `created_at`, `modified_at`)
VALUES
	(1,'mockon','接口平台','mysql','1',1,1,'2016-11-19 22:14:43','2016-11-28 13:53:32'),
	(2,'mcare','服务支持','mysql','0',1,1,'2016-11-26 15:45:38','2016-11-28 13:53:39'),
	(3,'lighting','动画效果库','mysql','0',1,1,'2016-11-26 15:45:38','2016-11-28 13:53:40'),
	(4,'smart','排期系统','mysql','0',1,1,'2016-11-26 15:45:38','2016-11-28 13:53:41'),
	(5,'mac','魅族活动云','mysql','0',1,1,'2016-11-26 15:45:38','2016-11-28 13:53:42'),
	(6,'example','示例数据库','mysql','0',1,1,'2016-11-26 22:11:56','2016-11-28 13:53:43'),
	(7,'test','测试数据库','mysql','1',1,1,'2016-11-28 11:39:03','2016-11-28 13:53:45');

/*!40000 ALTER TABLE `t_database` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_error
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_error`;

CREATE TABLE `t_error` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `code` varchar(6) NOT NULL DEFAULT '' COMMENT '错误码',
  `description` varchar(1000) NOT NULL DEFAULT '' COMMENT '错误信息',
  `project_id` int(11) NOT NULL COMMENT '所属项目',
  `module_id` int(11) NOT NULL COMMENT '所属模块',
  `user_id` int(11) NOT NULL COMMENT '创建者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_error` WRITE;
/*!40000 ALTER TABLE `t_error` DISABLE KEYS */;

INSERT INTO `t_error` (`id`, `code`, `description`, `project_id`, `module_id`, `user_id`, `created_at`, `modified_at`)
VALUES
	(1,'100','Continue',1,0,1,'2016-11-20 01:36:17','2016-11-29 15:02:23'),
	(2,'401','tid参数错误',6,0,1,'2016-12-20 17:53:54','2016-12-20 17:53:54'),
	(3,'402','时间错误',6,0,1,'2016-12-20 17:54:37','2016-12-20 17:54:37'),
	(4,'404','签名错误',6,0,1,'2016-12-20 17:55:02','2016-12-20 17:55:02'),
	(5,'10001','未登录/用户未登录',6,0,1,'2016-12-20 17:55:15','2016-12-20 17:55:15'),
	(6,'10021','格式错误/参数格式错误/图片格式，大小或尺寸错误/参数错误/参数错误或内容过长/mid错误/参数错误（具体看返回信息）',6,0,1,'2016-12-20 17:55:26','2016-12-20 17:55:26'),
	(7,'10023','服务器忙',6,0,1,'2016-12-20 17:55:38','2016-12-20 17:55:38'),
	(8,'10026','活动不存在',6,0,1,'2016-12-20 17:55:50','2016-12-20 17:55:50'),
	(9,'10027','服务器忙，请重试/服务器忙/服务器忙，添加失败',6,0,1,'2016-12-20 17:56:01','2016-12-20 17:56:01'),
	(10,'10028','删除失败请先取消设置相册封面',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(11,'10101','你已经报过名了/活动不存在/已经报过名',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(12,'10102','你还未报名',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(13,'10103','上传超过最大数量限制/你已经签到过了/最多只能添加',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(14,'10104','地址重复',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(15,'10105','你还未通过审核',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(16,'10106','找不到报名信息',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(17,'10107','活动类型不正确',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(18,'10108','找不到投票选项',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(19,'10109','找不到二维码信息',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(20,'10201','相册不存在或隐藏/文章不存在或隐藏',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(21,'10204','没有摇到魅友（仅当用户量不足无匹配用户时会摇不到）',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(22,'10301','被评论用户不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(23,'10302','您的评论过快，请稍息一下！',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(24,'10303','被评论活动不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(25,'10304','被评论用户组不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(26,'10331','点赞失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(27,'10401','请上传图片',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(28,'10402','请书写动态',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(29,'10403','动态字数超过',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(30,'10404','发布失败，原因不明',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(31,'10405','图片ID不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(32,'10406','删除失败，图片权限错误或者图片不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(33,'10407','删除失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(34,'10408','没有上传图片',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(35,'10411','已经赞过了，休息会再来吧/动态不存在，操作失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(36,'10412','话题已禁用/动态已被隐藏，操作失败/动态删除失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(37,'10413','全站置顶失败/置顶失败/取消全站置顶失败/取消置顶失败/全站推荐失败/推荐失败/取消全站推荐失败/取消推荐失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(38,'10501','请填写视频地址',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(39,'10502','请填写视频名称',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(40,'10503','发布失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(41,'10601','活动不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(42,'10602','该用户未获取抽奖机会',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(43,'10603','活动ID不正确',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(44,'10604','活动未启用',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(45,'10605','活动未开始',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(46,'10606','活动已结束',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(47,'10607','调用接口错误',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(48,'10608','会员ID不正确',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(49,'10609','会员不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(50,'10610','当天已经获取过了/该活动没有参与用户',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(51,'10611','获取抽奖类型错误/不存在此等奖/不存在此奖',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(52,'10612','奖品已经抽完/奖品已抽完/用户没有加活动',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(53,'10613','您的抽奖次数已用完/所有用户已经中奖',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(54,'10614','奖项【XXX】存在问题',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(55,'10615','中奖记录不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(56,'10616','用户已经加入过抽奖',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(57,'10701','图片地址错误',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(58,'10702','无法识别',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(59,'10703','图片地址不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(60,'10704','文本信息不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(61,'10705','图片无法读取',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(62,'10717','奖品已被放弃',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(63,'10718','奖品获取失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(64,'11141','拉黑失败/取消拉黑失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(65,'11142','用户不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(66,'11301','活动不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(67,'11302','会员不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(68,'11303','已经参与了活动',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(69,'11304','参与活动失败,愿意不详',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(70,'11307','没有找到参与活动的记录',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(71,'11309','次数已经用完',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(72,'11401','信息不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(73,'11402','用户不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(74,'11403','保存失败XXX',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(75,'11501','投票选项不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(76,'11502','投票活动不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(77,'11503','投票活动禁用',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(78,'11504','投票活动未开始',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(79,'11505','投票活动已结束',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(80,'11506','用户不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(81,'11507','投票失败数据库写入失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(82,'11508','投票失败/当前选项投票次数达到上限/当前活动投票次数达到上限',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(83,'11509','投票失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(84,'11511','添加选项失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(85,'11512','投票选项已被禁用',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(86,'11601','没有找到绑定信息',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(87,'11602','没有找到用户信息',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(88,'11722','无效问卷/无效题目/参数错误',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(89,'11723','问卷尚未开始/请填写答案/无效题目',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(90,'11724','问卷已经结束/请选择答案',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(91,'11725','已参与本次问卷调查/本题是单选题/请选择答案',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(92,'11726','选择的答案非本题选项/本题是单选题/添加参与记录失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(93,'11727','提交失败/无效答案',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(94,'11728','提交失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(95,'11801','群组不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(96,'11802','用户已经在群组中',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(97,'11803','logo不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(98,'11804','banner图片不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(99,'11805','添加群组失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(100,'11806','更新群组失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(101,'11808','没权限修改',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(102,'11841','群组未启用',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(103,'11842','群组非本应用',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(104,'11851','群组未启用',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(105,'11852','群组非本应用',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(106,'11860','创建者不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(107,'11861','黑名单用户已经存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(108,'11922','图片不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(109,'11923','发布直播失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(110,'11925','编辑直播失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(111,'11941','直播内容不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(112,'11942','删除直播失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(113,'11954','操作失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(114,'12121','活动回顾不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(115,'12124','活动回顾删除失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(116,'12133','活动回顾保存失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(117,'12134','活动回顾创建失败',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(118,'12135','url格式不正确(要以http或者https开头)',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(119,'12201','获取话题数量不能大于',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(120,'12202','话题不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(121,'12203','话题名称不可以超过',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(122,'12204','重复数据',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(123,'12300','添加失败,请重试',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(124,'12301','游戏不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(125,'12302','用户未参加游戏',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(126,'12303','用户已参加游戏',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(127,'12304','关卡不存在/无效关卡',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(128,'12305','游戏记录不存在',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25'),
	(129,'12307','该局游戏已结束',6,0,1,'2016-12-20 18:05:25','2016-12-20 18:05:25');

/*!40000 ALTER TABLE `t_error` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_field
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_field`;

CREATE TABLE `t_field` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '字段编号',
  `name` varchar(255) DEFAULT NULL COMMENT '字段名称',
  `description` varchar(1000) DEFAULT NULL COMMENT '字段描述',
  `project_id` int(11) NOT NULL COMMENT '所属项目',
  `response_id` int(11) DEFAULT NULL COMMENT '所属响应',
  `user_id` int(11) NOT NULL COMMENT '创建者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_field` WRITE;
/*!40000 ALTER TABLE `t_field` DISABLE KEYS */;

INSERT INTO `t_field` (`id`, `name`, `description`, `project_id`, `response_id`, `user_id`, `created_at`, `modified_at`)
VALUES
	(1,'code','响应代码',1,0,1,'2016-12-07 20:39:01','2016-12-08 10:04:57'),
	(2,'message','响应信息',1,0,1,'2016-12-07 20:40:14','2016-12-08 10:05:00'),
	(3,'data','响应数据',1,0,1,'2016-12-07 20:40:22','2016-12-08 10:05:02'),
	(4,'project_id','项目编号',1,21,1,'2016-12-07 20:41:07','2016-12-07 20:41:07'),
	(5,'user_id','用户编号',1,21,1,'2016-12-07 20:59:46','2016-12-08 10:03:11'),
	(6,'is_owner','是否为拥有者',1,0,1,'2016-12-07 20:59:47','2016-12-07 21:01:19'),
	(7,'user','用户',1,0,1,'2016-12-07 20:59:49','2016-12-07 21:01:25'),
	(8,'username','用户名',1,0,1,'2016-12-07 20:59:49','2016-12-07 21:01:26'),
	(9,'nickname','昵称',1,0,1,'2016-12-07 20:59:50','2016-12-07 21:01:26'),
	(10,'avatar','头像',1,0,1,'2016-12-07 20:59:51','2016-12-07 21:01:27'),
	(11,'email','邮箱',1,0,1,'2016-12-07 20:59:51','2016-12-07 21:01:28'),
	(12,'mobile','手机',1,0,1,'2016-12-07 20:59:52','2016-12-07 21:01:28'),
	(13,'description','描述',1,0,1,'2016-12-07 21:00:22','2016-12-07 21:01:29'),
	(14,'status','状态',1,0,1,'2016-12-07 21:00:22','2016-12-07 21:01:46'),
	(15,'status','状态码',6,0,1,'2016-12-21 13:01:51','2016-12-21 13:01:51'),
	(16,'message','响应信息',6,0,1,'2016-12-21 13:01:52','2016-12-21 13:01:52'),
	(17,'data','响应数据',6,0,1,'2016-12-21 13:01:52','2016-12-21 13:01:52');

/*!40000 ALTER TABLE `t_field` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_log
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_log`;

CREATE TABLE `t_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `title` varchar(255) DEFAULT '' COMMENT '标题',
  `description` varchar(1000) DEFAULT '' COMMENT '描述',
  `project_id` int(11) NOT NULL COMMENT '项目编号',
  `user_id` int(11) NOT NULL COMMENT '用户编号',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_log` WRITE;
/*!40000 ALTER TABLE `t_log` DISABLE KEYS */;

INSERT INTO `t_log` (`id`, `title`, `description`, `project_id`, `user_id`, `created_at`)
VALUES
	(1,'创建项目','创建了 Mockon 项目',1,1,'2016-11-10 01:43:50'),
	(2,'修改项目','修改了 Mockon 项目',1,1,'2016-11-11 01:43:50'),
	(3,'成功登录系统','',0,1,'2016-12-20 00:23:22'),
	(4,'成功登录系统','',0,1,'2016-12-20 15:03:45'),
	(5,'创建模块 报名活动','',6,1,'2016-12-20 18:11:51'),
	(6,'创建模块 相册管理','',6,1,'2016-12-20 18:14:19'),
	(7,'创建模块 评论管理','',6,1,'2016-12-20 18:14:46'),
	(8,'创建模块 动态管理','',6,1,'2016-12-20 18:15:28'),
	(9,'创建模块 视频管理','',6,1,'2016-12-20 18:15:51'),
	(10,'创建模块 抽奖管理','',6,1,'2016-12-20 18:16:18'),
	(11,'创建模块 文章管理','',6,1,'2016-12-20 18:16:34'),
	(12,'创建模块 二维码管理','',6,1,'2016-12-20 18:16:45'),
	(13,'创建模块 用户管理','',6,1,'2016-12-20 18:17:46'),
	(14,'创建模块 地址管理','',6,1,'2016-12-20 18:17:55'),
	(15,'创建模块 推送信息','',6,1,'2016-12-20 18:18:04'),
	(16,'创建模块 投票','',6,1,'2016-12-20 18:18:14'),
	(17,'创建模块 问卷调查','',6,1,'2016-12-20 18:18:37'),
	(18,'创建模块 群组管理','',6,1,'2016-12-20 18:18:58'),
	(19,'创建模块 数据统计','',6,1,'2016-12-20 18:19:45'),
	(20,'创建模块 话题管理','',6,1,'2016-12-20 18:20:02'),
	(21,'创建模块 连连看','',6,1,'2016-12-20 18:20:53'),
	(22,'创建模块 活动直播','',6,1,'2016-12-20 18:21:15'),
	(23,'登录系统','',0,1,'2016-12-21 13:56:54'),
	(24,'登录系统','',0,1,'2016-12-23 11:08:27'),
	(25,'登录系统','',0,1,'2016-12-23 11:08:41'),
	(26,'登录系统','',0,1,'2016-12-24 20:39:25'),
	(27,'登录系统','',0,1,'2016-12-30 18:35:18'),
	(28,'登录系统','',0,1,'2016-12-30 18:45:55'),
	(29,'登录系统','',0,1,'2017-01-09 13:23:55'),
	(30,'登录系统','',0,1,'2017-01-09 13:45:44'),
	(31,'登录系统','',0,1,'2017-01-11 13:56:25');

/*!40000 ALTER TABLE `t_log` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_member
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_member`;

CREATE TABLE `t_member` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `project_id` int(11) NOT NULL COMMENT '名称',
  `user_id` int(11) NOT NULL COMMENT '成员编号',
  `is_owner` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '项目编号',
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_member` WRITE;
/*!40000 ALTER TABLE `t_member` DISABLE KEYS */;

INSERT INTO `t_member` (`id`, `project_id`, `user_id`, `is_owner`, `created_at`, `modified_at`)
VALUES
	(1,1,1,1,'2016-11-19 22:51:04','2016-11-24 22:51:04'),
	(2,2,1,1,'2016-11-19 22:51:04','2016-11-19 22:51:04'),
	(3,3,1,1,'2016-11-19 22:51:04','2016-11-19 22:51:04'),
	(4,4,1,1,'2016-11-19 22:51:04','2016-11-19 22:51:04'),
	(5,5,1,1,'2016-11-19 22:51:04','2016-11-19 22:51:04'),
	(6,6,1,1,'2016-11-19 22:51:04','2016-11-19 22:51:04'),
	(7,6,4,1,'2016-11-19 22:51:04','2016-11-19 22:51:04'),
	(8,6,5,1,'2016-11-19 22:51:04','2016-11-19 22:51:04'),
	(9,6,6,1,'2016-11-19 22:51:04','2016-11-19 22:51:04');

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
	(1,'项目','project','以项目为维度，下有模块，模块下才是接口',0,'0',1,1,'2016-11-19 17:21:14','2016-12-02 10:10:14'),
	(2,'模块','module','模块作为接口的分组',0,'0',1,1,'2016-11-19 17:21:14','2016-11-29 16:05:53'),
	(3,'接口','api','接口信息',0,'0',1,1,'2016-11-19 21:19:44','2016-11-29 15:57:26'),
	(4,'成员','member','项目成员管理，只有加入项目的成员才有权限管理项目所有信息',0,'0',1,1,'2016-12-02 10:54:44','2016-12-02 10:54:44'),
	(5,'错误码','error','管理项目下所有错误码信息',0,'0',1,1,'2016-12-02 10:56:52','2016-12-02 10:56:52'),
	(6,'日志','log','记录所有用户操作日志',0,'0',1,1,'2016-12-02 11:17:03','2016-12-02 11:17:03'),
	(7,'报名活动','activity','',0,'1',6,1,'2016-12-20 18:11:51','2016-12-20 18:11:51'),
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
	(24,'活动直播','live','',0,'1',6,1,'2016-12-20 18:21:15','2016-12-20 18:21:15');

/*!40000 ALTER TABLE `t_module` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_notification
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_notification`;

CREATE TABLE `t_notification` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `title` varchar(255) NOT NULL DEFAULT '' COMMENT '标题',
  `description` varchar(1000) NOT NULL DEFAULT '' COMMENT '描述',
  `user_id` int(11) NOT NULL COMMENT '用户编号',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_notification` WRITE;
/*!40000 ALTER TABLE `t_notification` DISABLE KEYS */;

INSERT INTO `t_notification` (`id`, `title`, `description`, `user_id`, `created_at`)
VALUES
	(2,'系统消息','Mockon V2.0 版本已经发布，诚邀各位体验',1,'2016-11-20 15:35:34');

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
  `default_value` varchar(255) DEFAULT NULL COMMENT '默认值',
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
	(1,'name','string','body','10','',1,'名称',1,2,3,1,'2016-11-19 22:21:08','2016-12-05 17:57:51'),
	(2,'description','string','body','255','',0,'描述',1,2,3,1,'2016-11-27 19:23:36','2016-12-05 16:14:12'),
	(3,'method','string','body','7','get',1,'请求方法',1,2,3,1,'2016-11-27 20:43:08','2016-12-05 16:14:13'),
	(4,'path','string','body','255','/',1,'路径',1,2,3,1,'2016-11-27 20:45:41','2016-12-05 16:14:14'),
	(6,'sort_weight','int','body','11','0',1,'排序权重',1,2,3,1,'2016-11-27 20:53:39','2016-12-05 16:14:15'),
	(7,'module_id','int','body','11','',1,'所属模块',1,2,3,1,'2016-11-28 12:53:03','2016-12-05 16:14:16'),
	(8,'status','int','body','11','',1,'状态',1,2,3,1,'2016-11-28 12:55:10','2016-12-05 16:14:17'),
	(9,'user_id','int','body','11','',1,'创建者',1,2,3,1,'2016-12-05 16:03:13','2016-12-05 16:14:17'),
	(10,'project_id','int','body','11','',1,'所属项目',1,2,3,1,'2016-12-05 18:08:17','2016-12-05 18:08:17'),
	(11,'id','int','path','11','',1,'模块编号',1,5,6,1,'2016-12-05 19:29:01','2016-12-05 19:29:01'),
	(12,'id','int','path','11','',1,'模块编号',1,8,4,1,'2016-12-05 19:50:35','2016-12-05 19:51:29'),
	(13,'name','string','body','255','',1,'接口名称',1,10,14,1,'2016-12-06 10:03:54','2016-12-06 10:03:54'),
	(15,'id','int','path','11','',1,'接口编号',1,11,17,1,'2016-12-06 14:37:59','2016-12-06 14:37:59'),
	(16,'id','int','path','11','',1,'接口编号',1,11,18,1,'2016-12-06 14:38:32','2016-12-06 14:38:32'),
	(17,'project_id','int','body','11','',1,'所属项目',1,13,21,1,'2016-12-06 16:38:27','2016-12-06 16:38:27'),
	(18,'sort_weight','int','body','11','0',1,'排序权重',1,13,21,1,'2016-12-06 20:56:02','2016-12-06 20:56:02'),
	(19,'method','string','body','7','get',1,'请求方法',1,13,21,1,'2016-12-06 20:56:10','2016-12-06 20:56:10'),
	(20,'phone','int','formData','11','',1,'手机号',6,14,22,1,'2016-12-21 13:03:05','2016-12-21 13:03:44'),
	(21,'email','string','formData','50','',1,'电子邮件',6,14,22,1,'2016-12-21 13:03:40','2016-12-21 13:03:45'),
	(22,'qq','int','formData','','',1,'qq号码',6,14,22,1,'2016-12-21 13:04:26','2016-12-21 13:04:26'),
	(23,'height','int','formData','','',0,'身高cm',6,14,22,1,'2016-12-21 13:04:50','2016-12-21 13:04:50'),
	(24,'weight','int','formData','','',0,'体重kg',6,14,22,1,'2016-12-21 13:05:10','2016-12-21 13:05:10'),
	(25,'weixin','string','formData','','',0,'微信号',6,14,22,1,'2016-12-21 13:05:32','2016-12-21 13:05:32'),
	(26,'id_number','string','formData','','',0,'身份证或护照号码',6,14,22,1,'2016-12-21 13:05:50','2016-12-21 13:05:50'),
	(27,'address','string','formData','','',0,'住址',6,14,22,1,'2016-12-21 13:06:04','2016-12-21 13:06:04'),
	(28,'nickname','string','formData','30','',0,'昵称',6,14,22,1,'2016-12-21 13:06:18','2016-12-21 13:06:18'),
	(29,'sex','int','formData','','',0,'性别1 - 男 2 – 女 0 – 未知',6,14,22,1,'2016-12-21 13:06:31','2016-12-21 13:06:31'),
	(30,'web_url','string','formData','','',0,'个人主页',6,14,22,1,'2016-12-21 13:06:46','2016-12-21 13:06:46'),
	(31,'declaration','string','formData','','',0,'宣言',6,14,22,1,'2016-12-21 13:06:59','2016-12-21 13:06:59'),
	(32,'weibo_id','string','formData','','',0,'微博或论坛id',6,14,22,1,'2016-12-21 13:07:17','2016-12-21 13:07:17'),
	(33,'header_url','string','formData','','',1,'头像url',6,14,22,1,'2016-12-21 13:07:31','2016-12-21 13:07:31'),
	(34,'raid','int','formData','','',1,'活动id',6,14,22,1,'2016-12-21 13:07:45','2016-12-21 13:07:45'),
	(35,'mid','int','formData','','',1,'用户id',6,14,22,1,'2016-12-21 13:07:56','2016-12-21 13:07:56'),
	(36,'type','int','formData','','',1,'类型:1魅友，2媒体，3嘉宾，4特别嘉宾',6,14,22,1,'2016-12-21 13:08:08','2016-12-21 13:08:08');

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
  `private` tinyint(1) NOT NULL COMMENT '是否私有',
  `sort_weight` int(11) NOT NULL DEFAULT '0' COMMENT '排序权重',
  `status` char(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `theme_id` int(11) DEFAULT NULL COMMENT '文档主题',
  `user_id` int(11) NOT NULL COMMENT '创建者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_project` WRITE;
/*!40000 ALTER TABLE `t_project` DISABLE KEYS */;

INSERT INTO `t_project` (`id`, `name`, `code`, `image`, `base_url`, `description`, `enctype`, `private`, `sort_weight`, `status`, `theme_id`, `user_id`, `created_at`, `modified_at`)
VALUES
	(1,'Mockon','mockon','20161124/icon.png','http://api.mockon.time33.com/v1.0','- 倡导文档驱动开发模式，设计 > 测试 > 开发\n- 兼容 [Swagger](http://swagger.io)／[RAML](http://raml.org) 规范设计接口\n- 接口数据模拟，真正达到前后端并行开发\n- 接口请求代理，彻底从跨域问题中解脱出来\n- 便捷的数据导入导出，支持全新项目或者老项目快速\n- 界面友好、操作高效，通过点击和拖拽就可以完成大部分操作\n- 基于项目，多成员协作，多版本管理，清晰的操作日志\n- 平台数据请求接口基于 [JWT](http://jwt.io) 校验，保障数据安全','application/json',1,0,'1',NULL,1,'2016-11-19 17:23:42','2016-12-01 11:46:48'),
	(2,'Mcare','mcare','','http://sapi.service.meizu.com/v1.0','服务支持 v1.0 项目组','application/json',0,0,'0',NULL,1,'2016-11-19 17:23:42','2016-11-23 13:52:11'),
	(3,'Lighting','lighting','','http://api.lighting.meizu.com/v1.0','动画效果库，收集各种酷炫的动画效果','application/json',0,0,'0',NULL,1,'2016-11-19 17:23:42','2016-11-23 13:52:12'),
	(4,'Smart','smart','','http://api.smart.meizu.com/v1.0','灵活的在线排期系统','application/json',0,0,'0',NULL,1,'2016-11-21 20:27:09','2016-11-23 17:20:54'),
	(5,'Example','example','','http://api.example.meizu.com/v1.0','用来演示的示例项目','application/json',0,0,'0',NULL,1,'2016-11-21 20:27:09','2016-11-23 17:20:55'),
	(6,'Mac','mac','20161230/logo_by_wff.png','http://mac.meizu.com/','魅族活动云','application/json',0,0,'0',NULL,1,'2016-11-23 11:37:07','2016-12-30 18:37:56'),
	(7,'测试项目','test','20161124/sg.png','http://api.test.com/v1.0','这是三桂用来测试的项目','application/json',0,0,'0',NULL,1,'2016-11-24 18:18:05','2016-11-24 18:18:05');

/*!40000 ALTER TABLE `t_project` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_response
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_response`;

CREATE TABLE `t_response` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '响应编号',
  `type` varchar(10) DEFAULT NULL COMMENT '响应类型（0为成功，1为失败）',
  `description` varchar(1000) DEFAULT NULL COMMENT '响应描述',
  `enctype` varchar(50) DEFAULT NULL COMMENT '编码类型',
  `body` longtext COMMENT '响应体',
  `project_id` int(11) DEFAULT NULL COMMENT '所属项目',
  `api_id` int(11) DEFAULT NULL COMMENT '所属接口',
  `user_id` int(11) DEFAULT NULL COMMENT '创建者',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_response` WRITE;
/*!40000 ALTER TABLE `t_response` DISABLE KEYS */;

INSERT INTO `t_response` (`id`, `type`, `description`, `enctype`, `body`, `project_id`, `api_id`, `user_id`, `created_at`, `modified_at`)
VALUES
	(1,'success','获取所有项目','application/json','{}',1,1,1,'2016-12-02 12:44:29','2016-12-08 10:39:49'),
	(2,'success','获取单个项目信息','application/json','{}',1,1,1,'2016-12-05 16:04:58','2016-12-05 19:48:23'),
	(3,'success','新增项目成功','application/json','{}',1,2,1,'2016-12-05 16:10:33','2016-12-05 19:55:19'),
	(4,'success','删除模块成功','application/json','{}',1,8,1,'2016-12-05 19:16:33','2016-12-06 20:57:30'),
	(5,'success','获取所有模块','application/json','{}',1,5,1,'2016-12-05 19:22:06','2016-12-06 20:57:27'),
	(6,'success','获取单个模块','application/json','{}',1,5,1,'2016-12-05 19:26:54','2016-12-06 20:57:24'),
	(7,'success','更新模块信息成功','application/json','{}',1,7,1,'2016-12-05 19:38:34','2016-12-06 20:57:21'),
	(8,'success','更新模块信息失败','application/json','{}',1,7,1,'2016-12-05 19:43:15','2016-12-06 20:57:17'),
	(9,'success','删除模块失败','application/json','{}',1,8,1,'2016-12-05 19:49:47','2016-12-06 20:57:14'),
	(10,'success','新增模块成功','application/json','{}',1,6,1,'2016-12-05 19:52:38','2016-12-06 20:57:00'),
	(11,'success','新增模块失败','application/json','{}',1,6,1,'2016-12-05 19:53:54','2016-12-06 20:57:11'),
	(12,'success','新增项目失败','application/json','{}',1,2,1,'2016-12-05 20:47:07','2016-12-05 20:47:07'),
	(13,'success','获取所有接口','application/json','{}',1,9,1,'2016-12-06 09:57:40','2016-12-06 10:00:18'),
	(14,'success','新增接口成功','application/json','{}',1,10,1,'2016-12-06 10:03:11','2016-12-06 14:03:33'),
	(17,'success','删除接口成功','application/json','{}',1,11,1,'2016-12-06 14:32:05','2016-12-06 20:57:07'),
	(18,'success','删除接口失败','application/json','{}',1,11,1,'2016-12-06 14:38:32','2016-12-06 20:56:55'),
	(19,'success','更新接口信息成功','application/json','{}',1,12,1,'2016-12-06 14:45:32','2016-12-06 14:45:32'),
	(20,'error','更新接口信息失败','application/json','{}',1,12,1,'2016-12-06 14:45:37','2016-12-06 14:45:45'),
	(21,'success','获取项目成员列表','application/json','{\n  \"code\": 0,\n  \"message\": \"获取成功\",\n  \"data\": [\n    {\n      \"id\": 1,\n      \"project_id\": 1,\n      \"user_id\": 1,\n      \"is_owner\": 1,\n      \"user\": {\n        \"id\": 1,\n        \"username\": \"samgui\",\n        \"nickname\": \"三桂\",\n        \"avatar\": \"20161124/sg.png\",\n        \"email\": \"and1coder@gmail.com\",\n        \"mobile\": \"13302961259\",\n        \"description\": \"三桂哥哥\",\n        \"status\": \"0\"\n      }\n    }\n  ]\n}',1,13,1,'2016-12-06 16:34:20','2016-12-06 18:25:24'),
	(22,'success','报名成功','application/json','{\n  \"status\": 200,\n  \"message\": \"报名成功\",\n  \"data\": \"\"\n}',6,14,1,'2016-12-20 18:24:40','2016-12-21 13:00:59');

/*!40000 ALTER TABLE `t_response` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_share
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_share`;

CREATE TABLE `t_share` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `token` varchar(255) NOT NULL DEFAULT '' COMMENT 'TOKEN 值',
  `project_id` int(11) DEFAULT NULL COMMENT '项目编号',
  `document_id` int(11) DEFAULT NULL COMMENT '文档编号',
  `password` varchar(11) DEFAULT NULL COMMENT '密码',
  `user_id` int(11) NOT NULL COMMENT '创建者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `t_share` WRITE;
/*!40000 ALTER TABLE `t_share` DISABLE KEYS */;

INSERT INTO `t_share` (`id`, `token`, `project_id`, `document_id`, `password`, `user_id`, `created_at`, `modified_at`)
VALUES
	(1,'xxxx',1,1,NULL,1,'2016-11-20 01:54:48','2016-11-20 01:54:48');

/*!40000 ALTER TABLE `t_share` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_table
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_table`;

CREATE TABLE `t_table` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `name` varchar(10) NOT NULL DEFAULT '' COMMENT '名称',
  `description` varchar(1000) DEFAULT NULL COMMENT '描述',
  `status` char(1) NOT NULL DEFAULT '0' COMMENT '状态',
  `database_id` int(11) NOT NULL COMMENT '数据库',
  `user_id` int(11) NOT NULL COMMENT '创建者',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_table` WRITE;
/*!40000 ALTER TABLE `t_table` DISABLE KEYS */;

INSERT INTO `t_table` (`id`, `name`, `description`, `status`, `database_id`, `user_id`, `created_at`, `modified_at`)
VALUES
	(1,'api','接口','0',1,1,'2016-11-19 22:16:09','2016-11-26 22:30:43'),
	(2,'component','组件','0',1,1,'2016-11-26 20:09:19','2016-11-26 20:09:41'),
	(3,'database','数据库','0',1,1,'2016-11-26 20:09:19','2016-11-26 20:09:19');

/*!40000 ALTER TABLE `t_table` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_theme
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_theme`;

CREATE TABLE `t_theme` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT '名称',
  `image` int(255) DEFAULT NULL COMMENT '图片',
  `description` varchar(1000) DEFAULT NULL COMMENT '描述',
  `user_id` int(11) NOT NULL COMMENT '用户编号',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `modified_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `t_theme` WRITE;
/*!40000 ALTER TABLE `t_theme` DISABLE KEYS */;

INSERT INTO `t_theme` (`id`, `name`, `image`, `description`, `user_id`, `created_at`, `modified_at`)
VALUES
	(1,'默认主题',NULL,NULL,1,'2016-11-19 22:51:38','2016-11-19 22:51:49');

/*!40000 ALTER TABLE `t_theme` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table t_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `t_user`;

CREATE TABLE `t_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '编号',
  `username` varchar(20) DEFAULT '' COMMENT '账户名',
  `password` varchar(50) NOT NULL DEFAULT '' COMMENT '密码',
  `nickname` varchar(20) DEFAULT NULL COMMENT '昵称',
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

INSERT INTO `t_user` (`id`, `username`, `password`, `nickname`, `avatar`, `email`, `mobile`, `description`, `status`, `created_at`, `modified_at`)
VALUES
	(1,'samgui','e10adc3949ba59abbe56e057f20f883e','三桂','20161124/sg.png','and1coder@gmail.com','13302961259','这里是三桂哥哥的个人主页','0','2016-11-24 16:50:06','2017-01-09 13:45:19'),
	(2,'and1coder','e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'samgui.vip@qq.com',NULL,NULL,'0','2016-11-26 01:10:29','2016-11-28 16:44:40'),
	(3,'samguivip','e10adc3949ba59abbe56e057f20f883e',NULL,NULL,'samgui.vip@163.com',NULL,NULL,'0','2016-11-26 01:31:50','2016-11-28 16:44:44'),
	(4,'kaiye','e10adc3949ba59abbe56e057f20f883e','猫哥','https://avatars2.githubusercontent.com/u/344283','catgecn@gmail.com',NULL,'猫哥','0','2016-11-26 01:31:50','2017-01-09 14:10:30'),
	(5,'heaven','e10adc3949ba59abbe56e057f20f883e','如峰','https://avatars0.githubusercontent.com/u/8489343','617106268@qq.com',NULL,'如峰','0','2016-11-26 01:31:50','2017-01-09 14:10:32'),
	(6,'zhzhchwin','e10adc3949ba59abbe56e057f20f883e','阿创','https://avatars1.githubusercontent.com/u/10112498','617106268@qq.com',NULL,'阿创','0','2016-11-26 01:31:50','2017-01-09 14:10:33');

/*!40000 ALTER TABLE `t_user` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
