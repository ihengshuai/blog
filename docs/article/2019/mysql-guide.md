---
title: MySQL从入门到放弃
description: mysql基础使用指南,零基础学mysql完善全栈技术
head:
  - - meta
    - name: keywords
      content: MySQL,数据持久化,数据库,nodejs使用mysql,redis,关系型数据库
---

# MySQL从入门到放弃

对于一个程序的功能而言，数据存储也是一项很重要的技术。我们一般将程序产生的数据，比如用户账户信息，订单信息持久化，
也就是储存在数据库中。常用的关系型数据库有很多，如access、mysql、sqlserver、oracle等等。
其中目前最常用的还是mysql,今天小编就介绍下MySQL的基本操作...

## 下载安装
1. 下载

首页打开MySQL的官方网站(👉[MySQL](https://www.mysql.com/cn/downloads/))，打开后将网站拉到最底部，点击下载栏目中的
`MySQL Community Server`社区免费版，打开下载页面后，选择不同的操作系统，点击下面不同格式的安装包，如下：下载`8.0.22版本的dmg安装包`，
点击下载即可

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl4zdwp0nsj32761f0ar7.jpg)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl4zetgs71j32761f0h5c.jpg)

2. 安装

等待下载完成后双击安装包进行安装(Mac双击后点击里面的*.pkg安装包)，现在就进入MySQL的安装界面了

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl4zh66pyxj31lc0w0n6v.jpg)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl4zhof8hfj314o0uwgxu.jpg)

接下来就是傻瓜式的安装，一直点继续就可以了

:::warning 注意
安装完成之后会弹出一个对话框，告诉我们生成了一个root账户的临时密码。请注意保存，否则重设密码会比较麻烦。
这个版本会让你自己设置密码，至少8位，设置后安装完成后登录使用
:::

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl4zkc2srej314o0uw4cc.jpg)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl4zkjmqqdj314o0uw17n.jpg)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl4zkr4mojj314o0uwk29.jpg)

最后点击安装，等待安装完成...

安装完成后，打开我们的`系统偏好设置`就多出现MySQL服务，默认MySQL的服务开启状态

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl4zo2j7vrj317c17yaxx.jpg)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl4zovitn7j317c11g4ex.jpg)

MYSQL的默认安装路径

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl4zpwgxwej317c11gash.jpg)

## 终端配置MySQL
打开终端，Mac目前基本都是zsh终端，因此我们在`~`目录进行zsh配置，添加MySQL环境变量，如果没有`.zshrc`配置文件，自行创建即可

```bash
vim .zshrc

export PATH=${PATH}:/usr/local/mysql/bin 
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl50t01q8tj31ia1047lt.jpg)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl50t9fsn0j31l412iqv5.jpg)

环境变量配置好后，就可以进行终端登录了，如下图表示配置成功(输入安装过程中创建的密码)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl50vcigobj31ia104nd8.jpg)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl50vlfz3fj31ia104e1e.jpg)

## 工具推荐
推荐一个强大的数据可视化工具：`Navicat Premium`，这款工具不仅可以连接MySQL数据库，
也可以连接SQL Server等数据库，非常强大，唯一一点不好就是收费，可以自行百度下载破解版，这里我下载了15.0版本的

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl52a4201lj32341g8qkr.jpg)

## 基本操作

> 操作数据库的语句时，结尾一定不能漏掉分号!!!

## 创建数据库
1. 数据库操作

查看数据库列表
```sql
show databases;
```
接着创建一个demo数据库

```sql
# create database 数据库名字;

create database demo;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl513ywzicj31ia104e33.jpg)

## 删除数据库
```shell script
# drop database 数据库名字;

drop database demo;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl51n7a5tpj31ia104aub.jpg)

使用数据库
```bash
 # use 数据库名字;

 use demo;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl51psr1rsj31ia104h62.jpg)


2. 表的操作
## 查看当前数据库所有表
```sql
show tables;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl51uj9ab2j31ia104as7.jpg)

我去没一个表，那就创建表吧...

## 创建表
创建一个user表

```sql
# create table 表名 (配置...);

create table user (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NOT NULL,
  `age` INT(3),
  `birth` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB CHARSET=UTF8;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl51zf0psnj31ia104nj6.jpg)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl52bmvlqqj31wm0qa0yh.jpg)

