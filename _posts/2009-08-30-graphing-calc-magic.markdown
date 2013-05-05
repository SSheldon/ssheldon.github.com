---
comments: true
date: 2009-08-30 00:17:43
layout: post
slug: graphing-calc-magic
title: Graphing Calc Magic
wordpress_id: 11
---

Remember back in middle school when we had to simplify roots? Bam!

    Prompt R,D
    For(I,iPart(R^(D^-1)),1,-1)
    If iPart(R/I^D)=(R/I^D)
    Then
    Disp I
    Return
    End
    End

This TI-Basic program takes the radicand and the degree (R and D, respectively) of a root and displays the largest integer coefficient that can be factored out of it. If only we had these graphing calculators back in middle school, I could have made math very interesting...

Oh, and the [method I wrote a while ago in C# to do this]({% post_url 2009-03-29-c-root-simplification-method %})? Yeah, it's an over complicated piece of crap. Life goes on.
