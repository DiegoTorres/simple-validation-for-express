<p>&nbsp;</p>

## Getting Started

Install it using [`npm`](https://www.npmjs.com/package/@diegoti/simple-validation-for-express):

```bash
npm i @diegoti/simple-validation-for-express
```

## Example

Define a configuration object with the validations.

```javascript
const uservalidator = [
  {
    source: 'body',
    type: 'string',
    field: 'name',
    validations: {
      required: { value: true, message: '[name.required] custom message.' },
      size: { value: 7, message: '[name.size] custom message.' },
    },
  },
  {
    source: 'body',
    type: 'string',
    field: 'password',
    validations: {
      required: { value: true, message: '[password.required] custom message.' },
      range: { value: { min: 8, max: 16 } },
    },
  },
  {
    source: 'body',
    type: 'string',
    field: 'role',
    validations: {
      required: { value: false },
      size: { value: 3 },
      inList: { value: ['ADM', 'USE', 'MAN'] },
    },
  },
  {
    source: 'body',
    type: 'number',
    field: 'age',
    validations: {
      required: { value: true },
      range: { value: { min: 0, max: 100 }, message: null },
      inList: { value: [1, 55, 530] },
      equal: { value: 1111 },
    },
  },
];

module.exports = {
  uservalidator,
};
```

Import simple-validation-for-express and your config object and pass it to your route, if any validation is found, an error object is added to req object.

```javascript
var express = require('express');
const simpleValidationForExpress = require("@diegoti/simple-validation-for-express");

const { uservalidator } = require('./user.validator');
var router = express.Router();

router.get('/', simpleValidationForExpress.validate(uservalidator), function (req, res, next) {
  res.status(req.errors ? 400 : 200).json({errors: req.errors})
});

module.exports = router;
```

Example of `req.errors`:

```json
{
  "errors": [
    {
      "field": "name",
      "message": "[name.required] custom message."
    },
    {
      "field": "name",
      "message": "[name.size] custom message."
    },
    {
      "field": "password",
      "message": "[password.required] custom message."
    },
    {
      "field": "password",
      "message": "password must be between 8 and 16 characters."
    },
    {
      "field": "role",
      "message": "role must contain one of these values [ADM,USE,MAN]."
    },
    {
      "field": "role",
      "message": "role must have 3 characters."
    },
    {
      "field": "age",
      "message": "age must be provided"
    },
    {
      "field": "age",
      "message": "age must be equal to [1111]"
    },
    {
      "field": "age",
      "message": "age must contain one of these values [1,55,530]."
    },
    {
      "field": "age",
      "message": "age must be a valid Number."
    },
    {
      "field": "age",
      "message": "age must be between 0 and 100."
    }
  ]
}
```