>MySQL常用数据类型传送门: [常用数据类型](https://www.cnblogs.com/nick-huang/p/6697010.html)

## 删除表 Drop
删除user表

```sql
# drop table 表名;
drop table user;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl5234h746j31ia104h82.jpg)

## 插入数据 Insert into
1.全部插入
```sql
# insert into 表名 values (值);

insert into user values (1, 'Peachick', 10, NOW());
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl52crr1t2j31ia1047r3.jpg)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl52dekd9xj317y0b20ut.jpg)

2.选择插入对应值
>选择插入，键值是对应的，因此值可以根据键的顺序，填写值


```sql
# insert into 表名 (键...) values (对应值...);
insert into user (name, birth) values ("Peachick2", NOW());
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl52hcc6pnj310c04itdw.jpg)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl52htmpdhj31ei0ban00.jpg)

刷新发现多了一条数据...

3.插入多条数据
```sql
# insert into 表名 values (值), (值), ...;
或者
# insert into 表名 (键...) values (值...), (值...), ...

insert into user (name, age, birth) values ('Peachick3', 11, NOW()), ('Peachick4', 12, NOw());
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl52mgxnu0j31c406egsd.jpg)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl52mu74xgj31gk0ec41x.jpg)

>插入多条，前面的语法和前面插入单条是一样的，VALUES之后的，每一个小括号算是一条数据，每条数据之间用逗号隔开就行了。

## 修改数据 Update
1.修改单个值

```shell script
# update 表名 set 字段名 = 新值 (条件语句)?可有可无;
update user set name = 'Peachick1' where id = 1;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl52sj6ubyj313o05s0zm.jpg)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl52swgmmhj31hg0eqtby.jpg)

2.修改对个值

```shell script
# update 表名 set 字段名 = 新值, 字段名 = 新值, ... (条件语句)?可有可无;
update user set name = 'Peachick02', age = 2 where id = 2;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl52vgwe94j312g05iafg.jpg)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl52w0xp4jj31gy0du0vy.jpg)

3.不带条件

```shell script
update user set name = 'Peachick', age = 0, birth = NOW();
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl52yauhb9j311k05mdma.jpg)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl52yhq1fgj31cq0cqq62.jpg)

我们会发现表中的数据全被改了，有点流氓...，所以在修改数据库时一定要加上`条件语句`!!!

## 删除数据 Delete from
1. 有条件
```shell script
# delete from 表名 (条件语句)?可有可无;
delete from user where id = 1;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl5333qtyrj312i04gdl0.jpg)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl533fkuabj31by0b6go4.jpg)

可以看出id为1的数据被删除了...

2. 无条件
上面说了，条件语句可有可无，那如果没有条件语句会是什么样子呢？
```shell script
delete from user;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl535lt2uwj30xu04cwiv.jpg)

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl535uedt8j319m0csaco.jpg)

我去数据全部被删除了，有点魔鬼!!! 所以在删除数据时，一定要非常谨慎的加上条件，否则会产生很严重的后果...

## 简单查询
1. 查询所有字段
```shell script
# select * from 表名;
select * from user;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl53b4l6jij30su0bqdr5.jpg)

2. 查询指定字段
```shell script
# select 字段名, 字段名, ... from 表名;
select name, age from user;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl53doevwuj30uy0bi48a.jpg)

3. 条件查询
```shell script
# select * (或者 选择字段) from 表名 条件语句;
select name, age from user where id = 1;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl53fk0aiuj30u2086qag.jpg)

## 查询排序 Order By
1. 单个字段
```shell script
# select * from 表名 order by 字段名 排序;
select * from user order by age DESC;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl53jsdjkqj30s40mmx0p.jpg)

通过观察上述两个语句的执行结果，我们可以得出以下几点结论：
- MYSQL的排序命令是ORDER BY + 排序字段 + 排序方式,这个命令要加在语句的最后面（如果带了查询条件，查询条件应该放到ORDER BY 前面，否则会报错）
- DESC 表示倒序(降序)排序
- ASC表示正序(升序)排序
- ASC是默认排序方式

2. 多个字段
```shell script
# select * from 表名 order by 字段名 排序, 字段名 排序, ...;
select * from user order by age DESC, id ASC;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl53mtjkj6j30u20b4qdy.jpg)


通过观察上述两条语句的结果可以得出：

