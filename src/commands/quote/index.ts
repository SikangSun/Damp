import { QuoteImage } from './../../types/quote';
import { category } from '../../utils'
import quote from './quote'
import getone from "./get"
import tagedit from "./updatetag"
import deleteone from "./delete"

export default category('quote', [
  quote, getone, tagedit, deleteone
])



