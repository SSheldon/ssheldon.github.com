---
layout: post
title: Designing my own keyboard alpha layout for comfy inrolls
date: 2025-12-28T22:00:00-08:00
updated: 2025-12-29T11:10:00-08:00
---

Last year, the discomfort in my arms after using the computer got too bad to
continue ignoring, and I ordered my first ergonomic keyboard, the
[MoErgo Glove80](https://www.moergo.com/pages/glove80). This was my first time
using a columnar keyboard, and my first programmable keyboard.
I expected to make some layout customizations; obviously the layout on this
new keyboard couldn't match the keyboards I was used to.
But I didn't expect how, when you're using a totally new form factor and
can customize every part of the layout,
there's really no reason not to customize deeply!

<!-- more -->

Ultimately this led me to designing my own alpha layout with inspiration from
other alternative layouts.
I switched to it at the start of the year and have been enjoying typing with it!
I prioritized finger utilization I found comfortable and inward rolling:

```
x c l d k  z y o u q
r s t h f  p n e i a
w v g m j  ↵ b ' . ,
```

* [Background](#background)
* [Learning](#learning)
* [Basics of layout design](#basics-of-layout-design)
* [My design goals](#my-design-goals)
* [Design process](#design-process)
  * [Vowels](#vowels)
  * [Consonants](#consonants)
  * [Punctuation](#punctuation)
  * [Enter?](#enter)
* [Metrics](#metrics)
  * [Finger utilization](#finger-utilization)
  * [In-rolls](#in-rolls)
  * [Redirects](#redirects)
  * [Same finger usage](#same-finger-usage)
  * [Scissors and lateral stretches](#scissors-and-lateral-stretches)
* [Thoughts from a year of usage](#thoughts-from-a-year-of-usage)
* [Why I wrote this](#why-i-wrote-this)
* [Resources and additional reading](#resources-and-additional-reading)

## Background

I originally intended to keep using QWERTY on my new keyboard.
Surely my existing muscle memory would be far more valuable than any minor
improvements to be gained from a new alpha layout.
Until I started using a columnar keyboard for the first time,
with fingers strictly assigned to keys, and realized:
my typing previously on QWERTY was nothing like this,
and using QWERTY this way kind of sucked.

Using QWERTY with strictly assigned fingers raised a lot of questions.
Why did I so often have to type multiple letters in a row with the same finger?
Why did I so frequently have to reach with my index fingers for `t`, `n`, and `h`?
Why was I resting my right hand on these home keys if they are so rarely used?
Why did I have to reach my right pinky to the top row for `p` when its home
position was the rarely used `;`?

I realized that I had been avoiding a lot of these issues by not strictly using
fingers for certain keys. I learned that it's common among QWERTY typists to
work around using the same finger repeatedly by using different fingers to hit
a key, a technique called "alt fingering".
Even beyond this, my QWERTY typing had idiosyncrasies:
I type `the` entirely with my left hand (middle-index-ring),
I barely use my right ring finger and never use my right pinky, and
I even hit the space bar with my right index finger.

This meant that, for me, typing QWERTY on columnar was basically learning an
entirely new layout. I was typing really slowly and would need a lot of practice,
and I would be putting in all this effort to re-learn to type
with a layout that didn't even perform well with strictly assigned fingers.

## Learning

Before we get into this process of designing a keyboard layout,
if you haven't learned to use an alternative layout before,
you may be thinking that switching is prohibitively difficult.
The process of learning a new layout wasn't as bad as I expected!

When I got my first split columnar keyboard, I re-learned how to type three times
over the following months. I started out using columnar QWERTY for ~1 month,
then switched to an alternative layout designed to be similar to QWERTY for ~3 months,
then finally switched to the custom layout described in this post.
Learning for the third time seemed easier than the previous times.
I started practicing during a lazy holiday week off work and then
went back to work using it (clumsily). After a little over a month I started
hitting 70 wpm in typing tests, and now after a year I've hit 90 wpm in tests.

To learn, I started out using [keybr][keybr],
which gradually adds additional letters for you to learn.
Once I had unlocked all letters there, I switched to [Monkeytype][monkeytype],
which offers more options and has a fun collection of quotes to practice with.

[keybr]: https://www.keybr.com/
[monkeytype]: https://monkeytype.com/

The process of learning a new layout is frustrating at times, like when
I wanted to quickly type out an idea but was still too clumsy to do so.
But I also found it fun, and, strangely, I kind of miss it.
Typing practice was meditative for me, a good way to clear my head,
and it reminded me of practicing a musical instrument.

I've only use alternative keyboard layouts on my split columnar keyboards;
I continue to use QWERTY on my laptop and any other unibody row-staggered keyboards.
I experienced a bit of confusion during the learning process,
but that cleared up as my muscle memory solidified,
so now I can easily switch between using the different kinds of keyboards.
Having such different form factors between the two seems to help maintain
separate muscle memory.

I believe I still type faster on QWERTY than on my custom layout (~100 wpm),
but I don't regularly take QWERTY typing tests to know for sure.
This is a little demoralizing after so much practice,
but it makes sense given the many years I've been typing QWERTY.
And I remind myself that the switch wasn't about speed;
I may type faster on my laptop keyboard, but after using it for a while
I can feel the familiar forearm and wrist aches returning.

## Basics of layout design

When I started researching alternative keyboard layouts, I thought I'd just
find the best, most optimal one and pick that.
Well, it turns out that's not so easy to define.
There's a passionate community using metrics to rigorously analyze layouts, but
there's no obvious way to define a metric for how "good" a keyboard layout is.
Instead, we usually look for patterns that feel comfortable or uncomfortable,
and then try to formally define them and measure how frequently they occur.
Each layout optimizes for a different balance of these metrics.

[Ec0's Keyboard layouts doc][kld] is the the best source for understanding how
modern layouts are designed and the metrics used. One of the basic metrics is
the frequency of ["same finger bigrams" (SFBs)][kld-4.1]
which measures how often the same finger has to type two keys in a row.
There are metrics to measure how often fingers have to stretch apart
[vertically (scissors)][kld-6.1] or
[horizontally (lateral stretch bigrams, LSBs)][kld-7.1].
More advanced metrics look at [trigrams][kld-8.1], 3-key sequences,
to evaluate how often typing switches between hands (alternation), or
uses the same hand flowing in a consistent direction (rolling), or
uses the same hand but with awkward changes in direction (redirects).
Some analyzers assign effort values to key positions to quantify how difficult
typing common words feels.

All of these metrics make layout design a fascinating puzzle, where it's
impossible to maximize every metric at once, and the layout designer must
decide what trade-offs to make to maximize metrics for their preferred patterns.

[kld]: https://docs.google.com/document/d/1W0jhfqJI2ueJ2FNseR4YAFpNfsUM-_FlREHbpNGmC2o
[kld-4.1]: https://docs.google.com/document/d/1W0jhfqJI2ueJ2FNseR4YAFpNfsUM-_FlREHbpNGmC2o/edit?tab=t.84dl8gsr8by7#heading=h.11zdpmpqdkga
[kld-6.1]: https://docs.google.com/document/d/1W0jhfqJI2ueJ2FNseR4YAFpNfsUM-_FlREHbpNGmC2o/edit?tab=t.3j7hpqkn3etl#heading=h.52yn1he03w10
[kld-7.1]: https://docs.google.com/document/d/1W0jhfqJI2ueJ2FNseR4YAFpNfsUM-_FlREHbpNGmC2o/edit?tab=t.i8oe0bwffr95#heading=h.gmkonyyr2tww
[kld-8.1]: https://docs.google.com/document/d/1W0jhfqJI2ueJ2FNseR4YAFpNfsUM-_FlREHbpNGmC2o/edit?tab=t.6r1v629nms0d#heading=h.mabm585mao3e

## My design goals

When I first started using my new keyboard, I quickly found that I was not
accustomed to typing with all 10 fingers, and some felt strained from the adjustment.
I found that I had used my middle fingers for many keys previously,
but now they were down to only 3 letters. Maybe I have short pinkies or
suboptimal hand positioning, but I found the top row pinky keys required
a stretch that was not comfortable for me to perform frequently.

These observations led to comfortable finger utilization being my primary goal.
I wanted my middle fingers to have the most utilization, followed by index, ring,
and pinky, and I wanted to only have low frequency keys for the top row pinky keys.

In hindsight, I'm not sure utilization was exactly the right metric. I now think
that finger movement (moving between keys) is more impactful than utilization;
I feel less strain on a finger that mostly presses a single key than a finger
that regularly switches between multiple, even if the single key is frequently used.
Fortunately, utilization does correlate somewhat with movement, so I ended up
in roughly the right place. Over time I have found that my weaker fingers have
grown more comfortable typing, so I think I could have adapted to a layout
that used them more, but perhaps it was good to not push my luck.

After finger utilization, I decided I wanted to prioritize inward rolling.
When I first read about inward rolling (from pinky to index) vs
outward rolling (from index to pinky), I was surprised to compare
how much clumsier it felt to roll my fingers outwards.
I'm not sure how much this actually matters in typing,
so I didn't zealously avoid all outward rolling,
but it was at least a fun little challenge to optimize around.

Although I wanted to prioritize inward rolling, I didn't want redirects to
become too frequent. If some rolls came with too many redirects,
I would prefer having alternation instead.

Like all modern layouts, I wanted to minimize same finger bigrams, but
I found I wasn't so sensitive to them that I'd prioritize this over my other goals.
I was hoping for SFBs a bit better than Colemak, but I knew I wouldn't beat the
SFB rates of the newest layouts (especially ones with thumb alphas or magic keys).
I didn't even consider same finger skipgrams;
just avoiding SFBs already felt luxurious enough coming from QWERTY.

In the end, my priority ranking came to:

1. Finger utilization
2. High in-rolls
3. Low redirects
4. Low same finger bigrams

## Design process

With these goals established, how do we design a layout optimized for them?

First, we should quantify the finger utilization targets. I chose:

* Index: 12-14%
* Middle: 16-18%
* Ring: 10-12%
* Pinky: 8-9%

The foundation of a layout is [its placement of the 9 most common letters][kld-9.1].
Modern layouts place all vowels on the same hand (in order to reduce redirects),
with [the 4 most common vowels on three fingers][kld-10.1]
(in order to leave more room for placing the many consonants).
Let's start [designing the layout as recommended][kld-11.3] with the vowel hand!

[kld-9.1]: https://docs.google.com/document/d/1W0jhfqJI2ueJ2FNseR4YAFpNfsUM-_FlREHbpNGmC2o/edit?tab=t.oldl5e1xa7v3#heading=h.fkc9oxga9jo9
[kld-10.1]: https://docs.google.com/document/d/1W0jhfqJI2ueJ2FNseR4YAFpNfsUM-_FlREHbpNGmC2o/edit?tab=t.gm0ejchjpek#heading=h.fy0chzg26unh
[kld-11.3]: https://docs.google.com/document/d/1W0jhfqJI2ueJ2FNseR4YAFpNfsUM-_FlREHbpNGmC2o/edit?tab=t.uv9x1j70u2nc#heading=h.8grvg0w34swn

### Vowels

Laying out the vowel hand starts with choosing the vowel block.

[The vowel block with highest inrolls][kld-15.2] is `yi oe ua`.
The `oe` stack would have utilization far past the target for ring,
so this would require `ua` on index.
This means we'd have to push more consonants off the index finger to keep SFBs low,
and ultimately this leads to violating the finger utilization goal,
like adding more letters onto pinky;
therefore, let's only consider vowel blocks that do not include index.

[kld-15.2]: https://docs.google.com/document/d/1W0jhfqJI2ueJ2FNseR4YAFpNfsUM-_FlREHbpNGmC2o/edit?tab=t.2yb5bwiy1wa8#heading=h.qyel7qja61lm

The next best vowel block for inrolls is `yi oa ue`, and
while `oa` has less utilization than `oe`, that's still a lot for ring,
especially with a very common letter off the home row.
`i ue oa` is next; this has the ring finger moving off home row far less often,
so it could be viable, but it still already means over 14% utilization for ring,
which is higher than the target.

This leads us to `a ui oe`. Although it doesn't have the highest inrolls,
its utilization is closer to what we're looking for. `oe` alone is over 19%
utilization, but as long as we don't add anything else common to the column,
it's not too far past the middle finger utilization target's 18% upper bound.

With the vowel block chosen, we can begin laying out consonants on the vowel hand.
High-inroll layouts (usually) have
[either `n` on the vowel hand index or `h` on the vowel hand pinky][kld-15.3.1],
so `n` index it is!
Let's not stack another common consonant [like `r`][kld-11.7] on the index,
because that would exceed the utilization target and limit our options
for the remaining 4 keys.

[kld-15.3.1]: https://docs.google.com/document/d/1W0jhfqJI2ueJ2FNseR4YAFpNfsUM-_FlREHbpNGmC2o/edit?tab=t.2yb5bwiy1wa8#heading=h.b3afrbm4ggth
[kld-11.7]: https://docs.google.com/document/d/1W0jhfqJI2ueJ2FNseR4YAFpNfsUM-_FlREHbpNGmC2o/edit?tab=t.uv9x1j70u2nc#heading=h.cjrto5uint97

I paired `y` with `n`, even though that leads to some moderate SFBs,
because then we have a `you` three-roll,
and that just feels so dang nice (even as an outroll).
We'll fill out the rest of this index later when laying out the consonants.

For a low-utilization key for top vowel pinky, I chose `q`.
This does mean a redirect for `equ`, an SFB for `aqu`, and an SFS for `qua`, but
the guaranteed `qu` inroll is nice, and `quo` feels great and `que` feels pretty good.

At this point, we've laid out most of the vowel hand:

```
☐ ☐ ☐ ☐ ☐  ☐ y o u q
☐ ☐ ☐ ☐ ☐  ☐ n e i a
☐ ☐ ☐ ☐ ☐  ☐ ☐ ☐ ☐ ☐
```

### Consonants

With the vowel hand mostly established, and only 4 consonants remaining from
the 9 most common letters, it's time to start on the consonant hand.
By this point we can see that this layout will be a member of
[the "N + vowels" family of inward rotation layouts in Ec0's Keyboard layouts doc][kld-15.7.3].

[kld-15.7.3]: https://docs.google.com/document/d/1W0jhfqJI2ueJ2FNseR4YAFpNfsUM-_FlREHbpNGmC2o/edit?tab=t.2yb5bwiy1wa8#heading=h.e1vfsiwzv6vw

Let's use the remaining 4 most common consonants for the home row of the
consonant hand; the arrangement with the highest inrolls is `rsth`.
This is perfect, because it puts the most frequent consonant, `t`, on middle finger,
which we'll need in order to have higher utilization on the middle finger,
in just 3 keys, than the index finger, with its 6 keys.

With this home row, [`c` must stack with `s` on ring finger][kld-11.8] to
minimize SFBs. Let's place `l`, the highest frequency consonant that we haven't
already given a home row spot, on middle finger. `tl` does mean some SFBs, but
this gives us more flexibility with what letters can be placed on the index.
`d` then goes on the index, and by placing these in the top row we now have
nice adjacent same-row inrolls for `ld` and `cl`.

[kld-11.8]: https://docs.google.com/document/d/1W0jhfqJI2ueJ2FNseR4YAFpNfsUM-_FlREHbpNGmC2o/edit?tab=t.uv9x1j70u2nc#heading=h.26oc0mqwptjr

For the consonant pinky's rare top key, I placed `x` to have `xc` and `xt` inrolls,
plus a fun three-roll for `xcl` in exclude.

```
x c l d ☐  ☐ y o u q
r s t h ☐  ☐ n e i a
☐ ☐ ☐ ☐ ☐  ☐ ☐ ☐ ☐ ☐
```

From here we should decide how to finish the consonant pinky.
`xr` is still well below the 8-9% utilization target.
`w` or `v` are the natural choices to reduce SFBs.
I chose `w` to get closer to the 8% utilization goal.
Fortunately a `wc` pair almost never appears, so we avoid an uncomfortable scissor,
and the `wl` and `wd` pairs are infrequent, so we don't have many row skips.
I find the `sw`, `tw`, and `wh` pairs to be comfortable.

There's another nice aspect of the `rw` pinky: I especially dislike redirects
where the pinky is the finger upon which direction changes, and thankfully `r`
and `w` don't often appear in the middle of consonant clusters.
They appear at the beginning (`rst`, `rts`, `wds`) or at
the end (`str`, `thr`, `sw`), but not in the middle (`srt`, `trs`, `dws`).

`g` shouldn't go with `n` or `h`, so it should go on ring or middle.
Putting `g` on middle doesn't maximize middle finger utilization (`m` would),
but it results in fewer SFBs than ring (`gl` vs `gs`),
so let's settle for middle. The `ltg` column is a little below the middle finger
utilization target, but it's close enough. We can then finish off ring as `csv`
to keep its SFBs low, since it already has the `sc` pair to deal with.

With `m` and `pb` remaining, we should put them on separate indexes.
`by` has lower SFBs than `my` (plus `ph`), so `pb` goes to the vowel hand index
and `m` to the consonant hand index. Of `p` and `b`,
`p` pairs more frequently with `o`, while `b` mostly pairs with `e`, so let's
place `p` in the inner column and `b` in the bottom row for fewer scissors
(despite slightly more lateral stretches from `po`).

```
x c l d ☐  ☐ y o u q
r s t h ☐  p n e i a
w v g m ☐  ☐ b ☐ ☐ ☐
```

At this point, we have 5 spots left on the index fingers, 4 of which are the
inner column top/bottom row corner positions that are more than 1u from the
index finger's home position.
Let's assign `f`, the last letter with > 1% utilization, to the
consonant hand index so that it need not be in one of these corner positions.
`f` does not cause SFBs here, and although it could lead to higher inrolls on
the vowel hand index, at least on the consonant hand it mostly contributes to
alternation rather than outrolls.
I placed `f` in the inner column and `m` in the bottom row since
`f` has less utilization and this avoids `fl` scissors.

`k`, the last letter besides the rare ones, can be assigned to
the consonant index to avoid `nk` SFBs.
Putting it in the top row means less of a stretch for `ck` and `lk`.

At this point we just have `j` and `z` to fill in the gaps.
I put `j` on the consonant hand so that `j` down and `k` up vim commands
in the terminal are in a convenient place.
`z` gets a vowel hand index spot, and now we've placed all the letters!

```
x c l d k  z y o u q
r s t h f  p n e i a
w v g m j  ☐ b ☐ ☐ ☐
```

### Punctuation

We still have some open spots on the vowel hand to place punctuation.
The most frequent `.` and `,` deserve a spot on the base layer,
but on middle finger [they would cause higher SFBs with `e`][kld-10.7]
and raise utilization even higher, so let's place them on ring and pinky instead.

[kld-10.7]: https://docs.google.com/document/d/1W0jhfqJI2ueJ2FNseR4YAFpNfsUM-_FlREHbpNGmC2o/edit?tab=t.gm0ejchjpek#heading=h.fat0i9wavpm4

I chose ring for `.` because, in contrast to `,`, it is tapped repeatedly for `...`,
and is often interleaved with letters for programming, acronyms, and domains.
Putting it on ring also gives us the freedom to put `/` on the pinky
outer column without creating an SFB for `./` paths.
This does swap the order of `,.` and the shifted `<>` from QWERTY,
but I'm not sure that matters when we're deviating so much from QWERTY
and when angle brackets are often better positioned on a symbol layer.

`'` could go on the pinky outer column without causing many SFBs, but I instead
chose middle finger. This does raise middle finger utilization somewhat higher,
but I prefer that to increased pinky lateral movement. This also means that
`'` is still available on the base layer of 3x5 keyboards.

Placing `'` on middle causes an `e'` 1u SFB on contractions like `he's` or `we're`,
and an `o_'` 2u SFS on contractions like `don't` or `you're`,
but I don't find these so unpleasant. Surprisingly, the layout analyzers say
the overall SFBs are the same as `/` or `;` on middle and `'` on pinky,
and I'd rather handle SFBs with the more dexterous middle finger.

```
x c l d k  z y o u q
r s t h f  p n e i a
w v g m j  ☐ b ' . ,
```

### Enter?

You may notice this leaves one spot unaccounted for on the vowel hand index.
Normally a layout would include one more punctuation key, usually either `;` or `/`,
but I use these infrequently enough that they seem like a waste of a
base layer key for the strong index finger. Yet this position isn't ideal for
keys that would regularly be used in the middle of typing prose:
it's more than 1u from the index home position, requires a lateral stretch,
and can cause scissors given this layout's top row bias on right hand.
Can we find a key that's used regularly, but not in the middle of typing prose?

The whitespace/control keys seemed like they might be a nice fit.
Placing one of them here could allow for lower pinky and thumb movement.

* Space would obviously be a bad choice, since it's used constantly when typing prose.
* Backspace is an option I thought might be good, but after trying it,
  I found that I use it too frequently in the middle of typing prose to
  quickly correct mistakes. (I put backspace on a thumb home key instead.)
* Delete and Escape could be fine options, but I don't use them that regularly.
* Enter and Tab seem like good options.

I use Enter more regularly than Tab, so I chose it.

With that, we've reached the completed layout as shown at the start of this post!

```
x c l d k  z y o u q
r s t h f  p n e i a
w v g m j  ↵ b ' . ,
```

## Metrics

But enough of me justifying these choices; the best way to see if this layout
succeeded at its goals is to turn to an analyzer and look at the metrics!

My favorite analyzer for evaluating and experimenting with layouts is
[Cyanophage's][cyanophage], and you can see
[its analysis of this layout here][cyanophage-mine].
Some other great interactive playground analyzers are [Oxey's][oxey] and
[Layouts Wiki's][layouts.wiki], though these don't support direct linking to
custom layouts.

[cyanophage]: https://cyanophage.github.io/
[cyanophage-mine]: https://cyanophage.github.io/playground.html?layout=xcldkzyouq-rsthfpneia%2Fwvgmj%3Bb%27.%2C%5C%5E&mode=ergo&lan=english
[oxey]: https://oxey.dev/playground/index.html
[layouts.wiki]: https://layouts.wiki/playground/

A caveat: these analyzers do not have data on usage of the Enter key, so
for this analysis I have replaced it with `;`.
This means the usage of the right index will be undercounted, but
hopefully it does not have a large impact on bigram/trigram analysis.

We can benchmark by comparing metrics against other layouts. I'll compare with:

* [Colemak-DH][colemak-dh]: a version of [Colemak][colemak], slightly modified
  and generally considered better for columnar keyboards. Colemak is one of
  the most popular alternative layouts and is designed to be similar to QWERTY.
* [APTv3][aptv3]: a well known inroll-focused layout from which I took inspiration.
* [Gallium][gallium]: a well-rounded layout often recommended as an upgrade from Colemak.
* [QWERTY][qwerty]: mostly just for laughs.

[colemak-dh]: https://colemakmods.github.io/mod-dh/
[colemak]: https://colemak.com/
[aptv3]: https://github.com/Apsu/APT
[gallium]: https://github.com/GalileoBlues/Gallium
[qwerty]: https://en.wikipedia.org/wiki/QWERTY

### Finger utilization

The reported finger utilization is roughly in line with the targets:

|        | Target | Left   | Right  |
| ------ |:------:|:------:|:------:|
| Pinky  |   8-9% |  8.01% |  9.23% |
| Ring   | 10-12% | 10.58% | 11.00% |
| Middle | 16-18% | 15.12% | 19.88% |
| Index  | 12-14% | 13.66% | 12.52% |

Left middle is a little under, right middle is over, and right index may
actually be over when the true utilization of Enter is considered.

Like mentioned earlier, finger movement is another useful measure of the work
performed by each finger:

|        | Left  | Right |
| ------ |:-----:|:-----:|
| Pinky  |  9.95 |  6.05 |
| Ring   | 21.07 | 18.87 |
| Middle | 28.56 | 39.99 |
| Index  | 41.43 | 28.33 |

For the most part, the movement of the fingers look good, but it shows some
interesting differences from finger utilization.
Although left pinky has lower utilization than right pinky, it has more movement.
And similarly, although left index has lower utilization than left middle,
it has significantly higher movement.
There may be more work required of these fingers than I hoped.

### In-rolls

| | 2roll in | 2roll out | 3roll in | 3roll out | Alt |
| ----------- |:------:|:------:|:-----:|:-----:|:------:|
| This layout | 30.07% | 14.62% | 1.33% | 1.07% | 33.45% |
| Gallium     | 21.35% | 23.06% | 0.45% | 1.21% | 37.55% |
| APTv3       | 32.63% | 14.12% | 2.26% | 0.54% | 30.73% |
| Colemak-DH  | 25.18% | 21.54% | 1.50% | 0.98% | 25.43% |
| QWERTY      | 20.38% | 21.38% | 1.32% | 1.48% | 21.38% |

The trigram metrics show we did a pretty good job of prioritizing inrolls!
Bigram inrolls are nearly twice as common as bigram outrolls and are noticeably
higher than Gallium and Colemak-DH. We get close to APTv3,
but cannot match it because of our focus on finger utilization,
falling behind especially on inward 3-rolls. We can see that alternation also
falls between Gallium and APTv3, which makes sense due to
[the inverse relationship between alternation and rolling][kld-8.2].

[kld-8.2]: https://docs.google.com/document/d/1W0jhfqJI2ueJ2FNseR4YAFpNfsUM-_FlREHbpNGmC2o/edit?tab=t.6r1v629nms0d#heading=h.r8uk3gldl10w

### Redirects

|          | Redirect | Weak Redirect |
| ----------- |:-----:|:-----:|
| This layout | 2.53% | 0.30% |
| Gallium     | 1.93% | 0.26% |
| APTv3       | 3.60% | 0.42% |
| Colemak-DH  | 5.33% | 1.09% |
| QWERTY      | 6.22% | 0.44% |

Similarly, redirects are situated between Gallium and APTv3, but significantly
better than Colemak-DH. We won't be able to beat Gallium on redirects because
we're prioritizing inrolls, and [rolling correlates with redirects][kld-8.2].

Additionally, I'm happy to see only +0.04% weak redirects over Gallium.
Cyanophage classifies redirects that occur on the middle, ring, and pinky
(i.e. without the index) as weak redirects, the redirects that feel clumsiest.

### Same finger usage

|             | SFBs  | SFSs  |
| ----------- |:-----:|:-----:|
| This layout | 0.84% | 3.50% |
| Gallium     | 0.64% | 2.74% |
| APTv3       | 0.81% | 3.09% |
| Colemak-DH  | 0.91% | 4.24% |
| QWERTY      | 4.38% | 5.45% |

Same finger bigrams look acceptable. As expected, we do not beat Gallium,
though we get close to APTv3 and do beat Colemak-DH.
Index/middle SFBs are 0.58%, so most are on capable fingers.

Since same finger skipgrams were not a design priority,
it's understandable that they lag behind Gallium and APTv3,
though it's good to see that they do still beat Colemak-DH.
A considerable portion of SFSs come from the `oe` stack.

### Scissors and lateral stretches

|          | Scissors | LSBs  |
| ----------- |:-----:|:-----:|
| This layout | 0.31% | 0.98% |
| Gallium     | 0.95% | 0.96% |
| APTv3       | 0.11% | 0.33% |
| Colemak-DH  | 0.15% | 1.27% |
| QWERTY      | 1.46% | 4.55% |

Although scissors and lateral stretches weren't a focus, we did consider them
during design, so it's worth checking on them.

Fortunately, the numbers seem reasonable! Scissors are lower than Gallium,
with most of the scissors coming from `bo` (like Gallium's `of`).
Lateral stretch bigrams are comparable to Gallium and lower than Colemak-DH.

## Thoughts from a year of usage

A layout can't be completely evaluated from its design justification or
analyzer metrics; the real test is how it feels in real usage.
I've been using this layout for a year now, and I've been happy with it!

It has largely succeeded at my goal of comfort. I no longer feel the strain on
my index fingers that I started to feel from using columnar QWERTY,
though perhaps that would have faded in time regardless.
The high middle finger utilization has not caused me any discomfort.

Unfortunately, the layout did have one noticeable point of discomfort:
the `wr` pinky. It seems that my left pinky has been messed up by a lifetime of
using only left shift on QWERTY, including weird contortions like Shift+1 and
long stretches like Shift+Y with my left index.
I started experiencing discomfort in my left pinky on the new layout, though
fortunately I was able to mitigate it by adjusting my navigation and
symbol layers for less pinky usage. It has lessened over time and now I
notice it only rarely if I've been typing quickly for long periods of time.

In hindsight, I wonder if finger movement would have been a better design goal
than utilization. For a while I considered swapping to a `vr` pinky,
which would reduce usage, but it comes with an increase in pinky SFBs and SFSs.
I considered something like an `xrz` pinky, but
I was worried it'd lead to index discomfort, and
I never found a solution I liked before the pinky discomfort started improving.
I'm not sure if the more common `bn` pinky would have fared better for me;
I can only imagine how bad I would have felt with Dvorak's `ls` pinky.

The relatively high SFBs of the left middle and right index haven't bothered me.
I don't notice the `by` 2u SFB, which I had expected to be annoying.
`ltg` is a bit busy, but nothing compared to QWERTY's `edc`;
typing `digital` for the first time was a funny experience, though.
The `ght` SFS occasionally trips me up during fast typing, so
maybe `g` on ring could have helped with that.

One pleasant realization I had: of the 5 most repeated letters, this layout puts
4 (all but `s`) on the middle fingers, which I find to be the most comfortable
finger to tap in quick succession. Nice!

The inroll focus doesn't feel as notable as I first imagined.
I'm excited whenever I get to type `rst` or `ien`, but
for the most part the inrolls fade into the background.
I can see why most layouts these days aren't designed for directionality,
especially with the wide variance of the English language fighting against you.

I've liked having Enter on an index finger. It feels nice for sending
quick messages and has helped me balance the load on my thumbs.
It doesn't feel great if you have do repeated patterns of single letter + Enter,
like with yes/no CLI prompts... which are especially annoying because
`y` and `n` are on the same finger, so I usually alt-finger this case.

I don't think I'll be hopping to a new layout any time soon;
any improvement it provides would have to be dramatic.
I've considered layouts with a thumb letter, but I'm concerned about
thumb strain if I have backspace and a letter on the same thumb.
Maybe someday a magic key will lure me into learning a new layout, but not yet.

## Why I wrote this

Designing this layout was a fun project and I wanted to share about the process!
I don't think I've designed the world's best layout, and I don't think that
everyone should use it; rather, I hope more people explore alternate layouts,
tweak existing ones to their preferences, and design their own.

If you're switching to an ergonomic keyboard, it's a great time to try an alternative.
Every layout is made with certain preferences, and if you can't find one that
matches yours, it's not so hard to tweak an existing layout or design your own.

## Resources and additional reading

If you want to learn more about alternative layouts:

* [Pascal Getreuer's guide to alt keyboard layouts][getreuer-guide] - a great
  introduction that overviews many alternative layouts
* [Layouts Wiki's guides][layouts.wiki-guide] - includes recommendations for
  the latest layouts with reasons you may (or may not) prefer them
* [Ec0's Keyboard layouts doc][kld] - already linked many times in this post,
  but worth repeating; an in-depth resource for understanding and creating layouts

[getreuer-guide]: https://getreuer.info/posts/keyboards/alt-layouts/index.html
[layouts.wiki-guide]: https://layouts.wiki/guides/start/intro/

And, in addition to the layouts linked earlier for benchmarking, here are some
layouts with neat ideas and writeups that I've enjoyed reading:

* [Thraeg's Mumak][mumak] - prioritizes middle finger utilization and
  adjacent finger rolls
* [Acas's Vylet][vylet] - prioritizes inrolls with an added magic key
* [Valorance's Night][night] - achieves very low SFBs and SFSs with a thumb letter,
  plus its writeup includes a nice overview of other layouts with thumb letters
* [Simon Zeng's Afterburner][afterburner] - a really neat idea for multiple
  magic keys to dramatically reduce same finger usage

[mumak]: https://docs.google.com/document/d/1HjylX4exH3wyBbxbwranSP4htHXn2qMqOKutpPDxN9c
[vylet]: https://github.com/MightyAcas/vylet/blob/main/README.md
[night]: https://valorance.net/night/design
[afterburner]: https://blog.simn.me/posts/2025/afterburner/
