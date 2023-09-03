import asyncCall from './asyncCall';


export default class Query {
  constructor(methodName, params) {
    this._params = params;
    this._methodName = methodName;
  }

  fetch = async () => {
    return await asyncCall(this._methodName, this._params);
  };

  getCount = async () => {
    if (this._counter) {
      throw new Error('This query is reactive, meaning you cannot use promises to fetch the data.');
    }

    return await asyncCall(`${this._methodName}.count`, this._params);
  };
}
