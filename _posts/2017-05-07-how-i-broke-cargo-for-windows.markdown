---
layout: post
title: How I Broke Rust's Package Manager for All Windows Users
date: 2017-05-07T10:07:40-07:00
---

Last weekend I was playing around with a way to represent null-terminated UTF8
strings in Rust. Rather than just toying with it forever,
I decided to clean up a minimal version and publish it to crates.io. Creating
the crate went smoothly, exactly the same as the 11 prior crates I've published.
I closed up my laptop and called it a day.

Well, everything only seemed the same until an hour later when I got this tweet:

<!-- more -->

{% tweet 858784809413472257 %}

## The impact

The crate I had just published was named `nul`, after
[the null terminator character](https://en.wikipedia.org/wiki/Null_character)
which is abbreviated as `NUL`.
I hopped onto Rust's IRC channel to figure out what I had done, and
[the friendly Rust devs informed me](https://botbot.me/mozilla/rust-internals/msg/84953638/)
that they were going to delete `nul` from crates.io.

While trying to catch up at this point, I saw that there was an
[issue filed on my repo](https://github.com/SSheldon/nul/issues/1).
And an [issue filed on cargo](https://github.com/rust-lang/cargo/issues/3982).
And a [reddit thread](https://www.reddit.com/r/rust/comments/68hemz/i_think_a_crate_called_nul_is_causing_errors_for/).
Whoops.

Whenever any users on Windows attempted to download new crates or update
their dependencies, they were greeted with this error:

```
Updating registry https://github.com/rust-lang/crates.io-index
error: [20/-1] Cannot checkout to invalid path '3/n/nul'
```

As [kmc described](https://botbot.me/mozilla/rust/msg/84953614/)
the status of cargo on Windows:

![](/blog/images/how-i-broke-cargo-for-windows/on-fire.jpeg)

## But why?

Turns out that "NUL" (including "nul") is a reserved filename on Windows.
`NUL` is the Windows equivalent of Unix's `/dev/null`, but instead of existing
at a specific directory you can write to `NUL` in any directory,
and even with any extension!

That might sound surprising, but
[Raymond Chen has an illuminating explanation](https://blogs.msdn.microsoft.com/oldnewthing/20031022-00/?p=42073):

> Because DOS 1.0 didn't have subdirectories.
> There was only one directory, which today we would call the root directory...

And so, since these DOS 1.0 days, tons of batch files exist on Windows
redirecting with `>NUL`, and the reserved filenames remain.

## The aftermath

Once my `nul` crate was deleted, Windows users were back in business.
The Rust team quickly moved to prevent this issue from happening again by
[adding "NUL" and Windows' 21 other reserved filenames to the list of reserved crate names](https://github.com/rust-lang/crates.io/pull/695).
Guess I won't get to publish that `aux` crate now 😉

Apologies to Carol Nichols and any other Rust devs whose weekends I interrupted,
thanks for your quick action!

Although, I mean, like withoutboats said:

{% tweet 858791127750557696 %}
