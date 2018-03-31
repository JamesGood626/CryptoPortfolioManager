const capitalizeTitles = {
  handleSingleTitle: function (item) {
                      let newItem = item.replace(/_/g, " ")
                      let stringArr = newItem.split(" ")
                      if (stringArr.length > 1) {
                        let newStringArr = []
                        for(let i=0; i < stringArr.length; i++) {
                          console.log(stringArr[i])
                          let refinedString = this.capitalize(stringArr[i])
                          newStringArr.push(refinedString)
                        }
                        let refinedStringArr = newStringArr.join(" ").trim()
                        return refinedStringArr
                      }
                      else {
                        let capitalized = newItem.replace(newItem[0], newItem[0].toUpperCase())
                        return capitalized
                      }
                    },
  capitalize: function (item) {
                if (item === "btc") {
                  let capitalized = item.toUpperCase()
                  return capitalized
                }
                else if (item === "fiat") {
                  return null
                }
                let capitalized = item.replace(item[0], item[0].toUpperCase())
                return capitalized
              }
}

export default capitalizeTitles