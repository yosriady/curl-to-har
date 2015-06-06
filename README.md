# curl-to-har

--

Converts shell curl commands such as:

``` curl
curl --request POST --url 'http://mockbin.com/request?foo=bar&foo=baz' --header 'accept: application/json' --header 'content-type: application/json' --cookie 'foo=bar; bar=baz' --data '{"foo": "bar"}'

```

to HAR request objects:


``` js
{ 
  method: 'POST',
  url: 'http://mockbin.com/request',
  httpVersion: 'HTTP/1.1',
  queryString: [ { name: 'foo', value: 'bar' }, { name: 'foo', value: 'baz' } ],
  headers: 
   [ { name: 'accept', value: 'application/json' },
     { name: 'content-type', value: 'application/json' } ],
  cookies: [ { name: 'foo', value: 'bar' }, { name: 'bar', value: 'baz' } ],
  postData: { mimeType: 'application/json', text: { foo: 'bar' } } 
}
```

Pull requests most welcome!
