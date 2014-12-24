---
layout: post
title: "Objective-C and Rust: Blocks"
---

start with link to spec

set up rust repr of a block

``` rust
#[repr(C)]
pub struct Block {
    isa: *const Class,
    flags: c_int,
    _reserved: c_int,
    invoke: unsafe extern fn(*mut Block, ...),
}
```

There's still a lot of useful information missing from this representation, though. For example, what's the return type of the block? We might not be able to represent that as part of the struct in C, but in Rust we have the power to add type parameters to a block. If we add one for the return type, our struct now looks like this:

``` rust
pub struct Block<R> {
    ...
    invoke: unsafe extern fn(*mut Block<R>, ...) -> R,
}
```

It's a good start, but the other important piece of information missing is the arguments the block takes. Representing this turns out to be a bit trickier; while a block can only return one value, it can take an arbitrary number of arguments, which means an arbitrary number of types, too! We can't just have a variable number of type parameters to our struct, though.

Let's look to Rust's [Fn](http://doc.rust-lang.org/std/ops/trait.Fn.html) trait for inspiration, the trait used to support the function call operator. Here, arguments are represented as a tuple so that any number of arguments can be passed (without requiring a variadic function) and all their types can be represented with a single type parameter.

Representing our arguments in Rust as tuples works great, but the C invoke function of the block doesn't take a tuple. Converting between the two representations is a bit tricky, but we can actually accomplish this by delegating the responsibility of calling the function to the arguments themselves. It might seem weird to make the arguments invoke the function, but it allows us to call the function differently based on how many arguments there are. Let's create a `BlockArguments` trait:

``` rust
```

we can do better, parameter for return type

how about arguments?
can't have an arbitrary number of params, but what if we copy the fn trait and use a tuple?

uh oh, how do we pass the tuples into the function? BlockArguments trait

now we can implement a call method safely
call goes through immutable ref because of block copy

implement copy, too?

what about creating our own blocks?
of course, the interesting thing about a block is that it can also capture some environment

with rust's generics, we can add a context param
although it's only one field, it can be a struct or tuple containing everything we need from the environment

There is a constraint on our block's context, though: all Objective-C blocks support a copy operation to copy a block from the stack to a heap. Our context therefore must implement `Clone` so that we can copy it from the stack to the heap. This is implemented by providing a copy helper function for our block that the Objective-C runtime will call after allocating a new block on the heap.

how do we make sure this is cleaned up?
if our block stays on the stack, no problem, rust will drop the context for us when the block is dropped.
fortunately, for blocks on the heap we can specify a dispose helper that runs before the block is deallocated

maybe talk about descriptor?

how about the implementation for the block
it needs to be an extern function, but it's hard to represent the parameters safely
ideally the user could just supply a rust function, but the extern function obviously won't be called with a tuple
we can actually use our BlockArguments trait here again to return an extern function that converts arguments into a rust tuple

check out the whole (still evolving) implementation here: link