- MYSQL排序先按前一个条件来排序，会先以最前面一个规则来排序，在最前面一个规则的基础上按第二个规则再进行排序,一直到最后一个规则（可以修改age使之和id不一样进一步验证）


## 别名
1. 字段别名
```shell script
select 字段名 (as) "别名", ... from 表名;
```
`as`可以省略

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl9uczc3avj30rs0ayn6s.jpg)


```shell script
select 字段名 (as) "别名", ... from 表名 "别名";
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gl9ug4xvi1j30ts0aowlf.jpg)


## 常用函数
1. 统计 `COUNT()`
```sh
select count(*) from 表名;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glc46kve01j310g07uwju.jpg)

>应用场景：统计人数，点赞量。。。

2. 求和 `SUM()`
```sh
select SUM(字段名) from 表名;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glcph59rjlj30qe07maex.jpg)

>应用场景：sum()一般用于金钱、分数等数据的计算，比如求平台用户每个月收入多少钱，支出多少钱等等。另外sun()函数不仅可以求数字类型的字段的和还可以对字符串进行求和，但是它会只计算能求和的数据的和。

3. 平均数 `AVG()`
```sh
select AVG(字段名) from 表名;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glcpkmo0yxj30ty08g0xt.jpg)

4.其它

- 聚合函数
```sql
AVG(X)           --返回指定列的平均值
COUNT(X)         --返回指定列中非NULL值的个数
MIN(X)           --返回指定列的最小值
MAX(X)           --返回指定列的最大值
SUM(X)           --返回指定列的所有值之和
GROUP_CONCAT(X)  --返回由属于一组的列值连接组合而成的结果，非常有用
```

- 数学函数
```sql
ABS(x)                                          --返回x的绝对值
BIN(x)                                          --返回x的二进制（OCT返回八进制，HEX返回十六进制）
CEILING(x)                                      --返回大于x的最小整数值
EXP(x)                                          --返回值e（自然对数的底）的x次方
FLOOR(x)                                        --返回小于x的最大整数值
GREATEST(x1,x2,...,xn)  --返回集合中最大的值
LEAST(x1,x2,...,xn)     --返回集合中最小的值
LN(x)                                           --返回x的自然对数
LOG(x,y)                                        --返回x的以y为底的对数
MOD(x,y)                                        --返回x/y的模（余数）
PI()                                            --返回pi的值（圆周率）
RAND()                                          --返回０到１内的随机值,可以通过提供一个参数(种子)使RAND()随机数生成器生成一个指定的值。
ROUND(x,y)                                      --返回参数x的四舍五入的有y位小数的值
SIGN(x)                                         --返回代表数字x的符号的值
SQRT(x)                                         --返回一个数的平方根
TRUNCATE(x,y)                                   --返回数字x截短为y位小数的结果
```

- 字符串函数
```sql
ASCII(char)                                             --返回字符的ASCII码值
BIT_LENGTH(str)                                         --返回字符串的比特长度
CONCAT(s1,s2...,sn)         --将s1,s2...,sn连接成字符串
CONCAT_WS(sep,s1,s2...,sn)      --将s1,s2...,sn连接成字符串，并用sep字符间隔
INSERT(str,x,y,instr)                   --将字符串str从第x位置开始，y个字符长的子串替换为字符串instr，返回结果
FIND_IN_SET(str,list)                   --分析逗号分隔的list列表，如果发现str，返回str在list中的位置
LCASE(str)或LOWER(str)                  --返回将字符串str中所有字符改变为小写后的结果
LEFT(str,x)                                             --返回字符串str中最左边的x个字符
LENGTH(s)                                               --返回字符串str中的字符数
LTRIM(str)                                              --从字符串str中切掉开头的空格
POSITION(substr,str)                    --返回子串substr在字符串str中第一次出现的位置
QUOTE(str)                                              --用反斜杠转义str中的单引号
REPEAT(str,srchstr,rplcstr) --返回字符串str重复x次的结果
REVERSE(str)                                            --返回颠倒字符串str的结果
RIGHT(str,x)                                            --返回字符串str中最右边的x个字符
RTRIM(str)                                              --返回字符串str尾部的空格
STRCMP(s1,s2)                                           --比较字符串s1和s2
TRIM(str)                                               --去除字符串首部和尾部的所有空格
UCASE(str)或UPPER(str)                  --返回将字符串str中所有字符转变为大写后的结果
```

