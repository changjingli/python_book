# 类的特殊方法和属性

在编写自己的类的方法的时候，有些属性或方法的名字是不能随便用的，因为 Python 已经预定义了一些有特殊含义的的名字，它们被称为魔法方法 (Magic Methods)和魔法属性。在 Python 中，魔法方法/属性也被称为特殊方法/属性或者双下划线方法/属性。它们以双下划线为前后缀，例如，之前介绍过的 `__init__` 方法，`__name_`、 `__doc__` 属性等。魔法方法/属性允许开发者自定义对象的内部行为，以实现一些内置的操作，如运算符重载、函数调用、属性访问等。

## 基本的魔法方法

我们通过一个简单的例子来了解这一些基本的魔法方法。假设我们要创建一个简单的 Point 类，表示二维平面上的一个点：

```python
class Point:
    # 初始化一个新创建的对象
    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y

    # 析构方法，当对象被销毁时调用
    def __del__(self):
        print(f"Point ({self.x}, {self.y}) is being deleted!")

    # 返回一个“正式”的表示，通常可以用它来重新创建这个对象
    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    # 返回一个“非正式”的表示，用于打印或日志
    def __str__(self):
        return f"({self.x}, {self.y})"
        
# 测试一下：
p = Point(1, 2)
print(p)             # 输出: (1, 2)
print(repr(p))       # 输出: Point(1, 2)
del p                # 输出: Point (1, 2) is being deleted!
```
        
在上面的程序中：
* 当一个新对象被创建后，`__init__` 方法就会立刻执行，用于初始化对象的状态。在这里，我们初始化了 x 和 y 两个属性。
* 当对象被销毁（例如，当它不再被引用时）时，`__del__` 方法会被调用。我们的例子中只是打印了一个简单的消息，但在实际的应用中，它可能会被用于释放资源，如关闭文件、断开网络连接等。
* repr（） 函数会调用 `__repr__` 方法。它返回一个字符串，表示Python表达式，重新创建这个对象时可以用这个表达式。在我们的例子中，repr(point) 将返回像 Point(1, 2) 这样的字符串。
* 当我们打印一个对象或将其转化为字符串时，`__str__` 方法会被调用。在我们的例子中，str(point)将返回(1, 2)。

## `__new__` 方法

`__new__` 是一个非常特殊的方法。它不是对象方法而是个类方法。在对象创建时它会比 `__init__` 更早地被调用。大部分时候，我们都是使用 `__init__` 来初始化对象状态。但在某些情况下，我们可能需要更多地控制对象的创建过程，这时 `__new__` 就派上了用场。`__new__` 方法负责创建（并返回）类的新实例。它是一个类方法，所以不需要实例化，但它必须返回一个实例。如果没有正确地返回一个实例，那么 `__init__` 就不会被调用。

以下是 `__new__` 的一些典型用法：

### 实现单例模式

单例模式（Singleton）意味着一个类只能创建一个实例。这时候，我们可以利用 `__new__` 检查是否已经存在一个实例。如果不存在，它会创建一个；如果存在，它就直接返回已存在的实例：

```python
class Singleton:
    _instance = None

    def __new__(cls):
        if not cls._instance:
            cls._instance = super(Singleton, cls).__new__(cls)
        return cls._instance

s1 = Singleton()
s2 = Singleton()

print(s1 == s2)  # 输出: True
```

### 扩展不可变对象

例如，我们想创建一个扩展的元组（tuple）类型，可以通过 `__new__` 来定制对象的创建过程。

```python
class ExtendedTuple(tuple):
    def __new__(cls, *args):
        new_args = (x*2 for x in args)
        return super(ExtendedTuple, cls).__new__(cls, new_args)

t = ExtendedTuple(1, 2, 3)
print(t)  # 输出: (2, 4, 6)
```

在上面的例子中，我们使用 `__new__` 为元组中的每个元素乘以 2，并传递新的参数给 tuple 的构造函数。


## 算术魔法方法

算术魔法方法用于重新定义对象的算术运算符行为。最常用的方法包括：

* `__add__(self, other)`: 定义加法行为。
* `__sub__(self, other)`: 定义减法行为。
* `__mul__(self, other)`: 定义乘法行为。
* `__truediv__(self, other)`: 定义实数除法行为（Python 3 中的 /）。
* `__floordiv__(self, other)`: 定义整数除法行为（Python 3 中的 //）。
* `__mod__(self, other)`: 定义模除法（取余）行为。
* `__pow__(self, power[, modulo])`: 定义乘方行为。


Python 内置有一个 Fraction 类，它用于表示数学上的分数。我们下面编写一个简化版的 Fraction 类，用它来演示算术魔法方法的实现与使用。Fraction 类有两个属性分别表示分子和分母。它的实现方法如下：

