---
comments: true
date: 2010-07-24 21:04:25
layout: post
slug: finding-modes-in-on
title: Finding Modes in O(n)
wordpress_id: 4
---

Runnan and I have been [analyzing algorithms for finding modes](http://ponspk.blogspot.com/2010/07/finding-modes.html). I'll throw in my best one:
    
    public static List<int> Mode(int[] array)
    {
        Dictionary<int, int> freqs = new Dictionary<int, int>();
        List<int> mode = null;
        int maxCount = 0;
        foreach (int i in array)
        {
            int count;
            try
            {
                count = freqs[i] + 1;
            }
            catch (KeyNotFoundException)
            {
                count = 1;
            }
            freqs[i] = count;
            if (count > maxCount)
            {
                maxCount = count;
                mode = new List<int>();
            }
            if (count == maxCount) mode.Add(i);
        }
        return mode;
    }




It appears to be O(n). Plotting time vs. list size shows linear growth with R2=.9999.
