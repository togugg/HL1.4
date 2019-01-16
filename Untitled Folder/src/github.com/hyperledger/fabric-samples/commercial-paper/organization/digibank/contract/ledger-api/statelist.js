/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const State = require('./state.js');

/**
 * StateList provides a named virtual container for a set of ledger states.
 * Each state has a unique key which associates it with the container, rather
 * than the container containing a link to the state. This minimizes collisions
 * for parallel transactions on different states.
 */
class StateList {

  /**
   * Store Fabric context for subsequent API access, and name of list
   */
  constructor(ctx, listName) {
    this.ctx = ctx;
    this.name = listName;
    this.supportedClasses = {};

  }

  /**
   * Add a state to the list. Creates a new state in worldstate with
   * appropriate composite key.  Note that state defines its own key.
   * State object is serialized before writing.
   */
  async addState(state) {
    let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
    let data = State.serialize(state);
    await this.ctx.stub.putState(key, data);
  }

  /**
   * Get a state from the list using supplied keys. Form composite
   * keys to retrieve state from world state. State data is deserialized
   * into JSON object before being returned.
   */
  async getState(key) {
    let ledgerKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(key));
    let data = await this.ctx.stub.getState(ledgerKey);
    let state = State.deserialize(data, this.supportedClasses);
    return state;
  }

  /**
   * Get all states from the list using partial composite key. 
   * Calls helper function to process resulting data into array.
   * Returns arrray of JSON objects.
   */
  async getAllStates(key) {
    let data = await this.ctx.stub.getStateByPartialCompositeKey(this.name, State.splitKey(key));
    let results = await this.getAllResults(data);
    //return Buffer.from(JSON.stringify(results));
    return results;
  }

  /**
   * Update a state in the list. Puts the new state in world state with
   * appropriate composite key.  Note that state defines its own key.
   * A state is serialized before writing. Logic is very similar to
   * addState() but kept separate becuase it is semantically distinct.
   */
  async updateState(state) {
    let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
    let data = State.serialize(state);
    await this.ctx.stub.putState(key, data);
  }

  /** Stores the class for future deserialization */
  use(stateClass) {
    this.supportedClasses[stateClass.getClass()] = stateClass;
  }

  /**
 * Processes iterators. Returns arrray of JSON objects
 */

  async getAllResults(iterator) {
    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = [];
        try {
          jsonRes = State.deserialize(res.value.value, this.supportedClasses);
        } catch (err) {
          console.log(err);
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return allResults;
      }
    }
  }

}

module.exports = StateList;
