Requirements
------------

* Windows Vista, or Windows 7
* Internet connection :D
* Internet Explorer 7+ (IE 9 recommended)


New Features since v3
---------------------

* Updated to use Adam API version 1.0
* Only requires a token to be entered no more username and password.
* Support for more plan types. Everything but AdamTalk should work.
* Support for multiple accounts. You can have multiple gadgets displayed for different accounts.
* Better chance of recovery from suspend/reboot.
* Connection info (IPv4Address, Sync speed, SNR, Attenuation). Note: some info only available for ADSL accounts.
* Notification of gadget updates with download link to new version.
* Complete rewrite from v3 and v4. Better separation of data and presentation.
* Long plan names will no longer mess with the background.
* It will work with v3 or v4 still installed.

 
Instructions
------------

Instead of a password you need to enter your security token which you can set up by logging into the Members Services Area [https://members.adam.com.au/](https://members.adam.com.au/) and using the Token Manager to create a token.

After that click on the small spanner icon to bring up the settings panel and enter your token. Then click ok. After that you can reopen the settings panel and change the account type and view your connection info.

I have started a new thread for posting info on the new API [whrl.pl/RcGYMJ](http://whrl.pl/RcGYMJ) and also a wiki page [http://whirlpool.net.au/wiki/adamfaq_api](http://whirlpool.net.au/wiki/adamfaq_api)

 
Adam API Error Codes
--------------------

Under certain circumstances you can receive an API error code, this is what they mean. Api error means there is a problem with the feed see [http://www.adam.com.au/outages_system/outages-current-page1.php](http://www.adam.com.au/outages_system/outages-current-page1.php) for info.

* 001 - Unknown/Internal error.
* 003 - AdamAPI is currently unavailable. Please try again later.

 
Bug Reports
-----------

If you find a bug please make a note of the following in your post.

* A description of the problem and/or screenshot if applicable.
* Windows version (e.g. Vista or Win7)
* Internet Explorer version (gadgets use IE for rendering so this is important)
* Adam plan name and type
* It applicable please upload the output of [https://members.adam.com.au/api/](https://members.adam.com.au/api/) to [http://pastebin.com/](http://pastebin.com/) with your ipaddress and username removed.


Credits
-------

* James Roberts (basefield), original design
* Hamradio
* L. Sandery (Ihasa)
