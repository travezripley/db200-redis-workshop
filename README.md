# Redis Workshop
# Special offers inside,  

# Author - Michel Roberts JR.

# Modified by Travis Ripley, * Started Monday April 29th, 2019 17:30

## Right after this commercial break:
## Prerequisites

Redis is it's own separate program that must run in the background.

We'll be using a program called Medis to connect to our Redis instance.

### Installing on Windows

- Download the following installer for Redis: [Redis-x64-3.0.504.msi](https://github.com/MicrosoftArchive/redis/releases/download/win-3.0.504/Redis-x64-3.0.504.msi)
- Download the following installer for Medis: [medis-latest.exe](https://s3-us-west-1.amazonaws.com/oca-start-now/Medis/win/medis-latest.exe)
- Run both installers.
- Redis should start running on it's own.
- Once both have installed, open Medis, click connect
- Select the Terminal tab in top right
- Type `INFO` and hit return
- This should output general information about the running instance

### Installing on OSX

- Install Redis by using the [Homebrew](https://brew.sh/) package manager
- Run `brew install redis`
- Download, unzip, and add the Medis app to your Applications folder: [medis-latest.zip](https://s3-us-west-1.amazonaws.com/oca-start-now/Medis/osx/medis-latest.zip)
- Use the `redis-server` command in a terminal to start Redis
    - Note that this creates a Redis database file in the directory you're in
- Open Medis, click connect
- Select the Terminal tab in top right
- Type `INFO` and hit return
- This should output general information about the running instance

## Overview

We're going to be sending commands directly to Redis through the terminal in Medis.
Normally a server would be connected and sending commands, but because the commands are so similar we'll be using the terminal instead.

Once you have completed all the commands *leave Redis running* so that the tests can confirm you have run the correct commands.

### `GET` & `SET`

Redis is what is called a key-value store, often referred to as a NoSQL database. The essence of a key-value store is the ability to store some data, called a value, inside a key. This data can later be retrieved only if we know the exact key used to store it. We can use the command `SET` to store the value `"fido"` at key `server:name`:

```
    redis> SET server:name "fido"
```

Redis will store our data permanently, so we can later ask "What is the value stored at key `server:name`?" and Redis will reply with `"fido"`:

```
    redis> GET server:name
    "fido"
```

### Try this

```
    SET shout:123 "What is Shout?"
    GET shout:123 => "What is Shout?"
```

This `GET` command should return `"What is Shout?"`.

```
    SET shout:123 "Shout is the new Twitter"
    GET shout:123 => "Shout is the new Twitter"
```

Now running `GET` with the key `shout:123` should output the newly set value. Keys are overwritten without warning.

### `INCR`

Other common operations provided by key-value stores are `DEL` to delete a given
key and associated value, Set-if-not-exists (called `SETNX` on Redis) that sets a
key only if it does not already exist, and `INCR` to atomically increment a
number stored at a given key:


### Try this

```
    SET connections 10
    INCR connections => 11
```

`connections` should now be set to 11

```
    INCR connections => 12
```
`connections` should now return 12.

```
    DEL connections
```

This will the delete the `connections` entry.

```
    INCR connections => 1
```

Having been deleted the `INCR` starts an empty key at zero and returns 1

### `INCR` Continued

There is something special about `INCR`. Why do we provide such an operation if we can do it ourself with a bit of code? After all it is as simple as:

```
  x = GET count
  x = x + 1
  SET count x
```

The problem is that doing the increment in this way will only work as long as there is a single client using the key. See what happens if two clients are accessing this key at the same time:

1. Client A reads count as 10.
2. Client B reads count as 10.
3. Client A increments 10 and sets count to 11.
4. Client B increments 10 and sets count to 11.

We wanted the value to be 12, but instead it is 11! This is because incrementing the value in this way is not an atomic operation. Calling the `INCR` command in Redis will prevent this from happening, because it is an atomic operation. Redis provides many of these atomic operations on different types of data.


### Expiring Keys

Redis can be told that a key should only exist for a certain length of time. This is accomplished with the `EXPIRE` and `TTL` commands.

```
    SET resource:lock "Redis Demo"
    EXPIRE resource:lock 120
```

This causes the key resource:lock to be deleted in 120 seconds. You can test how long a key will exist with the `TTL` command. It returns the number of seconds until it will be deleted.

```
    TTL resource:lock => 113
    // after 113s
    TTL resource:lock => -2
```

The `-2` for the `TTL` of the key means that the key does not exist (anymore). A `-1` for the `TTL` of the key means that it will never expire. Note that if you SET a key, its `TTL` will be reset.

### Try this

```
    SET resource:lock "Redis Demo 1"
    EXPIRE resource:lock 120
    TTL resource:lock => 119
    SET resource:lock "Redis Demo 2"
    TTL resource:lock => -1
```

### List (similar to Arrays in JavaScript)

Redis also supports several more complex data structures. The first one we'll look at is a list. A list is a series of ordered values. Some of the important commands for interacting with lists are `RPUSH`, `LPUSH`, `LLEN`, `LRANGE`, `LPOP`, and `RPOP`. You can immediately begin working with a key as a list, as long as it doesn't already exist as a different type.

### Try this

`RPUSH` puts the new value at the end of the list.

```
    RPUSH friends "Alice"
    RPUSH friends "Bob"
```

`LPUSH` puts the new value at the start of the list.

```
    LPUSH friends "Sam"
```

`LRANGE` gives a subset of the list. It takes the index of the first element you want to retrieve as its first parameter and the index of the last element you want to retrieve as its second parameter. A value of `-1` for the second parameter means to retrieve elements until the end of the list.

```
    LRANGE friends 0 -1 => 1) "Sam", 2) "Alice", 3) "Bob"
    LRANGE friends 0 1 => 1) "Sam", 2) "Alice"
    LRANGE friends 1 2 => 1) "Alice", 2) "Bob"
```

### List Continued

`LLEN` returns the current length of the list.

```
    LLEN friends => 3
```

`LPOP` removes the first element from the list and returns it.

```
    LPOP friends => "Sam"
```

`RPOP` removes the last element from the list and returns it.

```
    RPOP friends => "Bob"
```

Note that the list now only has one element:

```
    LLEN friends => 1
    LRANGE friends 0 -1 => 1) "Alice"
```

### Set

The next data structure that we'll look at is a set. A set is similar to a list, except it does not have a specific order and each element may only appear once. Some of the important commands in working with sets are `SADD`, `SREM`, `SISMEMBER`, `SMEMBERS` and `SUNION`.

`SADD` adds the given value to the set.

```
    SADD superpowers "flight"
    SADD superpowers "x-ray vision"
    SADD superpowers "reflexes"
```

`SREM` removes the given value from the set.

```
    SREM superpowers "reflexes"
```

`SISMEMBER` tests if the given value is in the set. It returns 1 if the value is there and 0 if it is not.

```
    SISMEMBER superpowers "flight" => 1
    SISMEMBER superpowers "reflexes" => 0
```

`SMEMBERS` returns a list of all the members of this set.

```
    SMEMBERS superpowers => 1) "flight", 2) "x-ray vision"
```

`SUNION` combines two or more sets and returns the list of all elements.

```
    SADD birdpowers "pecking"
    SADD birdpowers "flight"
    SUNION superpowers birdpowers => 1) "pecking", 2) "x-ray vision", 3) "flight"
```

## Exit Criteria

- Complete all the exercises that say *Try this*
- All tests pass


There is no need to publish this to now.sh and you can provide the github url only for this project submission. [Submit your project](https://goo.gl/forms/wx8DLSus7s88lk043) 

##
#Thank you for taking the time to look at my projects,

#Also please follow my progress on youtube: 
https://www.youtube.com/channel/UCXv4p-lDYeWXPlnoRFYCSUg