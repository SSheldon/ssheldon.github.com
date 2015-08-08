---
layout: post
title: "Objective-C from Rust: objc_msgSend"
date: 2015-08-02T23:53:50-07:00
updated: 2015-08-04T19:22:16-07:00
---

I previously wrote about how to [interoperate between Objective-C and Rust](
{% post_url 2014-11-28-interoperating-between-objective-c-and-rust %})
and use a Rust macro to pass a variable number of arguments to `objc_msgSend`.
Well, there's a problem with this: `objc_msgSend` isn't a variadic function!

<!-- more -->

`objc_msgSend` is actually a "trampoline" that works by jumping directly to
the implementation of the method, not calling it and passing parameters.
Safely calling it requires first casting it to the type of the underlying
method implementation, like:

``` objc
// id result = [obj description];
id result = ((id (*)(id, SEL))objc_msgSend)(obj, @selector(description));
```

If you try to call `objc_msgSend` as if it were a variadic function,
[weird things can happen](https://github.com/servo/cocoa-rs/pull/74#issuecomment-75492331)!

## Handling arguments

How can we handle `objc_msgSend` in Rust? Let's try to write a
wrapper function that calls it correctly.
It's easy to see how we could do this for, say, two arguments:

``` rust
unsafe fn msg_send<A, B, R>(obj: *mut Object, op: Sel, arg1: A, arg2: B) -> R {
    // Transmute objc_msgSend to the type of the method implementation
    let msg_send_fn: unsafe extern fn(*mut Object, Sel, A, B) -> R =
        mem::transmute(objc_msgSend);
    msg_send_fn(obj, op, arg1, arg2)
}
```

But our function needs to be able to accept one argument, or no arguments,
or more than 2. This sounds a lot like function overloading, which Rust
doesn't support. However, there's a pattern that can emulate function
overloading in Rust: functions with a generic parameter. In our case,
our function could take a generic parameter that is the arguments,
represented as a tuple:

``` rust
unsafe fn msg_send<T, R>(obj: *mut Object, op: Sel, args: T) -> R { ... }
```

How do we implement this now?
Well, it was easy to implement for a fixed number of arguments,
so we can let the arguments themselves handle calling `objc_msgSend`.
Let's add a `MessageArguments` trait and implement it for tuples:

``` rust
impl<A, B> MessageArguments for (A, B) {
    unsafe fn send<R>(self, obj: *mut Object, op: Sel) -> R {
        // Transmute objc_msgSend to the type of the method implementation
        let msg_send_fn: unsafe extern fn(*mut Object, Sel, A, B) -> R =
            mem::transmute(objc_msgSend);
        let (arg1, arg2) = self;
        msg_send_fn(obj, op, arg1, arg2)
    }
}
```

[Using a macro](https://github.com/SSheldon/rust-objc/blob/2bc409b/src/message.rs#L134-L175),
we can easily implement this trait for tuples from size 0 to some upper bound.
Our function simply becomes:

``` rust
unsafe fn msg_send<T, R>(obj: *mut Object, op: Sel, args: T) -> R
        where T: MessageArguments {
    args.send(obj, op)
}
```

And now we're no longer pretending that `objc_msgSend` is variadic!

## Return types

There's one other caveat with `objc_msgSend`, though:
different versions of it are used for different return types.
Which version is used depends on the calling conventions of the architecture.

Let's encapsulate this with a simple function that returns the correct
version of `objc_msgSend` for the return type:

``` rust
fn msg_send_fn<R>() -> unsafe extern fn(*mut Object, Sel, ...) -> R { ... }
```

We can implement this for different architectures with a
[`cfg` attribute](https://doc.rust-lang.org/stable/reference.html#conditional-compilation).
x86's calling conventions are [arguably the most complicated](
https://developer.apple.com/library/mac/documentation/DeveloperTools/Conceptual/LowLevelABI/130-IA-32_Function_Calling_Conventions/IA32.html),
so for it this function would look like:

``` rust
#[cfg(target_arch = "x86")]
fn msg_send_fn<R: Any>() -> unsafe extern fn(*mut Object, Sel, ...) -> R {
    use std::any::TypeId;

    let type_id = TypeId::of::<R>();
    let size = mem::size_of::<R>();
    if type_id == TypeId::of::<f32>() || type_id == TypeId::of::<f64>() {
        unsafe { mem::transmute(objc_msgSend_fpret) }
    } else if size == 0 || size == 1 || size == 2 || size == 4 || size == 8 {
        unsafe { mem::transmute(objc_msgSend) }
    } else {
        unsafe { mem::transmute(objc_msgSend_stret) }
    }
}
```

With this `msg_send_fn` function [defined for each architecture](
https://github.com/SSheldon/rust-objc/blob/2bc409b/src/message.rs#L14-L112),
we can use it to get the correct version of `objc_msgSend` for
our return type.

At this point we're invisibly handling `objc_msgSend` correctly for any
combination of argument types and any return type. We can further
[wrap it with a macro](https://github.com/SSheldon/rust-objc/blob/2bc409b/src/macros.rs#L58-L83)
to make it more ergonomic; in the end, calling Objective-C methods is nearly
as easy from Rust as it is in Objective-C!
