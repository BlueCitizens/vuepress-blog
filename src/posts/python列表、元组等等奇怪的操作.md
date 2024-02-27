---
icon: pen-to-square
date: 2022-09-09
category:
  - 开发
tag:
  - Python
---

# Python列表、元组等等奇怪的操作

## numpy.arange中的步长为小数的问题
```py
np.arange(0.95, 0.1, -0.05)
```
步长不为整数时有很微妙的数值溢出问题

```python
np.arange(0.95, 0.1, -0.05).round(2)
```
为了结果好看，取一下合适的精确度吧

[python np.arange 步长0.1的问题需要注意](https://blog.csdn.net/h_372101/article/details/116001183)

## 数组连接

```python
# [1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
epsilon = [1] * 9 + [0] * 1
```

## 下标越界（负索引）
```py
profit = [0, 1]
# 下标取-1不越界，倒过来从后往前取到最后一个数1。下标取-2得到再前一个数0。
print(profit[-1])
print(profit[-2])

# 但是-3就越界了，会报out of range。正过来越界会直接报错，比如下标取2不会反过来找到第一个
```

## 列表范围索引
```py
# 前闭后开
profit[1:2]
# 可以缺省
profit[:2]
profit[1:]
# 可以负索引
# 正索引越界不会报错，相当于缺省
```