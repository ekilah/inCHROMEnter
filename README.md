inCHROMEnter
============
Version 0.5.1
--------
Latest stable version:  [0.5.1]() as of 3/20/2013. By Monroe Ekilah.

###Welcome to inCHROMEnter!
A simple Chrome extension to increment/decrement the URL of the current tab for fast browsing.

###Why
I got this idea when going through far too many sequential GitHub issues while grading for a course at my university. I wished there was a faster way to browse the issues than manually editing the URL, which conveniently ends in the issue number.

###Current features
+ Works on any site with the any of the following structures at the end of the URL:
  + `/#...#`
  + `/#...#/`
  + `/#...#/.cccc` where `cccc` is any extension that is no longer than 4 chars plus the dot before it. (i.e.: `.html`)
  + For example, try:
      + http://what-if.xkcd.com/15/
      + https://github.com/swcarpentry/2012-11-scripps/blob/master/_static/15.html
      + GitHub issues (the original intention of this project!)
	    + Accidentally, this also works great for GitHub organization management, if your organization's teams are lucky enough to be sequentially numbered and/or named :)
+ Alt + '+' and Alt + '-' will increment/decrement,  in addition to the buttons in the extension popup window.
  + The +/- keys on the numpad and the normal keyboard both work.
+ User options page functional!
  + Here, the user can:
    + Select from the available regular expressions
	+ **NEW:** Change default action for padding URL numbers with zeroes when a URL decremented with Alt + '-' and it loses a digit place (i.e. 100->99 or 100->099? Your choice!)
	+ Change the default increment/decrement value

###Thanks to these sites/people:
+ A good starter tutorial - http://mycodefixes.blogspot.in/2012/03/building-chrome-extensions-from-scratch.html
+ Obviously... - http://developer.chrome.com/extensions/
+ My inspiration: https://github.com/
+ http://www.cssbuttongenerator.com/
