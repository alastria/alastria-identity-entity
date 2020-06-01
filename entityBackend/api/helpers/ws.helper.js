module.exports = {
  setWSObject,
  getWSObject
}

let myWSObject = {}

function setWSObject(io) {
  myWSObject = io
}

function getWSObject() {
  return myWSObject
}
