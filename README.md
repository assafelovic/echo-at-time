#echo-at-time

Your task is to write a simple application server that prints a message at a given time in the future.
The server has only 1 API:

`echoAtTime` - which receives two parameters, time and message, and writes that message to the server console at the given time.

Since we want the server to be able to withstand restarts it will use redis to persist the messages and the time they should be sent at. You should also assume that there might be more than one server running behind a load balancer (load balancing implementation itself does not need to be provided as part of the answer)

In case the server was down when a message should have been printed, it should print it out when going back online.

The application should preferably be written in node.js. The focus of the exercise is the efficient use of redis and its data types as well as seeing your code in action.


Main logic:

Client sends post request with date to `/messages/schedule`
```
POST /messages/schedule
{
  "time": "2019-01-01T00:00:00.000Z",
  "message": "Happy New YEAR!!!"
}
```

and server responds with:

```
{
    "id": "4bbb0800-5204-4bfe-8dfe-332d270a55c0",
    "date": "2019-01-01T00:00:00.000Z",
    "message": "Happy New YEAR!!!"
}
```

EXTRA: `/messages/schedule/now` will push message to be scheduled at current time (almost immediately)
```
POST /messages/schedule/now
{
  "message": "Some message"
}
```

and server responds with:

```
{
    "id": "4bbb0800-5204-4bfe-8dfe-332d270a55c0",
    "date": "Current iso date time",
    "message": "Some message"
}
```


`MessagesController.schedule` creates following records in redis storage:

```
127.0.0.1:6379> keys *
1) "scheduledMessages:2019-01-01"
2) "scheduledMessage:4bbb0800-5204-4bfe-8dfe-332d270a55c0"
3) "scheduledMessagesLists"

127.0.0.1:6379> LRANGE scheduledMessagesLists 0 0
1) "2019-01-01"

127.0.0.1:6379> LRANGE scheduledMessages:2019-01-01 0 0
1) "2019-01-01T00:00:00.000Z,4bbb0800-5204-4bfe-8dfe-332d270a55c0"

127.0.0.1:6379> GET scheduledMessage:4bbb0800-5204-4bfe-8dfe-332d270a55c0
"2019-01-01T00:00:00.000Z,Happy New YEAR!!!"
```

Background scheduler task: `tasks/echo-scheduled-messages.js`:

Installing requirements:
```
npm i -g forever
```

Running:
```
npm run echo-scheduled-messages
```
or as `forever` process:
```
npm run task-echo-scheduled-messages
```

Logic:

On load:

1) Gets `scheduledMessagesLists` and filters by date and keeps dates that is today or previous days.
2) Finds outdated messages from lists: `scheduledMessages:{date-here}` and pops it out
3) Pushes outdated message by key: `scheduledMessage:{id}` to `scheduledMessagesQueue`

Looping:

1) Pops messages from : `scheduledMessagesQueue` 
2) Logs it to console
3) Pushes it to `processedMessages` list

