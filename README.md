DynamicCounter
==============
A work in progress and unsupported since December 2014 but serves dynamic images based on url and time of day useful for email campaigns. Also hosts an experimental tracking pixel at /track.

## Dynamic image server

Dynamic image server - see app.js for workings.

Run Node App to start server, webpage on localhost:8080 for example dynamic countdown and tool to create all the images for a countdown timer.

Set the year, month and day you want to countdown to and then use the individual images served to construct the countdown timer.

### Days
localhost:8080/countdown?year=xxxx&month=xx&day=xx&hour=xx&minute=xx&digit=D1

localhost:8080/countdown?year=xxxx&month=xx&day=xx&hour=xx&minute=xx&digit=D2

localhost:8080/countdown?year=xxxx&month=xx&day=xx&hour=xx&minute=xx&digit=D3

### Hours
localhost:8080/countdown?year=xxxx&month=xx&day=xx&hour=xx&minute=xx&digit=H1

localhost:8080/countdown?year=xxxx&month=xx&day=xx&hour=xx&minute=xx&digit=H2

### Minutes
localhost:8080/countdown?year=xxxx&month=xx&day=xx&hour=xx&minute=xx&digit=M1

localhost:8080/countdown?year=xxxx&month=xx&day=xx&hour=xx&minute=xx&digit=M2

### Seconds
localhost:8080/countdown?year=xxxx&month=xx&day=xx&hour=xx&minute=xx&digit=S1

localhost:8080/countdown?year=xxxx&month=xx&day=xx&hour=xx&minute=xx&digit=S2

## Tracking pixel

There's also an experimental tracking pixel at localhost:8080/track that can be configered with logentries to log all the requests made for the 't.gif' tracking pixel.