-日期和时间函数
```sql
CURDATE()或CURRENT_DATE() 
                  --返回当前的日期
CURTIME()或CURRENT_TIME() 
                  --返回当前的时间
DATE_ADD(date,INTERVAL int keyword)
                  --返回日期date加上间隔时间int的结果(int必须按照关键字进行格式化)
例如
SELECT DATE_ADD(CURRENT_DATE,INTERVAL 6 MONTH);

DATE_FORMAT(date,fmt)  
                  --依照指定的fmt格式格式化日期date值
DATE_SUB(date,INTERVAL int keyword)
                  --返回日期date加上间隔时间int的结果(int必须按照关键字进行格式化)
例如
SELECT DATE_SUB(CURRENT_DATE,INTERVAL 6 MONTH);

DAYOFWEEK(date)   --返回date所代表的一星期中的第几天(1~7)
DAYOFMONTH(date)  --返回date是一个月的第几天(1~31)
DAYOFYEAR(date)   --返回date是一年的第几天(1~366)
DAYNAME(date)     --返回date的星期名，如：SELECT DAYNAME(CURRENT_DATE);
FROM_UNIXTIME(ts,fmt)  
                  --根据指定的fmt格式，格式化UNIX时间戳ts
HOUR(time)        --返回time的小时值(0~23)
MINUTE(time)      --返回time的分钟值(0~59)
MONTH(date)       --返回date的月份值(1~12)
MONTHNAME(date)   --返回date的月份名，如：SELECT MONTHNAME(CURRENT_DATE);
NOW()             --返回当前的日期和时间
QUARTER(date)     --返回date在一年中的季度(1~4)
例如
SELECT QUARTER(CURRENT_DATE);

WEEK(date)        --返回日期date为一年中第几周(0~53)
YEAR(date)        --返回日期date的年份(1000~9999)
例如，获取当前系统时间
SELECT FROM_UNIXTIME(UNIX_TIMESTAMP());
SELECT EXTRACT(YEAR_MONTH FROM CURRENT_DATE);
SELECT EXTRACT(DAY_SECOND FROM CURRENT_DATE);
SELECT EXTRACT(HOUR_MINUTE FROM CURRENT_DATE);

返回两个日期值之间的差值(月数)
SELECT PERIOD_DIFF(200302,199802);

在Mysql中计算年龄：
SELECT DATE_FORMAT(FROM_DAYS(TO_DAYS(NOW())-TO_DAYS(birthday)),'%Y')+0 AS age FROM employee;
这样，如果Brithday是未来的年月日的话，计算结果为0。
下面的SQL语句计算员工的绝对年龄，即当Birthday是未来的日期时，将得到负值。
SELECT DATE_FORMAT(NOW(), '%Y') 
- DATE_FORMAT(birthday, '%Y') 
-(DATE_FORMAT(NOW(), '00-%m-%d') 
< DATE_FORMAT(birthday, '00-%m-%d')) AS age from employee
```

- 加密函数
```sql
AES_ENCRYPT(str,key)  
                  --返回用密钥key对字符串str利用高级加密标准算法加密后的结果，调用AES_ENCRYPT的结果是一个二进制字符串，以BLOB类型存储
AES_DECRYPT(str,key)  
                  --返回用密钥key对字符串str利用高级加密标准算法解密后的结果
DECODE(str,key)   --使用key作为密钥解密加密字符串str
ENCRYPT(str,salt) --使用UNIXcrypt()函数，用关键词salt(一个可以惟一确定口令的字符串，就像钥匙一样)加密字符串str
ENCODE(str,key)   --使用key作为密钥加密字符串str，调用ENCODE()的结果是一个二进制字符串，它以BLOB类型存储
MD5()             --计算字符串str的MD5校验和
PASSWORD(str)     --返回字符串str的加密版本，这个加密过程是不可逆转的，和UNIX密码加密过程使用不同的算法。
SHA()             --计算字符串str的安全散列算法(SHA)校验和

例如
SELECT ENCRYPT('root','salt');
SELECT ENCODE('xufeng','key');
SELECT DECODE(ENCODE('xufeng','key'),'key');#加解密放在一起
SELECT AES_ENCRYPT('root','key');
SELECT AES_DECRYPT(AES_ENCRYPT('root','key'),'key');
SELECT MD5('123456');
SELECT SHA('123456');
```