```python
from math import gcd

class Fraction:
    def __init__(self, numerator, denominator=1):
        if denominator == 0:
            raise ValueError("Denominator cannot be zero.")
        
        common = gcd(numerator, denominator)
        self.numerator = numerator // common
        self.denominator = denominator // common

    def __add__(self, other):
        new_numerator = self.numerator * other.denominator + other.numerator * self.denominator
        new_denominator = self.denominator * other.denominator
        return Fraction(new_numerator, new_denominator)

    def __sub__(self, other):
        new_numerator = self.numerator * other.denominator - other.numerator * self.denominator
        new_denominator = self.denominator * other.denominator
        return Fraction(new_numerator, new_denominator)

    def __mul__(self, other):
        new_numerator = self.numerator * other.numerator
        new_denominator = self.denominator * other.denominator
        return Fraction(new_numerator, new_denominator)

    def __truediv__(self, other):
        new_numerator = self.numerator * other.denominator
        new_denominator = self.denominator * other.numerator
        return Fraction(new_numerator, new_denominator)

    def __repr__(self):
        return f"{self.numerator}/{self.denominator}"

# 测试代码
f1 = Fraction(3, 4)
f2 = Fraction(5, 6)

print(f"{f1} + {f2} = {f1 + f2}")       # 输出: 3/4 + 5/6 = 19/12
print(f"{f1} - {f2} = {f1 - f2}")       # 输出: 3/4 - 5/6 = -1/12
print(f"{f1} * {f2} = {f1 * f2}")       # 输出: 3/4 * 5/6 = 5/8
print(f"{f1} / {f2} = {f1 / f2}")       # 输出: 3/4 / 5/6 = 9/10
```

## 比较魔法方法

顾名思义，比较魔法方法用于重新定义象之间的比较行为，常见的比较魔法方法包括：

* `__eq__(self, other)`: 定义等于的行为，使用 ==。
* `__ne__(self, other)`: 定义不等于的行为，使用 !=。
* `__lt__(self, other)`: 定义小于的行为，使用 <。
* `__le__(self, other)`: 定义小于或等于的行为，使用 <=。
* `__gt__(self, other)`: 定义大于的行为，使用 >。
* `__ge__(self, other)`: 定义大于或等于的行为，使用 >=。

我们可以继续使用简化的 Fraction 类，比较魔法方法，比较两个分数之间的大小。

```python
from math import gcd

class Fraction:
    def __init__(self, numerator, denominator=1):
        if denominator == 0:
            raise ValueError("Denominator cannot be zero.")
        
        common = gcd(numerator, denominator)
        self.numerator = numerator // common
        self.denominator = denominator // common

    def __eq__(self, other):
        return self.numerator == other.numerator and self.denominator == other.denominator

    def __lt__(self, other):
        # 两个分数a/b 和 c/d的比较，转化为a*d < c*b
        return self.numerator * other.denominator < other.numerator * self.denominator

    def __le__(self, other):
        return self.numerator * other.denominator <= other.numerator * self.denominator

    def __gt__(self, other):
        return self.numerator * other.denominator > other.numerator * self.denominator

    def __ge__(self, other):
        return self.numerator * other.denominator >= other.numerator * self.denominator

    def __repr__(self):
        return f"{self.numerator}/{self.denominator}"

# 测试
f1 = Fraction(1, 2)  # 1/2
f2 = Fraction(3, 4)  # 3/4

print(f1 == f2)  # False
print(f1 < f2)   # True
print(f1 <= f2)  # True
print(f1 > f2)   # False
print(f1 >= f2)  # False
```

## 类型转换魔法方法

类型转换魔法方法用于对象的数据类型转换， Python 内置类型转换函数会调用它们。常见的方法包括：

* `__int__(self)`: 使用 int(obj) 时调用。
* `__float__(self)`: 使用 float(obj) 时调用。
* `__bool__(self)`: 使用 bool(obj) 时调用。

我们仍然使用简化的 Fraction 类，用它演示类型转换方法，例如转换为整数、浮点数和布尔值。

```python
class Fraction:
    def __init__(self, numerator, denominator):
        if denominator == 0:
            raise ValueError("Denominator cannot be zero.")
        self.numerator = numerator
        self.denominator = denominator

    def __int__(self):
        # 转换为整数，实际上是分子除以分母的整数结果
        return self.numerator // self.denominator

    def __float__(self):
        # 转换为浮点数
        return self.numerator / self.denominator

    def __bool__(self):
        # 如果分数不为 0，那么为 True，否则为 False
        return self.numerator != 0

    def __str__(self):
        return f"{self.numerator}/{self.denominator}"

# 测试
f = Fraction(3, 4)

print(int(f))     # 0, 因为 3//4 = 0
print(float(f))   # 0.75, 因为 3/4 = 0.75
print(bool(f))    # True, 因为 3/4 = not 0

f_zero = Fraction(0, 1)
print(bool(f_zero))  # False, 因为分子是 0
```

