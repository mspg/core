import util from 'util'
import { exec } from 'child_process'

const xc = util.promisify(exec)

export default xc