- 控制流函数
```sql
CASE WHEN [test1] THEN [result1]...ELSE [default] END 
                    --如果test1是真，则返回result1，否则返回default
CASE [test] WHEN [val1] THEN [result]...ELSE [default] END  
                    --如果test和valN相等，则返回result，否则返回default
IF(test,t,f)        --如果test是真，返回t；否则返回f
IFNULL(arg1,arg2)   --如果arg1不是空，返回arg1，否则返回arg2
NULLIF(arg1,arg2)   --如果arg1=arg2返回NULL；否则返回arg1

这些函数的第一个是IFNULL()，它有两个参数，并且对第一个参数进行判断。
如果第一个参数不是NULL，函数就会向调用者返回第一个参数；
如果是NULL,将返回第二个参数。
例如
SELECT IFNULL(1,2), 
IFNULL(NULL,10),
IFNULL(4*NULL,'false');

NULLIF()函数将会检验提供的两个参数是否相等，如果相等，则返回NULL，
如果不相等，就返回第一个参数。
例如
SELECT NULLIF(1,1),
NULLIF('A','B'),
NULLIF(2+3,4+1);

MySQL的IF()函数也可以建立一个简单的条件测试，
这个函数有三个参数，第一个是要被判断的表达式，
如果表达式为真，IF()将会返回第二个参数，
如果为假，IF()将会返回第三个参数。
例如
SELECT IF(1<10,2,3),IF(56>100,'true','false');
IF()函数在只有两种可能结果时才适合使用。
然而，在现实世界中，我们可能发现在条件测试中会需要多个分支。
在这种情况下，它和PHP及Perl语言的switch-case条件例程一样。

CASE函数的格式有些复杂，通常如下所示：
CASE [expression to be evaluated]
WHEN [val 1] THEN [result 1]
WHEN [val 2] THEN [result 2]
WHEN [val 3] THEN [result 3]
......
WHEN [val n] THEN [result n]
ELSE [default result]
END
这里，第一个参数是要被判断的值或表达式，接下来的是一系列的WHEN-THEN块，
每一块的第一个参数指定要比较的值，如果为真，就返回结果。
所有的WHEN-THEN块将以ELSE块结束，当END结束了所有外部的CASE块时，
如果前面的每一个块都不匹配就会返回ELSE块指定的默认结果。
如果没有指定ELSE块，而且所有的WHEN-THEN比较都不是真，MySQL将会返回NULL。
CASE函数还有另外一种句法，有时使用起来非常方便，如下：
CASE
WHEN [conditional test 1] THEN [result 1]
WHEN [conditional test 2] THEN [result 2]
ELSE [default result]
END
这种条件下，返回的结果取决于相应的条件测试是否为真。
例如：
SELECT CASE 'green'
     WHEN 'red' THEN 'stop'
     WHEN 'green' THEN 'go' END;

SELECT CASE 9 
WHEN 1 THEN 'a'
WHEN 2 THEN 'b' ELSE 'N/A' END;

SELECT CASE WHEN (2+2)=4 THEN 'OK' 
WHEN (2+2)<>4 THEN 'not OK' END AS STATUS;

SELECT Name,IF((IsActive = 1),'已激活','未激活') AS RESULT 
FROM UserLoginInfo;

SELECT fname,lname,(math+sci+lit) AS total,
CASE WHEN (math+sci+lit) < 50 THEN 'D'
     WHEN (math+sci+lit) BETWEEN 50 AND 150 THEN 'C'
     WHEN (math+sci+lit) BETWEEN 151 AND 250 THEN 'B'
ELSE 'A' END AS grade FROM marks;

SELECT IF(ENCRYPT('sue','ts')=upass,'allow','deny') AS LoginResult
FROM users WHERE uname = 'sue';
```

- 格式化函数
```sql
DATE_FORMAT(date,fmt)  
                  --依照字符串fmt格式化日期date值
FORMAT(x,y)       --把x格式化为以逗号隔开的数字序列，y是结果的小数位数
INET_ATON(ip)     --返回IP地址的数字表示
INET_NTOA(num)    --返回数字所代表的IP地址
TIME_FORMAT(time,fmt)  
                  --依照字符串fmt格式化时间time值
其中最简单的是FORMAT()函数，
它可以把大的数值格式化为以逗号间隔的易读的序列。
例如
SELECT FORMAT(34234.34323432,3);
SELECT DATE_FORMAT(NOW(),'%W,%D %M %Y %r');
SELECT DATE_FORMAT(NOW(),'%Y-%m-%d');
SELECT DATE_FORMAT(19990330,'%Y-%m-%d');
SELECT DATE_FORMAT(NOW(),'%h:%i %p');
SELECT INET_ATON('10.122.89.47');
SELECT INET_NTOA(175790383);
```