## 容器魔法方法

容器魔法方法用于定义自定义那种类似于Python 容器（例如列表、字典）的对象。以下是一些常见的容器魔法方法：

* `__len__(self)`: 返回容器中的元素数。对应于内置函数 len()。
* `__getitem__(self, key)`: 用于访问容器中的元素。对应于 obj[key] 的行为。
* `__setitem__(self, key, value)`: 为容器中的某个元素分配值。对应于 obj[key] = value 的行为。
* `__delitem__(self, key)`: 删除容器中的某个元素。对应于 del obj[key] 的行为。
* `_contains__(self, item)`: 用于检查容器是否包含某个元素。对应于 item in obj 的行为。
* `__iter__(self)`: 返回容器的迭代器。对应于 iter(obj) 的行为。

假设我们要创建一个简单的排序序列类，该类的行为类似 Python 自带的列表的基本功能，独特之处在于它内部的数据总是按打下排序。为了简单起见，我们在其内部用普通列表来保存数据，虽然这样效率不高。

```python
class SortedList:
    def __init__(self, initial_data=[]):
        self.data = sorted(initial_data)

    def __len__(self):
        return len(self.data)

    def __getitem__(self, index):
        return self.data[index]

    def __setitem__(self, index, value):
        self.data[index] = value
        self.data.sort()

    def __delitem__(self, index):
        del self.data[index]

    def __contains__(self, value):
        return value in self.data

    def append(self, value):
        self.data.append(value)
        self.data.sort()

    def __iter__(self):
        return iter(self.data)

    def __repr__(self):
        return repr(self.data)

# 测试
lst = SortedList([3, 1, 2])
print(lst)           # [1, 2, 3]
lst.append(0)
print(lst)           # [0, 1, 2, 3]
lst[1] = 5           # 把第一个元素的值改为 5,之后，数据会重新排序
print(lst)           # [0, 2, 3, 5]
del lst[2]
print(lst)           # [0, 2, 5]
```


## 属性访问魔法方法:

属性访问魔法方法用于自定义属性的访问、设置、删除等行为。以下是一些常用的属性访问魔法方法：

* `__getattr__(self, name)`: 当尝试访问一个不存在的属性时调用此方法。
* `__setattr__(self, name, value)`: 设置一个属性的值时调用此方法。
* `__delattr__(self, name)`: 当尝试删除一个属性时调用此方法。
* `__getattribute__(self, name)`: 当尝试访问任何属性时都会调用此方法。

假设我们要创建一个类，该类在设置任何属性时都会存储历史记录，并且我们想要确保某些属性名称不能被设置。

```python
class HistoricalAttributes:
    def __init__(self):
        # 使用字典来存储属性历史记录
        self._history = {}
        self._forbidden_attributes = ["forbidden", "history"]

    def __setattr__(self, name, value):
        # 检查 _forbidden_attributes 是否已定义
        if hasattr(self, '_forbidden_attributes'):
            # 禁止设置某些属性
            if name in self._forbidden_attributes:
                raise AttributeError(f"'{name}' 是一个只读属性。")
            
            # 将属性值添加到历史记录中
            if name not in self._history:
                self._history[name] = []
            self._history[name].append(value)
        
        # 使用超类的__setattr__方法来实际设置属性
        super().__setattr__(name, value)

    def history_of(self, name):
        # 返回属性的历史记录
        return self._history.get(name, [])

# 测试
obj = HistoricalAttributes()
obj.x = 10
obj.x = 20
obj.y = 5
print(obj.history_of('x'))  # 输出：[10, 20]
print(obj.history_of('y'))  # 输出：[5]
# obj.forbidden = 99        # 抛出 AttributeError: 'forbidden' 是一个只读属性。
```


## 函数调用魔法方法

函数调用魔法方法是 `__call__`。这个方法允许对象的实例像函数一样被调用。当你尝试调用一个对象的实例（而不是类的方法或函数）时，Python 会自动调用该实例的 `__call__` 方法。这是一个特别的方法，它的存在可以让对象行为看起来像函数，这使得对象更加灵活和多变。

假设我们想创建一个类，它的对象可以被调用来计算多项式的值。例如，为输入的 x，计算 3x^2 + 4x + 10 的值。

