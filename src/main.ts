import * as core from '@actions/core'
import * as logging from "unity-ci-self-hosted-common/dist";
import { runCommand } from "unity-ci-self-hosted-common";
import { logLines } from "unity-ci-self-hosted-common";
import { join } from 'path'
import { variables } from './input'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    
    console.log(`--------------------------------------------------------------------`)
    logging.logWithStyle('Starting Unity Test', logging.ForegroundColor.Cyan)
    console.log(`--------------------------------------------------------------------`)

    const arifactsFullpath = variables.unityArtifactsPath.value
    const platforms = variables.unityTestMode.value.toLowerCase() === "all" 
            ? ["EditMode", "PlayMode"] : [variables.unityTestMode.value]

    for (let platform of platforms) {
      let testResultsFile = join(arifactsFullpath,`${variables.unityTestMode.value}-results.xml`)
      let command = variables.UNITY_PATH.value
      let args = [
        "-quit",
        "-batchmode",
        "-nographics",
        "-projectPath", variables.unityProjectPath.value,
        "-runTests",
        "-testPlatform", platform,
        "-testResults", testResultsFile,
        "-logFile -",
      ]

      if (variables.unityCustomArguments.value) {
        args.push(variables.unityCustomArguments.value)
      }
      
      let exitCode

      try {
        core.startGroup('Running Unity Command')
        exitCode = await runCommand(command, args)
        core.endGroup()
      } catch(error){
        core.endGroup()
        throw new Error('Exception while running unity command', {cause: error});
      }

      if (exitCode === 0) {
          console.log('--------------------------------------------------------------------')
          logging.logWithStyle('Build Succeeded!', logging.ForegroundColor.Green)
          console.log('--------------------------------------------------------------------')
          console.log('')
          logging.logWithStyle(`Test results: ${testResultsFile}`, logging.ForegroundColor.Green)
      } else {
        throw new Error(`Test Run with mode ${platform} Failed! Exit Code ${exitCode}`);
      }
    }
    
    console.log('')
    logging.logWithStyle('All Test Runs Succeeded!', logging.ForegroundColor.Green)
    console.log('')

  } catch (error) {
    if (error instanceof Error) {
      core.error(error)
    }
    else core.error("An unexpected error occurred")

    core.setFailed("Error during build run")
  }
}