- 类型转换函数
```sql
为了进行数据类型转化，MySQL提供了CAST()函数，
它可以把一个值转化为指定的数据类型。
类型有：BINARY,CHAR,DATE,TIME,DATETIME,SIGNED,UNSIGNED
例如
SELECT CAST(NOW() AS SIGNED INTEGER),CURDATE()+0;
SELECT 'f'=BINARY 'F','f'=CAST('F' AS BINARY);
```

- 信息系统函数
```sql
DATABASE()        --返回当前数据库名
BENCHMARK(count,expr)  
                  --将表达式expr重复运行count次
CONNECTION_ID()   --返回当前客户的连接ID
FOUND_ROWS()      --返回最后一个SELECT查询进行检索的总行数
USER()或SYSTEM_USER()  
                  --返回当前登陆用户名
VERSION()         --返回MySQL服务器的版本
例如
SELECT DATABASE(),VERSION(),USER();
SELECTBENCHMARK(9999999,LOG(RAND()*PI()));# 
该例中,MySQL计算LOG(RAND()*PI())表达式9999999次。
```

## 分组查询 Group By
```sh
select 字段名 from 表名 group by 字段名,...;
```

先查下表里的数据
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glcq75e7pnj30x20g2doz.jpg)

接下来分组查询

1.单个字段与多个字段

- 根据`age`字段
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glcq9b4c40j312y0amk0p.jpg)

- 根据`age和name`字段
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glcqa4gralj31300gu18g.jpg)

:::tip 总结
从上面的两个分组查询我们可以得出结论：`group by`会根据后面的字段进行分组，一样的为一组，不一样就是不同的组，要查询的字段必须是 `group by`后面的字段
:::

- 应用:
查询每个年龄的人数

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glcqel8g6uj315m0ayn7u.jpg)

2.多个字段的顺序
以`age和name`两个字段分组，不同的排序又会是啥样子呢？
- age, name 顺序

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glcqrtcuicj314o0vsx29.jpg)

可以发现，如果是age在前面就主要以age来进行分组，然在此基础上再以name为基础再继续分组，如果是name在前面就主要以name来进行分组，然在此基础上再以age为基础再继续分组

## 模糊查询 Like
```sh
select * from 表名 where 字段 like 值(%, _, regexp);
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glcwe96vzlj310k0vo1kx.jpg)

- 如果%通配符放到结尾，开头是固定内容，那就是查找以这个内容开头的数据，如’大%’
- 如果%通配符放到开头，结尾是固定内容，那就是查找以这个内容结尾的数据，如’%叔’
- 如果通配符放到首尾，中间是固定内容，那么就是查找包含这个内容的数据，如’%chick%’
- `_`通配符表示一个字符，`%`表示0个或多个

模糊查询的效率非常低，因为它在匹配数据的时候是一行行往下找的，对于数据量大的项目，查找数据非常费时，所以一般情况下我们应该避免使用模糊查询，真正在做搜索的时候一般会自己建立索引，然后用程序来维护，或者直接使用搜索引擎，当然，mysql自己也可以在插入数据的时候创建索引(这个鄙人完全没有使用过)，所以本章内容只做了解，顺便贴出大神总结的mysql通配符的文章：[https://blog.csdn.net/win7system/article/details/53508401](https://blog.csdn.net/win7system/article/details/53508401)

## 联表查询 Join
现在创建两张表来为后面的了联接做准备
- 学生表
```sh
CREATE TABLE `student` (
     `id` INT NOT NULL AUTO_INCREMENT,
     `name` VARCHAR(8) NOT NULL,
     `age` INT(3) NOT NULL,
     `class_id` INT(3),
     PRIMARY KEY(`id`)
) ENGINE=InnoDB charset=utf8;

