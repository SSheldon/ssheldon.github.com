---
layout: post
title: "Objective-C and Rust: Blocks"
---

start with link to spec

set up rust repr of a block

``` rust
#[repr(C)]
struct Block {
    isa: *const Class,
    flags: c_int,
    _reserved: c_int,
    invoke: unsafe extern fn(*mut Block, ...),
}
```

There's still a lot of useful information missing from this representation, though. For example, what's the return type of the block? We might not be able to represent that as part of the struct in C, but in Rust we have the power to add type parameters to a block. If we add one for the return type, our struct now looks like this:

``` rust
struct Block<R> {
    ...
    invoke: unsafe extern fn(*mut Block<R>, ...) -> R,
}
```

It's a good start, but the other important piece of information missing is the arguments the block takes. Representing this turns out to be a bit trickier; while a block can only return one value, it can take an arbitrary number of arguments, which means an arbitrary number of types, too! We can't just have a variable number of type parameters to our struct, though.

Let's look to Rust's [Fn](http://doc.rust-lang.org/std/ops/trait.Fn.html) trait for inspiration, the trait used to support the function call operator. Here, arguments are represented as a tuple so that any number of arguments can be passed (without requiring a variadic function) and all their types can be represented with a single type parameter.

``` rust
struct Block<A, R> {
   ...
}
```

Now, for example, a block that takes two `uints` and returns their sum would have the type `Block<(uint, uint), uint>`. Not the prettiest, but all of our type information is there now. We're ready for the next step: actually calling blocks in Rust.

The first question we have to answer is: does calling a block require a mutable reference or just an immutable reference? On one hand, blocks are free to mutate their environment, which would require a `&mut` reference in Rust. On the other, though, a `&mut` reference in Rust provides more guarantees than just a normal pointer in C; to have a `&mut` reference to a block, we must have the only reference to that block, which is a tough guarantee to make when even copying an Objective-C block will often just return an aliased reference to the same block! In the end, `&mut` is probably the safer choice; however, it'd be most convenient if we could ultimately implement one of the `Fn` operators for our block, but since this is part of the currently in-development unboxed closures feature, it turns out it's currently impossible to implement the `FnMut` trait. In light of this, we'll allowing calling blocks through an immutable reference for now to show off what the most pleasant syntax would look like.

Representing our arguments in Rust as tuples works great, but the C invoke function of the block doesn't take a tuple. Converting between the two representations is a bit tricky, but we can actually accomplish this by delegating the responsibility of calling the function to the arguments themselves. It might seem weird to make the arguments invoke the function, but it allows us to call the function differently based on how many arguments there are. Let's create a `BlockArguments` trait:

``` rust
trait BlockArguments {
    fn call_block<R>(self, block: &Block<Self, R>) -> R;
}
```

For example, the impl for a pair:

``` rust
impl<A, B> BlockArguments for (A, B) {
    fn call_block<R>(self, block: &Block<(A, B), R>) -> R {
        // Transmute the function to the correct signature
        let invoke: unsafe extern fn(*mut Block<(A, B), R>, A, B) -> R = unsafe {
            mem::transmute(block.invoke)
        };
        let block_ptr = block as *const _ as *mut _;
        // Call the invoke function with the individual args
        let (a, b) = self;
        unsafe {
            invoke(block_ptr, a, b)
        }
    }
}
```

And now we can use this to implement a `call` method on our `Block`.

``` rust
impl<A: BlockArguments, R> Block<A, R> {
    pub fn call(&self, args: A) -> R {
        args.call_block(self)
    }
}
```

call goes through immutable ref because of block copy

implement copy, too?

what about creating our own blocks?

we'll need a new struct for this (since we want to use our Block struct for representing blocks implemented in C, not implementing our own blocks)
borrow the name concrete block
the ideal would be if we can create a block from a rust closure
our struct would look like this:

``` rust
struct ConcreteBlock<F> {
    isa: *const Class,
    flags: c_int,
    _reserved: c_int,
    invoke: unsafe extern fn(*mut ConcreteBlock<F>, ...),
    // TODO: descriptor
    closure: F,
}
```

impl deref, like Vec<R> derefs to [T]
but wait, our Block requires the args and return type as part of its type, how do we know that?
turns out we don't need that since it's part of our closure's type:

``` rust
impl<A, R, F: Fn<A, R>> Deref<Block<A, R>> for ConcreteBlock<F> {
    fn deref(&self) -> &Block<A, R> {
        let ptr = self as *const _ as *const Block<A, R>;
        unsafe { &*ptr }
    }
}
```

great, but the tricky part here is: in order for this to all work, we need a C function that calls our block when it is called.
but the function will take some arbitrary number of arguments, not a tuple like the type of our closure uses. sounds a little familiar, maybe our BlockArguments trait can be useful again?

``` rust
unsafe extern fn concrete_block_invoke_args2<A, B, R, F: Fn<(A, B), R>>(
        block: *mut ConcreteBlock<F>, a: A, b: B) -> R {
    ((&*block).closure)(a, b)
}
```

``` rust
trait BlockArguments {
    ...

    fn invoke_for_concrete_block<R, F: Fn<Self, R>>() ->
            unsafe extern fn(*mut ConcreteBlock<F>, ...) -> R;
}
```

``` rust
impl<A, B> BlockArguments for (A, B) {
    ...

    fn invoke_for_concrete_block<R, F: Fn<(A, B), R>>() ->
            unsafe extern fn(*mut ConcreteBlock<F>, ...) -> R {
        unsafe {
            mem::transmute(concrete_block_invoke_args2::<A, B, R, F>)
        }
    }
}
```

``` rust
#[link(name = "Foundation", kind = "framework")]
extern {
    static _NSConcreteStackBlock: Class;
}


impl<A: BlockArguments, R, F: Fn<A, R>> ConcreteBlock<F> {
    fn new(closure: F) -> ConcreteBlock<F> {
        ConcreteBlock {
            isa: &_NSConcreteStackBlock,
            flags: 0,
            _reserved: 0,
            invoke: BlockArguments::invoke_for_concrete_block::<R, F>(),
            closure: closure,
        }
    }
}
```

we need to be able to move this block to the heap
since objc doesn't support generics like this, it'll only take our block by pointer

the runtime does this through the copy method that all blocks support.
unfortunately: objc doesn't support "moving", so you can copy the same stack block to the heap multiple times.
this doesn't jive with how we'd think of this in rust, where boxing an object
moves it and the original is no longer usable.
if we want to implement this functionality in the way that's technically correct for the objc runtime, we'd have to clone our closure to heap since we can't move it. this is a big pain, though, because closure's don't seem to implement clone automatically and it's inefficient to clone all of its state if we won't be using the stack block again.

so let's implement copy to move instead of clone, and warn that if you're interacting with C that may copy you block pointer multiple times, you should copy it to the heap before passing it.

copying our block onto the heap for the objc runtime to manage means its drop won't be run by the rust compiler anymore. fortunately, we can specify custom behavior to run via a handler function. there are two, copy and dispose

``` rust
unsafe extern fn block_context_dispose<B>(block: &mut B) {
    // Read the block onto the stack and let it drop
    ptr::read(block);
}

unsafe extern fn block_context_copy<B>(_dst: &mut B, _src: &B) {
    // The runtime memmoves the src block into the dst block, nothing to do
}
```

``` rust
#[repr(C)]
struct BlockDescriptor<B> {
    _reserved: c_ulong,
    block_size: c_ulong,
    copy_helper: unsafe extern fn(&mut B, &B),
    dispose_helper: unsafe extern fn(&mut B),
}

impl<B> BlockDescriptor<B> {
    fn new() -> BlockDescriptor<B> {
        BlockDescriptor {
            _reserved: 0,
            block_size: mem::size_of::<B>() as c_ulong,
            copy_helper: block_context_copy::<B>,
            dispose_helper: block_context_dispose::<B>,
        }
    }
}
```

``` rust
impl<A, R, F: Fn<A, R>> ConcreteBlock<F> {
    pub fn copy(self) -> Id<Block<A, R>> {
        unsafe {
            let block = msg_send![&*self copy] as *mut Block<A, R>;
            // At this point, our copy helper has been run so the block will
            // be moved to the heap and we can forget the original block
            // because the heap block will drop in our dispose helper.
            mem::forget(self);
            Id::from_retained_ptr(block)
        }
    }
}
```

---------------------------

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
