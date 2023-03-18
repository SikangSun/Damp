import { QuoteImage } from './../../types/quote';
import { category } from '../../utils'
import quote from './quote'
import getone from "./get"
import tagedit from "./update"
import deleteone from "./delete"
import random from "./random"

export default category('quote', [
  quote, getone, tagedit, deleteone, random
])



