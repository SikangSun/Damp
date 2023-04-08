import { QuoteImage } from './../../types/quote';
import { category } from '../../utils'
import quote from './quote'
import getone from "./get"
import tagedit from "./update"
import deleteone from "./delete"
import random from "./random"
import roles from "./roles"
import help from "./help"
import getall from "./getall"

export default category('quote', [
  quote, getone, tagedit, deleteone, random, roles, help, getall
])



