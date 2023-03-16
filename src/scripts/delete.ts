
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(__dirname, '..', '..', '.env') })
import { REST, Routes, APIUser } from 'discord.js'
import keys from '../keys'

const rest = new REST({ version: '10' }).setToken(keys.clientToken)
// const commandid =  "1076961684733833228";

const deleteCommands = async () => {
    const currentUser = await rest.get(Routes.user()) as APIUser
    const endpoint = await rest.put(Routes.applicationGuildCommands(currentUser.id, "886789851016462346"), { body: [] })
    console.log(endpoint)
    // rest.delete(Routes.applicationCommand(currentUser.id, commandid))
	// .then(() => console.log('Successfully deleted application command'))
	// .catch(console.error);
}
//Routes.applicationCommands(currentUser.id)
// Routes.applicationGuildCommands(currentUser.id, "886789851016462346")
deleteCommands();