```python
class Polynomial:
    def __init__(self, coefficients):
        """coefficients应该是一个列表，其中第i个元素是x^i的系数。"""
        self.coefficients = coefficients

    def __call__(self, x):
        """计算多项式的值给定x."""
        return sum([coef * (x ** (len(self.coefficients) - i - 1)) for i, coef in enumerate(self.coefficients)])

    def __repr__(self):
        return " + ".join([f"{coef}x^{(len(self.coefficients) - i - 1)}" for i, coef in enumerate(self.coefficients) if coef])

# 创建一个多项式对象：3x^2 + 4x + 10
p = Polynomial([3, 4, 10])

# 调用这个对象来计算 x=2 的值
print(p(2))  # 输出: 30

# 输出多项式本身
print(p)  # 输出: 3x^2 + 4x^1 + 10x^0
```

在上面的示例中，`__call__` 方法使得 Polynomial 类的实例可以被调用。我们只需使用一个数字作为参数（在上述例子中是2），就可以计算多项式在该点的值。

## 上下文管理魔法方法

当使用with语句时，上下文管理器可以保证资源，如文件、网络连接或数据库连接，被正确地获取和释放，无论在上下文中是否出现了异常。两个与此相关的方法分别是：

* `__enter__(self)`： 当执行with语句时被调用。这个方法的返回值被 with 语句的目标（或as子句中的变量）所使用。常用于初始化和返回需要管理的资源。
* `__exit__(self, exc_type, exc_value, traceback)`： 当 with 块的代码执行完毕（或在执行过程中抛出异常时）被调用。如果在 with 块中没有发生异常，exc_type、 exc_value 和 traceback 将会是 None。如果这个方法返回 True，表示压制 with 块中抛出的异常，否则异常会继续传播。

假设， 我们需要编写一个计时器类，这个计时器会在 with 块的代码执行时开始计时，并在代码执行完成后停止计时，然后打印出执行时间。


```python
import time

class Timer:
    def __enter__(self):
        self.start = time.time()
        return self  # 这里的 self 会被 with 语句的 as 子句所使用

    def __exit__(self, exc_type, exc_value, traceback):
        self.end = time.time()
        print(f"耗时: {self.end - self.start:.2f} 秒")
        return False  # 如果发生异常，不要压制它

# 使用示例
with Timer() as t:
    print(t)
    for _ in range(1000000):
        pass

# 输出类似于:耗时: 0.13 秒
```

## 常用的魔法属性

### `__dict__`

这是一个字典，包含了对象的所有属性。当创建一个对象时，Python 通常会为其创建一个字典来保存所有属性，这样可以在运行时动态地向对象添加新的属性。

```python
class MyClass:
    def __init__(self, x, y):
        self.x = x
        self.y = y

obj = MyClass(1, 2)
print(obj.__dict__)  # 输出：{'x': 1, 'y': 2}

obj.value = 3        # 为对象添加一个新属性
print(obj.__dict__)  # 输出：{'x': 1, 'y': 2, 'value': 3}
```

### `__slots__`

使用字典保存对象的属性虽然灵活，但字典有额外的内存开销。如果我们已经知道对象只需要固定的几个属性，那么使用 `__slots__` 可以避免这种字典开销，从而更有效地使用内存。定义 `__slots__` 的方法是在类中创建一个名为 `__slots__` 的属性，并将期望的属性名作为字符串保存在一个元组或列表中。

```python
class Fraction:
	__slots__ = ('numerator', 'denominator')
	
    def __init__(self, numerator, denominator=1):
        if denominator == 0:
            raise ValueError("Denominator cannot be zero.")
        
        common = gcd(numerator, denominator)
        self.numerator = numerator // common
        self.denominator = denominator // common

# 测试
f = Fraction(1, 2)  # 1/2

# 下面的代码会报错，因为 __slots__ 限制了只能有 'numerator' 和 'denominator' 这两个属性
# f.value = 3
```	
	
在上面的例子中，我们只能为 Fraction 的实例设置 numerator 和 denominator 这两个属性。尝试设置其他属性会抛出一个 AttributeError。
		

### `__doc__`

这个属性返回类的文档。

```python
class MyClass:
    """This is a docstring for MyClass."""
    pass

print(MyClass.__doc__)  # 输出：This is a docstring for MyClass.
```

### `__name__`

对于类，这返回类的名称。对于模块，返回模块的名称。

```python
print(MyClass.__name__)  # 输出：MyClass
```

### `__module__`

这个属性保存了定义这个类或函数的模块名。

```python
print(MyClass.__module__)  # 通常输出：__main__
```

### `__bases__`

这个属性是一个包含所有基类的元组。

```python
class Parent:
    pass

class Child(Parent):
    pass

print(Child.__bases__)  # 输出：(<class '__main__.Parent'>,)
```

### `__class__`

它返回对象所属的类。

```python
obj = MyClass()
print(obj.__class__)  # 输出：<class '__main__.MyClass'>
```