// 插入数据
INSERT INTO student (name, age, class_id) values ('喜羊羊', 10, 2), ('美羊羊', 9, 1), ('懒羊羊', 9, 3), ('沸羊羊', 11, 2), ('老村长', 33, 2), ('灰太狼', 10, 3), ('红太狼', 9, 1);
```
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glcx3btz5dj30py0fugpc.jpg)

- 班级表
```sh
CREATE TABLE `class` (
     `id` INT NOT NULL AUTO_INCREMENT,
     `name` VARCHAR(8) NOT NULL,
     PRIMARY KEY(`id`)
) ENGINE=InnoDB charset=utf8;

// 插入数据
INSERT INTO class (name) values ('仙女班'), ('汉子班'), ('娘炮班');
```
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glcx3ibf9zj30ni0d8770.jpg)

1. 左联接 LEFT JOIN
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1gld5kip3j5j31bo0f8atd.jpg)

左联查询的定义：首先取出表1（LEFT JOIN左边的表格）中所有数据和表2（LEFT JOIN右边的表格）中与表1所取数据相对应的所有数据，合成新的表格，没有数据则显示NULL。表1的数据为主，并显示在合成表格的左边。

2. 右联接 RIGHT JOIN
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glkcubfgx4j31by0ee161.jpg)

右联查询的定义：首先取出表1（RIGHT JOIN右边的表格）中所有数据和表2（RIGHT JOIN左边的表格）中与表1所取数据相对应的所有数据，合成新的表格，没有数据则显示NULL。表2的数据为主，并显示在合成表格的右边。

3. 内联 INNER JOIN
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glkcx34dm4j31c00eiarg.jpg)

内联理解起来比左右联更简单，就是把两个表中，class的id和student的class_id都存在并且两个相等的数据连接成一条数据。因此在数据库中有前面两种连接有部分为null的数据这一整行都没有了。


## 联表查询综合应用
现在创建一张老师的表，一个老师只能交一个班级
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glkt2avbddj30pw0eqq69.jpg)

如果要用联表查询查出每个学生所在的班级，还有老师，以及老师所教的课程
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glkt174kplj31bu0gk4fv.jpg)
这样联表的思路是，首先先用student表和class表联表，以联表之后的大表作为一张虚拟表，再用这张虚拟表和teacher表联表，最后查询出结果。
那么这样一来，和第三张表联表的方式可以是右联还可以是自联，甚至还可以是其它后面要学到的查询方式


## 自联
现在有一个这样的需求，假如有一张成绩表，里面是每个同学课程1的分数和课程2的分数，现在要查出课程2比课程1分数要高的学生

先创建一个分数表：
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glktc0w94bj30wu0dujug.jpg)

查询每个学生课程2分数高于课程1的学生：
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glkthdofyzj31c40aek3x.jpg)

这样就行啦。通过语句可以看出，其实这是一个内联，只不过是score表自己和自己联表，因此自联和左联右联不一样，所以单独开了一张出来没有和左联这几章一起写。自联其实是一种联表的用法，并不是一种联表方式，原理就是让一张表自己和自己联表，联表的方式可以是内联，也可以是左联右联。自联的用途也挺广泛的，除了文中这样，还有别的场景可以使用，比如有一个职工表，里面有姓名，职位，部门，还有上级id，如果是最高级，上级id是0，以及多级回复等等场景，都可以通过自联的方式获取想要的结果。

## 子查询
还是班级表，查询每个学生所在的班级，除了联表查询，也可以子查询：
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glktovfluwj31bw086104.jpg)

## 分页 LIMIT
```sh
select * from 表名 LIMIT 起始位置，查询条数;
```

![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glkttrpwkzj30uq08wjz2.jpg)
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glktty4bpnj30zk09on6l.jpg)

后面的依次类推。
可以看出，分页，主要是用了LIMIT关键字。这个关键字是这样的:LIMIT 开始位置,查询条数，
比如LIMIT 0,2说明是从第一条开始查询(下标都是由0开始)，查询两条，那么返回的结果就是第一条和第二条。我们可以吧这个看做是一页，那么下一页就是第三条和第四条了，那就是LIMIT 2,2。

LIMIT也可以和我们上述的其它语句一起结合使用，并且一定是放在最后面的，比如：
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glktwtyi53j313m0ikasa.jpg)
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glktyb5qjsj319o09awq7.jpg)

如果不把limit放在最后面就会报错：
![](https://ihengshuai-demo1.oss-cn-beijing.aliyuncs.com/005HV6Avgy1glktzcuxhxj31bq06ownx.jpg)
语法错误...

## 外键

待更新...


<Reward />
<Gitalk />