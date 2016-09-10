### Testing React Apps with Mocha, Enzyme and Chai.

### Dependencies



### Testing Actions

Here our main objective is to make sure actions are being dispatched correctly,
1.  Payload and metadata are attached to action?
2.  All expected actions were dispatched? (for cases where one action
    call dispatches multiple actions, see example bellow);


```
import React from 'react';
import configureMockStore from 'redux-mock-store';
import { expect } from 'chai';
import thunk from 'redux-thunk';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

import * as actions from './TodoActions';
import * as types from './TodoActionsTypes';

describe('Actions', function () {

  it(`creates ${types.TODO_SAVE_REQUEST}`, function () {
    const store = mockStore({});
    const todo = { id: '123', text: 'Swim' };
    const metadata = { isNew: true };

    store.dispatch(actions.TODO_SAVE_REQUEST(todo));

    const actions = store.getActions();
    const actionSave = actions[0];
    const actionAnimate = actions[1];

    expect(actions).to.have.length(2);
    expect(actionSave.payload).to.deep.equal(todo);
    expect(actionSave.meta).to.deep.equal(metadata);
    expect(actionSave.type).to.equal(types.TODO_SAVE_REQUEST);
    expect(actionAnimate.type).to.equal(types.TODO_SAVING_ANIMATE);
  });

})
```


### Testing Async Actions
Besides what is described above, async actions require us to mock HTTP responses.
Ac cpuple of good HTTP mocking and expectations libraries are [nock](https://github.com/node-nock/nock) or [moxios](https://github.com/mzabriskie/moxios) (in case you use [axios](https://github.com/mzabriskie/axios)).

Lets see how to test an async get request action.

```
import React from 'react';
import configureMockStore from 'redux-mock-store';
import { expect } from 'chai';
import thunk from 'redux-thunk';
import moxios from 'moxios';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

import * as actions from './TodoActions';
import * as types from './TodoActionsTypes';

describe('Async Actions', function () {
  beforeEach(function () {
    moxios.install();
  });

  afterEach(function () {
    moxios.uninstall();
  });

  it(`creates ${types.TODOS_GET_REQUEST}`, function () {
    const response = [
      { id: '123', text: 'Swim' }
    ];

    moxios.stubRequest(url, {
      status: 200,
      response: response
    });

    const expectedActions = [
      { type: types.TODOS_GET_REQUEST },
      { type: types.TODOS_GET_SUCCESS, payload: response }
    ];

    const store = mockStore({});

    return store.dispatch(actions.TODOS_GET_REQUEST())
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });
});
```
