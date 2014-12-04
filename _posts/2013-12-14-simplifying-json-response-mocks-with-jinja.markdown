---
layout: post
title: "Simplifying JSON Response Mocks With Jinja"
date: 2013-12-14 13:43:01 -0800
---

For documenting and testing large APIs, response mocks can be a very useful
tool. They not only provide examples for the users of your API, but they can be
used in automated tests as if you had received real data without actually
hitting the network.

Creating and maintaining a large collection of response mocks can be greatly
simplified by preprocessing them with a template engine like Python's
[Jinja](http://jinja.pocoo.org/). Although this adds another step to your build
process, it allows some really useful functionality!

<!-- more -->

### Variables

One of the first advantages of processing response mocks with Jinja is that
we can use [variables](http://jinja.pocoo.org/docs/templates/#variables) when
generating them.
For example, let's consider an API that can respond with information about a
person. One of our mock responses is a Person object, like so:

``` js
{
    "first_name": "John",
    "last_name": "Smith",
    "phone_number": "415 555-1234"
}
```

However, developers in different locations require that the phone number have a
local area code. In this situation, we could simply change the mock to be:

``` js+jinja
{% raw %}
{
    "first_name": "John",
    "last_name": "Smith",
    "phone_number": "{{ area_code }} 555-1234"
}
{% endraw %}
```

Now, we only need to process the mocks through Jinja with the area code in
the context to generate mocks using the new area code. We can render the mock
with `area_code='312'` in the context to get the phone number `"312 555-1234"`.

### Conditionals

We can further take advantage of Jinja to template our mocks using more
complicated control flows. For example, suppose that we wanted to format our
mock from the previous example to include a Person's last name sometimes, but
not in other cases. We can accomplish this simply in Jinja with an
[if block](http://jinja.pocoo.org/docs/templates/#if):

``` js+jinja
{% raw %}
{
    "first_name": "John",
    {% if last_names_included %}
    "last_name": "Smith",
    {% endif %}
    "phone_number": "415 555-1234"
}
{% endraw %}
```

If this mock is rendered with `last_names_included=True` in the context,
it will include the `last_name` field, and if not it will be absent!

### Including mocks

The previous examples might feel a little contrived, but importing one mock
from another is one of the greatest benefits of Jinja.
A large API will likely have objects with a common scheme that are used in
multiple responses, and it can be very convenient and greatly simplify our
mocks if we can define an object once and reference it in many places.

Perhaps multiple responses from our example API include addresses in a common
format. We can provide an example address in its own file:

``` js
{
    "street_address": "21 2nd Street",
    "city": "New York",
    "state": "NY",
    "postal_code": 10021
}
```

Then, in any response that includes an address, instead of copy-pasting this
example address or creating an entirely new address, we can simply include our
address in the mock with
[Jinja's include tag](http://jinja.pocoo.org/docs/templates/#include):

``` js+jinja
{% raw %}
{
    "first_name": "John",
    "last_name": "Smith",
    "address": {% include 'address.json' %},
    "phone_number": "415 555-1234"
}
{% endraw %}
```

The include tag does not only let us avoid duplicating data; if each object is
stored in its own file, it can turn our response mocks into a simple
composition of objects where the structure is clear at a glance.

### Extending mocks

I commonly need to create a response mock that is modified slightly from an
existing one, like a version of the response that has a parameter with a
different value or that specifies some optional parameters.
I think of this like JSON "inheritance", where an object gets all the values
from a base object but can then override them.

With Jinja, we call allow this "inheritance" by creating a way to extend mocks.
We can simply model the changes we want and the base object as Python
[`dict`](http://docs.python.org/2/library/stdtypes.html#mapping-types-dict)s and
use the [`update`](http://docs.python.org/2/library/stdtypes.html#dict.update)
method to override the items in the base dictionary with our changes.
The dictionary of updates will be specified in JSON, so a function to return
the JSON that results from updating looks like this:

``` python
def json_update(base, updates):
    result = json.loads(base)
    result.update(json.loads(updates))
    return json.dumps(result, sort_keys=True, indent=4)
```

We can then include this function in Jinja's context to access it within our
response mocks. This allows us to write an `extend_json`
[macro](http://jinja.pocoo.org/docs/templates/#macros):

``` jinja
{% raw %}
{% macro include_json(path) %}{% include path %}{% endmacro %}

{% macro extend_json(base_path) %}
    {{ json_update(include_json(base_path), caller()) }}
{% endmacro %}
{% endraw %}
```

This macro will be called with the JSON updates as its body so that they are
accessible within the macro through the `caller()` function.
The `include_json` macro just allows us to use an included file as an argument
to the `json_update` function.

To see this macro in action, let's consider our Person object with an age
parameter:

``` js
{
    "first_name": "John",
    "last_name": "Smith",
    "age": 25,
    "phone_number": "415 555-1234"
}
```

To create another Person object with a different age, we only have to do this:

``` js+jinja
{% raw %}
{% call extend_json('person.json') %}
{
    "age": 70
}
{% endcall %}
{% endraw %}
```

It's useful to note that the `extend_json` macro must be available in this
file, so we'll likely need to
[import](http://jinja.pocoo.org/docs/templates/#import) it from the file in
which it is declared.

The functionality of Jinja doesn't end with macros; after all, it's a
full-fledged template engine with many
[built-in filters](http://jinja.pocoo.org/docs/templates/#list-of-builtin-filters)
and a powerful (if complicated)
[extension system](http://jinja.pocoo.org/docs/extensions/).
This article just covered the functionality that I've found useful, but Jinja
can surely adapt to meet whatever your needs are.
