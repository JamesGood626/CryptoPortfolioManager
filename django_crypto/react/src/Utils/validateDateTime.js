const re = /\d\d\d\d-\d\d-\d\d[T]\d\d:\d\d:\d\d/

export default dateTime => {
  const invalidDateTime = re.test(dateTime)

  if(!invalidDateTime) {
    return "The date time you provided is invalid"
  }
}