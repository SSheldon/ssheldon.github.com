---
layout: post
title: "Interoperating Between Objective-C and Rust"
---

Rust can interoperate with objc via the objc runtime
how to build a safe rust interface for this?

# Calling Objective-C methods

start with calling a method:
const char *c_string = [string UTF8String];

translates to:
SEL selector = sel_registerName("UTF8String");
const char *c_string = objc_msgSend(string, selector);

we can do this in rust:
let selector = "UTF8String".with_c_str(|name| unsafe {
    sel_registerName(name)
});
let c_string = unsafe {
    objc_msgSend(string, selector) as *const c_char
};

No problem, but we can make it better with a macro:
let c_string = unsafe { msg_send![string UTF8String] as *const c_char };

# Representing Objective-C objects

Now what type is string?
Well, let's just try to mimic the objc:
NSString *string;
let string: *const NSString;

declare an NSString struct:
struct NSString;

Now we can give a type to our string pointer, but there's a problem with this. This struct allows users to construct NSStrings on the stack, and ObjC objects only live on the heap!
let string_on_stack = NSString;
let c_string = unsafe {
    msg_send![&string_on_stack UTF8String] as *const c_char
};

All right, we can make it a phantom type:
enum NSString { }

But this still has a problem; if a user has a reference to this NSString, they can still dereference it in safe code:
let string: &NSString;
let string_on_stack = *string;

This happens because the rust compiler sees that our enum has no fields that can't be copied, and therefore infers that our enum is copyable as well. To solve this, we must use the NoCopy marker:
struct NSString {
    nocopy: NoCopy,
}

We can actually use a struct again now, because with a private field users will not be able to construct an NSString themselves on the stack.
We just must never return an NSString by value (only pointers or references to one) and there is no way in safe code for users to get a stack allocated NSString.

Note: not a perfect solution; it'd be best if we could mark this struct as unsized. Still allows code like this:
let a: &mut NSString;
let b: &mut NSString;
mem::swap(a, b); // Doesn't actually do anything

Aside: has to be ref; if each thing you get from a collection is owned, you can't prevent mutating it simultaneously

# Implementing a safe Rust interface

Now that we've got a struct for representing our NSString, we can implement some methods on it. For example, we can wrap the UTF8String method with idiomatic Rust types:

impl NSString {
    fn as_str(&self) -> &str {
        unsafe {
            let c_string = msg_send![self UTF8String] as *const c_char;
            c_str_to_static_slice(c_string)
        }
    }
}

Here we also see one of the challenges of wrapping objc with a safe interface. The pointer returned by UTF8String doesn't need to be freed, so it's probably an internal pointer. The docs say it isn't valid forever, but don't specify precisely how long. We've assumed that as long as the string isn't mutated, the internal pointer is still valid, but since Foundation is closed source there isn't really a way for us to verify this.

What happens when we're implementing NSMutableString? Since NSMutableString inherits from NSString, it'd also have this method. But Rust structs don't allow inheritance. Instead of just duplicating the method, one thing we can do is implement it in a trait:

trait INSString {
    fn as_str(&self) -> &str {
        unsafe {
            let c_string = msg_send![self UTF8String] as *const c_char;
            c_str_to_static_slice(c_string)
        }
    }
}

impl INSString for NSString { }

Now when we just implement INSString for NSMutableString it'll get this functionality, too. This is also useful because we can make methods generic for any type that implements the INSString trait to accept either an NSString or an NSMutableString.

There is a drawback to this, though: users could implement this trait for any type inappropriately. Since it doesn't require any other method implemented, I could, in safe code, just implement the INSString trait for an int and then have undefined behavior by calling those methods on an int. I don't know of a way to prevent this without losing the convenience.

# Objective-C memory management

So great, at this point we can call methods from an NSString reference, but where does this reference come from? What's its lifetime?

Our Objective-C objects must be retained while we're using them and released when we're done with them, so this is a great fit for creating a custom smart pointer in rust:

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

Now we can use this to create safe wrappers over an object's initializers:

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

This finally allows us to work with an NSString with no more unsafe blocks:

let string = NSString::new();
println!("{}", string.as_str());

What if we have an object we want to mutate? We can implement DerefMut for Id, but sometimes we could have an object that we want to retain but that is shared, so it isn't safe to mutate. Similarly, we can implement Clone for Id by retaining the pointer and creating another Id, but if we allow you to mutably dereference the clone, we'd end up with aliasing mut references.

The way I chose to resolve this was by adding a phantom type param to Id, which is either Owned or Shared. Then, we can implement Clone for a Shared Id, and we can implement DerefMut for an Owned Id. This ensures that we won't have aliasing mut references. We can also allow an Owned Id to be "downgraded" to a Shared Id and then cloned.

Thinking about Objective-C in terms of Rust's memory semantics leads to some interesting questions, and these phantom types will be used again. For example, unlike a Vec in Rust, an NSArray can be copied without copying all of its elements. From this, we come to realize that an NSArray can have elements that are either shared or owned, and only an array of shared items can be copied; otherwise we'd end up with two arrays that think they own the items and could have aliasing mut references.

--- other neat things ---

adding generics to objc?
weak refs
declaring classes
idiomatic nsenumerator

