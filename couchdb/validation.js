function (newDoc, oldDoc, userCtx) {
  log(userCtx);
  function require(beTrue, message) {
    if (!beTrue) throw({forbidden : message});
  }

  require(userCtx.name, "User must be logged in") 

  if (!newDoc.createdBy || newDoc.createdBy !== userCtx.name) {
    require(false, "Document.createdBy must equal user's name")
  }

  if (oldDoc && (newDoc.createdBy !== oldDoc.createdBy)) {
    require(false, "Document.createdBy cannot be changed")
  }
}