import { category } from '../../utils'
import meme from "./meme"
import quote from './quote'
import getone from "./get"
import tagedit from "./update"
import deleteone from "./delete"
import random from "./random"
import roles from "./roles"
import help from "./help"
import getall from "./getall"


export default category('quote', [
  meme, quote, getone, tagedit, deleteone, random, roles, help, getall
])



