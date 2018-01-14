const expressHandlerResponse = {};

const _end = sinon.spy();
const end = (...args) => {
  _end.apply(null, [...args]);
  return expressHandlerResponse;
};

const _send = sinon.spy();
const send = (...args) => {
  _send.apply(null, [...args]);
  return expressHandlerResponse;
};

const _status = sinon.spy();
const status = (...args) => {
  _status.apply(null, [...args]);
  return expressHandlerResponse;
};

const _json = sinon.spy();
const json = (...args) => {
  _json.apply(null, [...args]);
  return expressHandlerResponse;
};

expressHandlerResponse._ = {
  end: _end,
  send: _send,
  status: _status,
  json: _json,
};
expressHandlerResponse.__ = {
  clear: () => {
    Object.keys(expressHandlerResponse._).forEach((key) => {
      expressHandlerResponse._[key].resetHistory();
    });
  },
};
expressHandlerResponse.end = end;
expressHandlerResponse.send = send;
expressHandlerResponse.status = status;
expressHandlerResponse.json = json;


module.exports = expressHandlerResponse;
