let BaseErrCode = 10000
const Err = {
  FA_VALIDATION: {
    err: BaseErrCode++,
    msg: 'Validation Error'
  }
}

module.exports = {
  Err
}
