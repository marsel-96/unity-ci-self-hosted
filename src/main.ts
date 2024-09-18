import * as core from '@actions/core'
import { runCommand } from "unity-ci-self-hosted-common";
import { logLines } from "unity-ci-self-hosted-common";
import { join, isAbsolute } from 'path'

import { variables } from './input'


/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    
    let arifactsFullpath = isAbsolute(variables.unityArtifactsPath.value) ? 
      variables.unityArtifactsPath.value : 
      join(variables.GITHUB_WORKSPACE.value, variables.unityArtifactsPath.value)

    let platforms = variables.unityTestMode.value.toLowerCase() === "all" ? ["EditMode", "PlayMode"] : [variables.unityTestMode.value]
    for (let platform of platforms) {
      let testResultsFile = join(arifactsFullpath,`${variables.unityTestMode.value}-results.xml`)
      let command = variables.UNITY_PATH.value
      let args = [
        "-quit",
        "-batchmode",
        "-nographics",
        "-projectPath " + variables.unityProjectPath.value,
        "-runTests",
        "-testPlatform " + platform,
        "-testResults " + testResultsFile,
        "-logFile -",
      ]

      if (variables.unityCustomArguments.value) {
        args.push(variables.unityCustomArguments.value)
      }
      
      let exitCode = await runCommand(command, args)
        .catch((error) => {
          throw new Error(`\n\nException while running unity command. ${error}`);
        })

      if (exitCode === 0) {
        logLines(
          '',
          '',
          `Test Run for platform ${platform} Succeeded!`,
          '',
          '###########################',
          '#     Artifact output     #',
          '###########################',
          '',
          `Test results: ${testResultsFile}`
        )
      } else {
        throw new Error(`Test Run with mode ${platform} Failed! Exit Code ${exitCode}`);
      }
    }
    
    logLines(
      '',
      'All Test Runs Succeeded!',
      ''
    )

  } catch (error) {
    if (error instanceof Error) {
      console.error("\n" + error.message)
      core.setFailed("Error during test run")
    }
    else core.setFailed("An unexpected error occurred")
  }
}
