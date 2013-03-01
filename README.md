inCHROMEnter
============
Version 0.4.2
--------
Latest stable version:  [0.4.2](https://github.com/ekilah/inCHROMEnter/tree/791c93617c2aa83b7c4788a226228d6f2e62523e) as of 3/1/2013. By Monroe Ekilah.

###Welcome to inCHROMEnter!
A simple Chrome extension to increment/decrement the URL of the current tab for fast browsing.

###Why
I got this idea when going through far too many sequential GitHub issues while grading for a course at my university. I wished there was a faster way to browse the issues than manually editing the URL, which conveniently ends in the issue number.

###Current features
+ ~~Works on GitHub issues only right now.~~ UPDATE: Works on any site with the any of the following structures at the end of the URL:
  + `/#...#`
  + `/#...#/`
  + `/#...#/.cccc` where `cccc` is any extension that is no longer than 4 chars plus the dot before it. (i.e.: `.html`)
  + For example, try:
      + http://what-if.xkcd.com/15/
      + https://github.com/swcarpentry/2012-11-scripps/blob/master/_static/15.html
      + GitHub issues (the original intention of this project!)
+ Alt + '+' and Alt + '-' will increment/decrement,  in addition to the ugly buttons in the extension popup window.
  + The +/- keys on the numpad and the normal keyboard both work.
+ User options page functional! User can select from available regular expressions, and change the default increment/decrement value.

###Thanks to these sites/people:
+ A good starter tutorial - http://mycodefixes.blogspot.in/2012/03/building-chrome-extensions-from-scratch.html
+ Obviously... - http://developer.chrome.com/extensions/
+ http://www.cssbuttongenerator.com/
