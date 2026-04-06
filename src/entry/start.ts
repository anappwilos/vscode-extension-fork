import process from 'node:process'
import { createAppConfig } from '../config/appConfig'

function main(): void {
  const config = createAppConfig('')
  const mode = process.env.NODE_ENV ?? 'development'

  console.log(`[fork] runtime ready in ${mode} mode`)
  console.log(`[fork] executable override configured: ${Boolean(config.forkExecutablePath)}`)
}

main()
