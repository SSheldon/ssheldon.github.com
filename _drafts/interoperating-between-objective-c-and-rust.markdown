---
layout: post
title: "Interoperating Between Objective-C and Rust"
---

Rust can interoperate with objc via the objc runtime
how to build a safe rust interface for this?

# Calling Objective-C methods

If we want to interoperate with Objective-C from rust, one of the first things
we'll need to be able to do is call methods on Objective-C object.
For example, let's consider this example where we have an `NSString` pointer
`string`:

``` objc
const char *c_string = [string UTF8String];
```

Since the Objective-C runtime actually has a C interface, we can invoke methods
in C using the [`objc_msgSend`](https://developer.apple.com/library/mac/documentation/Cocoa/Reference/ObjCRuntimeRef/index.html#//apple_ref/c/func/objc_msgSend)
function. Our previous Objective-C code is equivalent to this C:

``` c
SEL selector = sel_registerName("UTF8String");
const char *c_string = (const char *)objc_msgSend(string, selector);
```

Now that we see the C code, the translation into Rust is pretty straightforward
using Rust's [Foreign Function Interface](http://doc.rust-lang.org/guide-ffi.html).
Once we've set up an interface for the functions of the Objective-C runtime,
we can write:

``` rust
let selector = "UTF8String".with_c_str(|name| unsafe {
    sel_registerName(name)
});
let c_string = unsafe {
    objc_msgSend(string, selector) as *const c_char
};
```

Nice! But this is Rust, we can make this better with
[Rust's powerful macros](http://doc.rust-lang.org/guide-macros.html).
We can even support methods with arguments using a macro like this:

``` rust
macro_rules! msg_send(
    ($obj:expr $($name:ident : $arg:expr)+) => ({
        let sel_name = concat!($(stringify!($name), ':'),+);
        let sel = sel_name.with_c_str(|name| {
            sel_registerName(name)
        });
        objc_msgSend($obj, sel $(,$arg)+)
    });
)
```

By adding a special case to our macro for the no-argument case, we can rewrite
our example as:

``` rust
let c_string = unsafe {
    msg_send![string UTF8String] as *const c_char
};
```

And so we have a convenient way to call Objective-C methods with a syntax that
feels comfortable for Objective-C developers.

# Representing Objective-C objects

In our previous examples, we've been working with a variable named `string`,
but what is the type of this variable? Well, in Objective-C it'd be declared
like this:

``` objc
NSString *string;
```

The identical declaration in Rust would look like this:

``` rust
let string: *const NSString;
```

Okay, so we'll need some sort of `NSString` type in Rust.
Since we don't actually know or care about the memory layout of the `NSString`,
we could declare it simply as a unit struct:

``` rust
struct NSString;
```

There's a problem with this, though: it allows user to construct an `NSString`
on the stack, and Objective-C objects only live on the heap!

``` rust
let string_on_stack = NSString;
let c_string = unsafe {
    msg_send![&string_on_stack UTF8String] as *const c_char // Oops!
};
```

We don't actually want users to be able to construct our `NSString`, we'll just
be giving them pointers and references to one. To avoid this, we could use a
phantom type:

``` rust
enum NSString { }
```

By using an enum with no variants, `NSString` will be a valid type but there is
no way for users to instantiate an instance of one.

Unfortunately, this still has a problem; if a user has a reference to this
`NSString`, they can still dereference it in safe code:

``` rust
let string: &NSString;
let string_on_stack = *string;
```

This happens because the rust compiler sees that our enum has no fields that
can't be copied, and therefore infers that our enum is copyable as well.
To solve this, we must use the
[`NoCopy`](http://doc.rust-lang.org/std/kinds/marker/struct.NoCopy.html) marker:

``` rust
struct NSString {
    nocopy: NoCopy,
}
```

This also lets us use a struct again; now that it has a private field, users
cannot construct an `NSString` themselves. As long as we don't construct an
`NSString` on the stack in our module, there will be no way in safe code for
users to end up with a stack-allocated `NSString`.

This isn't a perfect solution, because even if there's no way to get a
stack-allocated `NSString`, the compiler will stil accept definitions like:

``` rust
let string: NSString;
let vector: Vec<NSString>;
```

Additionally, the following code will compile and run without doing anything:

``` rust
let a: &mut NSString;
let b: &mut NSString;
mem::swap(a, b); // Doesn't actually do anything
```

Ideally, we would opt out of the
[`Sized`](http://doc.rust-lang.org/std/kinds/trait.Sized.html) trait so that
the compiler would disallow these types as local variables, but unfortunately
it doesn't seem possible to have an unsized type without all references to it
becoming "fat" two-word references.

## Why not just wrap the pointer?

If an NSString can never exist on the stack, why don't we just prevent that
by making a struct that wraps a pointer?

``` rust
struct NSString {
    ptr: *mut c_void,
}
```

Let's consider the case of an NSArray of NSStrings.
If we want to get a string from the array, our NSArray can't return references
to this NSString struct:

``` rust
fn object_at(array: &NSArray, index: uint) -> &NSString {
    let string_ptr = unsafe {
        msg_send![array objectAtIndex:index]
    };
    let string = NSString { ptr: string_ptr };
    &string // Oops! string doesn't live past this method
}
```

Instead, we'd have to return this NSString struct by value, and then it's not
tied to the lifetime of our array at all.
This would allow us to get multiple copies of an NSString from our array and
try to mutate them simultaneously, which would cause a race condition.
To fix this we'd need to add a lifetime parameter to indicate that the string
is only valid as long as the array is mutably borrowed.
Not all strings should have this lifetime parameter, though, so we'd actually
end up needing 3 different NSString representations:
an owned string (`NSString`),
one representing an immutable borrow (`NSStringRef<'a>`),
and one representing a mutable borrow (`NSStringRefMut<'a>`).
This results in an interface that looks odd to both Rust and Objective-C
developers.

I felt that, despite the imperfections of representing Objective-C objects as
structs in Rust, it makes for a much more usable API.

# Implementing a safe Rust interface

Now that we've got a struct for representing our NSString, we can implement some methods on it. For example, we can wrap the UTF8String method with idiomatic Rust types:

``` rust
impl NSString {
    fn as_str(&self) -> &str {
        unsafe {
            let c_string = msg_send![self UTF8String] as *const c_char;
            c_str_to_static_slice(c_string)
        }
    }
}
```

Here we also see one of the challenges of wrapping objc with a safe interface. The pointer returned by UTF8String doesn't need to be freed, so it's probably an internal pointer. The docs say it isn't valid forever, but don't specify precisely how long. We've assumed that as long as the string isn't mutated, the internal pointer is still valid, but since Foundation is closed source there isn't really a way for us to verify this.

What happens when we're implementing NSMutableString? Since NSMutableString inherits from NSString, it'd also have this method. But Rust structs don't allow inheritance. Instead of just duplicating the method, one thing we can do is implement it in a trait:

``` rust
trait INSString {
    fn as_str(&self) -> &str {
        unsafe {
            let c_string = msg_send![self UTF8String] as *const c_char;
            c_str_to_static_slice(c_string)
        }
    }
}

impl INSString for NSString { }
```

Now when we just implement INSString for NSMutableString it'll get this functionality, too. This is also useful because we can make methods generic for any type that implements the INSString trait to accept either an NSString or an NSMutableString.

There is a drawback to this, though: users could implement this trait for any type inappropriately. Since it doesn't require any other method implemented, I could, in safe code, just implement the INSString trait for an int and then have undefined behavior by calling those methods on an int. I don't know of a way to prevent this without losing the convenience.

# Objective-C memory management

So great, at this point we can call methods from an NSString reference, but where does this reference come from? What's its lifetime?

Our Objective-C objects must be retained while we're using them and released when we're done with them, so this is a great fit for creating a custom smart pointer in rust:

``` rust
struct Id<T> {
    ptr: *mut T,
}

impl<T> Drop for Id<T> {
    fn drop(&mut self) {
        unsafe { msg_send![ptr release]; }
    }
}

impl<T> Deref<T> for Id<T> {
    fn deref(&self) -> &T {
        unsafe { &*self.ptr }
    }
}
```

Now we can use this to create safe wrappers over an object's initializers:

``` rust
impl NSString {
    fn new() -> Id<NSString> {
        unsafe {
            let cls = "NSString".with_c_str(|name| {
                objc_getClass(name)
            });
            let obj = msg_send![class alloc];
            let obj = msg_send![obj init];
            Id { ptr: obj }
        }
    }
}
```

This finally allows us to work with an NSString with no more unsafe blocks:

``` rust
let string = NSString::new();
println!("{}", string.as_str());
```

What if we have an object we want to mutate? We can implement DerefMut for Id, but sometimes we could have an object that we want to retain but that is shared, so it isn't safe to mutate. Similarly, we can implement Clone for Id by retaining the pointer and creating another Id, but if we allow you to mutably dereference the clone, we'd end up with aliasing mut references.

The way I chose to resolve this was by adding a phantom type param to Id, which is either Owned or Shared. Then, we can implement Clone for a Shared Id, and we can implement DerefMut for an Owned Id. This ensures that we won't have aliasing mut references. We can also allow an Owned Id to be "downgraded" to a Shared Id and then cloned.

Thinking about Objective-C in terms of Rust's memory semantics leads to some interesting questions, and these phantom types will be used again. For example, unlike a Vec in Rust, an NSArray can be copied without copying all of its elements. From this, we come to realize that an NSArray can have elements that are either shared or owned, and only an array of shared items can be copied; otherwise we'd end up with two arrays that think they own the items and could have aliasing mut references.

--- other neat things ---

adding generics to objc?
weak refs
declaring classes
idiomatic nsenumerator

