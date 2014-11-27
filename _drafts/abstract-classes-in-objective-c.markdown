---
layout: post
title: "Abstract Classes in Objective-C"
---

Objective C doesn't have abstract classes, but people try to do them anyways.

http://stackoverflow.com/questions/1034373/creating-an-abstract-class-in-objective-c

http://xcodeit.net/blog/abstract-classes-and-objective-c.html

BaseFoo.m

``` objc
- (instancetype)init {
  self = [super init];
  if (self) {
    NSAssert(![self isMemberOfClass[BaseFoo class]],
             @"BaseFoo is abstract");
  }
  return self;
}

- (void)doFoo {
  // Abstract method
  [self doesNotRecognizeSelector:_cmd];
}
```

There's a big disadvantage with this approach, though: there's no compiler checking that the method has been implemented. If a subclass fails to implement the method, you'll have no idea unless a developer hits the relevant code path in testing.

In Objective-C a better way to declare methods that must be implemented is to use a protocol. Let's instead declare this method in a protocol.

BaseFoo.h

``` objc
@protocol Foo <NSObject>
- (void)doFoo;
@end

@interface BaseFoo : NSObject
@end
```

Note that our abstract class does not confrom to the protocol! Instead, our subclasses must conform to it. This way we will be warned if a subclass does not implement an abstract method.

Subclasses now look like this:

MyFoo.h

``` objc
@interface MyFoo : BaseFoo <Foo>
@end
```

To ensure that our subclasses conform to the protocol, we can check on init.

BaseFoo.m

``` objc
- (instancetype)init {
  self = [super init];
  if (self) {
    NSAssert(![self isMemberOfClass[BaseFoo class]] &&
             [self conformsToProtocol:@protocol(Foo)],
             @"BaseFoo is abstract");
  }
  return self;
}
```

This still requires runtime checking, but you'll catch the error as soon as the object is initialized. This also means you won't miss a method.

One thing is still missing, though: we cannot call our abstract methods from our abstract class. We can a

BaseFoo.m

``` objc
@interface BaseFoo (Abstract) <Foo>
@end
```
