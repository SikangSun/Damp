import { category } from '../../utils'
import quote from './quote'
import getall from "./getall"
import getone from "./getone"
import tagedit from "./updatetag"
import deleteone from "./deleteone"

export default category('quote', [
  quote, getall, getone, tagedit, deleteone
])



