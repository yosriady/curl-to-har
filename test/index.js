var test = require('tape');
var parse = require('../');

test('parse curl command', function (t) {
    t.same(parse("curl --url 'http://mockbin.com/request'"), {
        method: 'GET',
        url: 'http://mockbin.com/request',
        httpVersion: 'HTTP/1.1',
        queryString: [],
        headers: [],
        cookies: [],
        postData: {}
    });
    t.same(parse("curl http://example.com/api/kittens -X PUT -H 'Authorization: meowmeowmeow'"),
        { method: 'PUT',
          url: 'http://example.com/api/kittens',
          httpVersion: 'HTTP/1.1',
          queryString: [],
          headers: [ { name: 'Authorization', value: 'meowmeowmeow' } ],
          cookies: [],
          postData: {}
    });
    t.same(parse("curl --url 'http://example.com/api/kittens' --header 'Authorization: meowmeowmeow'"),
        { method: 'GET',
          url: 'http://example.com/api/kittens',
          httpVersion: 'HTTP/1.1',
          queryString: [],
          headers: [ { name: 'Authorization', value: 'meowmeowmeow' } ],
          cookies: [],
          postData: {}
    });
    t.same(parse("curl --request POST --url 'http://mock.com/request?foo=bar&foo=baz' --header 'accept: application/json' --header 'content-type: application/json' --cookie 'foo=bar; bar=baz' --data '{\"foo\": \"bar\"}'"), {
        method: 'POST',
        url: 'http://mock.com/request',
        httpVersion: 'HTTP/1.1',
        queryString: [ { name: 'foo', value: 'bar' }, { name: 'foo', value: 'baz' } ],
        headers:
        [ { name: 'accept', value: 'application/json' },
         { name: 'content-type', value: 'application/json' } ],
        cookies: [ { name: 'foo', value: 'bar' }, { name: 'bar', value: 'baz' } ],
        postData: { mimeType: 'application/json', text: { foo: 'bar' } }
    });
    t.end();
});